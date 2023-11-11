-- DropForeignKey
ALTER TABLE `User` DROP FOREIGN KEY `User_organizationID_fkey`;

-- AlterTable
ALTER TABLE `User` MODIFY `address` VARCHAR(191) NULL,
    MODIFY `city` VARCHAR(191) NULL,
    MODIFY `organizationID` INTEGER NULL,
    MODIFY `phone` INTEGER NULL,
    MODIFY `type` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_organizationID_fkey` FOREIGN KEY (`organizationID`) REFERENCES `Organization`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
