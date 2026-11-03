/* ==========================================================================
   ไฟล์: js/slidebar.js
   หน้าที่: ควบคุมส่วนที่ 2 — Slide Bar (แบนเนอร์ประกาศรูปภาพ, งานสิ่งพิมพ์ และบทความออนไลน์)
   พร้อมระบบ JavaScript คำนวณและปรับขนาดรูปภาพให้พอดีกับกรอบสไลด์อัตโนมัติ
   ========================================================================== */

/**
 * รายการสไลด์ประกาศ (แก้ไขหรือเพิ่มจำนวนสไลด์ตรงนี้ได้เลย)
 * - category : ประเภท (เช่น ประกาศประชาสัมพันธ์ / งานสิ่งพิมพ์ / บทความออนไลน์)
 * - title    : คำอธิบายรูปภาพ
 * - image    : ที่อยู่ไฟล์รูปภาพในโฟลเดอร์ assets/images/banners/
 * - link     : คลิกที่แบนเนอร์แล้วให้ไปที่หน้าไหน
 */
const DEFAULT_SLIDE_ITEMS = [
  {
    category: 'ประกาศคลินิกเฉพาะทาง',
    title: 'ทีมสูตินรีแพทย์ผู้ชำนาญการ ด้านสุขภาพผู้หญิง แผนกสูตินรีเวชกรรม',
    image: 'assets/images/banners/banner-1.png',
    link: '/departments'
  },
  {
    category: 'งานสิ่งพิมพ์ประชาสัมพันธ์',
    title: 'โครงการตรวจสุขภาพประจำปี ใส่ใจสุขภาพเชิงป้องกัน โรงพยาบาลโคกศรีสุพรรณ',
    image: 'assets/images/banners/banner-2.svg',
    link: '/departments'
  },
  {
    category: 'บทความออนไลน์',
    title: 'บทความสุขภาพออนไลน์: รู้ทันสัญญาณเตือนโรคหัวใจและความดันโลหิต',
    image: 'assets/images/banners/banner-3.svg',
    link: '/news'
  }
];

// ดึงข้อมูลจากระบบหลังบ้าน (ถ้าแอดมินเคยแก้ไขไว้) หรือใช้ค่าเริ่มต้น
const SLIDE_ITEMS = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_slides');
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return DEFAULT_SLIDE_ITEMS;
})();

function resolveSlideImgPath(rootPath, imgPath) {
  if (!imgPath) return '';
  if (imgPath.startsWith('data:') || imgPath.startsWith('http')) return imgPath;
  return rootPath + imgPath;
}

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ของ Slide Bar
 */
function renderSlidebarHTML(rootPath) {
  // 1. สร้างรายการรูปภาพแต่ละสไลด์
  const slidesMarkup = SLIDE_ITEMS.map(function (item, index) {
    return `
      <div class="slidebar-item" data-index="${index}" aria-label="สไลด์ที่ ${index + 1}: ${item.title}">
        <a href="${rootPath}${item.link}" class="slidebar-link" title="${item.category} — ${item.title}">
          <img
            src="${resolveSlideImgPath(rootPath, item.image)}"
            alt="${item.title}"
            class="slidebar-image"
            loading="${index === 0 ? 'eager' : 'lazy'}"
          />
        </a>
      </div>
    `;
  }).join('');

  // 2. สร้างจุดบอกตำแหน่งด้านขวาล่าง (Pagination Dots)
  const dotsMarkup = SLIDE_ITEMS.map(function (item, index) {
    const activeClass = index === 0 ? 'is-active' : '';
    return `
      <button
        type="button"
        class="slidebar-dot ${activeClass}"
        data-slide-to="${index}"
        aria-label="ไปยังสไลด์ที่ ${index + 1}: ${item.category}"
      ></button>
    `;
  }).join('');

  // 3. ส่งคืนโครงสร้าง Slide Bar ทั้งก้อน
  return `
    <section class="announcement-slidebar" aria-label="ป้ายประกาศ งานสิ่งพิมพ์ และบทความออนไลน์">
      <!-- รางเลื่อนรูปภาพ -->
      <div class="slidebar-viewport" id="slidebar-viewport">
        <div class="slidebar-track" id="slidebar-track">
          ${slidesMarkup}
        </div>
      </div>

      <!-- ปุ่มลูกศรเลื่อนไปด้านซ้าย [ < ] -->
      <button type="button" class="slidebar-arrow is-prev" id="slidebar-prev" aria-label="ประกาศก่อนหน้า">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>

      <!-- ปุ่มลูกศรเลื่อนไปด้านขวา [ > ] -->
      <button type="button" class="slidebar-arrow is-next" id="slidebar-next" aria-label="ประกาศถัดไป">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
      </button>

      <!-- จุดบอกตำแหน่งสไลด์มุมขวาล่าง -->
      <div class="slidebar-pagination" id="slidebar-pagination">
        ${dotsMarkup}
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  // ตรวจสอบตำแหน่งโฟลเดอร์ของหน้าปัจจุบัน
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  // นำ Slide Bar ไปแสดงใน <div id="slidebar-placeholder"></div>
  const slidebarPlaceholder = document.getElementById('slidebar-placeholder');
  if (!slidebarPlaceholder) return;

  slidebarPlaceholder.innerHTML = renderSlidebarHTML(rootPath);

  // ดึง Element ที่ใช้ควบคุมการเลื่อนสไลด์และปรับขนาดรูปภาพ
  const viewport = document.getElementById('slidebar-viewport');
  const track = document.getElementById('slidebar-track');
  const prevBtn = document.getElementById('slidebar-prev');
  const nextBtn = document.getElementById('slidebar-next');
  const dots = document.querySelectorAll('.slidebar-dot');
  const slideImages = slidebarPlaceholder.querySelectorAll('.slidebar-image');
  const slidebarSection = slidebarPlaceholder.querySelector('.announcement-slidebar');

  let currentIndex = 0;
  const totalSlides = SLIDE_ITEMS.length;
  let autoPlayTimer = null;

  // =========================================================================
  // ฟังก์ชันคำนวณและปรับขนาดภาพให้พอดีกับกรอบสไลด์อัตโนมัติ (JS Auto-Fit Image)
  // =========================================================================
  function fitSlideImagesToContainer() {
    if (!viewport || slideImages.length === 0) return;

    // 1. หาความกว้างของกรอบสไลด์ในปัจจุบัน (หลังบีบซ้าย 15% และขวา 15% เหลือความกว้าง 70%)
    const viewportWidth = viewport.clientWidth || Math.round(window.innerWidth * 0.7);

    // 2. อ่านสัดส่วนภาพต้นฉบับจากรูปแรก (ถ้ายังไม่โหลดเสร็จ ใช้สัดส่วนมาตรฐานแบนเนอร์ 1205 / 357)
    const firstImg = slideImages[0];
    const naturalW = firstImg.naturalWidth || 1205;
    const naturalH = firstImg.naturalHeight || 357;
    const aspectRatio = naturalW / naturalH;

    // 3. คำนวณความสูงที่พอดีเป๊ะตามสัดส่วนภาพจริง (ภาพไม่ยืดไม่เบี้ยว รองรับหน้าจอกว้าง 1520px)
    const idealHeight = Math.round(viewportWidth / aspectRatio);
    const finalHeight = Math.max(140, Math.min(idealHeight, 520));

    // 4. กำหนดความสูงให้กรอบสไลด์และปรับรูปทุกใบให้ฟิตเต็มกรอบสไลด์ 100% พอดีเป๊ะไร้ขอบส่วนเกิน
    viewport.style.height = finalHeight + 'px';

    slideImages.forEach(function (img) {
      img.style.width = '100%';
      img.style.height = finalHeight + 'px';
      img.style.objectFit = 'fill';
    });
  }

  // เรียกปรับขนาดภาพทันทีเมื่อรูปโหลดเสร็จ และทุกครั้งที่ย่อ/ขยายหน้าจอเบราว์เซอร์
  slideImages.forEach(function (img) {
    if (img.complete) {
      fitSlideImagesToContainer();
    } else {
      img.addEventListener('load', fitSlideImagesToContainer);
    }
  });
  window.addEventListener('resize', fitSlideImagesToContainer);
  fitSlideImagesToContainer();

  // =========================================================================
  // ฟังก์ชันสั่งเลื่อนไปยังสไลด์ที่ต้องการ
  // =========================================================================
  function goToSlide(targetIndex) {
    if (targetIndex < 0) {
      currentIndex = totalSlides - 1;
    } else if (targetIndex >= totalSlides) {
      currentIndex = 0;
    } else {
      currentIndex = targetIndex;
    }

    // เลื่อนรางรูปภาพด้วยแกน X
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // อัปเดตสถานะจุดแคปซูลมุมขวาล่าง (.is-active)
    dots.forEach(function (dot, idx) {
      dot.classList.toggle('is-active', idx === currentIndex);
    });
  }

  // กดปุ่มลูกศรซ้าย [ < ]
  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      goToSlide(currentIndex - 1);
      restartAutoPlay();
    });
  }

  // กดปุ่มลูกศรขวา [ > ]
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      goToSlide(currentIndex + 1);
      restartAutoPlay();
    });
  }

  // กดที่จุดกลมด้านขวาล่างเพื่อกระโดดไปยังสไลด์นั้นทันที
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      const slideIdx = Number(dot.getAttribute('data-slide-to'));
      goToSlide(slideIdx);
      restartAutoPlay();
    });
  });

  // ระบบเลื่อนสไลด์อัตโนมัติทุกๆ 5.5 วินาที
  function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(function () {
      goToSlide(currentIndex + 1);
    }, 5500);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
  }

  // เมื่อเอาเมาส์วางบนป้ายประกาศ ให้หยุดเลื่อนชั่วคราวเพื่อให้คนไข้สแกน QR Code หรืออ่านข้อความได้ทัน
  if (slidebarSection) {
    slidebarSection.addEventListener('mouseenter', stopAutoPlay);
    slidebarSection.addEventListener('mouseleave', startAutoPlay);
  }

  // เริ่มทำงานอัตโนมัติ
  startAutoPlay();
});
