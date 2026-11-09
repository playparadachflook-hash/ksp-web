/* ==========================================================================
   ไฟล์: js/departments.js
   หน้าที่: สร้างส่วนที่ 3 — แผนกและคลินิก (แสดงต่อจาก Slide Bar)
   คำแนะนำสำหรับมือใหม่:
     - แก้ไขชื่อแผนก รายละเอียด หรือไอคอน ได้ที่ตัวแปร DEPARTMENTS_LIST ด้านล่างนี้เลย
   ========================================================================== */

/**
 * ไอคอน SVG ลายเส้นและการแพทย์ตามรายการคลินิก
 * - heart       : คลินิกหัวใจ
 * - arv         : คลินิก ARV (ยาต้านไวรัส)
 * - tb          : คลินิกวัณโรค (TB)
 * - thallasemia : คลินิกธาลัสซีเมีย (เม็ดเลือดแดง/หยดเลือด)
 * - thyroid     : คลินิกต่อมไทรอยด์
 * - wafarin     : คลินิกยวาร์ฟาริน (ยาต้านการแข็งตัวของเลือด)
 * - psych       : คลินิกจิตเวช / สุขภาพจิต
 * - asthma      : คลินิกโรคหอบหืด / ทางเดินหายใจ
 * - kidney      : คลินิกไต / ชะลอไตเสื่อม
 * - ribbon      : มะเร็ง/ริบบิ้นเฉพาะทาง
 */
const DEPARTMENT_ICONS = {
  heart: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 29.5C18 29.5 6.5 22.1 6.5 13.4C6.5 9.6 9.5 6.8 13 6.8C15.2 6.8 17.1 7.9 18 9.6C18.9 7.9 20.8 6.8 23 6.8C26.5 6.8 29.5 9.6 29.5 13.4C29.5 22.1 18 29.5 18 29.5Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M11 15C11 18.5 13.5 21 17 21C20.5 21 23 18.5 23 15" stroke="#b91c1c" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M23 15V13" stroke="#b91c1c" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="23" cy="12" r="1.5" fill="#dc2626"/>
      <path d="M17 21V24" stroke="#b91c1c" stroke-width="1.8" stroke-linecap="round"/>
      <circle cx="17" cy="25" r="2" fill="#ef4444"/>
    </svg>
  `,
  arv: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <rect x="8" y="13" width="18" height="8" rx="4" stroke="#9333ea" stroke-width="1.8" fill="#fae8ff"/>
      <line x1="12" y1="13" x2="12" y2="21" stroke="#a855f7" stroke-width="1.5"/>
      <line x1="16" y1="13" x2="16" y2="21" stroke="#a855f7" stroke-width="1.5"/>
      <line x1="20" y1="13" x2="20" y2="21" stroke="#a855f7" stroke-width="1.5"/>
      <circle cx="26" cy="8" r="2.5" fill="#c084fc" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="22" y1="13" x2="24.5" y2="10" stroke="#9333ea" stroke-width="1.5"/>
      <circle cx="10" cy="27" r="2.5" fill="#c084fc" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="13" y1="21" x2="11.5" y2="25" stroke="#9333ea" stroke-width="1.5"/>
      <circle cx="28" cy="26" r="2" fill="#e879f9" stroke="#9333ea" stroke-width="1.5"/>
      <line x1="24" y1="21" x2="26.5" y2="24.5" stroke="#9333ea" stroke-width="1.5"/>
    </svg>
  `,
  tb: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 5V14M18 14L13 18M18 14L23 18" stroke="#0284c7" stroke-width="2" stroke-linecap="round"/>
      <path d="M12 18C8.5 18 6 21 6 25C6 28 8.5 30 11.5 30C14 30 15 28 15 24V18H12Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M24 18C27.5 18 30 21 30 25C30 28 27.5 30 24.5 30C22 30 21 28 21 24V18H24Z" fill="#fee2e2" stroke="#e11d48" stroke-width="1.8" stroke-linejoin="round"/>
      <circle cx="25.5" cy="24.5" r="2.2" fill="#ef4444"/>
    </svg>
  `,
  thallasemia: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 5C18 5 9 16 9 22.5C9 27.2 13 31 18 31C23 31 27 27.2 27 22.5C27 16 18 5 18 5Z" fill="#fee2e2" stroke="#dc2626" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="18" cy="22.5" rx="4.5" ry="3.5" fill="#ef4444" stroke="#b91c1c" stroke-width="1.2"/>
      <path d="M14 18C13.5 19.5 13.5 21 14 22.5" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  thyroid: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <line x1="14" y1="6" x2="22" y2="6" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="14" y1="10" x2="22" y2="10" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="15" y1="14" x2="21" y2="14" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="15" y1="26" x2="21" y2="26" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="15" y1="30" x2="21" y2="30" stroke="#94a3b8" stroke-width="1.8" stroke-linecap="round"/>
      <line x1="18" y1="4" x2="18" y2="32" stroke="#64748b" stroke-width="1.5" stroke-dasharray="2 2"/>
      <path d="M15 15C10 14 7 18 7 23C7 27 11 28 14 24C15 22.5 15.5 20 15.5 18Z" fill="#fecdd3" stroke="#e11d48" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M21 15C26 14 29 18 29 23C29 27 25 28 22 24C21 22.5 20.5 20 20.5 18Z" fill="#fecdd3" stroke="#e11d48" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M14 21C16 22 20 22 22 21" stroke="#e11d48" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `,
  wafarin: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <ellipse cx="14" cy="14" rx="7" ry="5.5" fill="#bae6fd" stroke="#0284c7" stroke-width="1.8"/>
      <line x1="10" y1="14" x2="18" y2="14" stroke="#0284c7" stroke-width="1.2"/>
      <path d="M15 22C15 19 18 17 22 17C26 17 29 19 29 22C29 25 26 27 22 27C18 27 15 25 15 22Z" fill="#fbcfe8" stroke="#db2777" stroke-width="1.8"/>
      <line x1="18.5" y1="18.5" x2="25.5" y2="25.5" stroke="#db2777" stroke-width="1.2"/>
      <ellipse cx="13" cy="26" rx="5.5" ry="4" fill="#fce7f3" stroke="#ec4899" stroke-width="1.5"/>
    </svg>
  `,
  psych: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 31V26C12 24 13.5 22.5 15.5 22.5H16.5C17.5 22.5 18 21.5 18 20.5V19C15 18 13 15 13 12C13 7.5 16.5 4 21 4C25.5 4 29 7.5 29 12C29 15.5 26.8 18.5 23.5 19.5V22C24 23 25.5 24 27 25L28 26V31" stroke="#334155" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <rect x="19.5" y="8" width="3" height="8" rx="1" fill="#10b981"/>
      <rect x="17" y="10.5" width="8" height="3" rx="1" fill="#10b981"/>
    </svg>
  `,
  asthma: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 11C9 9 11 7 13 7H17V17L12 21H7C6 21 5 20 5 19V15C5 13 7 11 9 11Z" fill="#e0f2fe" stroke="#0369a1" stroke-width="1.8" stroke-linejoin="round"/>
      <rect x="15" y="15" width="7" height="6" rx="1" fill="#bae6fd" stroke="#0369a1" stroke-width="1.5"/>
      <path d="M24 14C27 15 29 17 31 17" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/>
      <path d="M23 18C26 18.5 28 20.5 30 21" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/>
      <path d="M24 22C27 22 28.5 24 30 25" stroke="#0ea5e9" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `,
  kidney: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M14.5 12C11 8.5 6 11 6 17C6 23.5 10.5 28 14 25C15.5 23.5 14.5 19.5 13.5 18C12.5 16.5 13 14 14.5 12Z" fill="#cffafe" stroke="#0891b2" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M21.5 12C25 8.5 30 11 30 17C30 23.5 25.5 28 22 25C20.5 23.5 21.5 19.5 22.5 18C23.5 16.5 23 14 21.5 12Z" fill="#cffafe" stroke="#0891b2" stroke-width="1.8" stroke-linejoin="round"/>
      <path d="M14 23C15 25 17 28 17 31" stroke="#0891b2" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M22 23C21 25 19 28 19 31" stroke="#0891b2" stroke-width="1.5" stroke-linecap="round"/>
    </svg>
  `,
  ribbon: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 6.5C14.4 6.5 12 9.1 12 12.4C12 15.8 15.1 19.6 18 23.1C20.9 19.6 24 15.8 24 12.4C24 9.1 21.6 6.5 18 6.5Z" stroke="#254785" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M18 10.2C16.5 10.2 15.4 11.2 15.4 12.5C15.4 14.1 16.7 15.9 18 17.5C19.3 15.9 20.6 14.1 20.6 12.5C20.6 11.2 19.5 10.2 18 10.2Z" stroke="#254785" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15.4 20.1L11.5 27.5L14.8 29.2L18 23.1" stroke="#254785" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20.6 20.1L24.5 27.5L21.2 29.2L18 23.1" stroke="#254785" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `
};

/**
 * รายการคลินิกเฉพาะทาง 13 คลินิกตามตารางออกตรวจของโรงพยาบาล
 */
const DEFAULT_DEPARTMENTS_LIST = [
  {
    icon: 'heart',
    title: 'หัวใจ',
    description: 'ตรวจรักษาและติดตามอาการโรคหัวใจและหลอดเลือด คลื่นไฟฟ้าหัวใจ (EKG) ฟื้นฟูสมรรถภาพหัวใจ',
    link: '/departments'
  },
  {
    icon: 'arv',
    title: 'ARV',
    description: 'บริการตรวจรักษา ให้คำปรึกษา และดูแลผู้ติดเชื้อเอชไอวีด้วยยาต้านไวรัสอย่างครบวงจรและเป็นความลับ',
    link: '/departments'
  },
  {
    icon: 'tb',
    title: 'TB',
    description: 'ตรวจคัดกรอง วินิจฉัย เอกซเรย์ และดูแลรักษาผู้ป่วยวัณโรคตามมาตรฐานสากลด้วยระบบ DOTS',
    link: '/departments'
  },
  {
    icon: 'thallasemia',
    title: 'Thallasemia',
    description: 'ดูแลรักษาผู้ป่วยโรคโลหิตจางธาลัสซีเมีย บริการให้เลือด ยาขับเหล็ก และตรวจคัดกรองคู่สมรส',
    link: '/departments'
  },
  {
    icon: 'thyroid',
    title: 'thyroid',
    description: 'ตรวจวินิจฉัยและรักษาต่อมไทรอยด์ ไทรอยด์เป็นพิษ ภาวะฮอร์โมนไทรอยด์ต่ำ และก้อนที่ต่อมไทรอยด์',
    link: '/departments'
  },
  {
    icon: 'thyroid',
    title: 'thyroid พฤหัสที่ 2',
    description: 'คลินิกเฉพาะทางโรคต่อมไทรอยด์ ให้บริการตรวจติดตามอาการและปรับยาทุกวันพฤหัสบดีสัปดาห์ที่ 2 ของเดือน',
    link: '/departments'
  },
  {
    icon: 'wafarin',
    title: 'wafarin',
    description: 'ติดตามความปลอดภัยการใช้ยาต้านการแข็งตัวของเลือด ตรวจวัดค่า INR และแนะนำการใช้ยาร่วมกับอาหาร',
    link: '/departments'
  },
  {
    icon: 'psych',
    title: 'จิตเวช Wks2',
    description: 'บริการตรวจรักษาปัญหาสุขภาพจิต จิตเวช และบำบัดฟื้นฟู ทุกสัปดาห์ที่ 2 ของเดือน',
    link: '/departments'
  },
  {
    icon: 'psych',
    title: 'จิตเวช Wks4',
    description: 'บริการตรวจรักษาปัญหาสุขภาพจิต จิตเวช และติดตามการใช้ยา ทุกสัปดาห์ที่ 4 ของเดือน',
    link: '/departments'
  },
  {
    icon: 'asthma',
    title: 'Asthma 1',
    description: 'ตรวจรักษาและควบคุมอาการโรคหอบหืดและปอดอุดกั้นเรื้อรัง (COPD) ทดสอบสมรรถภาพปอด กลุ่มที่ 1',
    link: '/departments'
  },
  {
    icon: 'asthma',
    title: 'Asthma 2',
    description: 'ตรวจติดตามอาการโรคหอบหืด ประเมินเทคนิคการใช้ยาพ่นสูด และการฟื้นฟูสมรรถภาพปอด กลุ่มที่ 2',
    link: '/departments'
  },
  {
    icon: 'kidney',
    title: 'คลินิกไต 1',
    description: 'คลินิกชะลอไตเสื่อม ดูแลผู้ป่วยโรคไตเรื้อรัง (CKD) ระยะเริ่มต้นถึงปานกลาง และการควบคุมอาหาร',
    link: '/departments'
  },
  {
    icon: 'kidney',
    title: 'คลินิกไต 2',
    description: 'ดูแลผู้ป่วยโรคไตเรื้อรังระยะก้าวหน้า วางแผนการรักษาและเตรียมความพร้อมการบำบัดทดแทนไต',
    link: '/departments'
  }
];

const DEPARTMENTS_LIST = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_departments');
    if (saved) {
      const parsed = JSON.parse(saved);
      // หากข้อมูลเดิมมีข้อความ mock 'มะเร็ง' หรือรายการน้อยกว่า 13 ให้เปลี่ยนเป็นข้อมูลคลินิกจริงใหม่ทั้งหมดอัตโนมัติ
      const hasOldMock = Array.isArray(parsed) && (parsed.some(d => d.title === 'มะเร็ง') || parsed.length < 13);
      if (!hasOldMock) {
        return parsed;
      }
    }
  } catch (e) {}
  // บันทึกชุดคลินิกใหม่ลง localStorage เพื่อซิงก์ตรงกัน
  try {
    localStorage.setItem('ksp_cms_v1_departments', JSON.stringify(DEFAULT_DEPARTMENTS_LIST));
  } catch (e) {}
  return DEFAULT_DEPARTMENTS_LIST;
})();

/**
 * ฟังก์ชันสร้าง HTML ส่วนแผนกและคลินิก
 */
function renderDepartmentsHTML(rootPath, list) {
  const currentList = Array.isArray(list) && list.length > 0 ? list : DEPARTMENTS_LIST;
  const isAllDeptsPage = window.location.pathname.includes('/departments');

  const cardsMarkup = currentList.map(function (item) {
    const svgIcon = DEPARTMENT_ICONS[item.icon] || DEPARTMENT_ICONS.heart;
    const hasImage = Boolean(item.image && String(item.image).trim() !== '');
    const imgUrl = hasImage ? (item.image.startsWith('data:') || item.image.startsWith('http') ? item.image : rootPath + item.image) : '';

    return `
      <a href="${rootPath}${item.link || '/departments'}" class="department-card ${hasImage ? 'has-image' : ''}">
        ${hasImage ? `
          <div class="department-img-box">
            <img src="${imgUrl}" alt="${item.title}" class="department-card-img" loading="lazy" />
          </div>
          <div class="department-card-body">
            <h3 class="department-card-title">${item.title}</h3>
            <p class="department-card-desc">${item.description || ''}</p>
          </div>
        ` : `
          <div class="department-icon-box">
            ${svgIcon}
          </div>
          <h3 class="department-card-title">${item.title}</h3>
          <p class="department-card-desc">${item.description || ''}</p>
        `}
      </a>
    `;
  }).join('');

  return `
    <section class="departments-section" aria-labelledby="departments-heading">
      <div class="departments-container">
        <!-- หัวข้อตรงกลางพร้อมเส้นขีดไล่สี -->
        <div class="departments-header">
          <h2 class="departments-title" id="departments-heading">แผนกและคลินิกเฉพาะทาง</h2>
          <div class="departments-underline"></div>
        </div>

        <!-- ตารางการ์ดคลินิก -->
        <div class="departments-grid">
          ${cardsMarkup}
        </div>

        <!-- ปุ่มลิงก์ ดูทั้งหมด > มุมขวาล่าง (ซ่อนหากอยู่ในหน้า /departments แล้ว) -->
        ${!isAllDeptsPage ? `
        <div class="departments-footer">
          <a href="${rootPath}/departments" class="departments-view-all">
            <span>ดูคลินิกทั้งหมด (13 คลินิก)</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
        ` : ''}
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', async function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const departmentsPlaceholder = document.getElementById('departments-placeholder');
  if (!departmentsPlaceholder) return;

  // เรนเดอร์ทันทีจาก cache หรือ default
  departmentsPlaceholder.innerHTML = renderDepartmentsHTML(rootPath, DEPARTMENTS_LIST);

  // ดึงข้อมูลล่าสุดจาก API MySQL เพื่ออัปเดตแบบเรียลไทม์
  try {
    const res = await fetch('/api/cms?action=get_section&section_key=departments');
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.section_data) && data.section_data.length > 0) {
        localStorage.setItem('ksp_cms_v1_departments', JSON.stringify(data.section_data));
        departmentsPlaceholder.innerHTML = renderDepartmentsHTML(rootPath, data.section_data);
      }
    }
  } catch (e) {
    // รันออฟไลน์ได้ตามปกติ
  }
});
