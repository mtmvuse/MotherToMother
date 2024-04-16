SELECT
  `mtm`.`CashDonation`.`id` AS `id`,
  `mtm`.`CashDonation`.`date` AS `date`,
  `mtm`.`User`.`firstName` AS `firstName`,
  `mtm`.`User`.`lastName` AS `lastName`,
  `mtm`.`User`.`id` AS `userId`,
  `mtm`.`Organization`.`name` AS `organization`,
  `mtm`.`CashDonation`.`total` AS `total`
FROM
  (
    (
      `mtm`.`CashDonation`
      JOIN `mtm`.`User` ON(
        (
          `mtm`.`CashDonation`.`userId` = `mtm`.`User`.`id`
        )
      )
    )
    JOIN `mtm`.`Organization` ON(
      (
        `mtm`.`User`.`organizationId` = `mtm`.`Organization`.`id`
      )
    )
  )