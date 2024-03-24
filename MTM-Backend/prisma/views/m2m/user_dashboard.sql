SELECT
  `m2m`.`User`.`id` AS `id`,
  `m2m`.`User`.`email` AS `email`,
  concat_ws(
    ' ',
    `m2m`.`User`.`firstName`,
    `m2m`.`User`.`lastName`
  ) AS `name`,
  `m2m`.`User`.`phone` AS `phone`,
  concat_ws(
    ', ',
    `m2m`.`User`.`address`,
    `m2m`.`User`.`city`,
    `m2m`.`User`.`state`,
    `m2m`.`User`.`zip`
  ) AS `address`,
  `m2m`.`User`.`userType` AS `type`,
  `m2m`.`Organization`.`name` AS `organization`
FROM
  (
    `m2m`.`User`
    JOIN `m2m`.`Organization` ON(
      (
        `m2m`.`User`.`organizationId` = `m2m`.`Organization`.`id`
      )
    )
  )