-- ============================================================================
-- ฐานข้อมูล: Web_Ksp
-- ระบบจัดการหลังบ้าน (Back-Office CMS) โรงพยาบาลโคกศรีสุพรรณ
-- มีเฉพาะตารางของระบบหลังบ้านที่ใช้งานจริงในโปรเจกต์นี้ (ตรงกับทั้ง 9 เมนูใน Admin)
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET foreign_key_checks = 0;

CREATE DATABASE IF NOT EXISTS `Web_Ksp`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `Web_Ksp`;

-- ============================================================================
-- เมนูที่ 1: เพิ่มสมาชิก / ผู้ใช้งานระบบหลังบ้าน (Admin Members)
-- ============================================================================
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(50) NOT NULL UNIQUE COMMENT 'ชื่อผู้ใช้งานสำหรับเข้าสู่ระบบหลังบ้าน',
  `password` VARCHAR(255) NOT NULL COMMENT 'รหัสผ่าน',
  `full_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุลจริง',
  `role` VARCHAR(100) DEFAULT 'กลุ่มงานสุขภาพดิจิทัล' COMMENT 'บทบาท/กลุ่มงานที่สังกัด',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันที่สร้างบัญชี'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางสมาชิกผู้ดูแลระบบหลังบ้าน';

-- ============================================================================
-- ระบบจัดเก็บเนื้อหา CMS ส่วนกลาง (ตารางหลักที่ API /api/cms ใช้งานจริง)
-- ============================================================================
DROP TABLE IF EXISTS `cms_sections`;
CREATE TABLE `cms_sections` (
  `section_key` VARCHAR(60) NOT NULL PRIMARY KEY COMMENT 'คีย์ประจำส่วน เช่น members, news, policies, downloads, slides, executive, departments, intranet, contact',
  `section_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อส่วนภาษาไทย',
  `section_data` LONGTEXT NOT NULL COMMENT 'ข้อมูลเนื้อหาทั้งหมดในรูปแบบ JSON',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'เวลาที่แก้ไขล่าสุด'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลเนื้อหา CMS หลังบ้าน';

-- ============================================================================
-- เมนูที่ 2: ข่าวสาร & กิจกรรม (News & Activities)
-- ============================================================================
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'หัวข้อข่าวสาร',
  `excerpt` TEXT NOT NULL COMMENT 'เนื้อหาข่าวโดยย่อ',
  `image` LONGTEXT NOT NULL COMMENT 'ภาพหน้าปกข่าว (URL หรือ Base64)',
  `gallery` LONGTEXT DEFAULT NULL COMMENT 'ภาพงานทั้งหมดในอัลบั้ม (JSON Array)',
  `link` VARCHAR(255) DEFAULT '/news' COMMENT 'ลิงก์เป้าหมาย',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข่าวสารและกิจกรรม';

-- ============================================================================
-- เมนูที่ 3: ประกาศนโยบายโรงพยาบาล (Policy Announcements)
-- ============================================================================
DROP TABLE IF EXISTS `policies`;
CREATE TABLE `policies` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'ชื่อประกาศนโยบาย',
  `category_badge` VARCHAR(100) DEFAULT 'ประกาศนโยบายโรงพยาบาล' COMMENT 'ป้ายหมวดหมู่นโยบาย',
  `date` VARCHAR(80) NOT NULL COMMENT 'วันที่ลงประกาศ',
  `views` INT DEFAULT 0 COMMENT 'จำนวนครั้งที่เข้าชม (View Counter)',
  `file_name` VARCHAR(255) DEFAULT NULL COMMENT 'ชื่อไฟล์เอกสารแนบ',
  `file_data_url` LONGTEXT DEFAULT NULL COMMENT 'ข้อมูลไฟล์ดาวน์โหลด (Data URL / Base64)',
  `image_data_url` LONGTEXT DEFAULT NULL COMMENT 'ข้อมูลรูปภาพประกาศ (Data URL / Base64)',
  `link` VARCHAR(255) DEFAULT '/policy' COMMENT 'ลิงก์เป้าหมาย',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางประกาศนโยบายโรงพยาบาล';

-- ============================================================================
-- เมนูที่ 4: ดาวน์โหลดเอกสาร (Document Downloads)
-- ============================================================================
DROP TABLE IF EXISTS `downloads`;
CREATE TABLE `downloads` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(255) NOT NULL COMMENT 'ชื่อเอกสารดาวน์โหลด',
  `category` VARCHAR(100) NOT NULL COMMENT 'หมวดหมู่เอกสาร เช่น แบบฟอร์มขอประวัติ, เอกสารสมัครงาน',
  `file_type` VARCHAR(20) DEFAULT 'PDF' COMMENT 'ประเภทไฟล์ เช่น PDF, DOC, XLS',
  `file_size` VARCHAR(50) DEFAULT '1.2 MB' COMMENT 'ขนาดไฟล์',
  `file_url` TEXT DEFAULT NULL COMMENT 'ลิงก์ดาวน์โหลดไฟล์',
  `file_name` VARCHAR(255) DEFAULT NULL COMMENT 'ชื่อไฟล์',
  `file_data_url` LONGTEXT DEFAULT NULL COMMENT 'ข้อมูลไฟล์แนบ (Data URL / Base64)',
  `downloads_count` INT DEFAULT 0 COMMENT 'สถิติจำนวนครั้งที่ถูกดาวน์โหลด',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางดาวน์โหลดเอกสาร';

-- ============================================================================
-- เมนูที่ 5: จัดการสไลด์ประกาศ (Slide Bar Banners)
-- ============================================================================
DROP TABLE IF EXISTS `slides`;
CREATE TABLE `slides` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `category` VARCHAR(100) NOT NULL COMMENT 'ประเภท เช่น ประกาศคลินิกเฉพาะทาง, งานสิ่งพิมพ์, บทความออนไลน์',
  `title` VARCHAR(255) NOT NULL COMMENT 'คำอธิบายรูปภาพ / หัวข้อสไลด์',
  `image` LONGTEXT NOT NULL COMMENT 'ที่อยู่ไฟล์รูปภาพ หรือ Base64',
  `link` VARCHAR(255) DEFAULT '/departments' COMMENT 'คลิกที่แบนเนอร์แล้วให้ไปหน้าไหน',
  `display_order` INT DEFAULT 1 COMMENT 'ลำดับการแสดงผล',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางสไลด์แบนเนอร์หน้าแรก';

-- ============================================================================
-- เมนูที่ 6: ผู้บริหาร & วิสัยทัศน์ (Executive & Vision)
-- ============================================================================
DROP TABLE IF EXISTS `executive`;
CREATE TABLE `executive` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `section_heading` VARCHAR(150) DEFAULT 'ผู้บริหารและวิสัยทัศน์โรงพยาบาล',
  `card_title` VARCHAR(100) DEFAULT 'ผู้บริหาร',
  `photo` LONGTEXT DEFAULT NULL COMMENT 'รูปถ่ายผู้อำนวยการ',
  `director_name` VARCHAR(150) NOT NULL COMMENT 'ชื่อ-นามสกุล ผู้อำนวยการ',
  `rank` VARCHAR(100) DEFAULT 'นายแพทย์ชำนาญการพิเศษ',
  `acting_title` VARCHAR(100) DEFAULT 'รักษาการในตำแหน่ง',
  `role` VARCHAR(100) DEFAULT 'ผู้อำนวยการ รพ.โคกศรีสุพรรณ',
  `vision_badge` VARCHAR(150) DEFAULT 'โรงพยาบาลโคกศรีสุพรรณ (KHOKSRISUPHAN HOSPITAL)',
  `vision_headline` VARCHAR(255) NOT NULL COMMENT 'คำขวัญ/วิสัยทัศน์หลัก',
  `vision_quote` TEXT NOT NULL COMMENT 'สารจากผู้อำนวยการ',
  `pillars_json` LONGTEXT DEFAULT NULL COMMENT 'ข้อมูลเสาหลัก วิสัยทัศน์ พันธกิจ ค่านิยม (JSON Array)',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลผู้บริหารและวิสัยทัศน์';

-- ============================================================================
-- เมนูที่ 7: แผนกและคลินิก (Departments & Clinics)
-- ============================================================================
DROP TABLE IF EXISTS `departments`;
CREATE TABLE `departments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `dept_code` VARCHAR(30) DEFAULT NULL COMMENT 'รหัสแผนก เช่น OPD, ER, DENTAL',
  `name_th` VARCHAR(150) NOT NULL COMMENT 'ชื่อแผนกภาษาไทย',
  `name_en` VARCHAR(150) DEFAULT NULL COMMENT 'ชื่อแผนกภาษาอังกฤษ',
  `category` VARCHAR(100) DEFAULT 'แผนกผู้ป่วยนอก' COMMENT 'หมวดหมู่',
  `description` TEXT DEFAULT NULL COMMENT 'รายละเอียดการให้บริการ',
  `location_info` VARCHAR(150) DEFAULT NULL COMMENT 'อาคารและชั้นที่ตั้ง',
  `tel_internal` VARCHAR(50) DEFAULT NULL COMMENT 'เบอร์โทรศัพท์ภายใน',
  `open_hours` VARCHAR(150) DEFAULT NULL COMMENT 'เวลาทำการ',
  `icon_svg` TEXT DEFAULT NULL COMMENT 'ไอคอนประจำแผนก',
  `link` VARCHAR(255) DEFAULT '/departments',
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแผนกและคลินิก';

-- ============================================================================
-- เมนูที่ 8: เว็บไซต์ภายใน (Internal Websites / Intranet)
-- ============================================================================
DROP TABLE IF EXISTS `intranet`;
CREATE TABLE `intranet` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL COMMENT 'ชื่อระบบงาน เช่น ระบบเรียกคิว Smart Queue, HOSxP',
  `category` VARCHAR(100) DEFAULT 'งานบริการผู้ป่วย' COMMENT 'หมวดหมู่งาน',
  `description` VARCHAR(255) DEFAULT NULL COMMENT 'คำอธิบายระบบโดยย่อ',
  `url` VARCHAR(255) NOT NULL COMMENT 'URL หรือ IP ของระบบงาน',
  `port_number` INT DEFAULT NULL COMMENT 'หมายเลขพอร์ต',
  `icon_symbol` VARCHAR(50) DEFAULT '🖥️' COMMENT 'ไอคอนประจำระบบ',
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางเว็บไซต์ระบบสารสนเทศภายใน';

-- ============================================================================
-- เมนูที่ 9: ติดต่อเรา & แผนที่ (Contact & Map)
-- ============================================================================
DROP TABLE IF EXISTS `contact`;
CREATE TABLE `contact` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `hospital_name` VARCHAR(150) DEFAULT 'โรงพยาบาลโคกศรีสุพรรณ',
  `address` VARCHAR(255) NOT NULL COMMENT 'ที่อยู่โรงพยาบาล',
  `tel_normal` VARCHAR(50) DEFAULT '042-766054' COMMENT 'เบอร์โทรศัพท์ปกติ',
  `tel_emergency` VARCHAR(50) DEFAULT '042-766054 ต่อ 101' COMMENT 'เบอร์โทรฉุกเฉิน 24 ชม.',
  `email` VARCHAR(100) DEFAULT 'ksphos@gmail.com' COMMENT 'อีเมลติดต่อ',
  `map_url` TEXT DEFAULT NULL COMMENT 'ลิงก์ Google Maps / Iframe',
  `travel_info` TEXT DEFAULT NULL COMMENT 'ข้อมูลการเดินทาง',
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางข้อมูลติดต่อโรงพยาบาล';

-- ============================================================================
-- ข้อมูลเริ่มต้นของระบบหลังบ้าน (Initial Seed Data)
-- ============================================================================

-- 1. ผู้ใช้งานเริ่มต้น (admin / 1234)
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`)
VALUES
  (1, 'admin', '1234', 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)', 'Super Admin');

-- 2. ข้อมูลสไลด์ประกาศเริ่มต้น
INSERT INTO `slides` (`id`, `category`, `title`, `image`, `link`, `display_order`)
VALUES
  (1, 'ประกาศคลินิกเฉพาะทาง', 'ทีมสูตินรีแพทย์ผู้ชำนาญการ ด้านสุขภาพผู้หญิง แผนกสูตินรีเวชกรรม', 'assets/images/banners/banner-1.png', '/departments', 1),
  (2, 'งานสิ่งพิมพ์ประชาสัมพันธ์', 'โครงการตรวจสุขภาพประจำปี ใส่ใจสุขภาพเชิงป้องกัน โรงพยาบาลโคกศรีสุพรรณ', 'assets/images/banners/banner-2.svg', '/departments', 2),
  (3, 'บทความออนไลน์', 'บทความสุขภาพออนไลน์: รู้ทันสัญญาณเตือนโรคหัวใจและความดันโลหิต', 'assets/images/banners/banner-3.svg', '/news', 3);

-- 3. ข้อมูลข่าวสารเริ่มต้น
INSERT INTO `news` (`id`, `title`, `excerpt`, `image`, `link`)
VALUES
  (1, 'การแสดงผลงานกรณีศึกษาทางการพยาบาล ณ ประเทศเกาหลีใต้', 'ผลงานวิชาการด้านการดูแลรักษาผู้ป่วยของหน่วยวิกฤติหัวใจ โรงพยาบาลโคกศรีสุพรรณ ได้รับคัดเลือกให้นำเสนอผลงานวิชาการ...', 'assets/images/news/news-1.png', '/news'),
  (2, 'โครงการอบรมเชิงปฏิบัติการพัฒนาศักยภาพบุคลากรทางการแพทย์', 'กลุ่มงานการพยาบาลจัดอบรมฟื้นฟูทักษะการช่วยฟื้นคืนชีพขั้นสูง (ACLS) ประจำปี 2569...', 'assets/images/news/news-1.png', '/news');

-- 4. ข้อมูลนโยบายเริ่มต้น
INSERT INTO `policies` (`id`, `title`, `category_badge`, `date`, `views`, `link`)
VALUES
  (1, 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล', 'ประกาศนโยบายโรงพยาบาล', '5 มิ.ย. 2567', 6694, '/policy'),
  (2, 'นโยบายความปลอดภัยของผู้ป่วยและบุคลากรสาธารณสุข (2P Safety)', 'มาตรฐานคุณภาพ HA', '1 ต.ค. 2567', 4820, '/policy');

-- 5. ข้อมูลเอกสารดาวน์โหลดเริ่มต้น
INSERT INTO `downloads` (`id`, `title`, `category`, `file_type`, `file_size`, `downloads_count`)
VALUES
  (1, 'แบบฟอร์มขอประวัติการรักษาพยาบาล (ใบคำร้องทั่วไป)', 'แบบฟอร์มขอประวัติทางการแพทย์', 'PDF', '245 KB', 1250),
  (2, 'ใบสมัครงานลูกจ้างชั่วคราวเงินบำรุง โรงพยาบาลโคกศรีสุพรรณ', 'งานบริหารทรัพยากรบุคคล', 'PDF', '320 KB', 890);

-- 6. ข้อมูลระบบสารสนเทศภายในเริ่มต้น
INSERT INTO `intranet` (`id`, `title`, `category`, `description`, `url`, `port_number`, `icon_symbol`, `display_order`)
VALUES
  (1, 'ระบบเรียกคิวอัจฉริยะ (HOSxP Smart Queue)', 'งานบริการผู้ป่วย', 'ระบบแสดงผลและเรียกคิวผู้ป่วยอัตโนมัติ เชื่อมต่อ HOSxP เรียลไทม์', 'http://192.168.2.202:5173', 5173, '📟', 1),
  (2, 'ระบบสารสนเทศโรงพยาบาล HOSxP Portal', 'งานบริหารและสารสนเทศ', 'ศูนย์รวมโปรแกรมและระบบงานภายในโรงพยาบาลสำหรับเจ้าหน้าที่', 'http://192.168.2.202:80', 80, '🏥', 2),
  (3, 'ระบบตรวจสอบสิทธิและการเคลม (FDH Checker)', 'งานการเงินและการเคลม', 'ระบบตรวจสอบสิทธิการรักษาพยาบาลและการส่งเบิกค่ารักษาแบบดิจิทัล', 'http://192.168.2.202:3000', 3000, '💳', 3);

-- 7. ข้อมูลติดต่อเริ่มต้น
INSERT INTO `contact` (`id`, `hospital_name`, `address`, `tel_normal`, `tel_emergency`, `email`)
VALUES
  (1, 'โรงพยาบาลโคกศรีสุพรรณ', 'อำเภอโคกศรีสุพรรณ จังหวัดสกลนคร 47280', '042-766054', '042-766054 ต่อ 101', 'ksphos@gmail.com');

SET foreign_key_checks = 1;
