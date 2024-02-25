SELECT
  `MTM-mysql`.`Donation`.`id` AS `id`,
  `MTM-mysql`.`Donation`.`date` AS `date`,
  `MTM-mysql`.`Organization`.`name` AS `organization`,
  sum(
    (
      (
        `MTM-mysql`.`DonationDetail`.`newQuantity` * `MTM-mysql`.`Item`.`valueNew`
      ) + (
        `MTM-mysql`.`DonationDetail`.`usedQuantity` * `MTM-mysql`.`Item`.`valueUsed`
      )
    )
  ) AS `total`,
  sum(
    (
      `MTM-mysql`.`DonationDetail`.`newQuantity` + `MTM-mysql`.`DonationDetail`.`usedQuantity`
    )
  ) AS `items`,
(
    CASE
      WHEN (`MTM-mysql`.`Organization`.`type` = 'Agency') THEN 'Outgoing'
      WHEN (
        `MTM-mysql`.`Organization`.`type` IN ('Public', 'Corporate')
      ) THEN 'Incoming'
      ELSE 'unknown'
    END
  ) AS `type`,
  json_arrayagg(
    json_object(
      'item',
      `MTM-mysql`.`Item`.`name`,
      'itemId',
      `MTM-mysql`.`Item`.`id`,
      'newDetails',
      IF(
        (`MTM-mysql`.`DonationDetail`.`newQuantity` > 0),
        json_object(
          'status',
          'new',
          'value',
          `MTM-mysql`.`Item`.`valueNew`,
          'quantity',
          `MTM-mysql`.`DonationDetail`.`newQuantity`,
          'total',
(
            `MTM-mysql`.`Item`.`valueNew` * `MTM-mysql`.`DonationDetail`.`newQuantity`
          )
        ),
        NULL
      ),
      'usedDetails',
      IF(
        (`MTM-mysql`.`DonationDetail`.`usedQuantity` > 0),
        json_object(
          'status',
          'used',
          'value',
          `MTM-mysql`.`Item`.`valueUsed`,
          'quantity',
          `MTM-mysql`.`DonationDetail`.`usedQuantity`,
          'total',
(
            `MTM-mysql`.`Item`.`valueUsed` * `MTM-mysql`.`DonationDetail`.`usedQuantity`
          )
        ),
        NULL
      )
    )
  ) AS `details`
FROM
  (
    (
      (
        (
          `MTM-mysql`.`Donation`
          JOIN `MTM-mysql`.`DonationDetail` ON(
            (
              `MTM-mysql`.`Donation`.`id` = `MTM-mysql`.`DonationDetail`.`donationId`
            )
          )
        )
        JOIN `MTM-mysql`.`Item` ON(
          (
            `MTM-mysql`.`DonationDetail`.`itemId` = `MTM-mysql`.`Item`.`id`
          )
        )
      )
      JOIN `MTM-mysql`.`User` ON(
        (
          `MTM-mysql`.`Donation`.`userId` = `MTM-mysql`.`User`.`id`
        )
      )
    )
    JOIN `MTM-mysql`.`Organization` ON(
      (
        `MTM-mysql`.`User`.`organizationId` = `MTM-mysql`.`Organization`.`id`
      )
    )
  )
GROUP BY
  `MTM-mysql`.`Donation`.`id`