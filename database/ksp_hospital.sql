-- ============================================================================
-- ไฟล์ฐานข้อมูล: database/ksp_hospital.sql
-- ระบบฐานข้อมูลหลังบ้าน โรงพยาบาลโคกศรีสุพรรณ (MySQL / MariaDB สำหรับ XAMPP)
-- วิธีใช้งานสำหรับมือใหม่:
--   1. เปิดโปรแกรม XAMPP Control Panel แล้วกด Start ที่ Apache และ MySQL
--   2. เข้าเว็บ http://localhost/phpmyadmin
--   3. กดแท็บ "Import" (นำเข้า) -> เลือกไฟล์ database/ksp_hospital.sql นี้ -> กด Import
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `ksp_hospital_db`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `ksp_hospital_db`;

-- ----------------------------------------------------------------------------
-- 1. ตารางผู้ดูแลระบบหลังบ้าน (users)
--    บัญชีเริ่มต้น: username = admin | password = 1234
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE,
  `password_plain_or_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(120) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

INSERT IGNORE INTO `users` (`id`, `username`, `password_plain_or_hash`, `full_name`, `role`)
VALUES (1, 'admin', '1234', 'ผู้ดูแลระบบ กลุ่มงานสุขภาพดิจิทัล', 'admin');

-- ----------------------------------------------------------------------------
-- 2. ตารางเก็บข้อมูลแต่ละส่วนของเว็บไซต์แบบยืดหยุ่น (cms_sections)
--    เก็บข้อมูล JSON ของแต่ละเมนู (slides, executive, departments, news, policies, downloads, intranet, contact)
--    ข้อดี: โครงสร้างเดียวกับ LocalStorage 100% ทำให้สลับใช้งานระหว่าง LocalStorage กับ MySQL ได้ทันที
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `cms_sections` (
  `section_key` VARCHAR(60) NOT NULL PRIMARY KEY,
  `section_name` VARCHAR(120) NOT NULL,
  `section_data` LONGTEXT NOT NULL,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------------------------------------------------------
-- 3. ตารางแยกตามหมวดหมู่ (สำหรับผู้ที่ต้องการเขียนคำสั่ง SELECT / INSERT แยกตารางในอนาคต)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category_badge` VARCHAR(100) DEFAULT 'ประกาศนโยบายโรงพยาบาล',
  `announce_date` VARCHAR(50) NOT NULL,
  `views` INT DEFAULT 0,
  `link` VARCHAR(255) DEFAULT 'pages/policy.html',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `excerpt` TEXT NOT NULL,
  `image` LONGTEXT NOT NULL,
  `link` VARCHAR(255) DEFAULT 'pages/news.html',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `downloads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL,
  `category` VARCHAR(100) NOT NULL,
  `file_type` VARCHAR(20) DEFAULT 'PDF',
  `file_size` VARCHAR(30) DEFAULT '250 KB',
  `updated_date` VARCHAR(50) NOT NULL,
  `file_url` VARCHAR(255) DEFAULT 'pages/downloads.html',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
