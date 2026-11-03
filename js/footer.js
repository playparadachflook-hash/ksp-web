/* ==========================================================================
   ไฟล์: js/footer.js
   หน้าที่: สร้างส่วนท้ายเว็บไซต์ (Footer Bar) จากจุดเดียวแล้วนำไปแสดงผลทุกหน้า
   คำแนะนำสำหรับมือใหม่:
     - หากต้องการเปลี่ยนข้อความลิขสิทธิ์ด้านล่างสุดของเว็บ ให้แก้ที่ตัวแปร FOOTER_TEXT ด้านล่างนี้จุดเดียว
       แล้วทุกหน้าในเว็บไซต์จะเปลี่ยนตามอัตโนมัติครับ!
   ========================================================================== */

const FOOTER_TEXT =
  '© Design By Khoksrisuphan_hospital กลุ่มงานสุขภาพดิจิทัล Co,.ltd 2026 ALL RIGHTS RESERVED.';

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ของ Footer
 */
function renderFooterHTML() {
  return `
    <footer class="site-footer" role="contentinfo">
      <div class="footer-container">
        <p class="footer-copyright">${FOOTER_TEXT}</p>
      </div>
    </footer>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const footerPlaceholder = document.getElementById('footer-placeholder');
  if (!footerPlaceholder) return;

  footerPlaceholder.innerHTML = renderFooterHTML();
});
