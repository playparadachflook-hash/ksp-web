/* ==========================================================================
   ไฟล์: js/departments.js
   หน้าที่: สร้างส่วนที่ 3 — แผนกและคลินิก (แสดงต่อจาก Slide Bar)
   คำแนะนำสำหรับมือใหม่:
     - แก้ไขชื่อแผนก รายละเอียด หรือไอคอน ได้ที่ตัวแปร DEPARTMENTS_LIST ด้านล่างนี้เลย
   ========================================================================== */

/**
 * ไอคอน SVG ลายเส้นสีน้ำเงินเข้มตามรูปต้นแบบ
 * - heart  : ไอคอนรูปหัวใจสองชั้น
 * - ribbon : ไอคอนโบว์ริบบิ้นทางการแพทย์ (มะเร็ง/เฉพาะทาง)
 */
const DEPARTMENT_ICONS = {
  heart: `
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M18 29.5C18 29.5 6.5 22.1 6.5 13.4C6.5 9.6 9.5 6.8 13 6.8C15.2 6.8 17.1 7.9 18 9.6C18.9 7.9 20.8 6.8 23 6.8C26.5 6.8 29.5 9.6 29.5 13.4C29.5 22.1 18 29.5 18 29.5Z" stroke="#254785" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M13.2 10.2C11.3 10.4 9.8 11.9 9.8 13.9" stroke="#254785" stroke-width="1.4" stroke-linecap="round"/>
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
 * รายการการ์ดแผนกและคลินิกทั้ง 8 กล่อง (2 แถว × 4 คอลัมน์ ตามรูปต้นแบบ)
 */
const DEFAULT_DEPARTMENTS_LIST = [
  {
    icon: 'heart',
    title: 'หัวใจ',
    description: 'อายุรกรรมโรคหัวใจ, ฟื้นฟูและส่งเสริมสมรรถภาพหัวใจ, รักษาหัวใจผ่านสายสวน',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  },
  {
    icon: 'heart',
    title: 'หัวใจ',
    description: 'อายุรกรรมโรคหัวใจ, ฟื้นฟูและส่งเสริมสมรรถภาพหัวใจ, รักษาหัวใจผ่านสายสวน',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  },
  {
    icon: 'ribbon',
    title: 'มะเร็ง',
    description: 'รังสีรักษาวัฒโนสถ, ป้องกันและตรวจค้นมะเร็งระยะแรกเริ่ม, อายุรกรรมมะเร็ง, เคมีบำบัด',
    link: '/departments'
  }
];

const DEPARTMENTS_LIST = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_departments');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_DEPARTMENTS_LIST;
})();

/**
 * ฟังก์ชันสร้าง HTML ส่วนแผนกและคลินิก
 */
function renderDepartmentsHTML(rootPath) {
  const cardsMarkup = DEPARTMENTS_LIST.map(function (item) {
    const svgIcon = DEPARTMENT_ICONS[item.icon] || DEPARTMENT_ICONS.heart;
    const hasImage = Boolean(item.image && String(item.image).trim() !== '');
    const imgUrl = hasImage ? (item.image.startsWith('data:') || item.image.startsWith('http') ? item.image : rootPath + item.image) : '';

    return `
      <a href="${rootPath}${item.link}" class="department-card ${hasImage ? 'has-image' : ''}">
        ${hasImage ? `
          <div class="department-img-box">
            <img src="${imgUrl}" alt="${item.title}" class="department-card-img" loading="lazy" />
          </div>
          <div class="department-card-body">
            <h3 class="department-card-title">${item.title}</h3>
            <p class="department-card-desc">${item.description}</p>
          </div>
        ` : `
          <div class="department-icon-box">
            ${svgIcon}
          </div>
          <h3 class="department-card-title">${item.title}</h3>
          <p class="department-card-desc">${item.description}</p>
        `}
      </a>
    `;
  }).join('');

  return `
    <section class="departments-section" aria-labelledby="departments-heading">
      <div class="departments-container">
        <!-- หัวข้อตรงกลางพร้อมเส้นขีดไล่สี -->
        <div class="departments-header">
          <h2 class="departments-title" id="departments-heading">แผนกและคลินิก</h2>
          <div class="departments-underline"></div>
        </div>

        <!-- ตารางการ์ด 4 คอลัมน์ × 2 แถว -->
        <div class="departments-grid">
          ${cardsMarkup}
        </div>

        <!-- ปุ่มลิงก์ ดูทั้งหมด > มุมขวาล่าง -->
        <div class="departments-footer">
          <a href="${rootPath}/departments" class="departments-view-all">
            <span>ดูทั้งหมด</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const departmentsPlaceholder = document.getElementById('departments-placeholder');
  if (!departmentsPlaceholder) return;

  departmentsPlaceholder.innerHTML = renderDepartmentsHTML(rootPath);
});
