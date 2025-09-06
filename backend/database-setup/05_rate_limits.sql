-- =============================================
-- Sheria Smart Database Setup - Step 5: Rate Limiting Tables
-- Run this after 04_email_retry_fields.sql
-- =============================================

-- CreateTable: rate_limits
CREATE TABLE `rate_limits` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `featureType` ENUM('QUICK_CHAT', 'STRUCTURED_ANALYSIS', 'DOCUMENT_GENERATION') NOT NULL,
    `usageCount` INTEGER NOT NULL DEFAULT 0,
    `resetDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rate_limits_userId_featureType_key`(`userId`, `featureType`),
    INDEX `rate_limits_resetDate_idx`(`resetDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable: rate_limit_configs
CREATE TABLE `rate_limit_configs` (
    `id` VARCHAR(191) NOT NULL,
    `featureType` ENUM('QUICK_CHAT', 'STRUCTURED_ANALYSIS', 'DOCUMENT_GENERATION') NOT NULL,
    `limit` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `rate_limit_configs_featureType_key`(`featureType`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `rate_limits` ADD CONSTRAINT `rate_limits_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;