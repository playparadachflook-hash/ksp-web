/**
 * ==============================================================================
 * js/auto-update-widget.js - สคริปต์แสดงปุ่มสถานะและอัปเดตระบบจาก GitHub อัตโนมัติ
 * สีเขียว = ปัจจุบัน | สีเหลือง = รออัปเดต (คลิกเพื่อดึงโค้ดล่าสุดจาก GitHub ทันที)
 * ==============================================================================
 */

(function () {
  // รันเฉพาะบนเว็บเซิร์ฟเวอร์ (http หรือ https)
  if (window.location.protocol !== 'http:' && window.location.protocol !== 'https:') {
    return;
  }

  // สร้าง Element ปุ่มลอย
  const widget = document.createElement('div');
  widget.id = 'ksp-update-widget';
  widget.className = 'ksp-update-floating-widget status-green';
  widget.innerHTML = `
    <span class="status-dot"></span>
    <div class="widget-label">
      <span class="widget-title" id="ksp-update-title">กำลังตรวจสอบ...</span>
      <span class="widget-sub" id="ksp-update-sub">Server 192.168.2.202</span>
    </div>
  `;

  document.body.appendChild(widget);

  const titleEl = document.getElementById('ksp-update-title');
  const subEl = document.getElementById('ksp-update-sub');

  let currentHasUpdate = false;
  let isUpdating = false;

  async function checkGitStatus() {
    if (isUpdating) return;
    try {
      const res = await fetch('/api/git-status', { cache: 'no-store' });
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();

      currentHasUpdate = !!data.hasUpdate;

      if (data.hasUpdate) {
        // สถานะสีเหลือง: รออัปเดต
        widget.className = 'ksp-update-floating-widget status-yellow';
        titleEl.textContent = '🟡 รออัปเดตจาก GitHub';
        subEl.textContent = `ใหม่: ${data.remoteCommit} (คลิกเพื่ออัปเดต)`;
        widget.title = `มีอัปเดตใหม่ใน GitHub: ${data.remoteCommit}\nคลิกเพื่อดึงโค้ดและอัปเดตโปรแกรมทันที`;
      } else {
        // สถานะสีเขียว: เป็นปัจจุบัน
        widget.className = 'ksp-update-floating-widget status-green';
        titleEl.textContent = '🟢 เวอร์ชันปัจจุบัน';
        subEl.textContent = `Commit: ${data.localCommit || 'latest'}`;
        widget.title = `ระบบเป็นเวอร์ชันล่าสุดแล้ว (${data.localCommit})`;
      }
    } catch (err) {
      // กรณีไม่สามารถเชื่อมต่อ API ได้
      titleEl.textContent = '🟢 เซิร์ฟเวอร์ออนไลน์';
      subEl.textContent = 'พอร์ต 3088';
    }
  }

  // เมื่อผู้ใช้คลิกที่ปุ่ม
  widget.addEventListener('click', async function () {
    if (isUpdating) return;

    if (!currentHasUpdate) {
      // ตรวจสอบอีกครั้งเพื่อความแน่ใจ
      titleEl.textContent = '🔍 กำลังตรวจสอบ GitHub...';
      await checkGitStatus();
      if (!currentHasUpdate) {
        alert('ระบบบนเซิร์ฟเวอร์เป็นเวอร์ชันล่าสุดตรงกับ GitHub เรียบร้อยแล้วครับ!');
      }
      return;
    }

    const confirmUpdate = confirm('พบการเปลี่ยนแปลงใหม่ใน GitHub คุณต้องการนำโค้ดมาอัปเดตที่เซิร์ฟเวอร์ทันทีหรือไม่?');
    if (!confirmUpdate) return;

    isUpdating = true;
    widget.className = 'ksp-update-floating-widget status-updating';
    titleEl.textContent = '⏳ กำลังอัปเดตระบบ...';
    subEl.textContent = 'กำลัง Git Pull และรีสตาร์ท Node...';

    try {
      const res = await fetch('/api/git-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();

      if (data.success) {
        titleEl.textContent = '✅ อัปเดตสำเร็จ!';
        subEl.textContent = 'กำลังรีเฟรชหน้าเว็บ...';
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      } else {
        alert('การอัปเดตไม่สำเร็จ: ' + (data.error || 'เกิดข้อผิดพลาด'));
        isUpdating = false;
        checkGitStatus();
      }
    } catch (err) {
      // แม้ connection จะ drop เนื่องจากเซิร์ฟเวอร์รีสตาร์ท ให้รีเฟรชหน้าเว็บใหม่
      titleEl.textContent = '✅ อัปเดตสำเร็จ!';
      subEl.textContent = 'กำลังรีเฟรชหน้าเว็บ...';
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  });

  // เรียกตรวจสอบทันทีเมื่อโหลดหน้า และตรวจสอบซ้ำทุก 30 วินาที
  checkGitStatus();
  setInterval(checkGitStatus, 30000);
})();
