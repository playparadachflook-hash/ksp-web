/**
 * ==============================================================================
 * server.js - Node.js Backend Server สำหรับโรงพยาบาลโคกศรีสุพรรณ
 * พัฒนาด้วย Express.js + EJS Template Engine
 * คุณสมบัติด้านความปลอดภัย:
 *   1. ไม่มีไฟล์ .html ในระบบ (ใช้ EJS Views แทนทั้งหมด)
 *   2. ตรวจสอบ URL ไม่ให้มี .html เด็ดขาด (Redirect/Strip .html อัตโนมัติ เพื่อความปลอดภัย)
 *   3. จำกัดการเข้าถึง Static File ให้เฉพาะโฟลเดอร์ css, js, assets เท่านั้น
 *   4. ระบบฐานข้อมูล CMS (JSON Database)
 *   5. ระบบตรวจจับและอัปเดตโค้ดอัตโนมัติจาก GitHub
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
const VIEWS_DIR = path.join(ROOT_DIR, 'views');
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
let express, cors, ejs;
try {
  express = require('express');
  cors = require('cors');
  try { ejs = require('ejs'); } catch (e) {}
  useExpress = true;
} catch (e) {
  useExpress = false;
}

if (useExpress) {
  // ==========================================================================
  // โหมด EXPRESS.JS (Production Mode)
  // ==========================================================================
  const app = express();

  // ตั้งค่า Template Engine
  app.set('view engine', 'ejs');
  app.set('views', VIEWS_DIR);

  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // 1. ระบบรักษาความปลอดภัย URL: ตรวจสอบและป้องกัน URL ไม่ให้มี .html เด็ดขาด
  app.use((req, res, next) => {
    // ปิด Cache เพื่อให้แสดงผลล่าสุดเสมอ
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const reqUrl = req.url;
    const [pathname, search] = reqUrl.split('?');

    // ถ้ามีการเรียก URL ที่ลงท้ายด้วย .html หรือมี /pages/ ให้ Redirect เป็น Clean URL เพื่อความปลอดภัย
    if (pathname.includes('.html') || pathname.startsWith('/pages/')) {
      let cleanPath = pathname
        .replace(/^\/pages\//, '/')
        .replace(/\.html$/, '');

      if (cleanPath === '/index' || cleanPath === '') {
        cleanPath = '/';
      }

      const queryString = search ? `?${search}` : '';
      console.log(`[Security Redirect] ป้องกัน URL ไม่ปลอดภัย: ${reqUrl} -> ${cleanPath}${queryString}`);
      return res.redirect(301, `${cleanPath}${queryString}`);
    }

    next();
  });

  // 2. เสิร์ฟเฉพาะไฟล์ Static ที่จำเป็น (css, js, assets) ไม่อนุญาตให้เข้าถึงไฟล์ตรงใน root
  const staticOptions = {
    setHeaders: (res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  };
  app.use('/css', express.static(path.join(ROOT_DIR, 'css'), staticOptions));
  app.use('/js', express.static(path.join(ROOT_DIR, 'js'), staticOptions));
  app.use('/assets', express.static(path.join(ROOT_DIR, 'assets'), staticOptions));

  // 3. API Health check
  app.get('/api/ping', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Express.js (Node.js)',
      template: 'EJS Views (No HTML files)',
      port: PORT,
      uptime: Math.floor(process.uptime())
    });
  });

  // 4. API CMS Backend
  const handleCms = (req, res) => {
    const action = req.query.action || req.body.action || 'get_all';

    // เข้าสู่ระบบ
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

    // ดึงข้อมูลทุกส่วน
    if (action === 'get_all') {
      return res.json({
        status: 'ok',
        engine: 'Node.js JSON Database',
        data: getCmsData()
      });
    }

    // บันทึกข้อมูลแต่ละส่วน
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

  // 5. API Check Git status
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

  // 6. API Trigger Git Update
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

  // 7. Route หน้าเว็บทั้งหมด (URL สะอาด ไม่มี .html ปลอดภัย 100%)
  // หน้าแรก
  app.get('/', (req, res) => {
    res.render('index');
  });

  // หน้าอื่นๆ ตามชื่อ Route สะอาด
  app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const viewFile = path.join(VIEWS_DIR, `${page}.ejs`);

    if (fs.existsSync(viewFile)) {
      return res.render(page);
    }
    next();
  });

  // จัดการหน้า 404 เมื่อไม่พบ Route
  app.use((req, res) => {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="th">
      <head>
        <meta charset="UTF-8">
        <title>404 - ไม่พบหน้าที่ต้องการ</title>
        <link rel="stylesheet" href="/css/tokens.css">
        <style>
          body { font-family: 'Prompt', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background: #f8fafc; color: #1e293b; text-align: center; }
          .box { padding: 40px; background: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); }
          h1 { font-size: 5rem; margin: 0; color: #0284c7; }
          p { font-size: 1.2rem; color: #64748b; margin: 12px 0 24px; }
          a { display: inline-block; padding: 10px 24px; background: #0284c7; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; }
        </style>
      </head>
      <body>
        <div class="box">
          <h1>404</h1>
          <p>ไม่พบหน้าที่ท่านต้องการ หรือ URL นี้ถูกปรับปรุงเพื่อความปลอดภัย</p>
          <a href="/">กลับสู่หน้าแรก</a>
        </div>
      </body>
      </html>
    `);
  });

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`=======================================================`);
    console.log(` KSP Web Hospital (Node.js Express Server)`);
    console.log(` Security: Clean URLs (No .html exposed)`);
    console.log(` Port:     ${PORT}`);
    console.log(` Local:    http://localhost:${PORT}`);
    console.log(` Network:  http://192.168.2.202:${PORT}`);
    console.log(`=======================================================`);
  });

} else {
  // ==========================================================================
  // โหมด FALLBACK BUILT-IN HTTP (กรณีรันก่อน npm install)
  // ==========================================================================
  const http = require('http');

  const MIME_TYPES = {
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

  function renderView(viewName, res) {
    const filePath = path.join(VIEWS_DIR, `${viewName}.ejs`);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf-8');
      res.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      });
      return res.end(html);
    }
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('404 Not Found');
  }

  const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(204);
      return res.end();
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    let pathname = decodeURIComponent(parsedUrl.pathname);

    // URL Security Check
    if (pathname.includes('.html') || pathname.startsWith('/pages/')) {
      let clean = pathname.replace(/^\/pages\//, '/').replace(/\.html$/, '');
      if (clean === '/index' || clean === '') clean = '/';
      res.writeHead(301, { Location: clean + (parsedUrl.search || '') });
      return res.end();
    }

    if (pathname === '/api/ping') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      return res.end(JSON.stringify({ status: 'ok', engine: 'Node.js Fallback' }));
    }

    // Static Assets
    if (pathname.startsWith('/css/') || pathname.startsWith('/js/') || pathname.startsWith('/assets/')) {
      const filePath = path.join(ROOT_DIR, pathname);
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        });
        return fs.createReadStream(filePath).pipe(res);
      }
    }

    // Views
    if (pathname === '/' || pathname === '') {
      return renderView('index', res);
    }
    const pageName = pathname.replace(/^\//, '');
    renderView(pageName, res);
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`KSP Hospital Fallback Server running on port: ${PORT}`);
  });
}
