/*
  Warnings:

  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `household` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stateZip` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `IncomingDonation` DROP FOREIGN KEY `IncomingDonation_donorID_fkey`;

-- DropForeignKey
ALTER TABLE `OutgoingDonation` DROP FOREIGN KEY `OutgoingDonation_requesterID_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_organizationID_fkey`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `household`,
    DROP COLUMN `phone`,
    DROP COLUMN `role`,
    DROP COLUMN `stateZip`,
    DROP COLUMN `type`;
