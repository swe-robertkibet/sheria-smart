-- =============================================
-- Sheria Smart Database Setup - Step 2: Document Requests
-- Run this after 01_init.sql
-- =============================================

-- CreateTable: document_requests
CREATE TABLE `document_requests` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `documentType` ENUM('NDA', 'EMPLOYMENT_CONTRACT', 'SERVICE_AGREEMENT', 'LEASE_AGREEMENT') NOT NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EMAIL_SENT') NOT NULL DEFAULT 'PENDING',
    `userInput` TEXT NOT NULL,
    `backstory` TEXT NOT NULL,
    `generatedContent` TEXT NULL,
    `formats` VARCHAR(191) NOT NULL,
    `emailSent` BOOLEAN NOT NULL DEFAULT false,
    `emailAddress` VARCHAR(191) NOT NULL,
    `filePaths` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `document_requests_userId_createdAt_idx`(`userId`, `createdAt` DESC),
    INDEX `document_requests_status_idx`(`status`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `document_requests` ADD CONSTRAINT `document_requests_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;