-- CreateTable
CREATE TABLE `SkinTypeOnProfile` (
    `id` VARCHAR(191) NOT NULL,
    `skinProfileId` VARCHAR(191) NOT NULL,
    `type` ENUM('DRY', 'OILY', 'COMBINATION', 'NORMAL', 'SENSITIVE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SkinConcernOnProfile` (
    `id` VARCHAR(191) NOT NULL,
    `skinProfileId` VARCHAR(191) NOT NULL,
    `concern` ENUM('ACNE', 'AGING', 'PIGMENTATION', 'SENSITIVITY', 'DRYNESS', 'OILINESS', 'REDNESS', 'UNEVEN_TEXTURE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SkinTypeOnProfile` ADD CONSTRAINT `SkinTypeOnProfile_skinProfileId_fkey` FOREIGN KEY (`skinProfileId`) REFERENCES `SkinProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SkinConcernOnProfile` ADD CONSTRAINT `SkinConcernOnProfile_skinProfileId_fkey` FOREIGN KEY (`skinProfileId`) REFERENCES `SkinProfile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
