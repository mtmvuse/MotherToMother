SELECT
  `mtm`.`CashDonation`.`id` AS `id`,
  `mtm`.`CashDonation`.`date` AS `date`,
  `mtm`.`Organization`.`name` AS `organization`,
  `mtm`.`CashDonation`.`total` AS `total`
FROM
  (
    `mtm`.`CashDonation`
    JOIN `mtm`.`Organization` ON(
      (
        `mtm`.`CashDonation`.`organizationId` = `mtm`.`Organization`.`id`
      )
    )
  )