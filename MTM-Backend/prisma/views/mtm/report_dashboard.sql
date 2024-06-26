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
  `t1`.`status` AS `status`,
  (
    CASE
      WHEN (`t2`.`type` = 'Agency') THEN 'Outgoing'
      WHEN (
        `t2`.`type` IN ('Public', 'Corporate')
      ) THEN 'Incoming'
      ELSE 'unknown'
    END
  ) AS `type`
FROM
  (
    (
      SELECT
        `mtm`.`DonationDetail`.`id` AS `id`,
        `mtm`.`DonationDetail`.`usedQuantity` AS `quantity`,
        'Used' AS `status`
      FROM
        `mtm`.`DonationDetail`
      UNION
      ALL
      SELECT
        `mtm`.`DonationDetail`.`id` AS `id`,
        `mtm`.`DonationDetail`.`newQuantity` AS `quantity`,
        'New' AS `status`
      FROM
        `mtm`.`DonationDetail`
    ) `t1`
    JOIN (
      SELECT
        `mtm`.`DonationDetail`.`id` AS `id`,
        `mtm`.`Organization`.`name` AS `agency`,
        `mtm`.`Organization`.`type` AS `type`,
        `mtm`.`Donation`.`date` AS `date`,
        `mtm`.`Item`.`name` AS `item`,
        `mtm`.`Item`.`valueUsed` AS `valueUsed`,
        `mtm`.`Item`.`valueNew` AS `valueNew`
      FROM
        (
          (
            (
              (
                `mtm`.`User`
                JOIN `mtm`.`Organization` ON(
                  (
                    `mtm`.`User`.`organizationId` = `mtm`.`Organization`.`id`
                  )
                )
              )
              JOIN `mtm`.`Donation` ON((`mtm`.`User`.`id` = `mtm`.`Donation`.`userId`))
            )
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
    ) `t2` ON((`t1`.`id` = `t2`.`id`))
  )
WHERE
  (`t1`.`quantity` <> 0)