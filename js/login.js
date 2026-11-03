/* ==========================================================================
   js/login.js - ตรวจสอบการเข้าสู่ระบบหลังบ้าน
   URL สะอาด ปลอดภัย ไม่มี .html
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('ksp_admin_logged_in') === 'true') {
    window.location.href = '/admin';
    return;
  }

  const loginForm = document.getElementById('ksp-login-form');
  const usernameInput = document.getElementById('login-username');
  const passwordInput = document.getElementById('login-password');
  const errorBox = document.getElementById('login-error-box');

  if (!loginForm) return;

  loginForm.addEventListener('submit', async function (event) {
    event.preventDefault();
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (errorBox) {
      errorBox.classList.remove('is-visible');
    }

    // 1. ตรวจสอบจากรายชื่อสมาชิกที่เพิ่มไว้ใน LocalStorage
    try {
      const savedMembersRaw = localStorage.getItem('ksp_cms_v1_members');
      if (savedMembersRaw) {
        const membersList = JSON.parse(savedMembersRaw);
        const matchedMember = membersList.find(function (m) {
          return m.username === username && m.password === password;
        });
        if (matchedMember) {
          localStorage.setItem('ksp_admin_logged_in', 'true');
          localStorage.setItem('ksp_admin_user', matchedMember.fullName + ' (' + matchedMember.role + ')');
          window.location.href = '/admin';
          return;
        }
      }
    } catch (e) {}

    // 2. ตรวจสอบผ่าน Node.js API Backend
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      try {
        const res = await fetch('/api/cms?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username, password: password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok') {
            localStorage.setItem('ksp_admin_logged_in', 'true');
            localStorage.setItem('ksp_admin_user', data.user.full_name || username);
            window.location.href = '/admin';
            return;
          }
        }
      } catch (err) {}
    }

    // 3. ตรวจสอบบัญชีแอดมินหลักเริ่มต้น (admin / 1234)
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('ksp_admin_logged_in', 'true');
      localStorage.setItem('ksp_admin_user', 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)');
      window.location.href = '/admin';
    } else if (errorBox) {
      errorBox.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      errorBox.classList.add('is-visible');
    }
  });
});
