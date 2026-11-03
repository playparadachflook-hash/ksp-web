<?php
/**
 * ============================================================================
 * ไฟล์: api/cms.php
 * หน้าที่: API หลังบ้านสำหรับ ดึงข้อมูล (GET), บันทึกข้อมูล (POST), และเข้าสู่ระบบ (Login)
 * เชื่อมต่อกับตารางในฐานข้อมูล MySQL (`ksp_hospital_db`)
 * ============================================================================
 */

require_once __DIR__ . '/db.php';

$action = isset($_GET['action']) ? $_GET['action'] : 'get_all';

// ----------------------------------------------------------------------------
// 1. ตรวจสอบการเข้าสู่ระบบ (POST: api/cms.php?action=login)
// ----------------------------------------------------------------------------
if ($action === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? trim($input['password']) : '';

    $stmt = $pdo->prepare('SELECT id, username, password_plain_or_hash, full_name, role FROM users WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $user = $stmt->fetch();

    if ($user && ($password === $user['password_plain_or_hash'] || password_verify($password, $user['password_plain_or_hash']))) {
        echo json_encode([
            'status' => 'ok',
            'user'   => [
                'id'        => $user['id'],
                'username'  => $user['username'],
                'full_name' => $user['full_name'],
                'role'      => $user['role']
            ]
        ], JSON_UNESCAPED_UNICODE);
    } else {
        http_response_code(401);
        echo json_encode([
            'status'  => 'error',
            'message' => 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        ], JSON_UNESCAPED_UNICODE);
    }
    exit;
}

// ----------------------------------------------------------------------------
// 2. ดึงข้อมูลทั้งหมดของเว็บไซต์ (GET: api/cms.php?action=get_all)
// ----------------------------------------------------------------------------
if ($action === 'get_all') {
    $stmt = $pdo->query('SELECT section_key, section_data FROM cms_sections');
    $rows = $stmt->fetchAll();

    $result = [];
    foreach ($rows as $row) {
        $result[$row['section_key']] = json_decode($row['section_data'], true);
    }

    echo json_encode([
        'status' => 'ok',
        'data'   => $result
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// ----------------------------------------------------------------------------
// 3. บันทึกหรือแก้ไขข้อมูลแต่ละส่วน (POST: api/cms.php?action=save_section)
// ----------------------------------------------------------------------------
if ($action === 'save_section' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $sectionKey  = isset($input['section_key']) ? trim($input['section_key']) : '';
    $sectionName = isset($input['section_name']) ? trim($input['section_name']) : $sectionKey;
    $sectionData = isset($input['section_data']) ? $input['section_data'] : null;

    if ($sectionKey === '' || $sectionData === null) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ข้อมูลไม่ครบถ้วน'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $jsonPayload = json_encode($sectionData, JSON_UNESCAPED_UNICODE);

    $stmt = $pdo->prepare('
        INSERT INTO cms_sections (section_key, section_name, section_data)
        VALUES (:k, :n, :d)
        ON DUPLICATE KEY UPDATE
          section_name = VALUES(section_name),
          section_data = VALUES(section_data)
    ');
    $stmt->execute([
        ':k' => $sectionKey,
        ':n' => $sectionName,
        ':d' => $jsonPayload
    ]);

    echo json_encode([
        'status'  => 'ok',
        'message' => "บันทึกข้อมูลส่วน {$sectionName} ลงฐานข้อมูล MySQL สำเร็จ"
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

echo json_encode(['status' => 'error', 'message' => 'ไม่พบคำสั่งที่ระบุ'], JSON_UNESCAPED_UNICODE);
