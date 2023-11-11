/*
  Warnings:

  - You are about to drop the `DonationDetail` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_itemID_fkey`;

-- DropForeignKey
ALTER TABLE `DonationDetail` DROP FOREIGN KEY `DonationDetail_outgoingDonationId_fkey`;

-- DropTable
DROP TABLE `DonationDetail`;

-- CreateTable
CREATE TABLE `DonationDetails` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `itemID` INTEGER NOT NULL,
    `quantityOld` INTEGER NOT NULL,
    `quantityNew` INTEGER NOT NULL,
    `outgoingDonationId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DonationDetails` ADD CONSTRAINT `DonationDetails_itemID_fkey` FOREIGN KEY (`itemID`) REFERENCES `Item`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DonationDetails` ADD CONSTRAINT `DonationDetails_outgoingDonationId_fkey` FOREIGN KEY (`outgoingDonationId`) REFERENCES `OutgoingDonation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
