SELECT
  `MTM-mysql`.`User`.`id` AS `id`,
  `MTM-mysql`.`User`.`email` AS `email`,
  concat_ws(
    ' ',
    `MTM-mysql`.`User`.`firstName`,
    `MTM-mysql`.`User`.`lastName`
  ) AS `name`,
  `MTM-mysql`.`User`.`phone` AS `phone`,
  concat_ws(
    ', ',
    `MTM-mysql`.`User`.`address`,
    `MTM-mysql`.`User`.`city`,
    `MTM-mysql`.`User`.`state`,
    `MTM-mysql`.`User`.`zip`
  ) AS `address`,
  `MTM-mysql`.`User`.`userType` AS `type`,
  `MTM-mysql`.`Organization`.`name` AS `organization`
FROM
  (
    `MTM-mysql`.`User`
    JOIN `MTM-mysql`.`Organization` ON(
      (
        `MTM-mysql`.`User`.`organizationId` = `MTM-mysql`.`Organization`.`id`
      )
    )
  )