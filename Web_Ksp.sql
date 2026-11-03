-- ============================================================================
-- ฐานข้อมูล: Web_Ksp
-- ระบบเว็บไซต์หลักและระบบจัดการหลังบ้าน (Back-Office CMS) โรงพยาบาลโคกศรีสุพรรณ
-- สร้างขึ้นเพื่อรองรับการทำงานทั้งระบบหน้าบ้าน (Public Web) และระบบหลังบ้าน (Admin CMS)
-- ============================================================================

CREATE DATABASE IF NOT EXISTS `Web_Ksp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `Web_Ksp`;

-- ============================================================================
-- หมวดที่ 1: ระบบสมาชิกและความปลอดภัยหลังบ้าน (Authentication & Authorization)
-- ============================================================================

-- 1.1 ตารางผู้ดูแลระบบและเจ้าหน้าที่ (users)
DROP TABLE IF EXISTS `user_activity_logs`;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบ',
  `password` VARCHAR(255) NOT NULL COMMENT 'รหัสผ่าน (รองรับทั้ง Plain Text และ Hash)',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุลจริง',
  `role` ENUM('Super Admin', 'Admin', 'Editor', 'Staff') DEFAULT 'Admin' COMMENT 'ระดับสิทธิ์การใช้งาน',
  `department` VARCHAR(100) DEFAULT 'กลุ่มงานสุขภาพดิจิทัล' COMMENT 'แผนก/กลุ่มงานที่สังกัด',
  `email` VARCHAR(100) DEFAULT NULL COMMENT 'อีเมลติดต่อ',
  `tel` VARCHAR(30) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ติดต่อ',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '1 = ใช้งานได้, 0 = ปิดใช้งาน',
  `last_login` DATETIME DEFAULT NULL COMMENT 'เวลาที่เข้าสู่ระบบล่าสุด',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบัญชี',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางผู้ดูแลระบบหลังบ้าน';

-- 1.2 ตารางประวัติการเข้าใช้งานและแก้ไขข้อมูล (user_activity_logs)
CREATE TABLE `user_activity_logs` (
  `id` BIGINT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT DEFAULT NULL COMMENT 'รหัสผู้ใช้งานที่ทำรายการ',
  `username` VARCHAR(50) NOT NULL COMMENT 'ชื่อผู้ใช้งาน',
  `action` VARCHAR(100) NOT NULL COMMENT 'การกระทำ เช่น LOGIN, UPDATE_SECTION, DELETE_BANNER',
  `details` TEXT DEFAULT NULL COMMENT 'รายละเอียดเพิ่มเติม',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'หมายเลข IP ของผู้ใช้งาน',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบันทึก Audit Logs การใช้งานหลังบ้าน';

-- ============================================================================
-- หมวดที่ 2: ระบบจัดการเนื้อหาเว็บไซต์ส่วนกลาง (Flexible CMS Storage)
-- ============================================================================

-- 2.1 ตารางเก็บข้อมูลส่วนต่างๆ ของหน้าเว็บในรูปแบบ JSON (cms_sections)
DROP TABLE IF EXISTS `cms_sections`;
CREATE TABLE `cms_sections` (
  `section_key` VARCHAR(80) NOT NULL PRIMARY KEY COMMENT 'คีย์ประจำส่วน เช่น hero, executive, contact, vision',
  `section_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อส่วนภาษาไทย เช่น ข้อมูลผู้บริหาร, ภาพสไลด์',
  `section_data` LONGTEXT NOT NULL COMMENT 'ข้อมูลเนื้อหาทั้งหมดในรูปแบบ JSON',
  `updated_by` VARCHAR(100) DEFAULT 'admin' COMMENT 'ผู้แก้ไขล่าสุด',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเก็บข้อมูลเนื้อหา CMS';

-- ============================================================================
-- หมวดที่ 3: ระบบสื่อประชาสัมพันธ์ สไลด์ และข่าวสาร (Media & Announcements)
-- ============================================================================

-- 3.1 ตารางภาพสไลด์แบนเนอร์หน้าแรก (banners)
DROP TABLE IF EXISTS `banners`;
CREATE TABLE `banners` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'หัวข้อแบนเนอร์',
  `subtitle` TEXT DEFAULT NULL COMMENT 'คำอธิบายสั้นหรือรายละเอียดย่อย',
  `badge` VARCHAR(80) DEFAULT 'บทความสุขภาพออนไลน์' COMMENT 'ป้ายข้อความกำกับ เช่น ข่าวเด่น, โปรโมชัน',
  `image_url` LONGTEXT NOT NULL COMMENT 'ที่อยู่ไฟล์ภาพ หรือ Base64',
  `link_url` VARCHAR(255) DEFAULT '/departments' COMMENT 'ลิงก์เป้าหมายเมื่อกดคลิก',
  `display_order` INT DEFAULT 1 COMMENT 'ลำดับการแสดงผล',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '1 = แสดงบนหน้าเว็บ, 0 = ซ่อน',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแบนเนอร์สไลด์หน้าแรก';

-- 3.2 ตารางหมวดหมู่ข่าวสาร (news_categories)
DROP TABLE IF EXISTS `news_articles`;
DROP TABLE IF EXISTS `news_categories`;
CREATE TABLE `news_categories` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_name` VARCHAR(100) NOT NULL UNIQUE COMMENT 'ชื่อหมวดหมู่ เช่น ข่าวจัดซื้อจัดจ้าง, ข่าวกิจกรรม',
  `badge_color` VARCHAR(30) DEFAULT '#0284c7' COMMENT 'สีของป้ายหมวดหมู่',
  `display_order` INT DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางหมวดหมู่ข่าว';

-- 3.3 ตารางข่าวสารและกิจกรรม (news_articles)
CREATE TABLE `news_articles` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category_id` INT DEFAULT NULL COMMENT 'รหัสหมวดหมู่ข่าว',
  `title` VARCHAR(255) NOT NULL COMMENT 'หัวข้อข่าวสาร',
  `excerpt` TEXT DEFAULT NULL COMMENT 'เนื้อหาข่าวโดยย่อสำหรับแสดงหน้ารวม',
  `content` LONGTEXT DEFAULT NULL COMMENT 'เนื้อหาข่าวฉบับเต็ม (รองรับ HTML)',
  `cover_image` LONGTEXT DEFAULT NULL COMMENT 'รูปภาพหน้าปกข่าว',
  `views_count` INT DEFAULT 0 COMMENT 'จำนวนครั้งที่มีผู้เข้าชม',
  `is_pinned` TINYINT(1) DEFAULT 0 COMMENT '1 = ปักหมุดข่าวเด่น, 0 = ทั่วไป',
  `is_active` TINYINT(1) DEFAULT 1 COMMENT '1 = เผยแพร่, 0 = แบบร่าง',
  `published_date` DATE NOT NULL COMMENT 'วันที่เผยแพร่',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `news_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางบทความและข่าวสาร';

-- ============================================================================
-- หมวดที่ 4: ระบบบริการทางการแพทย์ แผนก และคลินิก (Clinical Services)
-- ============================================================================

-- 4.1 ตารางแผนกและคลินิกบริการทางการแพทย์ (departments)
DROP TABLE IF EXISTS `doctor_schedules`;
DROP TABLE IF EXISTS `doctors`;
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dept_code` VARCHAR(30) DEFAULT NULL UNIQUE COMMENT 'รหัสแผนก เช่น OPD, ER, DENTAL',
  `name_th` VARCHAR(150) NOT NULL COMMENT 'ชื่อแผนกภาษาไทย',
  `name_en` VARCHAR(150) DEFAULT NULL COMMENT 'ชื่อแผนกภาษาอังกฤษ',
  `category` ENUM('แผนกผู้ป่วยนอก', 'แผนกผู้ป่วยใน', 'ศูนย์การแพทย์เฉพาะทาง', 'สนับสนุนบริการ') DEFAULT 'แผนกผู้ป่วยนอก',
  `description` TEXT DEFAULT NULL COMMENT 'รายละเอียดการให้บริการ',
  `location_building` VARCHAR(100) DEFAULT 'อาคารผู้ป่วยนอก (OPD)' COMMENT 'ชื่ออาคารที่ตั้ง',
  `location_floor` VARCHAR(50) DEFAULT 'ชั้น 1' COMMENT 'ชั้นที่ตั้ง',
  `tel_internal` VARCHAR(50) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ภายใน',
  `open_hours` VARCHAR(100) DEFAULT 'เปิดให้บริการ วันจันทร์ - ศุกร์ 08:30 - 16:30 น.' COMMENT 'เวลาทำการ',
  `icon_svg` TEXT DEFAULT NULL COMMENT 'ไอคอนประจำแผนก',
  `cover_image` LONGTEXT DEFAULT NULL COMMENT 'รูปภาพประจำแผนก',
  `display_order` INT DEFAULT 1,
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแผนกและคลินิกการแพทย์';

-- 4.2 ตารางแพทย์ผู้เชี่ยวชาญ (doctors)
CREATE TABLE `doctors` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doctor_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุลแพทย์ พร้อมคำนำหน้า',
  `specialty` VARCHAR(150) NOT NULL COMMENT 'สาขาความเชี่ยวชาญหลัก เช่น เวชศาสตร์ครอบครัว, อายุรกรรม',
  `sub_specialty` VARCHAR(150) DEFAULT NULL COMMENT 'อนุสาขาความเชี่ยวชาญเฉพาะทาง',
  `education` TEXT DEFAULT NULL COMMENT 'ประวัติการศึกษาและการฝึกอบรม',
  `department_id` INT DEFAULT NULL COMMENT 'แผนกที่สังกัด',
  `photo_url` LONGTEXT DEFAULT NULL COMMENT 'รูปถ่ายแพทย์',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแพทย์ผู้เชี่ยวชาญ';

-- 4.3 ตารางออกตรวจของแพทย์ (doctor_schedules)
CREATE TABLE `doctor_schedules` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `doctor_id` INT NOT NULL COMMENT 'รหัสแพทย์',
  `day_of_week` ENUM('จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์', 'อาทิตย์') NOT NULL COMMENT 'วันออกตรวจ',
  `time_period` ENUM('รอบเช้า (08:30 - 12:00)', 'รอบบ่าย (13:00 - 16:30)', 'คลินิกพิเศษนอกเวลา (16:30 - 20:00)') NOT NULL COMMENT 'ช่วงเวลา',
  `room_number` VARCHAR(50) DEFAULT 'ห้องตรวจที่ 1' COMMENT 'ห้องตรวจ',
  `notes` VARCHAR(255) DEFAULT NULL COMMENT 'หมายเหตุ เช่น สัปดาห์ที่ 1 และ 3 ของเดือน',
  `is_active` TINYINT(1) DEFAULT 1,
  FOREIGN KEY (`doctor_id`) REFERENCES `doctors`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเวลาออกตรวจของแพทย์';

-- 4.4 ตารางแพ็กเกจตรวจสุขภาพและโปรโมชัน (health_packages)
DROP TABLE IF EXISTS `health_packages`;
CREATE TABLE `health_packages` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL COMMENT 'ชื่อแพ็กเกจตรวจสุขภาพ',
  `badge` VARCHAR(80) DEFAULT 'โปรแกรมยอดนิยม' COMMENT 'ป้ายข้อความกำกับ',
  `category` VARCHAR(100) DEFAULT 'ตรวจสุขภาพประจำปี' COMMENT 'หมวดหมู่แพ็กเกจ',
  `description` TEXT DEFAULT NULL COMMENT 'รายละเอียดการตรวจ',
  `price_normal` DECIMAL(10,2) DEFAULT NULL COMMENT 'ราคาปกติ',
  `price_promotion` DECIMAL(10,2) NOT NULL COMMENT 'ราคาโปรโมชัน',
  `target_group` VARCHAR(150) DEFAULT 'เหมาะสำหรับประชาชนทุกกลุ่มวัย' COMMENT 'กลุ่มเป้าหมาย',
  `items_checklist` JSON DEFAULT NULL COMMENT 'รายการตรวจในแพ็กเกจ (Array JSON)',
  `cover_image` LONGTEXT DEFAULT NULL COMMENT 'รูปภาพแพ็กเกจ',
  `is_popular` TINYINT(1) DEFAULT 0 COMMENT '1 = แพ็กเกจแนะนำ, 0 = ปกติ',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแพ็กเกจสุขภาพ';

-- ============================================================================
-- หมวดที่ 5: ระบบเอกสารดาวน์โหลดและนโยบายโรงพยาบาล (Documents & Policies)
-- ============================================================================

-- 5.1 ตารางดาวน์โหลดเอกสารและแบบฟอร์ม (downloads)
DROP TABLE IF EXISTS `downloads`;
CREATE TABLE `downloads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'ชื่อเอกสาร',
  `category` VARCHAR(100) NOT NULL COMMENT 'หมวดหมู่ เช่น แบบฟอร์มขอประวัติ, เอกสารสมัครงาน',
  `file_url` TEXT NOT NULL COMMENT 'ลิงก์ดาวน์โหลดไฟล์',
  `file_size` VARCHAR(50) DEFAULT '1.2 MB' COMMENT 'ขนาดไฟล์',
  `file_type` VARCHAR(20) DEFAULT 'PDF' COMMENT 'ประเภทไฟล์ เช่น PDF, DOCX, XLSX',
  `downloads_count` INT DEFAULT 0 COMMENT 'สถิติจำนวนครั้งที่ถูกดาวน์โหลด',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางดาวน์โหลดเอกสาร';

-- 5.2 ตารางประกาศนโยบายโรงพยาบาลและมาตรฐานคุณภาพ (policies)
DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'ชื่อประกาศนโยบาย',
  `category_badge` VARCHAR(100) DEFAULT 'ประกาศนโยบายโรงพยาบาล' COMMENT 'หมวดหมู่นโยบาย',
  `fiscal_year` VARCHAR(10) DEFAULT '2569' COMMENT 'ปีงบประมาณ',
  `announce_date` VARCHAR(80) NOT NULL COMMENT 'วันที่ประกาศ',
  `file_url` TEXT DEFAULT NULL COMMENT 'ลิงก์ไฟล์ประกาศทางการ',
  `views_count` INT DEFAULT 0 COMMENT 'จำนวนครั้งที่เข้าชม',
  `is_active` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางประกาศนโยบายและ ITA';

-- ============================================================================
-- หมวดที่ 6: ระบบสารสนเทศและเว็บไซต์ภายใน (Internal Intranet Systems)
-- ============================================================================

-- 6.1 ตารางลิงก์ระบบสารสนเทศภายในโรงพยาบาล (internal_systems)
DROP TABLE IF EXISTS `internal_systems`;
CREATE TABLE `internal_systems` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `system_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อระบบงาน เช่น ระบบเรียกคิว Smart Queue, HOSxP',
  `system_code` VARCHAR(50) DEFAULT NULL COMMENT 'รหัสย่อระบบ เช่น KSP-QUEUE, FDH, QMR',
  `description` VARCHAR(255) DEFAULT NULL COMMENT 'คำอธิบายระบบโดยย่อ',
  `target_url` VARCHAR(255) NOT NULL COMMENT 'ที่อยู่ URL หรือ IP ของระบบงาน',
  `port_number` INT DEFAULT NULL COMMENT 'หมายเลขพอร์ต (ถ้ามี เช่น 5173, 8080)',
  `category` ENUM('งานบริการผู้ป่วย', 'งานการเงินและการเคลม', 'งานบริหารและสารสนเทศ', 'ระบบคลินิกเฉพาะทาง') DEFAULT 'งานบริการผู้ป่วย',
  `icon_badge` VARCHAR(50) DEFAULT '🖥️' COMMENT 'ไอคอนประจำระบบ',
  `is_active` TINYINT(1) DEFAULT 1,
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเว็บไซต์ระบบสารสนเทศภายใน';

-- ============================================================================
-- หมวดที่ 7: ระบบการมีส่วนร่วมและบริการประชาชน (Citizen & Patient Interaction)
-- ============================================================================

-- 7.1 ตารางการทำนัดหมายแพทย์ออนไลน์จากหน้าบ้าน (online_appointments)
DROP TABLE IF EXISTS `online_appointments`;
CREATE TABLE `online_appointments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hn` VARCHAR(20) DEFAULT NULL COMMENT 'เลขประจำตัวผู้ป่วย (HN ถ้ามี)',
  `cid` VARCHAR(20) NOT NULL COMMENT 'เลขบัตรประชาชน 13 หลัก',
  `patient_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุล ผู้ขอรับบริการ',
  `patient_tel` VARCHAR(30) NOT NULL COMMENT 'เบอร์โทรศัพท์ที่ติดต่อได้',
  `patient_email` VARCHAR(100) DEFAULT NULL COMMENT 'อีเมลสำหรับรับข้อความยืนยัน',
  `department_id` INT DEFAULT NULL COMMENT 'แผนกที่ต้องการทำนัดหมาย',
  `requested_date` DATE NOT NULL COMMENT 'วันที่ต้องการนัดหมาย',
  `requested_time_slot` VARCHAR(50) DEFAULT 'ช่วงเช้า (08:30 - 12:00)' COMMENT 'ช่วงเวลาที่สะดวก',
  `symptoms_note` TEXT DEFAULT NULL COMMENT 'อาการเบื้องต้นหรือสาเหตุการทำนัด',
  `status` ENUM('รอดำเนินการ', 'ยืนยันนัดหมายแล้ว', 'ยกเลิก', 'เสร็จสิ้น') DEFAULT 'รอดำเนินการ' COMMENT 'สถานะการนัดหมาย',
  `staff_remark` TEXT DEFAULT NULL COMMENT 'บันทึกเพิ่มเติมจากเจ้าหน้าที่',
  `confirmed_by` INT DEFAULT NULL COMMENT 'รหัสเจ้าหน้าที่ผู้ยืนยันนัด',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE SET NULL,
  FOREIGN KEY (`confirmed_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางคำขอนัดหมายแพทย์ออนไลน์';

-- 7.2 ตารางข้อความติดต่อสอบถามและข้อเสนอแนะจากหน้าบ้าน (contact_inquiries)
DROP TABLE IF EXISTS `contact_inquiries`;
CREATE TABLE `contact_inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `sender_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุล ผู้ติดต่อ',
  `sender_email` VARCHAR(100) DEFAULT NULL COMMENT 'อีเมล',
  `sender_tel` VARCHAR(30) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์',
  `subject_category` ENUM('สอบถามข้อมูลทั่วไป', 'ร้องเรียนการให้บริการ', 'ข้อเสนอแนะชื่นชม', 'ติดต่อราชการ') DEFAULT 'สอบถามข้อมูลทั่วไป',
  `message_text` TEXT NOT NULL COMMENT 'ข้อความที่ส่งเข้ามา',
  `status` ENUM('รอตรวจสอบ', 'อยู่ระหว่างดำเนินการ', 'ตอบกลับเรียบร้อย') DEFAULT 'รอตรวจสอบ',
  `reply_text` TEXT DEFAULT NULL COMMENT 'ข้อความตอบกลับ',
  `replied_by` INT DEFAULT NULL COMMENT 'รหัสเจ้าหน้าที่ที่ตอบกลับ',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`replied_by`) REFERENCES `users`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อความติดต่อสอบถามจากหน้าบ้าน';

-- ============================================================================
-- หมวดที่ 8: ข้อมูลเริ่มต้นของระบบ (Initial Seed Data)
-- ============================================================================

-- บัญชีผู้ดูแลระบบหลักเริ่มต้น (admin / 1234)
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`, `department`, `email`, `tel`, `is_active`)
VALUES
  (1, 'admin', '1234', 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)', 'Super Admin', 'กลุ่มงานสุขภาพดิจิทัล', 'digitalhealth@ksphospital.go.th', '042-766054', 1),
  (2, 'editor', '1234', 'เจ้าหน้าที่งานประชาสัมพันธ์', 'Editor', 'กลุ่มงานบริหารทั่วไป', 'pr@ksphospital.go.th', '042-766054', 1);

-- หมวดหมู่ข่าวสารเริ่มต้น
INSERT INTO `news_categories` (`id`, `category_name`, `badge_color`, `display_order`)
VALUES
  (1, 'ข่าวสารทั่วไป & บริการทางการแพทย์', '#0284c7', 1),
  (2, 'ข่าวประกาศจัดซื้อจัดจ้าง', '#eab308', 2),
  (3, 'ข่าวกิจกรรมโรงพยาบาล', '#16a34a', 3),
  (4, 'ข่าวรับสมัครงาน', '#8b5cf6', 4);

-- ข่าวสารเริ่มต้น
INSERT INTO `news_articles` (`id`, `category_id`, `title`, `excerpt`, `content`, `cover_image`, `views_count`, `is_pinned`, `is_active`, `published_date`)
VALUES
  (1, 1, 'โรงพยาบาลโคกศรีสุพรรณ เปิดให้บริการคลินิกเฉพาะทางผู้สูงอายุและดูแลผู้ป่วยระยะยาว', 'เปิดให้บริการตรวจวินิจฉัยและดูแลฟื้นฟูสุขภาพผู้สูงอายุแบบองค์รวม โดยทีมแพทย์เวชศาสตร์ครอบครัวและสหวิชาชีพ', 'รายละเอียดข่าวสารและข้อมูลเวลาให้บริการ...', '/assets/images/logo-ksp.png', 342, 1, 1, '2026-10-25'),
  (2, 2, 'ประกาศเผยแพร่แผนการจัดซื้อจัดจ้าง ประจำปีงบประมาณ พ.ศ. 2570', 'รายละเอียดรายการจัดซื้อเวชภัณฑ์และครุภัณฑ์ทางการแพทย์ เพื่อยกระดับศักยภาพห้องปฏิบัติการทางการแพทย์', 'รายละเอียดแผนจัดซื้อจัดจ้าง...', '/assets/images/logo-ksp.png', 189, 0, 1, '2026-10-28'),
  (3, 3, 'โครงการออกหน่วยแพทย์เคลื่อนที่เชิงรุก ดูแลสุขภาพประชาชนในพื้นที่ห่างไกล', 'ทีมแพทย์ พยาบาล และเจ้าหน้าที่สาธารณสุข รพ.โคกศรีสุพรรณ ลงพื้นที่ตรวจสุขภาพและให้ความรู้การป้องกันโรคไม่ติดต่อเรื้อรัง (NCDs)', 'รายละเอียดโครงการ...', '/assets/images/logo-ksp.png', 215, 0, 1, '2026-11-01');

-- แผนกและคลินิกการแพทย์เริ่มต้น
INSERT INTO `departments` (`id`, `dept_code`, `name_th`, `name_en`, `category`, `description`, `location_building`, `location_floor`, `tel_internal`, `open_hours`, `display_order`, `is_active`)
VALUES
  (1, 'ER', 'แผนกอุบัติเหตุและฉุกเฉิน (ER)', 'Emergency Department', 'แผนกผู้ป่วยนอก', 'พร้อมดูแลผู้ป่วยวิกฤตและอุบัติเหตุตลอด 24 ชั่วโมง โดยทีมแพทย์เวชศาสตร์ฉุกเฉินและพยาบาลเฉพาะทาง', 'อาคารผู้ป่วยนอก (OPD)', 'ชั้น 1', '101, 102', 'เปิดให้บริการตลอด 24 ชั่วโมง ทุกวัน', 1, 1),
  (2, 'OPD', 'แผนกผู้ป่วยนอกทั่วไป (OPD)', 'Out-Patient Department', 'แผนกผู้ป่วยนอก', 'ตรวจรักษาโรคทั่วไป ให้คำปรึกษาปัญหาสุขภาพ และประสานงานส่งต่อคลินิกเฉพาะทาง', 'อาคารผู้ป่วยนอก (OPD)', 'ชั้น 1', '103', 'วันจันทร์ - ศุกร์ 08:30 - 16:30 น.', 2, 1),
  (3, 'DENTAL', 'แผนกทันตกรรม (Dental Clinic)', 'Dental Clinic', 'ศูนย์การแพทย์เฉพาะทาง', 'ตรวจสุขภาพช่องปาก อุดฟัน ถอนฟัน ขูดหินปูน รักษารากฟัน และศัลยกรรมช่องปาก', 'อาคารทันตกรรมและบริการเฉพาะทาง', 'ชั้น 2', '201', 'วันจันทร์ - ศุกร์ 08:30 - 16:30 น.', 3, 1),
  (4, 'NCD', 'คลินิกโรคเรื้อรัง (NCD Clinic)', 'Non-Communicable Diseases Clinic', 'ศูนย์การแพทย์เฉพาะทาง', 'ดูแลรักษาโรคเบาหวาน ความดันโลหิตสูง โรคไต และโรคหลอดเลือดหัวใจแบบครบวงจร', 'อาคารเฉลิมพระเกียรติ', 'ชั้น 1', '204', 'วันจันทร์ - พฤหัสบดี 08:30 - 12:00 น.', 4, 1),
  (5, 'THAIMED', 'กลุ่มงานการแพทย์แผนไทยและแพทย์ทางเลือก', 'Applied Thai Traditional Medicine', 'สนับสนุนบริการ', 'นวดประคบสมุนไพรรักษาโรค ฟื้นฟูมารดาหลังคลอด และจ่ายยาสมุนไพรตามศาสตร์การแพทย์แผนไทย', 'อาคารแพทย์แผนไทย', 'ชั้น 1', '301', 'วันจันทร์ - ศุกร์ 08:30 - 16:30 น.', 5, 1);

-- แบนเนอร์หน้าแรกเริ่มต้น
INSERT INTO `banners` (`id`, `title`, `subtitle`, `badge`, `image_url`, `link_url`, `display_order`, `is_active`)
VALUES
  (1, 'รู้ทันสัญญาณเตือนโรคหัวใจและความดันโลหิต ดูแลตัวเองอย่างไรให้ห่างไกลภาวะฉุกเฉิน', 'อ่านบทความแนะนำการสังเกตอาการเบื้องต้น โภชนาการ และการออกกำลังกายที่เหมาะสม', 'บทความสุขภาพออนไลน์', '/assets/images/logo-ksp.png', '/news', 1, 1),
  (2, 'คลังความรู้สุขภาพ โรงพยาบาลโคกศรีสุพรรณ', 'ศูนย์รวมข้อมูลข่าวสาร ความรู้เรื่องยา และการดูแลสุขภาวะเพื่อประชาชน', 'ข่าวประชาสัมพันธ์', '/assets/images/logo-ksp.png', '/departments', 2, 1);

-- ระบบสารสนเทศภายในเริ่มต้น
INSERT INTO `internal_systems` (`id`, `system_name`, `system_code`, `description`, `target_url`, `port_number`, `category`, `icon_badge`, `is_active`, `display_order`)
VALUES
  (1, 'ระบบเรียกคิวอัจฉริยะ (HOSxP Smart Queue)', 'KSP-QUEUE', 'ระบบแสดงผลและเรียกคิวผู้ป่วยอัตโนมัติ เชื่อมต่อ HOSxP เรียลไทม์', 'http://192.168.2.202:5173', 5173, 'งานบริการผู้ป่วย', '📟', 1, 1),
  (2, 'ระบบสารสนเทศโรงพยาบาล HOSxP Portal', 'HOSXP-PORTAL', 'ศูนย์รวมโปรแกรมและระบบงานภายในโรงพยาบาลสำหรับเจ้าหน้าที่', 'http://192.168.2.202:80', 80, 'งานบริหารและสารสนเทศ', '🏥', 1, 2),
  (3, 'ระบบตรวจสอบสิทธิและการเคลม (FDH Checker)', 'FDH-CHECKER', 'ระบบตรวจสอบสิทธิการรักษาพยาบาลและการส่งเบิกค่ารักษาแบบดิจิทัล', 'http://192.168.2.202:3000', 3000, 'งานการเงินและการเคลม', '💳', 1, 3),
  (4, 'ระบบตัวชี้วัดคุณภาพโรงพยาบาล (QMR-KSS)', 'QMR-KSS', 'ระบบติดตามและรายงานตัวชี้วัดผลการดำเนินงานของโรงพยาบาล', 'http://192.168.2.202:8080', 8080, 'งานบริหารและสารสนเทศ', '📊', 1, 4);

-- ประกาศนโยบายเริ่มต้น
INSERT INTO `policies` (`id`, `title`, `category_badge`, `fiscal_year`, `announce_date`, `views_count`, `is_active`)
VALUES
  (1, 'ประกาศนโยบายไม่รับของขวัญและของกำนัลทุกชนิดจากการปฏิบัติหน้าที่ (No Gift Policy) ประจำปีงบประมาณ พ.ศ. 2569', 'ITA & ความโปร่งใส', '2569', '1 ตุลาคม 2568', 128, 1),
  (2, 'นโยบายการคุ้มครองข้อมูลส่วนบุคคล (PDPA) สำหรับผู้มารับบริการทางการแพทย์ โรงพยาบาลโคกศรีสุพรรณ', 'คุ้มครองข้อมูล PDPA', '2569', '15 พฤศจิกายน 2568', 95, 1),
  (3, 'แผนยุทธศาสตร์การพัฒนาโรงพยาบาลดิจิทัล (Smart Hospital) ระยะ 5 ปี (พ.ศ. 2568 - 2572)', 'ยุทธศาสตร์โรงพยาบาล', '2569', '1 มกราคม 2569', 142, 1);

-- เอกสารดาวน์โหลดเริ่มต้น
INSERT INTO `downloads` (`id`, `title`, `category`, `file_url`, `file_size`, `file_type`, `downloads_count`, `is_active`)
VALUES
  (1, 'แบบฟอร์มคำร้องขอประวัติการรักษาพยาบาลและสำเนาเวชระเบียน (ใบคำร้องทั่วไป)', 'แบบฟอร์มขอประวัติทางการแพทย์', '/assets/documents/form-medical-record.pdf', '245 KB', 'PDF', 312, 1),
  (2, 'แบบฟอร์มคำขอทำบัตรผู้ป่วยใหม่ / ปรับปรุงข้อมูลสิทธิการรักษา', 'งานเวชระเบียนและสิทธิการรักษา', '/assets/documents/form-new-patient.pdf', '180 KB', 'PDF', 198, 1),
  (3, 'ใบสมัครงานและคัดเลือกบุคคลเข้าปฏิบัติงานเป็นลูกจ้างชั่วคราวเงินบำรุง', 'งานบริหารทรัพยากรบุคคล', '/assets/documents/form-job-application.pdf', '320 KB', 'PDF', 450, 1);
