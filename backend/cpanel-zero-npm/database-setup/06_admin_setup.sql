-- =============================================
-- Sheria Smart Database Setup - Step 6: Admin User Setup
-- Run this after 05_rate_limits.sql
-- =============================================

-- Note: This script sets up admin privileges for swe.robertkibet@gmail.com
-- The user must first log in via Google OAuth to create their account
-- Then run this script to grant admin privileges

-- Update user to admin status (will only work after first login)
UPDATE `users` SET `isAdmin` = true WHERE `email` = 'swe.robertkibet@gmail.com';

-- Insert default rate limit configurations
INSERT INTO `rate_limit_configs` (`id`, `featureType`, `limit`, `createdAt`, `updatedAt`) VALUES 
('rate_config_quick_chat', 'QUICK_CHAT', 50, NOW(), NOW()),
('rate_config_structured', 'STRUCTURED_ANALYSIS', 20, NOW(), NOW()),
('rate_config_documents', 'DOCUMENT_GENERATION', 10, NOW(), NOW())
ON DUPLICATE KEY UPDATE 
`limit` = VALUES(`limit`), 
`updatedAt` = NOW();

-- Verify admin setup
SELECT 
    email, 
    name, 
    isAdmin,
    createdAt 
FROM `users` 
WHERE `email` = 'swe.robertkibet@gmail.com';

-- Show rate limit configurations
SELECT 
    featureType, 
    `limit`,
    createdAt 
FROM `rate_limit_configs` 
ORDER BY `featureType`;