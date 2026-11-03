/* ==========================================================================
   ไฟล์: js/contact-section.js
   หน้าที่: สร้างส่วน "ติดต่อเรา" (แผนที่ Google Maps + ที่อยู่ + เบอร์โทร + อีเมล)
   คำแนะนำสำหรับมือใหม่:
     - หากต้องการเปลี่ยนที่อยู่ เบอร์โทรศัพท์ หรืออีเมลของโรงพยาบาล
       สามารถแก้ไขได้ที่ตัวแปร CONTACT_DATA ด้านล่างนี้จุดเดียวได้เลยครับ!
   ========================================================================== */

/**
 * ข้อมูลติดต่อโรงพยาบาลโคกศรีสุพรรณ และลิงก์แผนที่ Google Maps ตามที่ระบุ
 */
const DEFAULT_CONTACT_DATA = {
  hospitalName: 'โรงพยาบาลโคกศรีสุพรรณ',
  address: '76 ตำบลตองโขบ อำเภอโคกศรีสุพรรณ จังหวัดสกลนคร 47280',
  phone: '042-766-030',
  email: 'khoksrisuphanhospital@gmail.com',

  // ลิงก์นำทาง Google Maps ของโรงพยาบาลโคกศรีสุพรรณตามที่ออกแบบไว้
  googleMapsDirUrl:
    'https://www.google.com/maps/dir//%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B9%82%E0%B8%84%E0%B8%81%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B8%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%93+76+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B8%95%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%82%E0%B8%9A+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD+%E0%B9%82%E0%B8%84%E0%B8%81%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B8%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%93+%E0%B8%AA%E0%B8%81%E0%B8%A5%E0%B8%99%E0%B8%84%E0%B8%A3+47280/@17.0514746,104.2613408,17z/data=!4m16!1m7!3m6!1s0x313c8cceaaaaaaab:0x50e229189d7fcb0c!2z4LmC4Lij4LiH4Lie4Lii4Liy4Lia4Liy4Lil4LmC4LiE4LiB4Lio4Lij4Li14Liq4Li44Lie4Lij4Lij4LiT!8m2!3d17.0514695!4d104.2662117!16s%2Fg%2F1hc7p7ggg!4m7!1m0!1m5!1m1!1s0x313c8cceaaaaaaab:0x50e229189d7fcb0c!2m2!1d104.2662117!2d17.0514695?entry=ttu&g_ep=EgoyMDI2MTAyNy4wIKXMDSoASAFQAw%3D%3D',

  // ลิงก์สำหรับฝังแผนที่แบบโต้ตอบได้
  googleMapsEmbedUrl:
    'https://www.google.com/maps?q=%E0%B9%82%E0%B8%A3%E0%B8%87%E0%B8%9E%E0%B8%A2%E0%B8%B2%E0%B8%9A%E0%B8%B2%E0%B8%A5%E0%B9%82%E0%B8%84%E0%B8%81%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B8%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%93+76+%E0%B8%95%E0%B8%B3%E0%B8%9A%E0%B8%A5+%E0%B8%95%E0%B8%AD%E0%B8%87%E0%B9%82%E0%B8%82%E0%B8%9A+%E0%B8%AD%E0%B8%B3%E0%B9%80%E0%B8%A0%E0%B8%AD+%E0%B9%82%E0%B8%84%E0%B8%81%E0%B8%A8%E0%B8%A3%E0%B8%B5%E0%B8%AA%E0%B8%B8%E0%B8%9E%E0%B8%A3%E0%B8%A3%E0%B8%93+%E0%B8%AA%E0%B8%81%E0%B8%A5%E0%B8%99%E0%B8%84%E0%B8%A3+47280&hl=th&z=16&output=embed'
};

const CONTACT_DATA = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_contact');
    if (saved) return Object.assign({}, DEFAULT_CONTACT_DATA, JSON.parse(saved));
  } catch (e) {}
  return DEFAULT_CONTACT_DATA;
})();

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ส่วนติดต่อเราและแผนที่
 */
function renderContactSectionHTML() {
  return `
    <section class="contact-section" aria-labelledby="contact-main-heading">
      <div class="contact-container">
        <!-- หัวข้อ "ติดต่อเรา" รูปแบบเดียวกับประกาศนโยบายโรงพยาบาล -->
        <div class="contact-header">
          <h2 class="contact-title" id="contact-main-heading">ติดต่อเรา</h2>
          <div class="contact-underline"></div>
        </div>

        <!-- แผนที่ Google Maps แบบโต้ตอบได้ -->
        <div class="contact-map-wrapper">
          <iframe
            class="contact-map-iframe"
            src="${CONTACT_DATA.googleMapsEmbedUrl}"
            title="แผนที่นำทางไป ${CONTACT_DATA.hospitalName}"
            loading="lazy"
            allowfullscreen
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <!-- รายละเอียดที่อยู่ เบอร์โทร และอีเมล ด้านล่างแผนที่ตามรูปตัวอย่าง -->
        <div class="contact-details">
          <h2 class="contact-hospital-name" id="contact-hospital-heading">
            ${CONTACT_DATA.hospitalName}
          </h2>

          <ul class="contact-info-list">
            <!-- บรรทัดที่ 1: ที่อยู่ (คลิกเพื่อเปิดลิงก์นำทาง Google Maps ได้ทันที) -->
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2" />
                  <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                </svg>
              </span>
              <a
                href="${CONTACT_DATA.googleMapsDirUrl}"
                target="_blank"
                rel="noopener noreferrer"
                class="contact-info-link"
                title="คลิกเพื่อเปิดเส้นทางใน Google Maps"
              >
                ที่อยู่ :${CONTACT_DATA.address}
              </a>
            </li>

            <!-- บรรทัดที่ 2: เบอร์โทรศัพท์ -->
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="1.8" />
                  <path
                    d="M15.4 14.2c-.3-.2-.8-.4-1.1-.1l-.6.6c-.2.2-.5.2-.9 0-.7-.4-1.4-1-1.8-1.8-.2-.4-.2-.7 0-.9l.6-.6c.3-.3.1-.8-.1-1.1l-.9-1.2c-.3-.3-.7-.3-1 0l-.5.5c-.6.6-.8 1.5-.4 2.4.6 1.5 1.9 2.8 3.4 3.4.9.4 1.8.2 2.4-.4l.5-.5c.3-.3.3-.7 0-1l-.6-.3z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <a href="tel:${CONTACT_DATA.phone.replace(/[^0-9+]/g, '')}" class="contact-info-link">
                โทร : ${CONTACT_DATA.phone}
              </a>
            </li>

            <!-- บรรทัดที่ 3: อีเมล์ -->
            <li class="contact-info-item">
              <span class="contact-info-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <rect x="2.5" y="5" width="19" height="14" rx="2" stroke="currentColor" stroke-width="1.8" />
                  <path d="M3 6.5L12 13L21 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </span>
              <a href="mailto:${CONTACT_DATA.email}" class="contact-info-link">
                อีเมล์ : ${CONTACT_DATA.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const contactPlaceholder = document.getElementById('contact-placeholder');
  if (!contactPlaceholder) return;

  contactPlaceholder.innerHTML = renderContactSectionHTML();
});
