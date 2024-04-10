SELECT
  `m2m`.`Donation`.`id` AS `id`,
  `m2m`.`Donation`.`date` AS `date`,
  `m2m`.`Organization`.`name` AS `organization`,
  sum(
    (
      (
        `m2m`.`DonationDetail`.`newQuantity` * `m2m`.`Item`.`valueNew`
      ) + (
        `m2m`.`DonationDetail`.`usedQuantity` * `m2m`.`Item`.`valueUsed`
      )
    )
  ) AS `total`,
  sum(
    (
      `m2m`.`DonationDetail`.`newQuantity` + `m2m`.`DonationDetail`.`usedQuantity`
    )
  ) AS `items`,
(
    CASE
      WHEN (`m2m`.`Organization`.`type` = 'Agency') THEN 'Outgoing'
      WHEN (
        `m2m`.`Organization`.`type` IN ('Public', 'Corporate')
      ) THEN 'Incoming'
      ELSE 'unknown'
    END
  ) AS `type`,
  json_arrayagg(
    json_object(
      'item',
      `m2m`.`Item`.`name`,
      'itemId',
      `m2m`.`Item`.`id`,
      'newDetails',
      IF(
        (`m2m`.`DonationDetail`.`newQuantity` > 0),
        json_object(
          'status',
          'new',
          'value',
          `m2m`.`Item`.`valueNew`,
          'quantity',
          `m2m`.`DonationDetail`.`newQuantity`,
          'total',
(
            `m2m`.`Item`.`valueNew` * `m2m`.`DonationDetail`.`newQuantity`
          )
        ),
        NULL
      ),
      'usedDetails',
      IF(
        (`m2m`.`DonationDetail`.`usedQuantity` > 0),
        json_object(
          'status',
          'used',
          'value',
          `m2m`.`Item`.`valueUsed`,
          'quantity',
          `m2m`.`DonationDetail`.`usedQuantity`,
          'total',
(
            `m2m`.`Item`.`valueUsed` * `m2m`.`DonationDetail`.`usedQuantity`
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
          `m2m`.`Donation`
          JOIN `m2m`.`DonationDetail` ON(
            (
              `m2m`.`Donation`.`id` = `m2m`.`DonationDetail`.`donationId`
            )
          )
        )
        JOIN `m2m`.`Item` ON(
          (
            `m2m`.`DonationDetail`.`itemId` = `m2m`.`Item`.`id`
          )
        )
      )
      JOIN `m2m`.`User` ON((`m2m`.`Donation`.`userId` = `m2m`.`User`.`id`))
    )
    JOIN `m2m`.`Organization` ON(
      (
        `m2m`.`User`.`organizationId` = `m2m`.`Organization`.`id`
      )
    )
  )
GROUP BY
  `m2m`.`Donation`.`id`