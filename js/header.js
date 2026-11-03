/* ==========================================================================
   js/header.js - Single Source of Truth สำหรับ Header Bar
   URL สะอาด ปลอดภัย ไม่มี .html (Node.js Routing)
   ========================================================================== */

function renderSharedHeader() {
  return `
  <header class="site-header">
    <div class="header-container">

      <!-- 1. ฝั่งซ้าย: โลโก้โรงพยาบาลโคกศรีสุพรรณ -->
      <div class="header-logo-area">
        <a href="/" class="brand-logo-link" title="กลับสู่หน้าแรก โรงพยาบาลโคกศรีสุพรรณ">
          <img
            src="/assets/images/logo-ksp.svg"
            alt="ตราสัญลักษณ์ โรงพยาบาลโคกศรีสุพรรณ"
            class="brand-logo-mark"
          />
          <span class="brand-title-th">โรงพยาบาลโคกศรีสุพรรณ</span>
          <span class="brand-title-en">KHOKSRISUPHAN HOSPITAL</span>
        </a>
      </div>

      <!-- 2. แถวบน: ช่องค้นหา + เบอร์โทร + เบอร์ฉุกเฉิน + ภาษา -->
      <div class="header-top-row">

        <!-- 2.1 ช่องค้นหาข้อมูล -->
        <form class="header-search-form" action="/departments" method="get" role="search">
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

        <!-- 2.2 เบอร์โทรปกติ -->
        <a href="tel:026259000" class="quick-call-item is-normal" title="โทรติดต่อโรงพยาบาล">
          <svg class="quick-call-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24c1.12.37 2.33.57 3.58.57a1 1 0 01.99.77l.73 3.65a1 1 0 01-.29.93l-1.57 1.57a12.07 12.07 0 01-5.52-5.52l1.57-1.57a1 1 0 01.93-.29l3.65.73a1 1 0 01.77.99z" />
          </svg>
          <div class="quick-call-texts">
            <span class="quick-call-label">โทร</span>
            <span class="quick-call-number">02 625 9000</span>
          </div>
        </a>

        <!-- 2.3 เบอร์ฉุกเฉิน 24 ชม. -->
        <a href="tel:026340990" class="quick-call-item is-emergency" title="โทรสายด่วนฉุกเฉิน 24 ชั่วโมง">
          <svg class="quick-call-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83M12 22v-4M19.07 19.07l-2.83-2.83M22 12h-4M19.07 4.93l-2.83 2.83" />
            <circle cx="12" cy="12" r="4" fill="currentColor" />
          </svg>
          <div class="quick-call-texts">
            <span class="quick-call-label">ฉุกเฉิน</span>
            <span class="quick-call-number">02 634 0990</span>
          </div>
        </a>

        <!-- 2.4 ปุ่มเลือกภาษา -->
        <div class="header-lang-switch">
          <button type="button" class="lang-btn is-active" aria-label="เลือกภาษาไทย">
            <span class="lang-flag" aria-hidden="true">🇹🇭</span>
            <span class="lang-code">TH</span>
          </button>
        </div>

        <!-- 2.5 ปุ่มแฮมเบอร์เกอร์สำหรับจอมือถือ -->
        <button
          type="button"
          class="mobile-menu-toggle"
          aria-label="เปิด/ปิด แถบเมนูบนมือถือ"
          aria-expanded="false"
        >
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
          <span class="toggle-bar"></span>
        </button>

      </div>

      <!-- 3. แถวล่าง: เมนูหลัก 5 เมนู + ปุ่มเข้าสู่ระบบ (URL สะอาด ไม่มี .html) -->
      <div class="header-bottom-row">
        <nav class="main-nav" aria-label="เมนูหลักของเว็บไซต์">
          <ul class="main-nav-list">

            <!-- เมนูที่ 1: หน้าแรก -->
            <li class="nav-item">
              <a href="/" class="nav-link">หน้าแรก</a>
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
                <li><a href="/departments" class="dropdown-link">1. แผนกและคลินิก</a></li>
                <li><a href="/rooms" class="dropdown-link">2. ห้องพัก</a></li>
                <li><a href="/medical-documents" class="dropdown-link">3. ขอเอกสารทางการแพทย์</a></li>
                <li><a href="/facilities" class="dropdown-link">4. สิ่งอำนวยความสะดวก</a></li>
              </ul>
            </li>

            <!-- เมนูที่ 3: ข่าวสาร & กิจกรรม -->
            <li class="nav-item">
              <a href="/news" class="nav-link">ข่าวสาร &amp; กิจกรรม</a>
            </li>

            <!-- เมนูที่ 4: ดาวน์โหลดเอกสาร -->
            <li class="nav-item">
              <a href="/downloads" class="nav-link">ดาวน์โหลดเอกสาร</a>
            </li>

            <!-- เมนูที่ 5: เว็บไซต์ภายใน -->
            <li class="nav-item">
              <a href="/internal-websites" class="nav-link">เว็บไซต์ภายใน</a>
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
                <li><a href="/about-general" class="dropdown-link">1. ข้อมูลทั่วไปโรงพยาบาล</a></li>
                <li><a href="/vision-mission" class="dropdown-link">2. วิสัยทัศน์และพันธกิจ</a></li>
                <li><a href="/quality-awards" class="dropdown-link">3. มาตรฐานคุณภาพและรางวัลรับรอง</a></li>
                <li><a href="/policy" class="dropdown-link">4. ประกาศนโยบายโรงพยาบาล</a></li>
              </ul>
            </li>

            <!-- เมนูที่ 7: ติดต่อเรา -->
            <li class="nav-item">
              <a href="/contact" class="nav-link">ติดต่อเรา</a>
            </li>

          </ul>
        </nav>

        <!-- ปุ่มเข้าสู่ระบบ (สำหรับเจ้าหน้าที่เข้าสู่ระบบหลังบ้าน) -->
        <a href="/login" class="login-link"></a>
      </div>

    </div>
  </header>
  <br>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const headerPlaceholder = document.getElementById('header-placeholder');
  if (headerPlaceholder) {
    headerPlaceholder.innerHTML = renderSharedHeader();
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

  // Active Menu Highlight (ตรวจสอบจาก Route ปัจจุบัน ไม่มี .html)
  const currentPath = window.location.pathname.replace(/\/$/, '') || '/';
  const allNavLinks = document.querySelectorAll('.main-nav a, .login-link');

  allNavLinks.forEach(function (link) {
    link.classList.remove('is-active');
    const linkHref = link.getAttribute('href') || '';

    if (linkHref === currentPath || (currentPath === '/' && linkHref === '/')) {
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
