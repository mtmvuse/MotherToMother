/*
  Warnings:

  - You are about to drop the column `userType` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `userType`,
    ADD COLUMN `address` VARCHAR(191) NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `household` VARCHAR(191) NULL,
    ADD COLUMN `organizationID` INTEGER NULL,
    ADD COLUMN `phone` INTEGER NULL,
    ADD COLUMN `role` VARCHAR(191) NULL,
    ADD COLUMN `stateZip` INTEGER NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Organization` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DonationDetail` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `quantityOld` INTEGER NOT NULL,
    `quantityNew` INTEGER NOT NULL,
    `outgoingDonationId` INTEGER NOT NULL,
    `incomingDonationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `OutgoingDonation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `requesterID` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `numberServed` INTEGER NOT NULL,
    `whiteNum` INTEGER NOT NULL,
    `latinoNum` INTEGER NOT NULL,
    `blackNum` INTEGER NOT NULL,
    `nativeNum` INTEGER NOT NULL,
    `asianNum` INTEGER NOT NULL,
    `otherNum` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `IncomingDonation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `donorID` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `category` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `stockNew` INTEGER NOT NULL,
    `stockOld` INTEGER NOT NULL,
    `valueNew` INTEGER NOT NULL,
    `valueOld` DOUBLE NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_organizationID_fkey` FOREIGN KEY (`organizationID`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetail` ADD CONSTRAINT `DonationDetail_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetail` ADD CONSTRAINT `DonationDetail_outgoingDonationId_fkey` FOREIGN KEY (`outgoingDonationId`) REFERENCES `OutgoingDonation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetail` ADD CONSTRAINT `DonationDetail_incomingDonationId_fkey` FOREIGN KEY (`incomingDonationId`) REFERENCES `IncomingDonation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `OutgoingDonation` ADD CONSTRAINT `OutgoingDonation_requesterID_fkey` FOREIGN KEY (`requesterID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `IncomingDonation` ADD CONSTRAINT `IncomingDonation_donorID_fkey` FOREIGN KEY (`donorID`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
