/* ==========================================================================
   ไฟล์ที่ 3: js/header.js
   หน้าที่สำคัญ (Single Source of Truth สำหรับ Header Bar):
     1. เก็บโค้ด HTML ของ Header Bar ไว้ที่ไฟล์นี้จุดเดียว!
     2. จัดเรียงตามรูปต้นแบบเป๊ะ (2 คอลัมน์ × 2 แถว) โดยใช้ข้อมูลเดิมของเว็บเรา:
        - ฝั่งซ้าย (กิน 2 แถว): โลโก้โรงพยาบาลโคกศรีสุพรรณ
        - แถวบน (ชิดขวา)    : [🔍 ค้นหา เช่น แพทย์, แพ็กเกจ...]  [📞 โทร 02 625 9000]  [🚨 ฉุกเฉิน 02 634 0990]  [🇹🇭 TH]
        - แถวล่าง (ชิดซ้ายต่อจากโลโก้): หน้าแรก | งานบริการ ⌄ | ข่าวสาร & กิจกรรม | เกี่ยวกับเรา ⌄ | ติดต่อเรา ... เข้าสู่ระบบ
   ========================================================================== */

function renderSharedHeader(rootPath) {
  return `
  <header class="site-header">
    <div class="header-container">

      <!-- =====================================================
           1. ฝั่งซ้าย: โลโก้โรงพยาบาลโคกศรีสุพรรณ (กินพื้นที่แนวตั้ง 2 แถว)
           ===================================================== -->
      <div class="header-logo-area">
        <a href="${rootPath}index.html" class="brand-logo-link" title="กลับสู่หน้าแรก โรงพยาบาลโคกศรีสุพรรณ">
          <img
            src="${rootPath}assets/images/logo-ksp.svg"
            alt="ตราสัญลักษณ์ โรงพยาบาลโคกศรีสุพรรณ"
            class="brand-logo-mark"
          />
          <span class="brand-title-th">โรงพยาบาลโคกศรีสุพรรณ</span>
          <span class="brand-title-en">KHOKSRISUPHAN HOSPITAL</span>
        </a>
      </div>

      <!-- =====================================================
           2. แถวบน (ชิดขวาตามรูป):
              [🔍 ช่องค้นหาขีดเส้นใต้] -> [📞 โทร 02 625 9000] -> [🚨 ฉุกเฉิน 02 634 0990] -> [🇹🇭 TH]
           ===================================================== -->
      <div class="header-top-row">

        <!-- 2.1 ช่องค้นหาข้อมูล (มีไอคอนแว่นขยาย + เส้นใต้บางๆ อยู่หน้าปุ่มโทรตามรูป) -->
        <form class="header-search-form" action="${rootPath}pages/departments.html" method="get" role="search">
          <button type="submit" class="search-submit-btn" aria-label="ค้นหาข้อมูล">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="6.5"></circle>
              <line x1="20" y1="20" x2="15.8" y2="15.8"></line>
            </svg>
          </button>
          <input
            type="search"
            name="q"
            class="search-input"
            placeholder="ค้นหา เช่น แพทย์, แพ็กเกจ, แผนกและคลินิก, เทคโนโลยีการรักษา"
            aria-label="ค้นหา เช่น แพทย์, แพ็กเกจ, แผนกและคลินิก, เทคโนโลยีการรักษา"
          />
        </form>

        <!-- 2.2 เบอร์โทรปกติ (โทร 02 625 9000) -->
        <a href="tel:026259000" class="quick-call-item is-normal" title="โทรติดต่อโรงพยาบาล">
          <svg class="quick-call-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.25.2 2.46.57 3.58a1 1 0 01-.25 1.01l-2.2 2.2z"></path>
          </svg>
          <div class="quick-call-text">
            <span class="quick-call-label">โทร</span>
            <span class="quick-call-number">02 625 9000</span>
          </div>
        </a>

        <!-- 2.3 เบอร์ฉุกเฉิน (ฉุกเฉิน 02 634 0990) -->
        <a href="tel:026340990" class="quick-call-item is-emergency" title="สายด่วนฉุกเฉิน 24 ชั่วโมง">
          <svg class="quick-call-icon" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <line x1="14" y1="2.5" x2="14" y2="5.2" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
            <line x1="6.2" y1="5.8" x2="8.2" y2="7.8" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
            <line x1="21.8" y1="5.8" x2="19.8" y2="7.8" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
            <line x1="2.8" y1="13.5" x2="5.5" y2="13.5" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
            <line x1="22.5" y1="13.5" x2="25.2" y2="13.5" stroke="#DC2626" stroke-width="2" stroke-linecap="round" />
            <path d="M8.5 19V13.5C8.5 10.46 10.96 8 14 8C17.04 8 19.5 10.46 19.5 13.5V19H8.5Z" fill="#DC2626" />
            <path d="M11.2 14.5C11.2 12.4 12.5 10.9 14.2 10.6" stroke="#FFFFFF" stroke-width="1.7" stroke-linecap="round" />
            <rect x="7" y="20.5" width="14" height="2.6" rx="1.2" fill="#DC2626" />
          </svg>
          <div class="quick-call-text">
            <span class="quick-call-label">ฉุกเฉิน</span>
            <span class="quick-call-number">02 634 0990</span>
          </div>
        </a>

        <!-- 2.4 ปุ่มเลือกภาษา [ 🇹🇭 TH ] -->
        <button type="button" class="lang-switch-btn" aria-label="เปลี่ยนภาษา (ปัจจุบัน: ภาษาไทย)">
          <span class="lang-flag-wrap">
            <svg class="lang-flag-icon" viewBox="0 0 36 36" aria-hidden="true">
              <rect width="36" height="6" y="0" fill="#ED1C24"></rect>
              <rect width="36" height="6" y="6" fill="#FFFFFF"></rect>
              <rect width="36" height="12" y="12" fill="#241D4F"></rect>
              <rect width="36" height="6" y="24" fill="#FFFFFF"></rect>
              <rect width="36" height="6" y="30" fill="#ED1C24"></rect>
            </svg>
          </span>
          <span>TH</span>
        </button>

        <!-- ปุ่มเปิดเมนูสำหรับจอมือถือ -->
        <button type="button" class="mobile-menu-toggle" aria-expanded="false" aria-label="เปิดเมนูหลัก">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
          <span>เมนู</span>
        </button>

      </div>

      <!-- =====================================================
           3. แถวล่าง (ชิดซ้ายต่อจากโลโก้ตามรูป):
              เมนูหลัก 5 เมนูเดิมของเว็บเรา + ปุ่มเข้าสู่ระบบ
           ===================================================== -->
      <div class="header-bottom-row">
        <nav class="main-nav" aria-label="เมนูหลักของเว็บไซต์">
          <ul class="main-nav-list">

            <!-- เมนูที่ 1: หน้าแรก -->
            <li class="nav-item">
              <a href="${rootPath}index.html" class="nav-link">หน้าแรก</a>
            </li>

            <!-- เมนูที่ 2: งานบริการ (มี Dropdown 4 เมนูย่อย) -->
            <li class="nav-item has-dropdown">
              <button type="button" class="nav-link dropdown-toggle" aria-expanded="false">
                <span>งานบริการ</span>
                <svg class="dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <ul class="dropdown-menu">
                <li><a href="${rootPath}pages/departments.html" class="dropdown-link">1. แผนกและคลินิก</a></li>
                <li><a href="${rootPath}pages/rooms.html" class="dropdown-link">2. ห้องพัก</a></li>
                <li><a href="${rootPath}pages/medical-documents.html" class="dropdown-link">3. ขอเอกสารทางการแพทย์</a></li>
                <li><a href="${rootPath}pages/facilities.html" class="dropdown-link">4. สิ่งอำนวยความสะดวก</a></li>
              </ul>
            </li>

            <!-- เมนูที่ 3: ข่าวสาร & กิจกรรม -->
            <li class="nav-item">
              <a href="${rootPath}pages/news.html" class="nav-link">ข่าวสาร &amp; กิจกรรม</a>
            </li>

            <!-- เมนูที่ 4: ดาวน์โหลดเอกสาร -->
            <li class="nav-item">
              <a href="${rootPath}pages/downloads.html" class="nav-link">ดาวน์โหลดเอกสาร</a>
            </li>

            <!-- เมนูที่ 5: เว็บไซต์ภายใน -->
            <li class="nav-item">
              <a href="${rootPath}pages/internal-websites.html" class="nav-link">เว็บไซต์ภายใน</a>
            </li>

            <!-- เมนูที่ 6: ข้อมูลโรงพยาบาล (มี Dropdown รายละเอียดองค์กร) -->
            <li class="nav-item has-dropdown">
              <button type="button" class="nav-link dropdown-toggle" aria-expanded="false">
                <span>ข้อมูลโรงพยาบาล</span>
                <svg class="dropdown-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>
              <ul class="dropdown-menu">
                <li><a href="${rootPath}pages/about-general.html" class="dropdown-link">1. ข้อมูลทั่วไปโรงพยาบาล</a></li>
                <li><a href="${rootPath}pages/vision-mission.html" class="dropdown-link">2. วิสัยทัศน์และพันธกิจ</a></li>
                <li><a href="${rootPath}pages/quality-awards.html" class="dropdown-link">3. มาตรฐานคุณภาพและรางวัลรับรอง</a></li>
                <li><a href="${rootPath}pages/policy.html" class="dropdown-link">4. ประกาศนโยบายโรงพยาบาล</a></li>
              </ul>
            </li>

            <!-- เมนูที่ 7: ติดต่อเรา -->
            <li class="nav-item">
              <a href="${rootPath}pages/contact.html" class="nav-link">ติดต่อเรา</a>
            </li>

          </ul>
        </nav>

        <!-- ปุ่มเข้าสู่ระบบ (สำหรับเจ้าหน้าที่เข้าสู่ระบบหลังบ้าน) -->
        <a href="${rootPath}pages/login.html" class="login-link"></a>
      </div>

    </div>
    
  </header>
   <br>
  `;
  
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = renderSharedHeader(rootPath);
  }

  const dropdownItems = document.querySelectorAll('.nav-item.has-dropdown');
  const siteHeader = document.querySelector('.site-header');
  const mobileToggleBtn = document.querySelector('.mobile-menu-toggle');

  function closeAllDropdowns(exceptItem = null) {
    dropdownItems.forEach(function (item) {
      if (item !== exceptItem) {
        item.classList.remove('is-open');
        const toggleBtn = item.querySelector('.dropdown-toggle');
        if (toggleBtn) {
          toggleBtn.setAttribute('aria-expanded', 'false');
        }
      }
    });
  }

  dropdownItems.forEach(function (item) {
    const toggleBtn = item.querySelector('.dropdown-toggle');

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function (event) {
        event.preventDefault();
        event.stopPropagation();

        const isCurrentlyOpen = item.classList.contains('is-open');
        closeAllDropdowns(item);

        if (isCurrentlyOpen) {
          item.classList.remove('is-open');
          toggleBtn.setAttribute('aria-expanded', 'false');
        } else {
          item.classList.add('is-open');
          toggleBtn.setAttribute('aria-expanded', 'true');
        }
      });
    }

    item.addEventListener('mouseenter', function () {
      if (window.innerWidth > 1080) {
        closeAllDropdowns(item);
        item.classList.add('is-open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'true');
      }
    });

    item.addEventListener('mouseleave', function () {
      if (window.innerWidth > 1080) {
        item.classList.remove('is-open');
        if (toggleBtn) toggleBtn.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-item.has-dropdown')) {
      closeAllDropdowns();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeAllDropdowns();
    }
  });

  if (mobileToggleBtn && siteHeader) {
    mobileToggleBtn.addEventListener('click', function () {
      const isOpen = siteHeader.classList.toggle('is-mobile-open');
      mobileToggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  const currentFile = normalizedPath.split('/').pop() || 'index.html';
  const allNavLinks = document.querySelectorAll('.main-nav a, .login-link');

  allNavLinks.forEach(function (link) {
    link.classList.remove('is-active');
    const linkHref = link.getAttribute('href') || '';
    const linkFile = linkHref.split('/').pop();

    if (linkFile === currentFile) {
      link.classList.add('is-active');

      const parentDropdown = link.closest('.nav-item.has-dropdown');
      if (parentDropdown) {
        const parentToggle = parentDropdown.querySelector('.dropdown-toggle');
        if (parentToggle) {
          parentToggle.classList.add('is-active');
        }
      }
    }
  });
});
