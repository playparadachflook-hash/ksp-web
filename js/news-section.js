/* ==========================================================================
   ไฟล์: js/news-section.js
   หน้าที่: สร้างส่วนที่ 4 — ข่าวสาร & กิจกรรม
           รองรับการแสดง "ภาพปกข่าว" และกดอ่านเพื่อเปิด Modal ดูเนื้อหาเต็ม + "ภาพงานทั้งหมด (Gallery)"
   ========================================================================== */

const DEFAULT_NEWS_LIST = [
  {
    image: 'assets/images/news/news-1.png',
    gallery: [
      'assets/images/news/news-1.png',
      'assets/images/banners/banner-1.png'
    ],
    title: 'การแสดงผลงานกรณีศึกษาทางการพยาบาล ณ ประเทศเกาหลีใต้',
    excerpt:
      'ผลงานวิชาการด้านการดูแลรักษาผู้ป่วยของหน่วยวิกฤติหัวใจ โรงพยาบาลกรุงเทพคริสเตียน โดย พว.จิราภรณ์ ต่วนกลิ่นคง และ พว.ฐิติมา พรมา ได้รับคัดเลือกให้นำเสนอผลงานวิชาการในรูปแบบโปสเตอร์ Poster Presentation หัวข้อ Interesting and Challenge case ในงานประชุมวิชาการนานาชาติ...',
    link: '/news'
  },
  {
    image: 'assets/images/news/news-1.png',
    gallery: ['assets/images/news/news-1.png'],
    title: 'การแสดงผลงานกรณีศึกษาทางการพยาบาล ณ ประเทศเกาหลีใต้',
    excerpt:
      'ผลงานวิชาการด้านการดูแลรักษาผู้ป่วยของหน่วยวิกฤติหัวใจ โรงพยาบาลกรุงเทพคริสเตียน โดย พว.จิราภรณ์ ต่วนกลิ่นคง และ พว.ฐิติมา พรมา ได้รับคัดเลือกให้นำเสนอผลงานวิชาการในรูปแบบโปสเตอร์ Poster Presentation หัวข้อ Interesting and Challenge case ในงานประชุมวิชาการนานาชาติ...',
    link: '/news'
  },
  {
    image: 'assets/images/news/news-1.png',
    gallery: ['assets/images/news/news-1.png'],
    title: 'การแสดงผลงานกรณีศึกษาทางการพยาบาล ณ ประเทศเกาหลีใต้',
    excerpt:
      'ผลงานวิชาการด้านการดูแลรักษาผู้ป่วยของหน่วยวิกฤติหัวใจ โรงพยาบาลกรุงเทพคริสเตียน โดย พว.จิราภรณ์ ต่วนกลิ่นคง และ พว.ฐิติมา พรมา ได้รับคัดเลือกให้นำเสนอผลงานวิชาการในรูปแบบโปสเตอร์ Poster Presentation หัวข้อ Interesting and Challenge case ในงานประชุมวิชาการนานาชาติ...',
    link: '/news'
  },
  {
    image: 'assets/images/news/news-1.png',
    gallery: ['assets/images/news/news-1.png'],
    title: 'การแสดงผลงานกรณีศึกษาทางการพยาบาล ณ ประเทศเกาหลีใต้',
    excerpt:
      'ผลงานวิชาการด้านการดูแลรักษาผู้ป่วยของหน่วยวิกฤติหัวใจ โรงพยาบาลกรุงเทพคริสเตียน โดย พว.จิราภรณ์ ต่วนกลิ่นคง และ พว.ฐิติมา พรมา ได้รับคัดเลือกให้นำเสนอผลงานวิชาการในรูปแบบโปสเตอร์ Poster Presentation หัวข้อ Interesting and Challenge case ในงานประชุมวิชาการนานาชาติ...',
    link: '/news'
  }
];

const NEWS_LIST = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_news');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_NEWS_LIST;
})();

const TOTAL_NEWS_PAGES = 7;

function resolveNewsImg(rootPath, imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) return imgPath;
  return rootPath + imgPath;
}

/**
 * ฟังก์ชันสร้าง HTML ส่วนข่าวสาร & กิจกรรม พร้อม Modal ดูภาพงานทั้งหมด
 */
function renderNewsSectionHTML(rootPath) {
  const cardsMarkup = NEWS_LIST.map(function (item, idx) {
    const galleryArr = Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [item.image];
    return `
      <article class="news-card">
        <div class="news-card-image-wrap" data-open-news="${idx}" role="button" tabindex="0" aria-label="ดูรายละเอียดและภาพงาน: ${item.title}">
          <img src="${resolveNewsImg(rootPath, item.image)}" alt="${item.title}" class="news-card-image" loading="lazy" />
          <span class="news-gallery-count">ภาพงานทั้งหมด ${galleryArr.length} ภาพ</span>
        </div>
        <h3 class="news-card-title">${item.title}</h3>
        <p class="news-card-excerpt">${item.excerpt}</p>
        <button type="button" class="news-card-readmore" data-open-news="${idx}" style="background:none;border:none;padding:0;cursor:pointer;">
          อ่านทั้งหมด &amp; ดูภาพงาน
        </button>
      </article>
    `;
  }).join('');

  let dotsMarkup = '';
  for (let i = 0; i < TOTAL_NEWS_PAGES; i++) {
    const activeClass = i === 0 ? 'is-active' : '';
    dotsMarkup += `
      <button
        type="button"
        class="news-dot ${activeClass}"
        data-news-page="${i}"
        aria-label="หน้าที่ ${i + 1} ของข่าวสารและกิจกรรม"
      ></button>
    `;
  }

  return `
    <section class="news-section" aria-labelledby="news-heading">
      <div class="news-container">
        <div class="news-header">
          <h2 class="news-title" id="news-heading">ข่าวสาร &amp; กิจกรรม</h2>
          <div class="news-underline"></div>
        </div>

        <div class="news-grid" id="news-grid">
          ${cardsMarkup}
        </div>

        <div class="news-footer">
          <div class="news-pagination" id="news-pagination">
            ${dotsMarkup}
          </div>

          <a href="${rootPath}/news" class="news-view-all">
            <span>ดูข่าวสารกิจกรรม ทั้งหมด &gt;</span>
          </a>
        </div>
      </div>

      <!-- Modal แสดงรายละเอียดข่าว + ภาพปก + อัลบั้มภาพงานทั้งหมด -->
      <div class="ksp-modal-backdrop" id="news-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="news-modal-title">
        <div class="ksp-modal-dialog" style="max-width:820px;">
          <div class="ksp-modal-header">
            <div>
              <span class="ksp-modal-badge">ข่าวสาร &amp; กิจกรรม โรงพยาบาลโคกศรีสุพรรณ</span>
              <h3 class="ksp-modal-title" id="news-modal-title"></h3>
            </div>
            <button type="button" class="ksp-modal-close" id="news-modal-close" aria-label="ปิดหน้าต่าง">&times;</button>
          </div>
          <div class="ksp-modal-body" id="news-modal-body"></div>
          <div class="ksp-modal-footer">
            <button type="button" class="ksp-modal-ok-btn" id="news-modal-ok">ปิดหน้าต่าง</button>
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

  const newsPlaceholder = document.getElementById('news-placeholder');
  if (!newsPlaceholder) return;

  newsPlaceholder.innerHTML = renderNewsSectionHTML(rootPath);

  // เปิด Modal แสดงภาพปกและภาพงานทั้งหมดเมื่อกด "อ่านทั้งหมด" หรือกดที่รูปปกข่าว
  const modalBackdrop = document.getElementById('news-modal-backdrop');
  const modalTitle = document.getElementById('news-modal-title');
  const modalBody = document.getElementById('news-modal-body');
  const closeBtn = document.getElementById('news-modal-close');
  const okBtn = document.getElementById('news-modal-ok');

  function openNewsModal(idx) {
    const item = NEWS_LIST[idx];
    if (!item || !modalBackdrop) return;

    modalTitle.textContent = item.title;
    const coverSrc = resolveNewsImg(rootPath, item.image);
    const galleryArr = Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [item.image];

    const galleryImgsMarkup = galleryArr.map(function (imgUrl, gIdx) {
      const resolvedUrl = resolveNewsImg(rootPath, imgUrl);
      return `<img src="${resolvedUrl}" data-select-news-img="${resolvedUrl}" alt="ภาพบรรยากาศงานที่ ${gIdx + 1}" class="news-modal-gallery-img" style="cursor:pointer;" title="คลิกเพื่อดูภาพนี้ขนาดใหญ่" />`;
    }).join('');

    modalBody.innerHTML = `
      <img id="news-modal-main-cover" src="${coverSrc}" alt="${item.title}" class="news-modal-cover" />
      <p>${item.excerpt}</p>
      <h4 class="news-modal-gallery-title">อัลบั้มภาพงานทั้งหมด (${galleryArr.length} ภาพ — คลิกที่รูปเพื่อขยายดูด้านบน)</h4>
      <div class="news-modal-gallery-grid">
        ${galleryImgsMarkup}
      </div>
    `;

    modalBody.querySelectorAll('[data-select-news-img]').forEach(function (thumbEl) {
      thumbEl.addEventListener('click', function () {
        const mainCover = document.getElementById('news-modal-main-cover');
        const targetSrc = thumbEl.getAttribute('data-select-news-img');
        if (mainCover && targetSrc) {
          mainCover.src = targetSrc;
          mainCover.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      });
    });

    modalBackdrop.classList.add('is-open');
  }

  function closeNewsModal() {
    if (modalBackdrop) modalBackdrop.classList.remove('is-open');
  }

  newsPlaceholder.querySelectorAll('[data-open-news]').forEach(function (el) {
    el.addEventListener('click', function () {
      const idx = Number(el.getAttribute('data-open-news'));
      openNewsModal(idx);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeNewsModal);
  if (okBtn) okBtn.addEventListener('click', closeNewsModal);
  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) closeNewsModal();
    });
  }

  const newsDots = newsPlaceholder.querySelectorAll('.news-dot');
  const newsGrid = document.getElementById('news-grid');

  newsDots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const selectedIdx = Number(dot.getAttribute('data-news-page'));
      newsDots.forEach(function (d, idx) {
        d.classList.toggle('is-active', idx === selectedIdx);
      });
      if (newsGrid) {
        newsGrid.style.opacity = '0.45';
        setTimeout(function () {
          newsGrid.style.opacity = '1';
        }, 160);
      }
    });
  });
});
