/**
 * ==============================================================================
 * server.js - Node.js Backend Server สำหรับโรงพยาบาลโคกศรีสุพรรณ
 * ==============================================================================
 * ความสามารถของระบบ:
 * 1. เสิร์ฟไฟล์หน้าเว็บ Static (HTML, CSS, JS, Images, Documents)
 * 2. ระบบฐานข้อมูล CMS (JSON Database) จัดเก็บที่ data/cms_data.json
 * 3. ระบบยืนยันตัวตน Login ตรวจสอบจาก data/users.json
 * 4. รองรับ API เดิม (/api/cms และ /api/cms.php) โดยไม่ต้องติดตั้ง PHP หรือ MySQL!
 * 5. ระบบตรวจจับและอัปเดตโค้ดจาก GitHub อัตโนมัติ (/api/git-status, /api/git-update)
 * 6. กำหนดพอร์ต 3088 ไม่ชนกับระบบอื่นในเซิร์ฟเวอร์
 * ==============================================================================
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT, 10) || 3088;
const ROOT_DIR = __dirname;
const DATA_DIR = path.join(ROOT_DIR, 'data');
const CMS_FILE = path.join(DATA_DIR, 'cms_data.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// สร้างโฟลเดอร์ data อัตโนมัติถ้ายังไม่มี
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(CMS_FILE)) {
  fs.writeFileSync(CMS_FILE, JSON.stringify({}, null, 2), 'utf-8');
}
if (!fs.existsSync(USERS_FILE)) {
  const defaultUsers = [
    {
      id: 1,
      username: 'admin',
      password: '1234',
      full_name: 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)',
      role: 'Super Admin'
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), 'utf-8');
}

// ชนิดไฟล์ที่รองรับสำหรับเว็บเบราว์เซอร์
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.doc': 'application/msword',
  '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  '.xls': 'application/vnd.ms-excel',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// ฟังก์ชันรันคำสั่ง Terminal (Git)
function runCommand(cmd) {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: ROOT_DIR, timeout: 30000 }, (error, stdout, stderr) => {
      if (error) {
        reject(new Error((stderr || error.message || '').trim()));
      } else {
        resolve((stdout || '').trim());
      }
    });
  });
}

// ฟังก์ชันแปลง Body ของ HTTP Request เป็น JSON
function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
      // ป้องกัน Request ขนาดใหญ่เกิน 20MB
      if (body.length > 20 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      if (!body.trim()) {
        resolve({});
        return;
      }
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error('รูปแบบ JSON ไม่ถูกต้อง: ' + err.message));
      }
    });
    req.on('error', reject);
  });
}

// อ่านข้อมูล CMS จากไฟล์ JSON
function getCmsData() {
  try {
    const raw = fs.readFileSync(CMS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return {};
  }
}

// บันทึกข้อมูล CMS ลงไฟล์ JSON
function saveCmsData(data) {
  fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// อ่านรายชื่อผู้ใช้งานระบบ
function getUsers() {
  try {
    const raw = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  // CORS Headers รองรับการเรียกจากทุกหน้าเว็บ
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(parsedUrl.pathname);
  const action = parsedUrl.searchParams.get('action') || 'get_all';

  // --------------------------------------------------------------------------
  // 1. API Health check
  // --------------------------------------------------------------------------
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({
      status: 'ok',
      engine: 'Node.js',
      port: PORT,
      uptime: Math.floor(process.uptime())
    }));
    return;
  }

  // --------------------------------------------------------------------------
  // 2. API CMS Backend (รองรับทั้ง /api/cms และ /api/cms.php)
  // --------------------------------------------------------------------------
  if (pathname === '/api/cms' || pathname === '/api/cms.php') {
    // 2.1 เข้าสู่ระบบ (POST: ?action=login)
    if (action === 'login' && req.method === 'POST') {
      try {
        const payload = await parseJsonBody(req);
        const username = (payload.username || '').trim();
        const password = (payload.password || '').trim();

        const users = getUsers();
        const matched = users.find(u => u.username === username && u.password === password);

        if (matched) {
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            status: 'ok',
            user: {
              id: matched.id,
              username: matched.username,
              full_name: matched.full_name,
              role: matched.role
            }
          }));
        } else {
          res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({
            status: 'error',
            message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
          }));
        }
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
      return;
    }

    // 2.2 ดึงข้อมูลทุกส่วน (GET: ?action=get_all)
    if (action === 'get_all' && req.method === 'GET') {
      const cmsData = getCmsData();
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        status: 'ok',
        engine: 'Node.js JSON Database',
        data: cmsData
      }));
      return;
    }

    // 2.3 บันทึกข้อมูลแต่ละส่วน (POST: ?action=save_section)
    if (action === 'save_section' && req.method === 'POST') {
      try {
        const payload = await parseJsonBody(req);
        const sectionKey = (payload.section_key || '').trim();
        const sectionName = (payload.section_name || sectionKey).trim();
        const sectionData = payload.section_data;

        if (!sectionKey || sectionData === undefined) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'error', message: 'ข้อมูลไม่ครบถ้วน' }));
          return;
        }

        const cmsData = getCmsData();
        cmsData[sectionKey] = sectionData;
        saveCmsData(cmsData);

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({
          status: 'ok',
          message: `บันทึกข้อมูลส่วน ${sectionName} เรียบร้อยแล้ว (Node.js JSON Storage)`
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ status: 'error', message: err.message }));
      }
      return;
    }

    res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'error', message: 'ไม่พบคำสั่ง CMS action ที่ระบุ' }));
    return;
  }

  // --------------------------------------------------------------------------
  // 3. API Check Git status (ตรวจสอบว่า GitHub มีอัปเดตใหม่หรือไม่)
  // --------------------------------------------------------------------------
  if (pathname === '/api/git-status' && req.method === 'GET') {
    try {
      const localCommitFull = await runCommand('git rev-parse HEAD');
      const localCommit = localCommitFull.substring(0, 7);
      const localMsg = await runCommand('git log -1 --format=%s');
      const localDate = await runCommand('git log -1 --format=%cd --date=relative');

      let remoteCommitFull = '';
      let remoteCommit = '';
      let hasUpdate = false;
      let errorMsg = null;

      try {
        const lsRemoteOut = await runCommand('git ls-remote origin -h refs/heads/main');
        if (lsRemoteOut) {
          const parts = lsRemoteOut.split(/\s+/);
          remoteCommitFull = parts[0] || '';
          remoteCommit = remoteCommitFull.substring(0, 7);
          if (remoteCommitFull && localCommitFull) {
            hasUpdate = remoteCommitFull.trim() !== localCommitFull.trim();
          }
        }
      } catch (err) {
        errorMsg = 'Cannot reach GitHub: ' + err.message;
      }

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        hasUpdate,
        localCommit,
        remoteCommit: remoteCommit || localCommit,
        localMsg,
        localDate,
        checkedAt: new Date().toISOString(),
        error: errorMsg
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ error: err.message }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 4. API Trigger Git Update (กดดึงอัปเดตจาก GitHub และรีสตาร์ทเซิร์ฟเวอร์อัตโนมัติ)
  // --------------------------------------------------------------------------
  if (pathname === '/api/git-update' && req.method === 'POST') {
    try {
      console.log('[Git Update] Fetching origin main and updating files...');
      await runCommand('git fetch origin main');
      const updateOut = await runCommand('git reset --hard origin/main');
      const newCommit = (await runCommand('git rev-parse HEAD')).substring(0, 7);
      const newMsg = await runCommand('git log -1 --format=%s');

      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({
        success: true,
        message: 'อัปเดตโปรแกรมจาก GitHub สำเร็จแล้ว!',
        commit: newCommit,
        subject: newMsg,
        output: updateOut
      }));

      // Exit process เพื่อให้ PM2 รีสตาร์ท Node.js ใหม่พร้อมโค้ดล่าสุด
      setTimeout(() => {
        console.log('[Git Update] Reloading process via PM2...');
        process.exit(0);
      }, 1000);
    } catch (err) {
      console.error('[Git Update Error]', err);
      res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // --------------------------------------------------------------------------
  // 5. Static file server (เสิร์ฟไฟล์หน้าเว็บ)
  // --------------------------------------------------------------------------
  let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
  if (safePath === '/' || safePath === '\\') {
    safePath = '/index.html';
  }

  const filePath = path.join(ROOT_DIR, safePath);

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` KSP Web Hospital (Node.js Server) running on port: ${PORT}`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://192.168.2.202:${PORT}`);
  console.log(`=======================================================`);
});
