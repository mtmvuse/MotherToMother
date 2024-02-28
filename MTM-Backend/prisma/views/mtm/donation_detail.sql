SELECT
  `mtm`.`Donation`.`id` AS `id`,
  `mtm`.`Donation`.`date` AS `date`,
  `mtm`.`Organization`.`name` AS `organization`,
  sum(
    (
      (
        `mtm`.`DonationDetail`.`newQuantity` * `mtm`.`Item`.`valueNew`
      ) + (
        `mtm`.`DonationDetail`.`usedQuantity` * `mtm`.`Item`.`valueUsed`
      )
    )
  ) AS `total`,
  sum(
    (
      `mtm`.`DonationDetail`.`newQuantity` + `mtm`.`DonationDetail`.`usedQuantity`
    )
  ) AS `items`,
(
    CASE
      WHEN (`mtm`.`Organization`.`type` = 'Agency') THEN 'Outgoing'
      WHEN (
        `mtm`.`Organization`.`type` IN ('Public', 'Corporate')
      ) THEN 'Incoming'
      ELSE 'unknown'
    END
  ) AS `type`,
  json_arrayagg(
    json_object(
      'item',
      `mtm`.`Item`.`name`,
      'itemId',
      `mtm`.`Item`.`id`,
      'newDetails',
      IF(
        (`mtm`.`DonationDetail`.`newQuantity` > 0),
        json_object(
          'status',
          'new',
          'value',
          `mtm`.`Item`.`valueNew`,
          'quantity',
          `mtm`.`DonationDetail`.`newQuantity`,
          'total',
(
            `mtm`.`Item`.`valueNew` * `mtm`.`DonationDetail`.`newQuantity`
          )
        ),
        NULL
      ),
      'usedDetails',
      IF(
        (`mtm`.`DonationDetail`.`usedQuantity` > 0),
        json_object(
          'status',
          'used',
          'value',
          `mtm`.`Item`.`valueUsed`,
          'quantity',
          `mtm`.`DonationDetail`.`usedQuantity`,
          'total',
(
            `mtm`.`Item`.`valueUsed` * `mtm`.`DonationDetail`.`usedQuantity`
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
          `mtm`.`Donation`
          JOIN `mtm`.`DonationDetail` ON(
            (
              `mtm`.`Donation`.`id` = `mtm`.`DonationDetail`.`donationId`
            )
          )
        )
        JOIN `mtm`.`Item` ON(
          (
            `mtm`.`DonationDetail`.`itemId` = `mtm`.`Item`.`id`
          )
        )
      )
      JOIN `mtm`.`User` ON((`mtm`.`Donation`.`userId` = `mtm`.`User`.`id`))
    )
    JOIN `mtm`.`Organization` ON(
      (
        `mtm`.`User`.`organizationId` = `mtm`.`Organization`.`id`
      )
    )
  )
GROUP BY
  `mtm`.`Donation`.`id`