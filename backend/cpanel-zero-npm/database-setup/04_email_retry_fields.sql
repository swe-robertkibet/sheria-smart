-- =============================================
-- Sheria Smart Database Setup - Step 4: Email Retry Fields
-- Run this after 03_expand_document_types.sql
-- =============================================

-- AlterTable: Add email retry fields and update status enum
ALTER TABLE `document_requests` 
    ADD COLUMN `emailError` TEXT NULL,
    ADD COLUMN `emailRetryCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `lastEmailAttempt` DATETIME(3) NULL,
    MODIFY `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'EMAIL_QUEUED', 'EMAIL_SENT') NOT NULL DEFAULT 'PENDING';