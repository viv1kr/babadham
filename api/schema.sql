-- =========================================================
-- BABA BAIDYANATH PRASADAM - Shared Hosting MySQL Schema
-- Import this SQL file via cPanel / Hostinger phpMyAdmin
-- =========================================================

CREATE DATABASE IF NOT EXISTS `babadham` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `babadham`;

-- 1. Prebooking Leads & Orders Table
CREATE TABLE IF NOT EXISTS `orders` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `order_id` VARCHAR(100) NOT NULL UNIQUE,
  `customer_name` VARCHAR(255) NOT NULL,
  `customer_phone` VARCHAR(50) NOT NULL,
  `shipping_address` TEXT NOT NULL,
  `city` VARCHAR(100) DEFAULT NULL,
  `state` VARCHAR(100) DEFAULT NULL,
  `pincode` VARCHAR(20) DEFAULT NULL,
  `landmark` VARCHAR(255) DEFAULT NULL,
  `total_amount` DECIMAL(10,2) DEFAULT 251.00,
  `payment_method` VARCHAR(50) DEFAULT 'COD',
  `lead_status` VARCHAR(50) DEFAULT 'PENDING',
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `booking_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Prebooking Hero Banners Table
CREATE TABLE IF NOT EXISTS `prebooking_banners` (
  `id` VARCHAR(100) PRIMARY KEY,
  `title` VARCHAR(255) DEFAULT NULL,
  `media_type` ENUM('image', 'video') DEFAULT 'image',
  `desktop_url` TEXT DEFAULT NULL,
  `mobile_url` TEXT DEFAULT NULL,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Brand Settings & Configurations Table
CREATE TABLE IF NOT EXISTS `settings` (
  `key_name` VARCHAR(100) PRIMARY KEY,
  `setting_value` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
