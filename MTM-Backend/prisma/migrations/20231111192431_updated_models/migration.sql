/*
  Warnings:

  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `DonationDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OutgoingDonation` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `quantityNew` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quantityUsed` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueOld` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valueUsed` to the `Item` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Type` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `DonationDetails` DROP FOREIGN KEY `DonationDetails_itemID_fkey`;

-- DropForeignKey
ALTER TABLE `DonationDetails` DROP FOREIGN KEY `DonationDetails_outgoingDonationId_fkey`;

-- DropForeignKey
ALTER TABLE `OutgoingDonation` DROP FOREIGN KEY `OutgoingDonation_requesterID_fkey`;

-- AlterTable
ALTER TABLE `Item` ADD COLUMN `quantityNew` INTEGER NOT NULL,
    ADD COLUMN `quantityUsed` INTEGER NOT NULL,
    ADD COLUMN `valueOld` DOUBLE NOT NULL,
    ADD COLUMN `valueUsed` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `userType`,
    ADD COLUMN `Household` VARCHAR(191) NULL,
    ADD COLUMN `Role` VARCHAR(191) NULL,
    ADD COLUMN `Type` VARCHAR(191) NOT NULL,
    ADD COLUMN `address` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NOT NULL,
    ADD COLUMN `organizationId` INTEGER NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `state` VARCHAR(191) NOT NULL,
    ADD COLUMN `zip` INTEGER NOT NULL;

-- DropTable
DROP TABLE `DonationDetails`;

-- DropTable
DROP TABLE `OutgoingDonation`;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Donation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonationDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donationID` INTEGER NOT NULL,
    `itemID` INTEGER NOT NULL,
    `quantityUsed` INTEGER NOT NULL,
    `quantityNew` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutgoingDonationStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donationID` INTEGER NOT NULL,
    `numberServed` INTEGER NOT NULL,
    `whiteNum` INTEGER NOT NULL,
    `latinoNum` INTEGER NOT NULL,
    `blackNum` INTEGER NOT NULL,
    `nativeNum` INTEGER NOT NULL,
    `asianNum` INTEGER NOT NULL,
    `otherNum` INTEGER NOT NULL,

    UNIQUE INDEX `OutgoingDonationStats_donationID_key`(`donationID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_organizationId_fkey` FOREIGN KEY (`organizationId`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Donation` ADD CONSTRAINT `Donation_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetail` ADD CONSTRAINT `DonationDetail_donationID_fkey` FOREIGN KEY (`donationID`) REFERENCES `Donation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetail` ADD CONSTRAINT `DonationDetail_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingDonationStats` ADD CONSTRAINT `OutgoingDonationStats_donationID_fkey` FOREIGN KEY (`donationID`) REFERENCES `Donation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
