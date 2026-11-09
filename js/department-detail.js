/* ==========================================================================
   ไฟล์: js/department-detail.js
   หน้าที่: ดึงข้อมูลและเรนเดอร์หน้ารายละเอียดคลินิกเฉพาะทาง
   ========================================================================== */

document.addEventListener('DOMContentLoaded', async function () {
  // 1. ดึง Identifier ของคลินิกจาก URL (เช่น /department/1 หรือ ?id=1 หรือ /department/heart)
  const pathParts = window.location.pathname.replace(/\/+$/, '').split('/');
  const lastParam = pathParts[pathParts.length - 1];
  const urlParams = new URLSearchParams(window.location.search);
  const targetKey = urlParams.get('id') || urlParams.get('slug') || lastParam;

  // 2. ดึงรายการข้อมูลคลินิกทั้งหมด (ดึงจาก Cache หรือ API สด)
  let clinicList = (typeof DEFAULT_DEPARTMENTS_LIST !== 'undefined') ? DEFAULT_DEPARTMENTS_LIST : [];

  try {
    const saved = localStorage.getItem('ksp_cms_v1_departments');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) clinicList = parsed;
    }
  } catch (e) {}

  // พยายามโหลดข้อมูลล่าสุดจาก API MySQL
  try {
    const res = await fetch('/api/cms?action=get_section&section_key=departments');
    if (res.ok) {
      const apiData = await res.json();
      if (apiData && Array.isArray(apiData.section_data) && apiData.section_data.length > 0) {
        clinicList = apiData.section_data;
        try { localStorage.setItem('ksp_cms_v1_departments', JSON.stringify(clinicList)); } catch (e) {}
      }
    }
  } catch (e) {}

  // 3. ค้นหาคลินิกที่ตรงกับ ID, Slug หรือชื่อคลินิก
  let currentClinic = null;

  if (targetKey && targetKey !== 'department' && targetKey !== 'departments' && targetKey !== 'department-detail') {
    const numId = Number(targetKey);
    if (!isNaN(numId)) {
      // ค้นหาตามลำดับ หรือ id
      currentClinic = clinicList.find(c => Number(c.id) === numId) || clinicList[numId - 1];
    }
    if (!currentClinic) {
      // ค้นหาตาม slug หรือ title
      const decodedKey = decodeURIComponent(targetKey).trim().toLowerCase();
      currentClinic = clinicList.find(c => {
        const cSlug = (c.slug || '').toLowerCase();
        const cTitle = (c.title || '').toLowerCase();
        return cSlug === decodedKey || cTitle === decodedKey || cTitle.includes(decodedKey);
      });
    }
  }

  // หากไม่พบ ให้เลือกคลินิกแรกเป็นค่าเริ่มต้น
  if (!currentClinic && clinicList.length > 0) {
    currentClinic = clinicList[0];
  }

  if (!currentClinic) return;

  // 4. เรนเดอร์ข้อมูลลงในหน้าเว็บ
  const fullTitle = currentClinic.title.startsWith('คลินิก') || currentClinic.title.startsWith('ศูนย์')
    ? currentClinic.title
    : `คลินิก${currentClinic.title}`;

  // อัปเดต Title บราวเซอร์ และ Breadcrumb
  document.title = `${fullTitle} | โรงพยาบาลโคกศรีสุพรรณ`;
  const breadcrumbEl = document.getElementById('breadcrumb-clinic-name');
  if (breadcrumbEl) breadcrumbEl.textContent = fullTitle;

  // หัวข้อคลินิก และไอคอน
  const titleEl = document.getElementById('clinic-title');
  if (titleEl) titleEl.textContent = fullTitle;

  const iconCircleEl = document.getElementById('clinic-icon-badge');
  if (iconCircleEl && typeof DEPARTMENT_ICONS !== 'undefined') {
    const svgIcon = DEPARTMENT_ICONS[currentClinic.icon] || DEPARTMENT_ICONS.heart;
    iconCircleEl.innerHTML = svgIcon;
  }

  // รูปภาพปกคลินิก (ถ้ามี)
  const coverBox = document.getElementById('dept-cover-box');
  const coverImg = document.getElementById('dept-cover-img');
  if (coverBox && coverImg) {
    if (currentClinic.image && String(currentClinic.image).trim() !== '') {
      coverImg.src = currentClinic.image;
      coverImg.alt = fullTitle;
      coverBox.style.display = 'block';
    } else {
      coverBox.style.display = 'none';
    }
  }

  // 1. รายละเอียดศูนย์ (Section 1)
  const overviewHeading = document.getElementById('overview-heading-text');
  if (overviewHeading) overviewHeading.textContent = `รายละเอียด${fullTitle}`;

  const detailBox = document.getElementById('clinic-detail-paragraphs');
  if (detailBox) {
    const rawDetail = currentClinic.detail || currentClinic.detail_text || currentClinic.description || '';
    const paragraphs = rawDetail.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

    if (paragraphs.length > 0) {
      detailBox.innerHTML = paragraphs.map(p => `<p>${p.replace(/\n/g, '<br/>')}</p>`).join('');
    } else {
      detailBox.innerHTML = `<p>${currentClinic.description || 'ให้บริการตรวจวินิจฉัยและดูแลรักษาโดยทีมแพทย์ผู้เชี่ยวชาญ โรงพยาบาลโคกศรีสุพรรณ'}</p>`;
    }
  }

  // 2. บริการทางการแพทย์ (Section 2 - Bullet Points)
  const servicesListEl = document.getElementById('clinic-services-list');
  if (servicesListEl) {
    let serviceItems = [];
    if (Array.isArray(currentClinic.services) && currentClinic.services.length > 0) {
      serviceItems = currentClinic.services;
    } else if (typeof currentClinic.services === 'string' && currentClinic.services.trim() !== '') {
      serviceItems = currentClinic.services.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
    } else if (typeof currentClinic.services_list === 'string' && currentClinic.services_list.trim() !== '') {
      serviceItems = currentClinic.services_list.split('\n').map(s => s.trim().replace(/^[-•*]\s*/, '')).filter(Boolean);
    }

    if (serviceItems.length === 0) {
      // ค่าบริการเริ่มต้นตามรายละเอียด
      serviceItems = [
        `ตรวจวินิจฉัยและรักษาผู้ป่วยเฉพาะทาง ${fullTitle}`,
        'ตรวจคัดกรอง ติดตามอาการ และประเมินผลการรักษาอย่างต่อเนื่อง',
        'ให้คำปรึกษา แนะนำการใช้ยา และการปฏิบัติตัวในการดูแลสุขภาพตนเอง',
        'บริการส่งต่อแพทย์ผู้เชี่ยวชาญกรณีโรคซับซ้อนตามมาตรฐานเครือข่าย'
      ];
    }

    servicesListEl.innerHTML = serviceItems.map(item => `<li>${item}</li>`).join('');
  }

  // ข้อมูลติดต่อและเวลาทำการ (Sidebar)
  const contactTitle = document.getElementById('contact-card-title');
  if (contactTitle) contactTitle.textContent = `ติดต่อ${fullTitle}`;

  const hoursWeekday = document.getElementById('clinic-hours-weekday');
  if (hoursWeekday) {
    hoursWeekday.textContent = currentClinic.open_hours_weekday || currentClinic.open_hours || 'วันจันทร์ – ศุกร์ 08.00 – 16.00 น.';
  }

  const hoursWeekend = document.getElementById('clinic-hours-weekend');
  if (hoursWeekend) {
    hoursWeekend.textContent = currentClinic.open_hours_weekend || 'ปิดทำการวันหยุดราชการ';
  }

  const phoneEl = document.getElementById('clinic-phone');
  if (phoneEl) {
    const tel = currentClinic.tel || currentClinic.tel_internal || '042-766054 ต่อ 101';
    phoneEl.textContent = tel.startsWith('โทร') ? tel : `โทร. ${tel}`;
  }

  const locationEl = document.getElementById('clinic-location');
  if (locationEl) {
    locationEl.textContent = currentClinic.location || currentClinic.location_info || 'อาคารผู้ป่วยนอก โรงพยาบาลโคกศรีสุพรรณ';
  }

  // Quick Nav Smooth Scrolling & Active State
  const navLinks = document.querySelectorAll('.dept-nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
          e.preventDefault();
          navLinks.forEach(l => l.classList.remove('active'));
          this.classList.add('active');
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
});
