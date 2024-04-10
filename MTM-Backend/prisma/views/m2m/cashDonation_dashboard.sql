SELECT
  `m2m`.`CashDonation`.`id` AS `id`,
  `m2m`.`CashDonation`.`date` AS `date`,
  `m2m`.`User`.`firstName` AS `firstName`,
  `m2m`.`User`.`lastName` AS `lastName`,
  `m2m`.`User`.`id` AS `userId`,
  `m2m`.`Organization`.`name` AS `organization`,
  `m2m`.`CashDonation`.`total` AS `total`
FROM
  (
    (
      `m2m`.`CashDonation`
      JOIN `m2m`.`User` ON(
        (
          `m2m`.`CashDonation`.`userId` = `m2m`.`User`.`id`
        )
      )
    )
    JOIN `m2m`.`Organization` ON(
      (
        `m2m`.`User`.`organizationId` = `m2m`.`Organization`.`id`
      )
    )
  )