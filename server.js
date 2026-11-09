/**
 * ==============================================================================
 * server.js - Node.js Backend Server สำหรับโรงพยาบาลโคกศรีสุพรรณ
 * พัฒนาด้วย Express.js + EJS Views + เชื่อมต่อฐานข้อมูล MySQL (Web_Ksp)
 * ==============================================================================
 */

// โหลดค่า Environment จากไฟล์ .env
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

// สร้างโฟลเดอร์ data อัตโนมัติสำหรับสำรองข้อมูล
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

function getLocalCmsData() {
  try {
    return JSON.parse(fs.readFileSync(CMS_FILE, 'utf-8'));
  } catch (err) {
    return {};
  }
}

function saveLocalCmsData(data) {
  try {
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {}
}

function getLocalUsers() {
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

// ============================================================================
// การเชื่อมต่อฐานข้อมูล MySQL: Web_Ksp
// ============================================================================
let dbPool = null;
let isDbConnected = false;

try {
  const mysql = require('mysql2/promise');
  dbPool = mysql.createPool({
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'opd',
    password: process.env.DB_PASSWORD || process.env.DB_PASS || 'opd',
    database: process.env.DB_NAME || 'Web_Ksp',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    charset: 'utf8mb4'
  });

  // ทดสอบการเชื่อมต่อ
  dbPool.getConnection().then((conn) => {
    isDbConnected = true;
    console.log('[MySQL] เชื่อมต่อฐานข้อมูล MySQL (Web_Ksp) สำเร็จเรียบร้อย!');
    conn.release();
  }).catch((err) => {
    isDbConnected = false;
    console.warn('[MySQL Warning] ยังไม่สามารถเชื่อมต่อ MySQL ได้ (สลับใช้ระบบสำรองอัตโนมัติ):', err.message);
  });
} catch (e) {
  console.warn('[MySQL Info] ยังไม่ได้ติดตั้ง mysql2 module หรือรันในโหมด Built-in');
}

// ตรวจสอบโมดูล Express
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
  const app = express();

  app.set('view engine', 'ejs');
  app.set('views', VIEWS_DIR);

  app.use(cors());
  app.use(express.json({ limit: '25mb' }));
  app.use(express.urlencoded({ extended: true, limit: '25mb' }));

  // 1. ตรวจสอบความปลอดภัย URL: ไม่ให้มี .html เด็ดขาด
  app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    const reqUrl = req.url;
    const [pathname, search] = reqUrl.split('?');

    if (pathname.includes('.html') || pathname.startsWith('/pages/')) {
      let cleanPath = pathname
        .replace(/^\/pages\//, '/')
        .replace(/\.html$/, '');

      if (cleanPath === '/index' || cleanPath === '') {
        cleanPath = '/';
      }

      const queryString = search ? `?${search}` : '';
      return res.redirect(301, `${cleanPath}${queryString}`);
    }

    next();
  });

  // 2. เสิร์ฟเฉพาะไฟล์ Static ที่จำเป็น
  const staticOptions = {
    setHeaders: (res) => {
      res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    }
  };
  app.use('/css', express.static(path.join(ROOT_DIR, 'css'), staticOptions));
  app.use('/js', express.static(path.join(ROOT_DIR, 'js'), staticOptions));
  app.use('/assets', express.static(path.join(ROOT_DIR, 'assets'), staticOptions));

  // 3. Health check API
  app.get('/api/ping', (req, res) => {
    res.json({
      status: 'ok',
      engine: 'Express.js (Node.js)',
      database: isDbConnected ? 'MySQL Web_Ksp (Connected)' : 'Fallback Local Storage',
      port: PORT,
      uptime: Math.floor(process.uptime())
    });
  });

  // =========================================================================
  // ฟังก์ชันซิงค์ข้อมูลลงตารางจริงรายตารางในฐานข้อมูล MySQL: Web_Ksp
  // รองรับการ เพิ่ม / แก้ไข / ลบ ในทุกๆ เมนูของระบบหลังบ้าน
  // =========================================================================
  async function syncToRelationalTables(sectionKey, sectionData) {
    if (!dbPool) return;
    try {
      if (sectionKey === 'members' && Array.isArray(sectionData)) {
        // --- 1. ตาราง users (สมาชิกและผู้ใช้งานระบบหลังบ้าน) ---
        for (const u of sectionData) {
          if (!u.username) continue;
          await dbPool.execute(`
            INSERT INTO users (username, password, full_name, role)
            VALUES (?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE
              password = VALUES(password),
              full_name = VALUES(full_name),
              role = VALUES(role)
          `, [u.username, u.password || '1234', u.fullName || u.full_name || u.username, u.role || 'ผู้ดูแลระบบ']);
        }
        // ลบสมาชิกที่ถูกลบออกจากระบบหลังบ้าน (ยกเว้น admin บัญชีหลัก)
        const usernames = sectionData.map(u => u.username).filter(Boolean);
        if (usernames.length > 0) {
          const placeholders = usernames.map(() => '?').join(',');
          await dbPool.execute(`DELETE FROM users WHERE username NOT IN (${placeholders}) AND username != 'admin'`, usernames);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลสมาชิก ${sectionData.length} รายการลงตาราง Web_Ksp.users สำเร็จ!`);
      } else if (sectionKey === 'news' && Array.isArray(sectionData)) {
        // --- 2. ตาราง news (ข่าวสาร & กิจกรรม) ---
        await dbPool.execute('DELETE FROM news');
        for (const n of sectionData) {
          const galleryJson = Array.isArray(n.gallery) ? JSON.stringify(n.gallery) : null;
          await dbPool.execute(`
            INSERT INTO news (title, excerpt, image, gallery, link)
            VALUES (?, ?, ?, ?, ?)
          `, [n.title || '', n.excerpt || '', n.image || '', galleryJson, n.link || '/news']);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลข่าวสาร ${sectionData.length} รายการลงตาราง Web_Ksp.news สำเร็จ!`);
      } else if (sectionKey === 'policies' && Array.isArray(sectionData)) {
        // --- 3. ตาราง policies (ประกาศนโยบายโรงพยาบาล) ---
        await dbPool.execute('DELETE FROM policies');
        for (const p of sectionData) {
          await dbPool.execute(`
            INSERT INTO policies (title, category_badge, date, views, file_name, file_data_url, image_data_url, link)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            p.title || '',
            p.categoryBadge || p.category_badge || 'ประกาศนโยบายโรงพยาบาล',
            p.date || '30 ต.ค. 2569',
            Number(p.views) || 0,
            p.fileName || p.file_name || null,
            p.fileDataUrl || p.file_data_url || null,
            p.imageDataUrl || p.image_data_url || null,
            p.link || '/policy'
          ]);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลประกาศนโยบาย ${sectionData.length} รายการลงตาราง Web_Ksp.policies สำเร็จ!`);
      } else if (sectionKey === 'downloads' && Array.isArray(sectionData)) {
        // --- 4. ตาราง downloads (ดาวน์โหลดเอกสาร) ---
        await dbPool.execute('DELETE FROM downloads');
        for (const d of sectionData) {
          await dbPool.execute(`
            INSERT INTO downloads (title, category, file_type, file_size, file_url, file_name, file_data_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
          `, [
            d.title || '',
            d.category || 'ผู้รับบริการ',
            d.fileType || d.file_type || 'PDF',
            d.fileSize || d.file_size || '250 KB',
            d.fileUrl || d.file_url || '/downloads',
            d.fileName || d.file_name || null,
            d.fileDataUrl || d.file_data_url || null
          ]);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลดาวน์โหลด ${sectionData.length} รายการลงตาราง Web_Ksp.downloads สำเร็จ!`);
      } else if (sectionKey === 'slides' && Array.isArray(sectionData)) {
        // --- 5. ตาราง slides (สไลด์แบนเนอร์หน้าแรก) ---
        await dbPool.execute('DELETE FROM slides');
        let order = 1;
        for (const s of sectionData) {
          await dbPool.execute(`
            INSERT INTO slides (category, title, image, link, display_order)
            VALUES (?, ?, ?, ?, ?)
          `, [s.category || 'ประกาศประชาสัมพันธ์', s.title || '', s.image || '', s.link || '/departments', order++]);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลสไลด์ ${sectionData.length} รายการลงตาราง Web_Ksp.slides สำเร็จ!`);
      } else if (sectionKey === 'executive' && typeof sectionData === 'object' && sectionData !== null) {
        // --- 6. ตาราง executive (ผู้บริหารและวิสัยทัศน์) ---
        await dbPool.execute(`
          UPDATE executive SET
            director_name = ?,
            rank = ?,
            acting_title = ?,
            role = ?,
            vision_headline = ?,
            vision_quote = ?,
            photo = COALESCE(?, photo)
          WHERE id = 1
        `, [
          sectionData.name || '',
          sectionData.rank || '',
          sectionData.actingTitle || '',
          sectionData.role || '',
          sectionData.visionHeadline || '',
          sectionData.visionQuote || '',
          sectionData.photo || null
        ]);
        console.log(`[MySQL Sync] ซิงค์ข้อมูลผู้บริหารลงตาราง Web_Ksp.executive สำเร็จ!`);
      } else if (sectionKey === 'departments' && Array.isArray(sectionData)) {
        // --- 7. ตาราง departments (แผนกและคลินิก) ---
        await dbPool.execute('DELETE FROM departments');
        let order = 1;
        for (const dept of sectionData) {
          const deptId = dept.id || order;
          const deptLink = dept.link || `/department/${deptId}`;
          const servicesJson = Array.isArray(dept.services) ? JSON.stringify(dept.services) : (dept.services || dept.services_list || '');
          await dbPool.execute(`
            INSERT INTO departments (id, dept_code, name_th, description, icon_svg, image, link, display_order, location_info, tel_internal, open_hours_weekday, open_hours_weekend, services_list, detail_text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            deptId,
            dept.slug || dept.dept_code || ('clinic-' + deptId),
            dept.title || '',
            dept.description || '',
            dept.icon || 'heart',
            dept.image || null,
            deptLink,
            order++,
            dept.location || dept.location_info || 'อาคารผู้ป่วยนอก โรงพยาบาลโคกศรีสุพรรณ',
            dept.tel || dept.tel_internal || '042-766054 ต่อ 101',
            dept.open_hours_weekday || 'วันจันทร์ – ศุกร์ 08.00 – 16.00 น.',
            dept.open_hours_weekend || 'ปิดทำการวันหยุดราชการ',
            servicesJson,
            dept.detail || dept.detail_text || ''
          ]);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลแผนก ${sectionData.length} รายการลงตาราง Web_Ksp.departments สำเร็จ!`);
      } else if (sectionKey === 'intranet' && Array.isArray(sectionData)) {
        // --- 8. ตาราง intranet (เว็บไซต์ภายใน สไตล์ราชการสะดวก) ---
        await dbPool.execute('DELETE FROM intranet');
        let order = 1;
        for (const intra of sectionData) {
          await dbPool.execute(`
            INSERT INTO intranet (title, category, description, url, theme, icon, action_text, btn_style, logo, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `, [
            intra.title || '',
            intra.code || 'ระบบงานภายใน',
            intra.description || '',
            intra.url || '',
            intra.theme || 'white',
            intra.icon || 'globe',
            intra.actionText || intra.action_text || 'สมัครใช้งาน',
            intra.btnStyle || intra.btn_style || 'green',
            intra.logo || null,
            order++
          ]);
        }
        console.log(`[MySQL Sync] ซิงค์ข้อมูลเว็บไซต์ภายใน ${sectionData.length} รายการลงตาราง Web_Ksp.intranet สำเร็จ!`);
      } else if (sectionKey === 'contact' && typeof sectionData === 'object' && sectionData !== null) {
        // --- 9. ตาราง contact (ข้อมูลติดต่อโรงพยาบาลและแผนที่) ---
        await dbPool.execute(`
          UPDATE contact SET
            hospital_name = ?,
            address = ?,
            tel_normal = ?,
            email = ?,
            map_url = ?
          WHERE id = 1
        `, [
          sectionData.hospitalName || '',
          sectionData.address || '',
          sectionData.phone || '',
          sectionData.email || '',
          sectionData.googleMapsDirUrl || null
        ]);
        console.log(`[MySQL Sync] ซิงค์ข้อมูลติดต่อลงตาราง Web_Ksp.contact สำเร็จ!`);
      }
    } catch (syncErr) {
      console.error(`[MySQL Sync Table Error (${sectionKey})]:`, syncErr.message);
    }
  }

  // 4. API CMS Backend & Authentication (เชื่อมต่อตารางจริงใน Web_Ksp)
  const handleCms = async (req, res) => {
    const action = req.query.action || req.body.action || 'get_all';

    // ------------------------------------------------------------------------
    // 4.1 ตรวจสอบการเข้าสู่ระบบ (Login) จากตารางจริง `users` ในฐานข้อมูล `Web_Ksp`
    // ------------------------------------------------------------------------
    if (action === 'login' && req.method === 'POST') {
      const username = (req.body.username || '').trim();
      const password = (req.body.password || '').trim();

      if (!username || !password) {
        return res.status(400).json({ status: 'error', message: 'กรุณากรอกชื่อผู้ใช้และรหัสผ่าน' });
      }

      // ตรวจสอบผ่าน MySQL (Web_Ksp.users)
      if (dbPool) {
        try {
          const [rows] = await dbPool.execute(
            'SELECT id, username, password, full_name, role FROM users WHERE username = ? LIMIT 1',
            [username]
          );

          if (rows.length > 0) {
            const dbUser = rows[0];
            // ตรวจสอบรหัสผ่านตรงกับในฐานข้อมูล Web_Ksp
            if (password === dbUser.password) {
              console.log(`[Login Success] ผู้ใช้: ${username} เข้าสู่ระบบสำเร็จ (ฐานข้อมูล MySQL: Web_Ksp)`);
              try {
                const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
                await dbPool.execute(`
                  INSERT INTO admin_logs (username, action_type, section_key, details, ip_address)
                  VALUES (?, 'LOGIN', 'auth', 'เข้าสู่ระบบสำเร็จ', ?)
                `, [username, String(clientIp)]);
              } catch (e) {}
              return res.json({
                status: 'ok',
                source: 'MySQL Database (Web_Ksp)',
                user: {
                  id: dbUser.id,
                  username: dbUser.username,
                  full_name: dbUser.full_name,
                  role: dbUser.role
                }
              });
            } else {
              return res.status(401).json({
                status: 'error',
                message: 'รหัสผ่านไม่ถูกต้อง (ตรวจสอบจากฐานข้อมูล Web_Ksp)'
              });
            }
          } else {
            return res.status(401).json({
              status: 'error',
              message: 'ไม่พบบัญชีผู้ใช้งานนี้ในฐานข้อมูล Web_Ksp'
            });
          }
        } catch (dbErr) {
          console.error('[MySQL Login Query Error]', dbErr.message);
        }
      }

      // โหมดสำรอง (Fallback) กรณีฐานข้อมูลออฟไลน์
      const localUsers = getLocalUsers();
      const matched = localUsers.find(u => u.username === username && u.password === password);
      if (matched) {
        return res.json({
          status: 'ok',
          source: 'Local Fallback Storage',
          user: {
            id: matched.id,
            username: matched.username,
            full_name: matched.full_name,
            role: matched.role
          }
        });
      }

      return res.status(401).json({
        status: 'error',
        message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง'
      });
    }

    // ------------------------------------------------------------------------
    // 4.2 ดึงข้อมูลทุกส่วน (Get All Sections) จาก MySQL Web_Ksp.cms_sections
    // ------------------------------------------------------------------------
    if (action === 'get_all') {
      if (dbPool) {
        try {
          const [rows] = await dbPool.execute('SELECT section_key, section_data FROM cms_sections');
          const result = {};
          for (const row of rows) {
            try {
              result[row.section_key] = JSON.parse(row.section_data);
            } catch (e) {
              result[row.section_key] = row.section_data;
            }
          }
          return res.json({
            status: 'ok',
            source: 'MySQL Web_Ksp',
            data: result
          });
        } catch (dbErr) {
          console.error('[MySQL Get All Error]', dbErr.message);
        }
      }

      return res.json({
        status: 'ok',
        source: 'Local JSON File',
        data: getLocalCmsData()
      });
    }

    // ------------------------------------------------------------------------
    // 4.2.1 ดึงข้อมูลเฉพาะส่วน (Get Single Section) จาก MySQL Web_Ksp.cms_sections
    // ------------------------------------------------------------------------
    if (action === 'get_section') {
      const sectionKey = (req.query.section_key || req.body.section_key || '').trim();
      if (!sectionKey) {
        return res.status(400).json({ status: 'error', message: 'กรุณาระบุ section_key' });
      }

      if (dbPool) {
        try {
          const [rows] = await dbPool.execute('SELECT section_key, section_data FROM cms_sections WHERE section_key = ?', [sectionKey]);
          if (rows.length > 0) {
            let parsed = rows[0].section_data;
            try { parsed = JSON.parse(rows[0].section_data); } catch (e) {}
            return res.json({
              status: 'ok',
              section_key: sectionKey,
              section_data: parsed
            });
          }
        } catch (dbErr) {
          console.error('[MySQL Get Section Error]', dbErr.message);
        }
      }

      const localAll = getLocalCmsData();
      return res.json({
        status: 'ok',
        section_key: sectionKey,
        section_data: localAll[sectionKey] || null
      });
    }

    // ------------------------------------------------------------------------
    // 4.3 บันทึกข้อมูลแต่ละส่วน (Save Section) ลง MySQL Web_Ksp.cms_sections
    // ------------------------------------------------------------------------
    if (action === 'save_section' && req.method === 'POST') {
      const sectionKey = (req.body.section_key || '').trim();
      const sectionName = (req.body.section_name || sectionKey).trim();
      const sectionData = req.body.section_data;

      if (!sectionKey || sectionData === undefined) {
        return res.status(400).json({ status: 'error', message: 'ข้อมูลไม่ครบถ้วน' });
      }

      const jsonStr = typeof sectionData === 'string' ? sectionData : JSON.stringify(sectionData);

      // 1. บันทึกลงตารางรวม cms_sections (MySQL Web_Ksp)
      if (dbPool) {
        try {
          await dbPool.execute(`
            INSERT INTO cms_sections (section_key, section_name, section_data)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
              section_name = VALUES(section_name),
              section_data = VALUES(section_data),
              updated_at = CURRENT_TIMESTAMP
          `, [sectionKey, sectionName, jsonStr]);

          // 2. ซิงค์ลงตารางจริงรายตารางของระบบ (users, news, policies, downloads, slides, executive, departments, intranet, contact)
          await syncToRelationalTables(sectionKey, sectionData);

          // 3. บันทึกประวัติการทำงานลงตาราง admin_logs
          try {
            const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
            const countInfo = Array.isArray(sectionData) ? `${sectionData.length} รายการ` : '1 รายการ';
            await dbPool.execute(`
              INSERT INTO admin_logs (username, action_type, section_key, details, ip_address)
              VALUES (?, 'SAVE', ?, ?, ?)
            `, [
              req.body.username || 'admin',
              sectionKey,
              `บันทึก/แก้ไขข้อมูลส่วน "${sectionName}" (${countInfo})`,
              String(clientIp)
            ]);
          } catch (logErr) {}
        } catch (dbErr) {
          console.error('[MySQL Save Section Error]', dbErr.message);
        }
      }

      // บันทึกสำรองลง Local JSON เสมอ
      const localData = getLocalCmsData();
      localData[sectionKey] = sectionData;
      saveLocalCmsData(localData);

      return res.json({
        status: 'ok',
        source: 'MySQL Web_Ksp + Backup',
        message: `บันทึกข้อมูลส่วน ${sectionName} ลงฐานข้อมูล Web_Ksp สำเร็จเรียบร้อย!`
      });
    }

    return res.status(400).json({ status: 'error', message: 'ไม่พบคำสั่ง CMS action ที่ระบุ' });
  };

  app.all('/api/cms', handleCms);
  app.all('/api/cms.php', handleCms);

  // 5. Git Status API
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

  // 6. Git Update API
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

  // 7. Route หน้าเว็บทั้งหมด (Clean URLs)
  app.get('/', (req, res) => {
    res.render('index');
  });

  // Route หน้ารายละเอียดคลินิกเฉพาะทาง (รองรับทั้ง /department/:id และ /departments/:id)
  app.get(['/department/:id', '/departments/:id', '/clinic/:id'], (req, res) => {
    res.render('department-detail', { deptId: req.params.id });
  });

  app.get('/department-detail', (req, res) => {
    res.render('department-detail', { deptId: req.query.id || '1' });
  });

  app.get('/:page', (req, res, next) => {
    const page = req.params.page;
    const viewFile = path.join(VIEWS_DIR, `${page}.ejs`);

    if (fs.existsSync(viewFile)) {
      return res.render(page);
    }
    next();
  });

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
    console.log(` KSP Web Hospital (Node.js Server with MySQL Web_Ksp)`);
    console.log(` Port:     ${PORT}`);
    console.log(` Database: Web_Ksp`);
    console.log(` Local:    http://localhost:${PORT}`);
    console.log(` Network:  http://192.168.2.202:${PORT}`);
    console.log(`=======================================================`);
  });

} else {
  // Built-in HTTP Fallback
  const http = require('http');

  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('KSP Web Hospital Fallback Server');
  });

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`KSP Fallback Server running on port: ${PORT}`);
  });
}
