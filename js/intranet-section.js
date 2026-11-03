/* ==========================================================================
   ไฟล์: js/intranet-section.js
   หน้าที่: สร้างส่วน "เว็บไซต์ภายใน" (ระบบสารสนเทศและลิงก์หน่วยงานภายในโรงพยาบาล)
   คำแนะนำสำหรับมือใหม่:
     - หากต้องการเพิ่มหรือเปลี่ยนลิงก์ระบบงานภายในของโรงพยาบาล
       สามารถแก้ไขได้ที่ตัวแปร INTERNAL_WEBSITES ด้านล่างนี้จุดเดียวได้เลยครับ!
   ========================================================================== */

const KSP_INTRANET_LOGO = 'assets/images/logo-ksp.png';

/**
 * รายการระบบเว็บไซต์ภายในของโรงพยาบาลโคกศรีสุพรรณ
 */
const DEFAULT_INTERNAL_WEBSITES = [
  {
    code: 'HIS / HOSxP',
    title: 'ระบบสารสนเทศโรงพยาบาล',
    description: 'ระบบเวชระเบียนอิเล็กทรอนิกส์และการให้บริการผู้ป่วยนอก-ผู้ป่วยใน',
    url: '/internal-websites'
  },
  {
    code: 'E-Office',
    title: 'ระบบงานสารบรรณอิเล็กทรอนิกส์',
    description: 'ระบบรับ-ส่งหนังสือราชการ แจ้งเวียนประกาศ และเอกสารภายในองค์กร',
    url: '/internal-websites'
  },
  {
    code: 'Digital Health',
    title: 'กลุ่มงานสุขภาพดิจิทัล (IT Helpdesk)',
    description: 'ระบบแจ้งซ่อมคอมพิวเตอร์ เครือข่ายอินเทอร์เน็ต และความมั่นคงปลอดภัยไซเบอร์',
    url: '/internal-websites'
  },
  {
    code: 'HR & E-Leave',
    title: 'ระบบบริหารทรัพยากรบุคคล',
    description: 'ระบบฐานข้อมูลบุคลากร ตารางปฏิบัติงาน และระบบการลาอิเล็กทรอนิกส์',
    url: '/internal-websites'
  },
  {
    code: 'HDC / Data',
    title: 'คลังข้อมูลสุขภาพและตัวชี้วัด (HDC)',
    description: 'ระบบรายงานข้อมูลสถิติทางการแพทย์และตัวชี้วัดกระทรวงสาธารณสุข',
    url: '/internal-websites'
  },
  {
    code: 'Back Office',
    title: 'ระบบบริหารคลังยาและพัสดุ',
    description: 'ระบบเบิก-จ่ายเวชภัณฑ์ยา พัสดุทางการแพทย์ และครุภัณฑ์โรงพยาบาล',
    url: '/internal-websites'
  },
  {
    code: 'HA / Risk',
    title: 'ระบบบริหารความเสี่ยงและคุณภาพ (HA)',
    description: 'ระบบรายงานอุบัติการณ์ความเสี่ยงและเอกสารมาตรฐานคุณภาพโรงพยาบาล',
    url: '/internal-websites'
  },
  {
    code: 'Smart Booking',
    title: 'ระบบจองห้องประชุมและยานพาหนะ',
    description: 'บริการจองห้องประชุมวิชาการและขออนุญาตใช้รถยนต์ส่วนกลางออนไลน์',
    url: '/internal-websites'
  }
];

const INTERNAL_WEBSITES = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_intranet');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_INTERNAL_WEBSITES;
})();

/**
 * ฟังก์ชันตรวจสอบและแปลง URL ของระบบเว็บไซต์ภายใน:
 * - หากเป็นลิงก์ภายนอก เช่น http://, https:// ให้ใช้ค่านั้นตรงๆ และเปิดแท็บใหม่
 * - หากเป็นลิงก์ภายในหน้าเว็บ (pages/...) ให้ต่อ rootPath ให้ถูกต้อง
 */
function resolveIntranetUrl(rootPath, url) {
  if (!url) return '#';
  const cleanUrl = url.trim();
  // ลิงก์เว็บภายนอกหรือ IP ภายในหน่วยงาน (http://, https://, //)
  if (/^(?:[a-z+]+:)?\/\//i.test(cleanUrl)) {
    return cleanUrl;
  }
  // หากผู้ใช้พิมพ์เป็น www. หรือ IP โดยไม่มี http:// ให้นำหน้าด้วย http://
  if (/^www\./i.test(cleanUrl) || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanUrl)) {
    return 'http://' + cleanUrl;
  }
  return rootPath + cleanUrl;
}

function resolveIntranetLogo(rootPath, logoPath) {
  if (!logoPath) return rootPath + KSP_INTRANET_LOGO;
  if (logoPath.startsWith('data:') || logoPath.startsWith('http')) return logoPath;
  return rootPath + logoPath;
}

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ส่วนเว็บไซต์ภายใน
 */
function renderIntranetSectionHTML(rootPath) {
  const cardsMarkup = INTERNAL_WEBSITES.map(function (item) {
    const targetUrl = resolveIntranetUrl(rootPath, item.url);
    const isExternal = /^(?:[a-z+]+:)?\/\//i.test(targetUrl);
    const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';
    const logoSrc = resolveIntranetLogo(rootPath, item.logo);

    return `
      <a href="${targetUrl}" class="intranet-card" ${targetAttr} title="คลิกเพื่อเข้าสู่ระบบงาน: ${item.title}">
        <div class="intranet-card-top">
          <div class="intranet-logo-badge">
            <img src="${logoSrc}" alt="โลโก้ ${item.title}" loading="lazy" />
          </div>
          <span class="intranet-system-code">${item.code}</span>
        </div>

        <h3 class="intranet-card-title">${item.title}</h3>
        <p class="intranet-card-desc">${item.description}</p>

        <span class="intranet-card-action">
          <span>เข้าสู่ระบบงาน</span>
          <span aria-hidden="true">&rarr;</span>
        </span>
      </a>
    `;
  }).join('');

  return `
    <section class="intranet-section" aria-labelledby="intranet-heading">
      <div class="intranet-container">
        <div class="intranet-header">
          <h2 class="intranet-title" id="intranet-heading">เว็บไซต์ภายใน</h2>
          <div class="intranet-underline"></div>
        </div>

        <div class="intranet-grid">
          ${cardsMarkup}
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const intranetPlaceholder = document.getElementById('intranet-placeholder');
  if (!intranetPlaceholder) return;

  intranetPlaceholder.innerHTML = renderIntranetSectionHTML(rootPath);
});
