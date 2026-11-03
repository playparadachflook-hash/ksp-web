/**
 * ==============================================================================
 * server.js - Node.js Backend Server สำหรับโรงพยาบาลโคกศรีสุพรรณ
 * พัฒนาด้วย Express.js ตามมาตรฐานระบบภายในของโรงพยาบาล
 * รองรับทั้ง Express และ Fallback Built-in HTTP (รันได้ทันทีโดยไม่มี Error)
 * ==============================================================================
 */

// โหลดค่า Environment จากไฟล์ .env ถ้ามี
try {
  require('dotenv').config();
} catch (e) {}

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

function getCmsData() {
  try {
    return JSON.parse(fs.readFileSync(CMS_FILE, 'utf-8'));
  } catch (err) {
    return {};
  }
}

function saveCmsData(data) {
  fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getUsers() {
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  } catch (err) {
    return [];
  }
}

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

// ตรวจสอบว่ามี Express ติดตั้งอยู่หรือไม่
let useExpress = false;
let express, cors;
try {
  express = require('express');
  cors = require('cors');
  useExpress = true;
} catch (e) {
  useExpress = false;
}

if (useExpress) {
  // ==========================================================================
  // 1. โหมด EXPRESS.JS (Production Mode)
  // ==========================================================================
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // ปิด Cache เพื่อให้อัปเดตไฟล์ใหม่ทันที
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    next();
  });

  // Health check
  app.get('/api/ping', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Express.js (Node.js)',
      port: PORT,
      uptime: Math.floor(process.uptime())
    });
  });

  // CMS API Handler
  const handleCms = (req, res) => {
    const action = req.query.action || req.body.action || 'get_all';

    // Login
    if (action === 'login' && req.method === 'POST') {
      const username = (req.body.username || '').trim();
      const password = (req.body.password || '').trim();
      const users = getUsers();
      const matched = users.find(u => u.username === username && u.password === password);

      if (matched) {
        return res.json({
          status: 'ok',
          user: {
            id: matched.id,
            username: matched.username,
            full_name: matched.full_name,
            role: matched.role
          }
        });
      } else {
        return res.status(401).json({
          status: 'error',
          message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
        });
      }
    }

    // Get all
    if (action === 'get_all') {
      return res.json({
        status: 'ok',
        engine: 'Node.js JSON Database',
        data: getCmsData()
      });
    }

    // Save section
    if (action === 'save_section' && req.method === 'POST') {
      const sectionKey = (req.body.section_key || '').trim();
      const sectionName = (req.body.section_name || sectionKey).trim();
      const sectionData = req.body.section_data;

      if (!sectionKey || sectionData === undefined) {
        return res.status(400).json({ status: 'error', message: 'ข้อมูลไม่ครบถ้วน' });
      }

      const cmsData = getCmsData();
      cmsData[sectionKey] = sectionData;
      saveCmsData(cmsData);

      return res.json({
        status: 'ok',
        message: `บันทึกข้อมูลส่วน ${sectionName} เรียบร้อยแล้ว (Express JSON Storage)`
      });
    }

    return res.status(400).json({ status: 'error', message: 'ไม่พบคำสั่ง CMS action ที่ระบุ' });
  };

  app.all('/api/cms', handleCms);
  app.all('/api/cms.php', handleCms);

  // Check Git status
  app.get('/api/git-status', async (req, res) => {
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

      res.json({
        hasUpdate,
        localCommit,
        remoteCommit: remoteCommit || localCommit,
        localMsg,
        localDate,
        checkedAt: new Date().toISOString(),
        error: errorMsg
      });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

  // Trigger Git Update
  app.post('/api/git-update', async (req, res) => {
    try {
      console.log('[Git Update] Fetching origin main and updating files...');
      await runCommand('git fetch origin main');
      const updateOut = await runCommand('git reset --hard origin/main');
      const newCommit = (await runCommand('git rev-parse HEAD')).substring(0, 7);
      const newMsg = await runCommand('git log -1 --format=%s');

      res.json({
        success: true,
        message: 'อัปเดตโปรแกรมจาก GitHub สำเร็จแล้ว!',
        commit: newCommit,
        subject: newMsg,
        output: updateOut
      });

      setTimeout(() => {
        console.log('[Git Update] Reloading process via PM2...');
        process.exit(0);
      }, 1000);
    } catch (err) {
      console.error('[Git Update Error]', err);
      res.status(500).json({ success: false, error: err.message });
    }
  });

  // เสิร์ฟไฟล์ Static ทั้งหมด (HTML, CSS, JS, Assets)
  app.use(express.static(ROOT_DIR, {
    setHeaders: (res, path) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  }));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` KSP Web Hospital (Express Server) running on port: ${PORT}`);
    console.log(` Local:   http://localhost:${PORT}`);
    console.log(` Network: http://192.168.2.202:${PORT}`);
    console.log(`=======================================================`);
  });

} else {
  // ==========================================================================
  // 2. โหมด BUILT-IN HTTP (Fallback เมื่อยังไม่ได้รัน npm install)
  // ==========================================================================
  const http = require('http');

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
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
  };

  function parseJsonBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
        if (body.length > 25 * 1024 * 1024) reject(new Error('Payload too large'));
      });
      req.on('end', () => {
        if (!body.trim()) return resolve({});
        try { resolve(JSON.parse(body)); } catch (e) { reject(new Error('JSON parse error: ' + e.message)); }
      });
      req.on('error', reject);
    });
  }

  const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = decodeURIComponent(parsedUrl.pathname);
    const action = parsedUrl.searchParams.get('action') || 'get_all';

    if (pathname === '/api/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ status: 'ok', engine: 'Node.js Built-in HTTP', port: PORT, uptime: Math.floor(process.uptime()) }));
    }

    if (pathname === '/api/cms' || pathname === '/api/cms.php') {
      if (action === 'login' && req.method === 'POST') {
        try {
          const payload = await parseJsonBody(req);
          const matched = getUsers().find(u => u.username === (payload.username || '').trim() && u.password === (payload.password || '').trim());
          if (matched) {
            res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ status: 'ok', user: { id: matched.id, username: matched.username, full_name: matched.full_name, role: matched.role } }));
          } else {
            res.writeHead(401, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ status: 'error', message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' }));
          }
        } catch (err) {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ status: 'error', message: err.message }));
        }
      }

      if (action === 'get_all' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ status: 'ok', engine: 'Node.js JSON Database', data: getCmsData() }));
      }

      if (action === 'save_section' && req.method === 'POST') {
        try {
          const payload = await parseJsonBody(req);
          const sectionKey = (payload.section_key || '').trim();
          const sectionName = (payload.section_name || sectionKey).trim();
          if (!sectionKey || payload.section_data === undefined) {
            res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' });
            return res.end(JSON.stringify({ status: 'error', message: 'ข้อมูลไม่ครบถ้วน' }));
          }
          const cmsData = getCmsData();
          cmsData[sectionKey] = payload.section_data;
          saveCmsData(cmsData);
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ status: 'ok', message: `บันทึกข้อมูลส่วน ${sectionName} เรียบร้อยแล้ว` }));
        } catch (err) {
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          return res.end(JSON.stringify({ status: 'error', message: err.message }));
        }
      }
    }

    if (pathname === '/api/git-status' && req.method === 'GET') {
      try {
        const localCommitFull = await runCommand('git rev-parse HEAD');
        const localCommit = localCommitFull.substring(0, 7);
        const localMsg = await runCommand('git log -1 --format=%s');
        const localDate = await runCommand('git log -1 --format=%cd --date=relative');
        let remoteCommit = '';
        let hasUpdate = false;
        try {
          const lsRemoteOut = await runCommand('git ls-remote origin -h refs/heads/main');
          if (lsRemoteOut) {
            const parts = lsRemoteOut.split(/\s+/);
            const remoteCommitFull = parts[0] || '';
            remoteCommit = remoteCommitFull.substring(0, 7);
            if (remoteCommitFull && localCommitFull) hasUpdate = remoteCommitFull.trim() !== localCommitFull.trim();
          }
        } catch (e) {}

        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ hasUpdate, localCommit, remoteCommit: remoteCommit || localCommit, localMsg, localDate, checkedAt: new Date().toISOString() }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ error: err.message }));
      }
    }

    if (pathname === '/api/git-update' && req.method === 'POST') {
      try {
        await runCommand('git fetch origin main');
        const updateOut = await runCommand('git reset --hard origin/main');
        const newCommit = (await runCommand('git rev-parse HEAD')).substring(0, 7);
        const newMsg = await runCommand('git log -1 --format=%s');
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(JSON.stringify({ success: true, message: 'อัปเดตสำเร็จ', commit: newCommit, subject: newMsg, output: updateOut }));
        setTimeout(() => process.exit(0), 1000);
        return;
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
        return res.end(JSON.stringify({ success: false, error: err.message }));
      }
    }

    // Static Files
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') safePath = '/index.html';
    const filePath = path.join(ROOT_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('404 Not Found');
      }
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';
      res.writeHead(200, {
        'Content-Type': contentType,
        'Content-Length': stats.size,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` KSP Web Hospital (Built-in Server) running on port: ${PORT}`);
    console.log(` Local:   http://localhost:${PORT}`);
    console.log(` Network: http://192.168.2.202:${PORT}`);
    console.log(`=======================================================`);
  });
}
