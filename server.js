/**
 * server.js - Node.js Server สำหรับโปรแกรมเว็บไซต์โรงพยาบาลโคกศรีสุพรรณ
 * - เสิร์ฟไฟล์เว็บ Static files (HTML, CSS, JS, Assets)
 * - มี API /api/git-status และ /api/git-update สำหรับตรวจสอบและกดอัปเดตจาก GitHub
 * - ควบคุมพอร์ตไม่ให้ชนกับระบบอื่น (ค่าเริ่มต้น PORT 3088)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = parseInt(process.env.PORT, 10) || 3088;
const ROOT_DIR = __dirname;

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

const server = http.createServer(async (req, res) => {
  // CORS Headers
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

  // 1. API Health check
  if (pathname === '/api/ping') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ status: 'ok', port: PORT, uptime: Math.floor(process.uptime()) }));
    return;
  }

  // 2. API Check Git status (ตรวจสอบว่า GitHub มีอัปเดตใหม่หรือไม่)
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

  // 3. API Trigger Git Update (กดดึงอัปเดตจาก GitHub และรีสตาร์ทเซิร์ฟเวอร์อัตโนมัติ)
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

      // Exit process หลังจากส่ง response แล้ว เพื่อให้ PM2 รีสตาร์ท process ใหม่ทันที
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

  // 4. Static file server
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
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`=======================================================`);
  console.log(` KSP Web Hospital Server running on port: ${PORT}`);
  console.log(` Local:   http://localhost:${PORT}`);
  console.log(` Network: http://192.168.2.202:${PORT}`);
  console.log(`=======================================================`);
});
