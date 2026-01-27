-- CreateTable
CREATE TABLE `ProductSkinType` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `type` ENUM('DRY', 'OILY', 'COMBINATION', 'NORMAL', 'SENSITIVE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ProductSkinConcern` (
    `id` VARCHAR(191) NOT NULL,
    `productId` VARCHAR(191) NOT NULL,
    `concern` ENUM('ACNE', 'AGING', 'PIGMENTATION', 'SENSITIVITY', 'DRYNESS', 'OILINESS', 'REDNESS', 'UNEVEN_TEXTURE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ProductSkinType` ADD CONSTRAINT `ProductSkinType_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ProductSkinConcern` ADD CONSTRAINT `ProductSkinConcern_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
