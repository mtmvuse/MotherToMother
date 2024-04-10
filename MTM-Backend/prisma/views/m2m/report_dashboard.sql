SELECT
  row_number() OVER (
    ORDER BY
      `t2`.`date`
  ) AS `id`,
  `t2`.`agency` AS `agency`,
  `t2`.`date` AS `date`,
  `t2`.`item` AS `item`,
  `t1`.`quantity` AS `quantity`,
(
    CASE
      WHEN (`t1`.`status` = 'Used') THEN `t2`.`valueUsed`
      WHEN (`t1`.`status` = 'New') THEN `t2`.`valueNew`
      ELSE NULL
    END
  ) AS `value`,
(
    CASE
      WHEN (`t1`.`status` = 'Used') THEN (`t2`.`valueUsed` * `t1`.`quantity`)
      WHEN (`t1`.`status` = 'New') THEN (`t2`.`valueNew` * `t1`.`quantity`)
      ELSE NULL
    END
  ) AS `total`,
  `t1`.`status` AS `status`
FROM
  (
    (
      SELECT
        `m2m`.`DonationDetail`.`id` AS `id`,
        `m2m`.`DonationDetail`.`usedQuantity` AS `quantity`,
        'Used' AS `status`
      FROM
        `m2m`.`DonationDetail`
      UNION
      ALL
      SELECT
        `m2m`.`DonationDetail`.`id` AS `id`,
        `m2m`.`DonationDetail`.`newQuantity` AS `quantity`,
        'New' AS `status`
      FROM
        `m2m`.`DonationDetail`
    ) `t1`
    JOIN (
      SELECT
        `m2m`.`DonationDetail`.`id` AS `id`,
        `m2m`.`Organization`.`name` AS `agency`,
        `m2m`.`Donation`.`date` AS `date`,
        `m2m`.`Item`.`name` AS `item`,
        `m2m`.`Item`.`valueUsed` AS `valueUsed`,
        `m2m`.`Item`.`valueNew` AS `valueNew`
      FROM
        (
          (
            (
              (
                `m2m`.`User`
                JOIN `m2m`.`Organization` ON(
                  (
                    `m2m`.`User`.`organizationId` = `m2m`.`Organization`.`id`
                  )
                )
              )
              JOIN `m2m`.`Donation` ON((`m2m`.`User`.`id` = `m2m`.`Donation`.`userId`))
            )
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
    ) `t2` ON((`t1`.`id` = `t2`.`id`))
  )
WHERE
  (`t1`.`quantity` <> 0)