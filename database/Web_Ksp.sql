-- ============================================================================
-- ฐานข้อมูล: Web_Ksp
-- ระบบจัดการหลังบ้าน (Back-Office CMS) โรงพยาบาลโคกศรีสุพรรณ
-- มีเฉพาะตารางของระบบหลังบ้านที่ใช้งานจริงในโปรเจกต์นี้ (ตรงกับทั้ง 9 เมนูใน Admin)
-- ============================================================================

SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET foreign_key_checks = 0;

DROP DATABASE IF EXISTS `Web_Ksp`;
CREATE DATABASE `Web_Ksp`
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
  `image` LONGTEXT DEFAULT NULL COMMENT 'รูปภาพคลินิก/แผนก (URL หรือ Base64)',
  `link` VARCHAR(255) DEFAULT '/departments',
  `display_order` INT DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางแผนกและคลินิก';

-- ============================================================================
-- เมนูที่ 8: เว็บไซต์ภายใน (Internal Websites / Intranet สไตล์ระบบราชการสะดวก)
-- ============================================================================
DROP TABLE IF EXISTS `intranet`;
CREATE TABLE `intranet` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL COMMENT 'ชื่อระบบงาน เช่น ระบบเรียกคิว Smart Queue, HOSxP',
  `category` VARCHAR(100) DEFAULT 'งานบริการผู้ป่วย' COMMENT 'หมวดหมู่งาน/รหัสย่อระบบ',
  `description` VARCHAR(255) DEFAULT NULL COMMENT 'คำอธิบายระบบโดยย่อ',
  `url` VARCHAR(255) NOT NULL COMMENT 'URL หรือ IP ของระบบงาน',
  `port_number` INT DEFAULT NULL COMMENT 'หมายเลขพอร์ต',
  `icon_symbol` VARCHAR(50) DEFAULT '🖥️' COMMENT 'ไอคอนสัญลักษณ์ข้อความ',
  `theme` VARCHAR(50) DEFAULT 'white' COMMENT 'โทนสีการ์ด เช่น white, purple, peach, sage, olive, sky ฯลฯ',
  `icon` VARCHAR(50) DEFAULT 'globe' COMMENT 'ไอคอนสัญลักษณ์ เช่น server, mail, wall, idcard, gauge',
  `action_text` VARCHAR(100) DEFAULT 'สมัครใช้งาน' COMMENT 'ข้อความบนปุ่มแคปซูล เช่น สมัครใช้งาน, เข้าสู่ระบบ, รอตรวจสอบสิทธิ์',
  `btn_style` VARCHAR(50) DEFAULT 'green' COMMENT 'รูปแบบสีปุ่ม เช่น green, yellow, transparent',
  `logo` LONGTEXT DEFAULT NULL COMMENT 'ภาพโลโก้เฉพาะ URL หรือ Base64',
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
-- เมนูพิเศษ: บันทึกประวัติการทำงานระบบหลังบ้าน (Admin Activity Logs)
-- ============================================================================
DROP TABLE IF EXISTS `admin_logs`;
CREATE TABLE `admin_logs` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(60) NOT NULL COMMENT 'ชื่อผู้ใช้งานที่ทำรายการ',
  `action_type` VARCHAR(30) NOT NULL COMMENT 'ประเภทรายการ: SAVE, UPDATE, DELETE, LOGIN',
  `section_key` VARCHAR(60) NOT NULL COMMENT 'ส่วนที่ทำรายการ เช่น members, news, departments, intranet',
  `details` TEXT DEFAULT NULL COMMENT 'รายละเอียดรายการ',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT 'IP Address ผู้ใช้งาน',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'วันเวลาที่ทำรายการ'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='ตารางประวัติการทำงานระบบหลังบ้าน';

-- ============================================================================
-- ข้อมูลเริ่มต้นของระบบหลังบ้าน (Initial Seed Data)
-- ============================================================================

-- 1. ผู้ใช้งานเริ่มต้น (admin / 1234)
INSERT INTO `users` (`id`, `username`, `password`, `full_name`, `role`)
VALUES
  (1, 'admin', '1212312121flook', 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)', 'Super Admin');

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

-- 6. ข้อมูลแผนกและคลินิกเฉพาะทางเริ่มต้น (13 คลินิกตามตารางออกตรวจ)
INSERT INTO `departments` (`id`, `name_th`, `description`, `icon_svg`, `link`, `display_order`)
VALUES
  (1, 'หัวใจ', 'ตรวจรักษาและติดตามอาการโรคหัวใจและหลอดเลือด คลื่นไฟฟ้าหัวใจ (EKG) ฟื้นฟูสมรรถภาพหัวใจ', 'heart', '/departments', 1),
  (2, 'ARV', 'บริการตรวจรักษา ให้คำปรึกษา และดูแลผู้ติดเชื้อเอชไอวีด้วยยาต้านไวรัสอย่างครบวงจรและเป็นความลับ', 'arv', '/departments', 2),
  (3, 'TB', 'ตรวจคัดกรอง วินิจฉัย เอกซเรย์ และดูแลรักษาผู้ป่วยวัณโรคตามมาตรฐานสากลด้วยระบบ DOTS', 'tb', '/departments', 3),
  (4, 'Thallasemia', 'ดูแลรักษาผู้ป่วยโรคโลหิตจางธาลัสซีเมีย บริการให้เลือด ยาขับเหล็ก และตรวจคัดกรองคู่สมรส', 'thallasemia', '/departments', 4),
  (5, 'thyroid', 'ตรวจวินิจฉัยและรักษาต่อมไทรอยด์ ไทรอยด์เป็นพิษ ภาวะฮอร์โมนไทรอยด์ต่ำ และก้อนที่ต่อมไทรอยด์', 'thyroid', '/departments', 5),
  (6, 'thyroid พฤหัสที่ 2', 'คลินิกเฉพาะทางโรคต่อมไทรอยด์ ให้บริการตรวจติดตามอาการและปรับยาทุกวันพฤหัสบดีสัปดาห์ที่ 2 ของเดือน', 'thyroid', '/departments', 6),
  (7, 'wafarin', 'ติดตามความปลอดภัยการใช้ยาต้านการแข็งตัวของเลือด ตรวจวัดค่า INR และแนะนำการใช้ยาร่วมกับอาหาร', 'wafarin', '/departments', 7),
  (8, 'จิตเวช Wks2', 'บริการตรวจรักษาปัญหาสุขภาพจิต จิตเวช และบำบัดฟื้นฟู ทุกสัปดาห์ที่ 2 ของเดือน', 'psych', '/departments', 8),
  (9, 'จิตเวช Wks4', 'บริการตรวจรักษาปัญหาสุขภาพจิต จิตเวช และติดตามการใช้ยา ทุกสัปดาห์ที่ 4 ของเดือน', 'psych', '/departments', 9),
  (10, 'Asthma 1', 'ตรวจรักษาและควบคุมอาการโรคหอบหืดและปอดอุดกั้นเรื้อรัง (COPD) ทดสอบสมรรถภาพปอด กลุ่มที่ 1', 'asthma', '/departments', 10),
  (11, 'Asthma 2', 'ตรวจติดตามอาการโรคหอบหืด ประเมินเทคนิคการใช้ยาพ่นสูด และการฟื้นฟูสมรรถภาพปอด กลุ่มที่ 2', 'asthma', '/departments', 11),
  (12, 'คลินิกไต 1', 'คลินิกชะลอไตเสื่อม ดูแลผู้ป่วยโรคไตเรื้อรัง (CKD) ระยะเริ่มต้นถึงปานกลาง และการควบคุมอาหาร', 'kidney', '/departments', 12),
  (13, 'คลินิกไต 2', 'ดูแลผู้ป่วยโรคไตเรื้อรังระยะก้าวหน้า วางแผนการรักษาและเตรียมความพร้อมการบำบัดทดแทนไต', 'kidney', '/departments', 13);

-- 7. ข้อมูลระบบสารสนเทศภายในเริ่มต้น
INSERT INTO `intranet` (`id`, `title`, `category`, `description`, `url`, `port_number`, `icon_symbol`, `theme`, `icon`, `action_text`, `btn_style`, `display_order`)
VALUES
  (1, 'ระบบสารสนเทศโรงพยาบาล (HOSxP / HIS)', 'HIS', 'ระบบเวชระเบียนอิเล็กทรอนิกส์และการให้บริการผู้ป่วยนอก-ผู้ป่วยใน', 'http://192.168.2.202:3088', 3088, '🏥', 'purple', 'server', 'เข้าใช้งานระบบ', 'green', 1),
  (2, 'ระบบงานสารบรรณอิเล็กทรอนิกส์ (E-Office)', 'E-Office', 'ระบบรับ-ส่งหนังสือราชการ แจ้งเวียนประกาศ และเอกสารภายในองค์กร', '/internal-websites', NULL, '✉️', 'white', 'mail', 'เข้าสู่ระบบ', 'green', 2),
  (3, 'กลุ่มงานสุขภาพดิจิทัล (IT Helpdesk)', 'Digital Health', 'ระบบแจ้งซ่อมคอมพิวเตอร์ เครือข่ายอินเทอร์เน็ต และความมั่นคงปลอดภัยไซเบอร์', '/internal-websites', NULL, '💻', 'sage', 'wall', 'แจ้งซ่อม IT', 'green', 3),
  (4, 'ระบบเรียกคิวอัจฉริยะ (HOSxP Smart Queue)', 'Queue', 'ระบบจัดการคิวตรวจผู้ป่วย แผนกเวชระเบียนและจุดบริการผู้ป่วยนอก', 'http://192.168.2.202:5173', 5173, '📟', 'pink', 'activity', 'เปิดดูระบบคิว', 'green', 4),
  (5, 'ระบบตรวจสอบสิทธิและการเคลม (FDH Checker)', 'FDH', 'ระบบตรวจสอบสิทธิการรักษาพยาบาลและการส่งเบิกค่ารักษาแบบดิจิทัล', 'http://192.168.2.202:3000', 3000, '💳', 'olive', 'gauge', 'รอตรวจสอบสิทธิ์', 'yellow', 5);

-- 8. ข้อมูลติดต่อเริ่มต้น
INSERT INTO `contact` (`id`, `hospital_name`, `address`, `tel_normal`, `tel_emergency`, `email`)
VALUES
  (1, 'โรงพยาบาลโคกศรีสุพรรณ', 'อำเภอโคกศรีสุพรรณ จังหวัดสกลนคร 47280', '042-766054', '042-766054 ต่อ 101', 'ksphos@gmail.com');

-- 9. ประวัติการเริ่มต้นระบบ
INSERT INTO `admin_logs` (`username`, `action_type`, `section_key`, `details`)
VALUES
  ('admin', 'INIT', 'system', 'ติดตั้งและเริ่มต้นฐานข้อมูลระบบหลังบ้าน Web_Ksp สำเร็จเรียบร้อย');

SET foreign_key_checks = 1;
