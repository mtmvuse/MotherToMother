SELECT
  `MTM-mysql`.`CashDonation`.`id` AS `id`,
  `MTM-mysql`.`CashDonation`.`date` AS `date`,
  `MTM-mysql`.`Organization`.`name` AS `organization`,
  `MTM-mysql`.`CashDonation`.`total` AS `total`
FROM
  (
    `MTM-mysql`.`CashDonation`
    JOIN `MTM-mysql`.`Organization` ON(
      (
        `MTM-mysql`.`CashDonation`.`organizationId` = `MTM-mysql`.`Organization`.`id`
      )
    )
  )