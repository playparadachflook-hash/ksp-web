/* ==========================================================================
   ไฟล์: js/policy-section.js
   หน้าที่: สร้างส่วนที่ 5 — ประกาศนโยบายโรงพยาบาล
   จุดเด่น:
     1. ดึง "โลโก้โรงพยาบาลโคกศรีสุพรรณ" (KSP_HOSPITAL_LOGO) มาใส่ในทุกประกาศอัตโนมัติ
     2. แสดงวันที่ลงประกาศ และนับจำนวนคนที่กดเข้าดู (View Counter เพิ่มขึ้นจริงทุกครั้งที่คลิกดู!)
     3. เวลากดเข้าดูประกาศ จะเปิด Modal แสดงใบประกาศ และสามารถกดดาวน์โหลดได้ทั้ง:
        - ดาวน์โหลดเอกสารประกาศ (ไฟล์ที่แนบจากหลังบ้าน หรือไฟล์เอกสารราชการ .DOC)
        - ดาวน์โหลดรูปภาพประกาศ (.PNG ความละเอียดสูง)
   ========================================================================== */

const KSP_HOSPITAL_LOGO = 'assets/images/logo-ksp.png';

const DEFAULT_POLICY_ANNOUNCEMENTS = [
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  },
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  },
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  },
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  },
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  },
  {
    title: 'แนวทางการตรวจห้องปฏิบัติการอย่างสมเหตุผล',
    categoryBadge: 'ประกาศนโยบายโรงพยาบาล',
    date: '5 มิ.ย. 2567',
    views: 6694,
    fileName: '',
    fileDataUrl: '',
    imageDataUrl: '',
    link: 'pages/policy.html'
  }
];

const POLICY_ANNOUNCEMENTS = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_policies');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_POLICY_ANNOUNCEMENTS;
})();

/**
 * ฟังก์ชันสร้างรูปภาพใบประกาศนโยบายโรงพยาบาล (.PNG ความละเอียดสูง 1200x820 px) ด้วย JavaScript Canvas
 * ใช้สำหรับแสดงตัวอย่างใน Modal และให้ผู้ชมกดดาวน์โหลดเป็นไฟล์รูปภาพ (.png) ได้ทันที
 */
function generateOfficialPolicyImageDataUrl(item) {
  const canvas = document.createElement('canvas');
  canvas.width = 1200;
  canvas.height = 820;
  const ctx = canvas.getContext('2d');

  // พื้นหลังใบประกาศโทนเขียวมรกตอ่อนสะอาดตา
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 820);
  bgGrad.addColorStop(0, '#f4fbf8');
  bgGrad.addColorStop(1, '#e3f3ec');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1200, 820);

  // กรอบนอกสีเขียวมรกตโรงพยาบาล
  ctx.strokeStyle = '#1f5a50';
  ctx.lineWidth = 10;
  ctx.strokeRect(28, 28, 1144, 764);

  // กรอบในเส้นคู่
  ctx.strokeStyle = '#7fc0aa';
  ctx.lineWidth = 2;
  ctx.strokeRect(44, 44, 1112, 732);

  // แถบหัวใบประกาศสีเขียวมรกตเข้ม
  ctx.fillStyle = '#1f5a50';
  ctx.fillRect(44, 44, 1112, 136);

  // ตราสัญลักษณ์วงกลมเครื่องหมายการแพทย์
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(135, 112, 44, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1f5a50';
  ctx.fillRect(127, 86, 16, 52);
  ctx.fillRect(109, 104, 52, 16);

  // ชื่อโรงพยาบาลบนแถบหัวประกาศ
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = 'bold 34px Prompt, sans-serif';
  ctx.fillText('โรงพยาบาลโคกศรีสุพรรณ (KHOKSRISUPHAN HOSPITAL)', 205, 104);

  ctx.fillStyle = '#cdece1';
  ctx.font = '500 22px Prompt, sans-serif';
  ctx.fillText('สำนักงานสาธารณสุขจังหวัดสกลนคร กระทรวงสาธารณสุข', 205, 144);

  // ป้ายหมวดหมู่ประกาศ
  ctx.fillStyle = '#e0f2ec';
  ctx.strokeStyle = '#256b5c';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(400, 225, 400, 52, 26);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#145a4a';
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px Prompt, sans-serif';
  ctx.fillText(item.categoryBadge || 'ประกาศนโยบายโรงพยาบาล', 600, 259);

  // หัวข้อประกาศนโยบาย
  ctx.fillStyle = '#0f2d26';
  ctx.font = 'bold 36px Prompt, sans-serif';
  const titleText = 'เรื่อง ' + (item.title || 'ประกาศนโยบายโรงพยาบาล');
  ctx.fillText(titleText, 600, 355);

  // เส้นคั่นกลาง
  ctx.strokeStyle = '#9bd1be';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(220, 395);
  ctx.lineTo(980, 395);
  ctx.stroke();

  // เนื้อหาสาระสำคัญของประกาศ
  ctx.fillStyle = '#1e293b';
  ctx.font = '400 24px Prompt, sans-serif';
  ctx.fillText(
    'โรงพยาบาลโคกศรีสุพรรณ กำหนดแนวทางและมาตรฐานการปฏิบัติงานตามประกาศฉบับนี้',
    600,
    460
  );
  ctx.fillText(
    'เพื่อให้บุคลากรทางการแพทย์และเจ้าหน้าที่ทุกฝ่ายยึดถือเป็นแนวทางปฏิบัติอย่างเคร่งครัด',
    600,
    505
  );
  ctx.fillText(
    'เพื่อความปลอดภัยสูงสุดของผู้รับบริการ และคุณภาพมาตรฐานบริการสาธารณสุข',
    600,
    550
  );

  // วันที่ประกาศ & ข้อมูลอ้างอิงด้านล่าง
  ctx.fillStyle = '#145a4a';
  ctx.font = 'bold 24px Prompt, sans-serif';
  ctx.fillText('ประกาศ ณ วันที่ ' + (item.date || '5 มิ.ย. 2567'), 600, 645);

  ctx.fillStyle = '#475569';
  ctx.font = '500 20px Prompt, sans-serif';
  ctx.fillText('เอกสารอิเล็กทรอนิกส์ทางการ — โรงพยาบาลโคกศรีสุพรรณ จังหวัดสกลนคร', 600, 715);

  return canvas.toDataURL('image/png');
}

/**
 * ฟังก์ชันสร้างไฟล์เอกสารราชการ (.doc เปิดด้วย Word ได้ทันที) กรณีประกาศนั้นยังไม่ได้แนบไฟล์แยกจากหลังบ้าน
 */
function generateOfficialPolicyDocDataUrl(item) {
  const htmlDoc = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${item.title}</title></head>
    <body style="font-family:'TH SarabunPSK','Prompt',sans-serif;padding:40px;line-height:1.6;">
      <h2 style="text-align:center;color:#145a4a;margin-bottom:4px;">ประกาศโรงพยาบาลโคกศรีสุพรรณ</h2>
      <h3 style="text-align:center;color:#1e293b;margin-top:0;">เรื่อง ${item.title}</h3>
      <hr style="border:1px solid #145a4a;margin:20px 0;" />
      <p><strong>หมวดหมู่:</strong> ${item.categoryBadge || 'ประกาศนโยบายโรงพยาบาล'}</p>
      <p><strong>ประกาศ ณ วันที่:</strong> ${item.date}</p>
      <p style="margin-top:20px;">
        เพื่อให้การดำเนินงานและการให้บริการทางการแพทย์ของโรงพยาบาลโคกศรีสุพรรณ เป็นไปด้วยความเรียบร้อย
        มีประสิทธิภาพ และเกิดประโยชน์สูงสุดแก่ผู้รับบริการ จึงขอประกาศใช้ <strong>"${item.title}"</strong>
        ให้บุคลากรในสังกัดทุกกลุ่มงานถือปฏิบัติตามแนวทางที่กำหนด
      </p>
      <br /><br />
      <p style="text-align:right;">
        <strong>โรงพยาบาลโคกศรีสุพรรณ จังหวัดสกลนคร</strong><br />
        วันที่ลงประกาศ: ${item.date}
      </p>
    </body>
    </html>
  `;
  return 'data:application/msword;charset=utf-8,' + encodeURIComponent(htmlDoc);
}

/**
 * ฟังก์ชันสร้าง HTML ส่วนประกาศนโยบายโรงพยาบาล
 */
function renderPolicySectionHTML(rootPath) {
  const cardsMarkup = POLICY_ANNOUNCEMENTS.map(function (item, idx) {
    return `
      <a href="#policy-view-${idx}" class="policy-card" data-policy-idx="${idx}">
        <!-- ฝั่งซ้าย: โลโก้โรงพยาบาลโคกศรีสุพรรณ (ดึงให้อัตโนมัติทุกการเพิ่มประกาศ) + ป้ายหมวดหมู่ -->
        <div class="policy-thumb">
          <div class="policy-thumb-logo-box">
            <img
              src="${rootPath}${KSP_HOSPITAL_LOGO}"
              alt="โลโก้โรงพยาบาลโคกศรีสุพรรณ"
              class="policy-thumb-logo"
              loading="lazy"
            />
          </div>
          <span class="policy-thumb-badge">${item.categoryBadge || 'ประกาศนโยบายโรงพยาบาล'}</span>
        </div>

        <!-- ฝั่งขวา: หัวข้อประกาศ + วันที่ลงประกาศ + จำนวนผู้เข้าดู -->
        <div class="policy-info">
          <h3 class="policy-card-title">${item.title}</h3>
          <div class="policy-card-meta">
            <span class="policy-meta-item" title="วันที่ลงประกาศ">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              <span>${item.date}</span>
            </span>

            <span class="policy-meta-item" title="จำนวนคนที่เข้าดู">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              <span class="policy-view-count" data-view-count="${idx}">${item.views}</span>
            </span>
          </div>
        </div>
      </a>
    `;
  }).join('');

  return `
    <section class="policy-section" aria-labelledby="policy-heading">
      <div class="policy-container">
        <div class="policy-header">
          <h2 class="policy-title" id="policy-heading">ประกาศนโยบายโรงพยาบาลบาล</h2>
          <div class="policy-underline"></div>
        </div>

        <div class="policy-grid">
          ${cardsMarkup}
        </div>
      </div>

      <!-- Modal แสดงรายละเอียดประกาศนโยบาย พร้อมปุ่มดาวน์โหลดเอกสารและรูปภาพ -->
      <div class="ksp-modal-backdrop" id="policy-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="policy-modal-title">
        <div class="ksp-modal-dialog" style="max-width:780px;">
          <div class="ksp-modal-header">
            <div>
              <span class="ksp-modal-badge" id="policy-modal-badge">ประกาศนโยบายโรงพยาบาล</span>
              <h3 class="ksp-modal-title" id="policy-modal-title"></h3>
            </div>
            <button type="button" class="ksp-modal-close" id="policy-modal-close" aria-label="ปิดหน้าต่าง">&times;</button>
          </div>
          <div class="ksp-modal-body" id="policy-modal-body"></div>
          <div class="ksp-modal-footer" id="policy-modal-footer" style="flex-wrap:wrap;">
            <button type="button" class="ksp-modal-ok-btn" id="policy-modal-ok">ปิดหน้าต่าง</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const policyPlaceholder = document.getElementById('policy-placeholder');
  if (!policyPlaceholder) return;

  policyPlaceholder.innerHTML = renderPolicySectionHTML(rootPath);

  const modalBackdrop = document.getElementById('policy-modal-backdrop');
  const modalBadge = document.getElementById('policy-modal-badge');
  const modalTitle = document.getElementById('policy-modal-title');
  const modalBody = document.getElementById('policy-modal-body');
  const modalFooter = document.getElementById('policy-modal-footer');
  const closeBtn = document.getElementById('policy-modal-close');

  function closePolicyModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
  }

  // เมื่อคลิกที่การ์ดประกาศ: บวกยอดเข้าดู +1 จริง และเปิด Modal ให้ดาวน์โหลดได้ทั้งเอกสารและรูปภาพ
  policyPlaceholder.querySelectorAll('.policy-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
      e.preventDefault();
      const idx = Number(card.getAttribute('data-policy-idx'));
      const item = POLICY_ANNOUNCEMENTS[idx];
      if (!item) return;

      // 1. เพิ่มจำนวนคนที่เข้าดู +1 และบันทึกกลับลงระบบทันที
      item.views = Number(item.views || 0) + 1;
      try {
        localStorage.setItem('ksp_cms_v1_policies', JSON.stringify(POLICY_ANNOUNCEMENTS));
      } catch (err) {}

      // อัปเดตตัวเลขบนหน้าจอทันที
      const viewSpan = policyPlaceholder.querySelector('[data-view-count="' + idx + '"]');
      if (viewSpan) {
        viewSpan.textContent = item.views;
      }

      // 2. เตรียมรูปภาพประกาศ (.PNG) และไฟล์เอกสารประกาศ (.PDF / .DOC) สำหรับแสดงผลและดาวน์โหลด
      modalBadge.textContent = item.categoryBadge || 'ประกาศนโยบายโรงพยาบาล';
      modalTitle.textContent = item.title;

      const isUploadedFileAnImage = item.fileDataUrl && item.fileDataUrl.startsWith('data:image/');
      const policyImageUrl =
        item.imageDataUrl ||
        (isUploadedFileAnImage ? item.fileDataUrl : generateOfficialPolicyImageDataUrl(item));

      const imageDownloadName = (item.title || 'ประกาศนโยบายโรงพยาบาล') + '.png';

      // เตรียมลิงก์ดาวน์โหลดไฟล์เอกสาร (ถ้าแอดมินอัปโหลดไฟล์ไว้ ให้ใช้ไฟล์นั้น ถ้ายังไม่มีให้สร้างไฟล์เอกสารราชการ .doc อัตโนมัติ)
      const docDownloadUrl = item.fileDataUrl || generateOfficialPolicyDocDataUrl(item);
      const docDownloadName = item.fileName || ((item.title || 'ประกาศนโยบายโรงพยาบาล') + '.doc');

      modalBody.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:10px;margin-bottom:14px;padding:10px 14px;background:#eef6f3;border-radius:10px;border:1px solid #bce3d4;">
          <span><strong>วันที่ลงประกาศ:</strong> ${item.date}</span>
          <span><strong>จำนวนผู้เข้าดู:</strong> ${item.views} ครั้ง</span>
        </div>

        <!-- แสดงตัวอย่างรูปภาพใบประกาศนโยบายโรงพยาบาล -->
        <div style="text-align:center;margin-bottom:14px;">
          <img
            src="${policyImageUrl}"
            alt="${item.title}"
            style="width:100%;max-height:420px;object-fit:contain;border-radius:12px;border:1px solid #cbd5e1;box-shadow:0 6px 18px rgba(15,45,38,0.12);background:#ffffff;"
          />
          <p style="font-size:0.82rem;color:#475569;margin:8px 0 0;">
            สามารถกดปุ่มด้านล่างเพื่อ <strong>ดาวน์โหลดเอกสารประกาศ</strong> หรือ <strong>ดาวน์โหลดรูปภาพใบประกาศ</strong> ลงเครื่องได้ทันที
          </p>
        </div>
      `;

      modalFooter.innerHTML = `
        <a
          href="${docDownloadUrl}"
          download="${docDownloadName}"
          class="ksp-modal-ok-btn"
          style="background:#1d4ed8;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"
        >
          📄 ดาวน์โหลดเอกสาร (${docDownloadName})
        </a>
        <a
          href="${policyImageUrl}"
          download="${imageDownloadName}"
          class="ksp-modal-ok-btn"
          style="background:#145a4a;text-decoration:none;display:inline-flex;align-items:center;gap:6px;"
        >
          🖼️ ดาวน์โหลดรูปภาพประกาศ (.PNG)
        </a>
        <button type="button" class="ksp-modal-ok-btn" id="policy-modal-ok-dyn" style="background:#475569;">
          ปิดหน้าต่าง
        </button>
      `;

      const dynOk = document.getElementById('policy-modal-ok-dyn');
      if (dynOk) dynOk.addEventListener('click', closePolicyModal);

      modalBackdrop.classList.add('is-open');
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePolicyModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closePolicyModal();
    });
  }
});
