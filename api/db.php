<?php
/**
 * ============================================================================
 * ไฟล์: api/db.php
 * หน้าที่: เชื่อมต่อฐานข้อมูล MySQL (XAMPP) ด้วย PDO อย่างปลอดภัย
 * คำแนะนำสำหรับมือใหม่:
 *   - ค่าเริ่มต้นของ XAMPP คือ host = localhost, user = root, password = "" (ว่างเปล่า)
 *   - ถ้านำไปขึ้นเซิร์ฟเวอร์จริงของโรงพยาบาล ให้แก้ค่าตัวแปรด้านล่างนี้จุดเดียวครับ
 * ============================================================================
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$DB_HOST = 'localhost';
$DB_NAME = 'ksp_hospital_db';
$DB_USER = 'root';
$DB_PASS = ''; // ใน XAMPP ปกติรหัสผ่าน root จะว่างเปล่า

try {
    $dsn = "mysql:host={$DB_HOST};dbname={$DB_NAME};charset=utf8mb4";
    $pdo = new PDO($dsn, $DB_USER, $DB_PASS, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);
} catch (PDOException $e) {
    // กรณีไม่ได้เปิด MySQL หรือยังไม่ได้ Import ไฟล์ SQL จะส่งสถานะบอกให้ระบบสลับไปใช้ LocalStorage อัตโนมัติ
    http_response_code(503);
    echo json_encode([
        'status'  => 'offline',
        'message' => 'ยังไม่ได้เชื่อมต่อฐานข้อมูล MySQL (ระบบทำงานในโหมด LocalStorage อัตโนมัติ)',
        'error'   => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
