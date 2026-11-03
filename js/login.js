/* ==========================================================================
   ไฟล์: js/login.js
   หน้าที่: ตรวจสอบการเข้าสู่ระบบหลังบ้าน
   รองรับ:
     1. สมาชิกทุกคนที่ถูกเพิ่มจากเมนู "เพิ่มสมาชิก" ในระบบหลังบ้าน (ksp_cms_v1_members)
     2. ฐานข้อมูล MySQL (api/cms.php?action=login) เมื่อรันบน XAMPP
     3. บัญชีแอดมินหลักเริ่มต้น: ชื่อผู้ใช้ admin | รหัสผ่าน 1234
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  if (localStorage.getItem('ksp_admin_logged_in') === 'true') {
    window.location.href = 'admin.html';
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

    // 1. ตรวจสอบจากรายชื่อสมาชิกที่เพิ่มไว้ในเมนู "เพิ่มสมาชิก" (ksp_cms_v1_members)
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
          window.location.href = 'admin.html';
          return;
        }
      }
    } catch (e) {}

    // 2. กรณีเปิดผ่าน XAMPP (http://localhost/...) ตรวจสอบกับฐานข้อมูล MySQL
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      try {
        const res = await fetch('../api/cms.php?action=login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: username, password: password })
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok') {
            localStorage.setItem('ksp_admin_logged_in', 'true');
            localStorage.setItem('ksp_admin_user', data.user.full_name || username);
            window.location.href = 'admin.html';
            return;
          }
        }
      } catch (err) {}
    }

    // 3. ตรวจสอบบัญชีแอดมินหลักเริ่มต้น (admin / 1234)
    if (username === 'admin' && password === '1234') {
      localStorage.setItem('ksp_admin_logged_in', 'true');
      localStorage.setItem('ksp_admin_user', 'ผู้ดูแลระบบหลัก (กลุ่มงานสุขภาพดิจิทัล)');
      window.location.href = 'admin.html';
    } else if (errorBox) {
      errorBox.textContent = 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง';
      errorBox.classList.add('is-visible');
    }
  });
});
