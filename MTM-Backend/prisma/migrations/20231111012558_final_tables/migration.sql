/*
  Warnings:

  - You are about to drop the column `incomingDonationId` on the `DonationDetail` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `stockNew` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `stockOld` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `valueNew` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `valueOld` on the `Item` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Organization` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `household` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `organizationID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `stateZip` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `IncomingDonation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_incomingDonationId_fkey`;

-- DropForeignKey
ALTER TABLE `IncomingDonation` DROP FOREIGN KEY `IncomingDonation_donorID_fkey`;

-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_organizationID_fkey`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- AlterTable
ALTER TABLE `DonationDetail` DROP COLUMN `incomingDonationId`;

-- AlterTable
ALTER TABLE `Item` DROP COLUMN `category`,
    DROP COLUMN `name`,
    DROP COLUMN `stockNew`,
    DROP COLUMN `stockOld`,
    DROP COLUMN `valueNew`,
    DROP COLUMN `valueOld`;

-- AlterTable
ALTER TABLE `Organization` DROP COLUMN `name`,
    DROP COLUMN `type`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `address`,
    DROP COLUMN `city`,
    DROP COLUMN `household`,
    DROP COLUMN `organizationID`,
    DROP COLUMN `phone`,
    DROP COLUMN `role`,
    DROP COLUMN `stateZip`,
    DROP COLUMN `type`,
    ADD COLUMN `userType` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `IncomingDonation`;
