/* ==========================================================================
   js/login.js - ระบบตรวจสอบการเข้าสู่ระบบหลังบ้าน
   - เมื่อเข้าหน้า /login จะทำการออกจากระบบผู้ใช้งานก่อนหน้านี้ทันที (ไม่ออโต้ล็อกอิน)
   - เมื่อเข้าสู่ระบบสำเร็จ จะแสดง Modal ข้อความยินดีต้อนรับพร้อมชื่อผู้ใช้งาน
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  // --------------------------------------------------------------------------
  // 1. เงื่อนไขสำคัญ: เวลาเข้าลิงก์ /login ให้ทำการออกจากระบบผู้ใช้งานก่อนหน้านี้ทันที
  //    (ไม่อนุญาตให้ล็อกอินค้าง หรือ Login Auto แบบเดิม เพื่อความปลอดภัย)
  // --------------------------------------------------------------------------
  localStorage.removeItem('ksp_admin_logged_in');
  localStorage.removeItem('ksp_admin_user');
  localStorage.removeItem('ksp_admin_role');
  sessionStorage.clear();

  const loginForm = document.getElementById('ksp-login-form');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit-btn');
  const errorBox = document.getElementById('login-error-box');
  const toggleLoginPassBtn = document.getElementById('btn-toggle-login-pass');

  if (toggleLoginPassBtn && passwordInput) {
    toggleLoginPassBtn.addEventListener('click', function () {
      if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleLoginPassBtn.textContent = '🙈';
        toggleLoginPassBtn.title = 'ซ่อนรหัสผ่าน';
      } else {
        passwordInput.type = 'password';
        toggleLoginPassBtn.textContent = '👁️';
        toggleLoginPassBtn.title = 'แสดงรหัสผ่าน';
      }
    });
  }

  // องค์ประกอบของ Modal ยินดีต้อนรับ
  const welcomeModal = document.getElementById('welcome-modal');
  const welcomeUserName = document.getElementById('welcome-user-name');
  const welcomeProgress = document.getElementById('welcome-progress-fill');
  const welcomeCountdown = document.getElementById('welcome-countdown');
  const welcomeRedirectBtn = document.getElementById('welcome-redirect-btn');

  if (!loginForm) return;

  // ฟังก์ชันแสดง Modal ยินดีต้อนรับ พร้อมชื่อผู้ใช้งาน
  function showWelcomeModalAndRedirect(displayName) {
    if (!welcomeModal) {
      window.location.href = '/admin';
      return;
    }

    // กำหนดชื่อผู้ใช้งานใน Modal
    if (welcomeUserName) {
      welcomeUserName.textContent = 'คุณ' + displayName;
    }

    // แสดง Modal ป๊อปอัป
    welcomeModal.classList.add('is-active');
    welcomeModal.setAttribute('aria-hidden', 'false');

    // เลื่อนหลอด Progress Bar
    if (welcomeProgress) {
      setTimeout(() => {
        welcomeProgress.style.width = '100%';
      }, 50);
    }

    let secondsLeft = 2;
    const timer = setInterval(() => {
      secondsLeft--;
      if (welcomeCountdown) {
        if (secondsLeft > 0) {
          welcomeCountdown.textContent = `กำลังนำท่านเข้าสู่แดชบอร์ดใน ${secondsLeft} วินาที...`;
        } else {
          welcomeCountdown.textContent = 'กำลังเปิดหน้าควบคุมระบบหลังบ้าน...';
        }
      }
      if (secondsLeft <= 0) {
        clearInterval(timer);
        window.location.href = '/admin';
      }
    }, 900);

    // หากผู้ใช้กดปุ่ม "เข้าสู่แดชบอร์ดทันที" ไม่ต้องรอเวลานับถอยหลัง
    if (welcomeRedirectBtn) {
      welcomeRedirectBtn.addEventListener('click', function () {
        clearInterval(timer);
        window.location.href = '/admin';
      });
    }
  }

  // --------------------------------------------------------------------------
  // 2. ตรวจสอบการส่งข้อมูลแบบฟอร์ม Login
  // --------------------------------------------------------------------------
  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (errorBox) {
      errorBox.classList.remove('is-visible');
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'กำลังตรวจสอบข้อมูล...';
    }

    let authenticated = false;
    let displayName = '';

    // วิธีที่ 1: ตรวจสอบจากสมาชิกที่เพิ่มผ่านเมนู "1. เพิ่มสมาชิก" ในหลังบ้าน
    try {
      const savedMembersRaw = localStorage.getItem('ksp_cms_v1_members');
      if (savedMembersRaw) {
        const membersList = JSON.parse(savedMembersRaw);
        const matchedMember = membersList.find(function (m) {
          return m.username === username && m.password === password;
        });
        if (matchedMember) {
          authenticated = true;
          displayName = matchedMember.fullName || matchedMember.username;
          localStorage.setItem('ksp_admin_logged_in', 'true');
          localStorage.setItem('ksp_admin_user', displayName + ' (' + (matchedMember.role || 'เจ้าหน้าที่') + ')');
        }
      }
    } catch (e) {}

    // วิธีที่ 2: ตรวจสอบผ่าน Node.js Backend API (/api/cms?action=login)
    if (!authenticated && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
      try {
        const res = await fetch('/api/cms?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username, password: password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok') {
            authenticated = true;
            displayName = data.user.full_name || data.user.username;
            localStorage.setItem('ksp_admin_logged_in', 'true');
            localStorage.setItem('ksp_admin_user', displayName);
          }
        }
      } catch (err) {}
    }

    // วิธีที่ 3: ตรวจสอบบัญชีผู้ดูแลระบบหลักเริ่มต้น (admin / 1234)
    if (!authenticated && username === 'admin' && password === '1234') {
      authenticated = true;
      displayName = 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)';
      localStorage.setItem('ksp_admin_logged_in', 'true');
      localStorage.setItem('ksp_admin_user', displayName);
    }

    // สรุปผลการตรวจสอบ
    if (authenticated) {
      // แสดงข้อความยินดีต้อนรับเป็น Modal เด้งขึ้นมา
      showWelcomeModalAndRedirect(displayName);
    } else {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'เข้าสู่ระบบจัดการเว็บไซต์';
      }
      if (errorBox) {
        errorBox.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบใหม่อีกครั้ง';
        errorBox.classList.add('is-visible');
      }
      passwordInput.value = '';
      passwordInput.focus();
    }
  });
});
