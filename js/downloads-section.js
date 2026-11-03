/* ==========================================================================
   ไฟล์: js/downloads-section.js
   หน้าที่: สร้างส่วน "ดาวน์โหลดเอกสาร" พร้อมระบบกรองหมวดหมู่
           และรองรับการดาวน์โหลดไฟล์เอกสารจริงที่อัปโหลดมาจากระบบหลังบ้าน
   ========================================================================== */

const DEFAULT_DOWNLOAD_ITEMS = [
  {
    title: 'แบบฟอร์มคำขอประวัติการรักษาพยาบาล (Medical Record Request)',
    category: 'ผู้รับบริการ',
    fileType: 'PDF',
    fileSize: '245 KB',
    updatedDate: '15 พ.ค. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/medical-documents.html'
  },
  {
    title: 'แบบฟอร์มหนังสือมอบอำนาจติดต่อราชการและรับเอกสารทางการแพทย์',
    category: 'ผู้รับบริการ',
    fileType: 'PDF',
    fileSize: '198 KB',
    updatedDate: '15 พ.ค. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/medical-documents.html'
  },
  {
    title: 'แบบฟอร์มแจ้งย้ายสิทธิหลักประกันสุขภาพแห่งชาติ (บัตรทอง รพ.โคกศรีสุพรรณ)',
    category: 'ผู้รับบริการ',
    fileType: 'PDF',
    fileSize: '310 KB',
    updatedDate: '1 มิ.ย. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/medical-documents.html'
  },
  {
    title: 'แผนปฏิบัติการจัดซื้อจัดจ้างและประกาศราคากลาง ประจำปีงบประมาณ 2569',
    category: 'เอกสารราชการ/จัดซื้อจัดจ้าง',
    fileType: 'PDF',
    fileSize: '620 KB',
    updatedDate: '5 มิ.ย. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/policy.html'
  },
  {
    title: 'คู่มือการเตรียมตัวก่อนตรวจสุขภาพประจำปีและการตรวจทางห้องปฏิบัติการ',
    category: 'คู่มือประชาชน',
    fileType: 'PDF',
    fileSize: '1.2 MB',
    updatedDate: '10 มิ.ย. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/departments.html'
  },
  {
    title: 'แบบฟอร์มใบสมัครงานและเอกสารประกอบการสมัครงาน โรงพยาบาลโคกศรีสุพรรณ',
    category: 'เอกสารราชการ/จัดซื้อจัดจ้าง',
    fileType: 'DOCX',
    fileSize: '180 KB',
    updatedDate: '12 มิ.ย. 2567',
    fileName: '',
    fileDataUrl: '',
    fileUrl: 'pages/policy.html'
  }
];

const DOWNLOAD_ITEMS = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_downloads');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_DOWNLOAD_ITEMS;
})();

const DOWNLOAD_CATEGORIES = [
  'ทั้งหมด',
  'ผู้รับบริการ',
  'เอกสารราชการ/จัดซื้อจัดจ้าง',
  'คู่มือประชาชน'
];

/**
 * ฟังก์ชันสร้างการ์ดเอกสารตามหมวดหมู่ที่เลือก
 */
function renderDownloadCardsMarkup(rootPath, selectedCategory) {
  const filtered = DOWNLOAD_ITEMS.filter(function (item) {
    return selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
  });

  return filtered.map(function (item) {
    // ถ้ามีการอัปโหลดไฟล์จริงมาจากระบบหลังบ้าน ให้ดาวน์โหลดไฟล์นั้นทันที
    const hrefVal = item.fileDataUrl ? item.fileDataUrl : rootPath + (item.fileUrl || 'pages/downloads.html');
    const downloadAttr = item.fileDataUrl ? `download="${item.fileName || item.title}"` : '';

    return `
      <div class="download-card">
        <div class="download-card-left">
          <div class="download-icon-box" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="12" y1="18" x2="12" y2="12"></line>
              <polyline points="9 15 12 18 15 15"></polyline>
            </svg>
            <span class="download-file-type">${item.fileType || 'PDF'}</span>
          </div>

          <div class="download-info">
            <h3 class="download-doc-title" title="${item.title}">${item.title}</h3>
            <div class="download-doc-meta">
              <span class="download-category-tag">${item.category}</span>
              <span>ขนาด ${item.fileSize}</span>
              <span>วันที่ลง ${item.updatedDate}</span>
            </div>
          </div>
        </div>

        <a href="${hrefVal}" ${downloadAttr} class="download-btn" title="ดาวน์โหลด ${item.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>ดาวน์โหลด</span>
        </a>
      </div>
    `;
  }).join('');
}

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ส่วนดาวน์โหลดเอกสาร
 */
function renderDownloadsSectionHTML(rootPath) {
  const tabsMarkup = DOWNLOAD_CATEGORIES.map(function (cat, idx) {
    const activeClass = idx === 0 ? 'is-active' : '';
    return `
      <button type="button" class="download-tab-btn ${activeClass}" data-category="${cat}">
        ${cat}
      </button>
    `;
  }).join('');

  return `
    <section class="downloads-section" aria-labelledby="downloads-heading">
      <div class="downloads-container">
        <div class="downloads-header">
          <h2 class="downloads-title" id="downloads-heading">ดาวน์โหลดเอกสาร</h2>
          <div class="downloads-underline"></div>
        </div>

        <div class="downloads-tabs" id="downloads-tabs">
          ${tabsMarkup}
        </div>

        <div class="downloads-grid" id="downloads-grid">
          ${renderDownloadCardsMarkup(rootPath, 'ทั้งหมด')}
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const downloadsPlaceholder = document.getElementById('downloads-placeholder');
  if (!downloadsPlaceholder) return;

  downloadsPlaceholder.innerHTML = renderDownloadsSectionHTML(rootPath);

  const tabBtns = downloadsPlaceholder.querySelectorAll('.download-tab-btn');
  const gridEl = document.getElementById('downloads-grid');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const selectedCat = btn.getAttribute('data-category');

      tabBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });

      if (gridEl) {
        gridEl.innerHTML = renderDownloadCardsMarkup(rootPath, selectedCat);
      }
    });
  });
});
