SELECT
  `mtm`.`User`.`id` AS `id`,
  `mtm`.`User`.`email` AS `email`,
  concat_ws(
    ' ',
    `mtm`.`User`.`firstName`,
    `mtm`.`User`.`lastName`
  ) AS `name`,
  `mtm`.`User`.`phone` AS `phone`,
  concat_ws(
    ', ',
    `mtm`.`User`.`address`,
    `mtm`.`User`.`city`,
    `mtm`.`User`.`state`,
    `mtm`.`User`.`zip`
  ) AS `address`,
  `mtm`.`User`.`userType` AS `type`,
  `mtm`.`User`.`status` AS `status`,
  `mtm`.`Organization`.`name` AS `organization`
FROM
  (
    `mtm`.`User`
    JOIN `mtm`.`Organization` ON(
      (
        `mtm`.`User`.`organizationId` = `mtm`.`Organization`.`id`
      )
    )
  )