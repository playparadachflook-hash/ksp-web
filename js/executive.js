/* ==========================================================================
   ไฟล์: js/executive.js
   หน้าที่: สร้างส่วน "ทำเนียบผู้บริหาร & วิสัยทัศน์โรงพยาบาล"
           พร้อมระบบกดที่การ์ด วิสัยทัศน์ / พันธกิจ / ค่านิยมหลัก แล้วเปิด Modal ป๊อปอัปแสดงรายละเอียดทันที
   ========================================================================== */

const DEFAULT_EXECUTIVE_DATA = {
  sectionHeading: 'ผู้บริหารและวิสัยทัศน์โรงพยาบาล',
  cardTitle: 'ผู้บริหาร',
  photo: 'assets/images/executive/director.png',
  name: 'นางณัฐปภัสร์ นวัตชัยศิริกุล',
  rank: 'นายแพทย์ชำนาญการพิเศษ',
  actingTitle: 'รักษาการในตำแหน่ง',
  role: 'ผู้อำนวยการ รพ.โคกศรีสุพรรณ',

  visionBadge: 'โรงพยาบาลโคกศรีสุพรรณ (KHOKSRISUPHAN HOSPITAL)',
  visionHeadline: 'มุ่งมั่นพัฒนาคุณภาพบริการทางการแพทย์ ดูแลด้วยหัวใจดุจญาติมิตร',
  visionQuote:
    '“โรงพยาบาลโคกศรีสุพรรณ มุ่งเน้นการให้บริการสุขภาพแบบองค์รวมที่ได้มาตรฐานวิชาชีพ ปลอดภัย ทันสมัย และเข้าถึงประชาชนทุกกลุ่มวัย พร้อมขับเคลื่อนระบบสุขภาพดิจิทัลเพื่อคุณภาพชีวิตที่ดีของชาวอำเภอโคกศรีสุพรรณ”',

  pillars: [
    {
      label: 'VISION',
      title: 'วิสัยทัศน์ (Vision)',
      desc: 'เป็นโรงพยาบาลชุมชนคุณภาพชั้นนำ ที่ประชาชนและชุมชนไว้วางใจ ได้มาตรฐานบริการสุขภาพระดับสากล',
      details: [
        'มุ่งสู่การเป็นโรงพยาบาลชุมชนต้นแบบด้านคุณภาพและความปลอดภัยของผู้ป่วย (Patient Safety & Hospital Accreditation)',
        'พัฒนาระบบบริการสุขภาพดิจิทัล (Smart Hospital) ที่เชื่อมโยงข้อมูลการรักษาอย่างรวดเร็ว แม่นยำ และไร้รอยต่อ',
        'สร้างสภาพแวดล้อมที่อบอุ่น ผ่อนคลาย และเข้าถึงง่ายสำหรับประชาชนทุกกลุ่มวัยในอำเภอโคกศรีสุพรรณและพื้นที่ใกล้เคียง'
      ]
    },
    {
      label: 'MISSION',
      title: 'พันธกิจ (Mission)',
      desc: 'ให้บริการรักษา ส่งเสริม ป้องกัน และฟื้นฟูสุขภาพอย่างมีคุณภาพ เชื่อมโยงเครือข่ายสุขภาพชุมชนอย่างยั่งยืน',
      details: [
        '1. ให้บริการตรวจรักษาพยาบาลแบบองค์รวม ทั้งด้านการรักษา ส่งเสริม ป้องกัน และฟื้นฟูสภาพตามมาตรฐานวิชาชีพ',
        '2. พัฒนาศักยภาพบุคลากรทางการแพทย์และสหวิชาชีพให้มีความเชี่ยวชาญ พร้อมดูแลผู้ป่วยด้วยหัวใจความเป็นมนุษย์',
        '3. บูรณาการความร่วมมือกับเครือข่ายสุขภาพระดับปฐมภูมิ ผู้นำชุมชน และท้องถิ่น เพื่อสร้างเสริมสุขภาวะที่ยั่งยืน',
        '4. บริหารจัดการทรัพยากรและเทคโนโลยีสารสนเทศอย่างมีประสิทธิภาพ โปร่งใส และตรวจสอบได้'
      ]
    },
    {
      label: 'CORE VALUES',
      title: 'ค่านิยมหลัก (Core Values)',
      desc: 'สามัคคี มีวินัย ใส่ใจผู้รับบริการ ยึดมั่นจริยธรรมวิชาชีพ พัฒนานวัตกรรมสุขภาพดิจิทัล',
      details: [
        'S - Service Mind : บริการด้วยใจ ยิ้มแย้มแจ่มใส ใส่ใจดุจญาติมิตร',
        'M - Mastery & Morality : มีความเชี่ยวชาญในวิชาชีพ ควบคู่คุณธรรมและจริยธรรม',
        'A - Agility & Innovation : ทันสมัย ปรับตัวไว ขับเคลื่อนด้วยเทคโนโลยีและนวัตกรรมสุขภาพดิจิทัล',
        'R - Responsibility : รับผิดชอบต่อผู้ป่วย ชุมชน และสังคมด้วยความโปร่งใส',
        'T - Teamwork : ทำงานเป็นทีมสหวิชาชีพ สามัคคี มีน้ำใจ เพื่อประโยชน์สูงสุดของผู้รับบริการ'
      ]
    }
  ]
};

const EXECUTIVE_DATA = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_executive');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (!parsed.pillars || !parsed.pillars[0] || !parsed.pillars[0].details) {
        parsed.pillars = DEFAULT_EXECUTIVE_DATA.pillars;
      }
      return Object.assign({}, DEFAULT_EXECUTIVE_DATA, parsed);
    }
  } catch (e) {}
  return DEFAULT_EXECUTIVE_DATA;
})();

function resolveExecPhoto(rootPath, imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) return imgPath;
  return rootPath + imgPath;
}

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ของส่วนผู้บริหารและวิสัยทัศน์ พร้อมหน้าต่าง Modal
 */
function renderExecutiveHTML(rootPath) {
  const pillarsMarkup = EXECUTIVE_DATA.pillars.map(function (pillar, index) {
    return `
      <button
        type="button"
        class="vision-pillar-card"
        data-pillar-index="${index}"
        aria-haspopup="dialog"
      >
        <div class="vision-pillar-label">${pillar.label}</div>
        <h4 class="vision-pillar-title">${pillar.title}</h4>
        <p class="vision-pillar-desc">${pillar.desc}</p>
        <span class="vision-pillar-readbtn">กดอ่านรายละเอียด &rarr;</span>
      </button>
    `;
  }).join('');

  return `
    <section class="executive-section" aria-labelledby="executive-main-heading">
      <div class="executive-container">
        <!-- หัวข้อตรงกลาง -->
        <div class="executive-section-header">
          <h2 class="executive-section-title" id="executive-main-heading">
            ${EXECUTIVE_DATA.sectionHeading}
          </h2>
          <div class="executive-section-underline"></div>
        </div>

        <!-- โครงสร้าง 2 คอลัมน์: ซ้าย (การ์ดผู้บริหาร) | ขวา (วิสัยทัศน์และพันธกิจ) -->
        <div class="executive-vision-grid">

          <!-- ฝั่งซ้าย: การ์ดผู้บริหารตามรูปต้นแบบ -->
          <aside class="executive-card" aria-label="${EXECUTIVE_DATA.cardTitle}">
            <div class="executive-header">
              <h3 class="executive-heading">${EXECUTIVE_DATA.cardTitle}</h3>
            </div>

            <div class="executive-photo-wrap">
              <img
                src="${resolveExecPhoto(rootPath, EXECUTIVE_DATA.photo)}"
                alt="${EXECUTIVE_DATA.name} — ${EXECUTIVE_DATA.role}"
                class="executive-photo"
              />
            </div>

            <div class="executive-info">
              <p class="executive-name">${EXECUTIVE_DATA.name}</p>
              <p class="executive-rank">${EXECUTIVE_DATA.rank}</p>
              <p class="executive-acting">${EXECUTIVE_DATA.actingTitle}</p>
              <p class="executive-role">${EXECUTIVE_DATA.role}</p>
            </div>
          </aside>

          <!-- ฝั่งขวา: สารจากผู้อำนวยการ & การ์ด วิสัยทัศน์ / พันธกิจ / ค่านิยมหลัก (กดแล้วขึ้น Modal) -->
          <div class="executive-vision-panel">
            <div>
              <span class="vision-badge">${EXECUTIVE_DATA.visionBadge}</span>
              <h3 class="vision-headline">${EXECUTIVE_DATA.visionHeadline}</h3>
              <blockquote class="vision-quote">
                ${EXECUTIVE_DATA.visionQuote}
              </blockquote>
            </div>

            <div class="vision-pillars-grid">
              ${pillarsMarkup}
            </div>
          </div>

        </div>
      </div>

      <!-- หน้าต่างป๊อปอัป (Modal) แสดงรายละเอียด วิสัยทัศน์ / พันธกิจ / ค่านิยมหลัก -->
      <div class="ksp-modal-backdrop" id="vision-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="vision-modal-title">
        <div class="ksp-modal-dialog">
          <div class="ksp-modal-header">
            <div>
              <span class="ksp-modal-badge" id="vision-modal-badge">VISION</span>
              <h3 class="ksp-modal-title" id="vision-modal-title">วิสัยทัศน์</h3>
            </div>
            <button type="button" class="ksp-modal-close" id="vision-modal-close" aria-label="ปิดหน้าต่าง">&times;</button>
          </div>

          <div class="ksp-modal-body" id="vision-modal-body"></div>

          <div class="ksp-modal-footer">
            <button type="button" class="ksp-modal-ok-btn" id="vision-modal-ok">ปิดหน้าต่าง</button>
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

  const executivePlaceholder = document.getElementById('executive-placeholder');
  if (!executivePlaceholder) return;

  executivePlaceholder.innerHTML = renderExecutiveHTML(rootPath);

  // ควบคุมการเปิด-ปิดหน้าต่าง Modal ของ วิสัยทัศน์ / พันธกิจ / ค่านิยมหลัก
  const modalBackdrop = document.getElementById('vision-modal-backdrop');
  const modalBadge = document.getElementById('vision-modal-badge');
  const modalTitle = document.getElementById('vision-modal-title');
  const modalBody = document.getElementById('vision-modal-body');
  const closeBtn = document.getElementById('vision-modal-close');
  const okBtn = document.getElementById('vision-modal-ok');
  const pillarBtns = executivePlaceholder.querySelectorAll('.vision-pillar-card');

  function openPillarModal(index) {
    const pillar = EXECUTIVE_DATA.pillars[index];
    if (!pillar || !modalBackdrop) return;

    modalBadge.textContent = pillar.label + ' — โรงพยาบาลโคกศรีสุพรรณ';
    modalTitle.textContent = pillar.title;

    const listItems = (pillar.details || []).map(function (line) {
      return `<li>${line}</li>`;
    }).join('');

    modalBody.innerHTML = `
      <p style="font-weight:600;color:#1f5a50;font-size:1.05rem;">${pillar.desc}</p>
      <ul class="ksp-modal-list">${listItems}</ul>
    `;

    modalBackdrop.classList.add('is-open');
  }

  function closePillarModal() {
    if (modalBackdrop) {
      modalBackdrop.classList.remove('is-open');
    }
  }

  pillarBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const idx = Number(btn.getAttribute('data-pillar-index'));
      openPillarModal(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closePillarModal);
  if (okBtn) okBtn.addEventListener('click', closePillarModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closePillarModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePillarModal();
  });
});
