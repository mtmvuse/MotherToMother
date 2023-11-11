/*
  Warnings:

  - You are about to drop the column `organizationID` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DonationDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IncomingDonation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutgoingDonation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `userType` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_incomingDonationId_fkey`;

-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_itemID_fkey`;

-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_outgoingDonationId_fkey`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_organizationID_fkey` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `organizationID`,
    ADD COLUMN `userType` VARCHAR(191) NOT NULL;

-- DropTable
DROP TABLE `DonationDetail`;

-- DropTable
DROP TABLE `IncomingDonation`;

-- DropTable
DROP TABLE `Item`;

-- DropTable
DROP TABLE `Organization`;

-- DropTable
DROP TABLE `OutgoingDonation`;
