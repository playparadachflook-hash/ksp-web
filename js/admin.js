/* ==========================================================================
   ไฟล์: js/admin.js
   หน้าที่: ควบคุมระบบจัดการเว็บไซต์หลังบ้าน (Admin Back-Office CMS)
   รองรับ:
     1. เมนูเพิ่มสมาชิก (Member Management)
     2. เมนูจัดการข่าวสาร & กิจกรรม:
        - ใช้ JavaScript (HTML5 Canvas + Sharpening Filter) ปรับขนาดและเพิ่มความคมชัดภาพปกทุกครั้งที่เพิ่มภาพ
        - แสดงพรีวิวทันที และสามารถกดคลิกดูภาพขยายใหญ่ (Lightbox) ได้ทั้งตอนกำลังเพิ่มและหลังบันทึกแล้ว
     3. เมนูจัดการประกาศนโยบายโรงพยาบาล (แนบไฟล์เอกสาร + แนบรูปภาพประกาศ + วันที่ลงประกาศ + จำนวนคนเข้าดู)
     4. เมนูจัดการดาวน์โหลดเอกสาร (ลงไฟล์เอกสารจริง + คำนวณขนาด/ชนิดไฟล์อัตโนมัติ)
     5. จัดการสไลด์, ผู้บริหาร, แผนกและคลินิก, เว็บไซต์ภายใน, ติดต่อเรา
   ========================================================================== */

const DEFAULT_MEMBERS_LIST = [
  {
    username: 'admin',
    password: '1234',
    fullName: 'ผู้ดูแลระบบหลัก',
    role: 'กลุ่มงานสุขภาพดิจิทัล'
  }
];

document.addEventListener('DOMContentLoaded', function () {
  // 1. ตรวจสอบสิทธิ์การเข้าสู่ระบบ
  if (localStorage.getItem('ksp_admin_logged_in') !== 'true') {
    window.location.href = '/login';
    return;
  }

  const currentUser = localStorage.getItem('ksp_admin_user') || 'ผู้ดูแลระบบ';
  const welcomeEl = document.getElementById('admin-welcome-user');
  if (welcomeEl) {
    welcomeEl.textContent = 'ผู้เข้าใช้งานปัจจุบัน: ' + currentUser;
  }

  // =========================================================================
  // ระบบแจ้งเตือนอัจฉริยะ (Smart Toast Notifications & Confirmation Dialogs)
  // รองรับการแจ้งเตือนเมื่อ บันทึก / แก้ไข / ลบ ทุกส่วนของระบบหลังบ้าน
  // =========================================================================
  const toastContainer = document.getElementById('admin-toast-container');
  const toastEl = document.getElementById('admin-toast');

  /**
   * แสดง Toast Notification สำหรับ บันทึก / แก้ไข / ลบ
   * @param {Object} options
   * @param {'success'|'info'|'warning'|'danger'} [options.type='success'] - ประเภทการแจ้งเตือน
   * @param {string} options.title - หัวข้อแจ้งเตือน
   * @param {string} options.message - ข้อความรายละเอียด
   * @param {number} [options.duration=4000] - ระยะเวลาแสดงผล (ms)
   */
  function notify({ type = 'success', title = '', message = '', duration = 4000 }) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' น.';

    // ไอคอนตามประเภทการแจ้งเตือน
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    } else if (type === 'info') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === 'danger') {
      iconSvg = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`;
    }

    if (!toastContainer) {
      if (toastEl) {
        toastEl.textContent = `${title ? title + ': ' : ''}${message}`;
        toastEl.classList.add('is-visible');
        setTimeout(() => toastEl.classList.remove('is-visible'), duration);
      }
      return;
    }

    const card = document.createElement('div');
    card.className = `admin-toast-card is-${type}`;
    card.innerHTML = `
      <div class="admin-toast-icon">${iconSvg}</div>
      <div class="admin-toast-body">
        <div class="admin-toast-header">
          <span class="admin-toast-title">${title}</span>
          <span class="admin-toast-time">${timeStr}</span>
        </div>
        <p class="admin-toast-desc">${message}</p>
      </div>
      <button type="button" class="admin-toast-close" aria-label="ปิด">&times;</button>
      <div class="admin-toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    const closeBtn = card.querySelector('.admin-toast-close');
    function dismiss() {
      if (card.classList.contains('is-leaving')) return;
      card.classList.add('is-leaving');
      setTimeout(() => {
        if (card.parentNode) card.parentNode.removeChild(card);
      }, 300);
    }
    if (closeBtn) closeBtn.addEventListener('click', dismiss);

    const timer = setTimeout(dismiss, duration);
    card.addEventListener('mouseenter', () => clearTimeout(timer));

    toastContainer.appendChild(card);
  }

  // รองรับฟังก์ชันเก่า showToast
  function showToast(msg) {
    notify({ type: 'success', title: 'บันทึกสำเร็จ', message: msg });
  }

  // =========================================================================
  // ระบบ Modal ยืนยันการลบข้อมูล (Delete Confirmation Modal)
  // =========================================================================
  const confirmBackdrop = document.getElementById('admin-confirm-backdrop');
  const confirmTitleEl = document.getElementById('admin-confirm-title');
  const confirmDescEl = document.getElementById('admin-confirm-desc');
  const confirmIconWrap = document.getElementById('admin-confirm-icon-wrap');
  const confirmCancelBtn = document.getElementById('admin-confirm-cancel');
  const confirmOkBtn = document.getElementById('admin-confirm-ok');

  let activeConfirmResolver = null;

  /**
   * แสดงกล่องยืนยันการลบข้อมูลแบบ Custom สวยงาม
   * @param {Object} opts
   * @param {string} opts.title - หัวข้อกล่องยืนยัน
   * @param {string} opts.message - ข้อความอธิบาย
   * @param {string} [opts.confirmText="ยืนยันการลบ"] - ข้อความบนปุ่มยืนยัน
   * @param {string} [opts.cancelText="ยกเลิก"] - ข้อความบนปุ่มยกเลิก
   * @param {'danger'|'warning'} [opts.type='danger']
   * @returns {Promise<boolean>}
   */
  function showConfirmDialog({
    title = 'ยืนยันการลบข้อมูล',
    message = 'คุณแน่ใจหรือไม่ว่าต้องการลบรายการนี้?',
    confirmText = 'ยืนยันการลบ',
    cancelText = 'ยกเลิก',
    type = 'danger'
  }) {
    return new Promise((resolve) => {
      activeConfirmResolver = resolve;
      if (!confirmBackdrop) {
        resolve(window.confirm(`${title}\n\n${message}`));
        return;
      }

      if (confirmTitleEl) confirmTitleEl.textContent = title;
      if (confirmDescEl) confirmDescEl.textContent = message;
      if (confirmCancelBtn) confirmCancelBtn.textContent = cancelText;
      if (confirmOkBtn) {
        confirmOkBtn.textContent = confirmText;
        confirmOkBtn.className = type === 'danger' ? 'admin-btn admin-btn-danger' : 'admin-btn admin-btn-primary';
      }
      if (confirmIconWrap) {
        if (type === 'danger') {
          confirmIconWrap.className = 'admin-confirm-icon-wrap';
          confirmIconWrap.textContent = '🗑️';
        } else {
          confirmIconWrap.className = 'admin-confirm-icon-wrap is-warning';
          confirmIconWrap.textContent = '⚠️';
        }
      }

      confirmBackdrop.style.display = 'flex';
    });
  }

  function closeConfirmDialog(result) {
    if (confirmBackdrop) {
      confirmBackdrop.classList.add('is-closing');
      setTimeout(() => {
        confirmBackdrop.style.display = 'none';
        confirmBackdrop.classList.remove('is-closing');
      }, 200);
    }
    if (activeConfirmResolver) {
      activeConfirmResolver(result);
      activeConfirmResolver = null;
    }
  }

  if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', () => closeConfirmDialog(false));
  if (confirmOkBtn) confirmOkBtn.addEventListener('click', () => closeConfirmDialog(true));
  if (confirmBackdrop) {
    confirmBackdrop.addEventListener('click', (e) => {
      if (e.target === confirmBackdrop) closeConfirmDialog(false);
    });
  }

  // =========================================================================
  // ระบบเปิดดูรูปภาพขยายใหญ่ (HD Image Lightbox Modal ในหน้า Admin)
  // =========================================================================
  const lightboxBackdrop = document.getElementById('admin-lightbox-backdrop');
  const lightboxTitle = document.getElementById('admin-lightbox-title');
  const lightboxBadge = document.getElementById('admin-lightbox-badge');
  const lightboxBody = document.getElementById('admin-lightbox-body');
  const lightboxClose = document.getElementById('admin-lightbox-close');
  const lightboxOk = document.getElementById('admin-lightbox-ok');

  function openAdminLightbox(title, mainImgSrc, galleryList, badgeText) {
    if (!lightboxBackdrop || !lightboxBody) return;
    lightboxTitle.textContent = title || 'ดูรูปภาพขนาดเต็ม';
    lightboxBadge.textContent = badgeText || 'ตรวจสอบความคมชัดรูปภาพ (HD Image Viewer)';

    let galleryHtml = '';
    if (Array.isArray(galleryList) && galleryList.length > 0) {
      const itemsMarkup = galleryList.map(function (src, idx) {
        return `
          <div style="border-radius:10px;overflow:hidden;border:2px solid #e2e8f0;background:#fff;">
            <img
              src="${src}"
              alt="ภาพที่ ${idx + 1}"
              data-switch-lightbox-img="${src}"
              style="width:100%;height:130px;object-fit:cover;cursor:pointer;display:block;"
              title="คลิกเพื่อดูภาพนี้ขนาดเต็ม"
            />
            <div style="font-size:0.75rem;padding:4px 8px;color:#334155;font-weight:600;">ภาพที่ ${idx + 1} (คลิกเพื่อขยาย)</div>
          </div>
        `;
      }).join('');

      galleryHtml = `
        <div style="margin-top:18px;text-align:left;">
          <h4 style="font-size:0.95rem;font-weight:700;color:#145a4a;margin:0 0 10px;">
            รายการภาพในอัลบั้มทั้งหมด (${galleryList.length} ภาพ) — คลิกที่ภาพย่อยเพื่อสลับดูขนาดใหญ่:
          </h4>
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px;">
            ${itemsMarkup}
          </div>
        </div>
      `;
    }

    lightboxBody.innerHTML = `
      <div style="background:#0f172a;padding:12px;border-radius:12px;display:inline-block;max-width:100%;">
        <img
          id="admin-lightbox-main-img"
          src="${mainImgSrc}"
          alt="${title}"
          style="max-width:100%;max-height:62vh;width:auto;height:auto;object-fit:contain;border-radius:8px;display:block;margin:0 auto;"
        />
      </div>
      ${galleryHtml}
    `;

    lightboxBody.querySelectorAll('[data-switch-lightbox-img]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        const newSrc = thumb.getAttribute('data-switch-lightbox-img');
        const mainImg = document.getElementById('admin-lightbox-main-img');
        if (mainImg && newSrc) {
          mainImg.src = newSrc;
        }
      });
    });

    lightboxBackdrop.classList.add('is-open');
  }

  function closeAdminLightbox() {
    if (lightboxBackdrop) lightboxBackdrop.classList.remove('is-open');
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeAdminLightbox);
  if (lightboxOk) lightboxOk.addEventListener('click', closeAdminLightbox);
  if (lightboxBackdrop) {
    lightboxBackdrop.addEventListener('click', function (e) {
      if (e.target === lightboxBackdrop) closeAdminLightbox();
    });
  }

  // =========================================================================
  // ฟังก์ชัน JavaScript ปรับขนาดภาพให้ชัดเจน (HD Resampling + Unsharp Convolution)
  // =========================================================================
  /**
   * ปรับความคมชัดของพิกเซลบน Canvas ด้วย 3x3 Sharpen Filter (Unsharp Mask)
   */
  function applyCanvasSharpen(ctx, w, h, mix) {
    try {
      const imgData = ctx.getImageData(0, 0, w, h);
      const src = imgData.data;
      const out = ctx.createImageData(w, h);
      const dst = out.data;

      // Kernel เพิ่มความคมชัดของขอบภาพ: [0, -1, 0, -1, 5, -1, 0, -1, 0]
      for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
          const i = (y * w + x) * 4;
          const up = ((y - 1) * w + x) * 4;
          const dn = ((y + 1) * w + x) * 4;
          const lf = (y * w + (x - 1)) * 4;
          const rt = (y * w + (x + 1)) * 4;

          for (let c = 0; c < 3; c++) {
            const sharpVal = 5 * src[i + c] - src[up + c] - src[dn + c] - src[lf + c] - src[rt + c];
            const blended = src[i + c] * (1 - mix) + sharpVal * mix;
            dst[i + c] = Math.min(255, Math.max(0, Math.round(blended)));
          }
          dst[i + 3] = src[i + 3];
        }
      }
      ctx.putImageData(out, 0, 0);
    } catch (e) {
      // กรณีติด CORS ให้ข้ามการทำ Pixel Manipulation
    }
  }

  /**
   * อ่านไฟล์รูปภาพแล้วใช้ JavaScript ปรับขนาดเป็น HD + เร่งความคมชัดอัตโนมัติ
   * @param {File} file ไฟล์รูปภาพที่เลือก
   * @param {Object} opts ตัวเลือก { mode: 'cover' | 'fit', width: 1200, height: 750, sharpen: 0.25 }
   */
  function enhanceImageFileWithJS(file, opts) {
    const options = Object.assign(
      { mode: 'cover', width: 1200, height: 750, sharpen: 0.26, quality: 0.92 },
      opts || {}
    );

    return new Promise(function (resolve) {
      if (!file) {
        resolve(null);
        return;
      }

      const reader = new FileReader();
      reader.onload = function (e) {
        const rawDataUrl = e.target.result;
        if (!file.type || !file.type.startsWith('image/')) {
          resolve({ dataUrl: rawDataUrl, width: 0, height: 0 });
          return;
        }

        const img = new Image();
        img.onload = function () {
          const canvas = document.createElement('canvas');
          let targetW = options.width;
          let targetH = options.height;

          if (options.mode === 'cover') {
            // บังคับสัดส่วนภาพปกมาตรฐาน HD (1200 x 750 px = 16:10) เพื่อให้กรอบการ์ดข่าวชัดเป๊ะทุกใบ
            canvas.width = targetW;
            canvas.height = targetH;
            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.filter = 'contrast(1.05) saturate(1.06) brightness(1.01)';

            const scale = Math.max(targetW / img.width, targetH / img.height);
            const scaledW = img.width * scale;
            const scaledH = img.height * scale;
            const offsetX = (targetW - scaledW) / 2;
            const offsetY = (targetH - scaledH) / 2;

            ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
            ctx.filter = 'none';
            applyCanvasSharpen(ctx, targetW, targetH, options.sharpen);
          } else {
            // โหมดรักษาสัดส่วนภาพเดิม แต่ปรับขนาดให้คมชัดระดับ HD
            const maxDim = options.width || 1280;
            const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1.5);
            targetW = Math.round(img.width * ratio);
            targetH = Math.round(img.height * ratio);
            canvas.width = targetW;
            canvas.height = targetH;

            const ctx = canvas.getContext('2d');
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.filter = 'contrast(1.04) saturate(1.05)';
            ctx.drawImage(img, 0, 0, targetW, targetH);
            ctx.filter = 'none';
            applyCanvasSharpen(ctx, targetW, targetH, options.sharpen);
          }

          const finalDataUrl = canvas.toDataURL('image/jpeg', options.quality);
          resolve({
            dataUrl: finalDataUrl,
            width: targetW,
            height: targetH
          });
        };
        img.onerror = function () {
          resolve({ dataUrl: rawDataUrl, width: 0, height: 0 });
        };
        img.src = rawDataUrl;
      };
      reader.onerror = function () {
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }

  // ฟังก์ชันอ่านไฟล์ทั่วไป (เช่น PDF / Word) เป็น Base64 DataURL
  function readFileAsDataURL(fileInput) {
    return new Promise(function (resolve) {
      if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        resolve(null);
        return;
      }
      const reader = new FileReader();
      reader.onload = function (e) {
        resolve(e.target.result);
      };
      reader.onerror = function () {
        resolve(null);
      };
      reader.readAsDataURL(fileInput.files[0]);
    });
  }

  // แปลงขนาดไฟล์ Bytes เป็น KB หรือ MB อ่านง่าย
  function formatFileSize(bytes) {
    if (!bytes) return '250 KB';
    const kb = bytes / 1024;
    if (kb < 1024) {
      return Math.max(1, Math.round(kb)) + ' KB';
    }
    return (kb / 1024).toFixed(2) + ' MB';
  }

  // 2. ระบบสลับแท็บเมนูฝั่งซ้าย
  const navBtns = document.querySelectorAll('.admin-nav-btn');
  const tabPanes = document.querySelectorAll('.admin-tab-pane');

  navBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetTab = btn.getAttribute('data-tab');
      navBtns.forEach(function (b) {
        b.classList.toggle('is-active', b === btn);
      });
      tabPanes.forEach(function (pane) {
        pane.classList.toggle('is-active', pane.id === 'tab-' + targetTab);
      });
    });
  });

  // ปุ่มออกจากระบบ
  const logoutBtn = document.getElementById('admin-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      localStorage.removeItem('ksp_admin_logged_in');
      window.location.href = '/login';
    });
  }

  // ปุ่มคืนค่าเริ่มต้นทั้งหมด
  const resetAllBtn = document.getElementById('admin-reset-all-btn');
  if (resetAllBtn) {
    resetAllBtn.addEventListener('click', async function () {
      const confirmed = await showConfirmDialog({
        title: 'ยืนยันการคืนค่าเริ่มต้นทั้งหมด',
        message: 'ต้องการคืนค่าข้อมูลทุกส่วนกลับเป็นค่าเริ่มต้นของโรงพยาบาลใช่หรือไม่? ข้อมูลทั้งหมดที่แก้ไขจะถูกรีเซ็ต',
        confirmText: 'คืนค่าเริ่มต้นทั้งหมด',
        type: 'warning'
      });
      if (confirmed) {
        window.KSP_CMS.resetAll();
        notify({
          type: 'warning',
          title: 'คืนค่าเริ่มต้นสำเร็จ',
          message: 'คืนค่าข้อมูลทุกส่วนกลับเป็นค่าเริ่มต้นเรียบร้อยแล้ว กำลังรีโหลดหน้าจอ...',
          duration: 3000
        });
        setTimeout(() => window.location.reload(), 1200);
      }
    });
  }

  // =========================================================================
  // เมนูที่ 1: เพิ่มสมาชิก / จัดการผู้ใช้งานระบบหลังบ้าน (รองรับ บันทึก / แก้ไข / ลบ พร้อมระบบความปลอดภัยรหัสผ่าน)
  // =========================================================================
  let membersData = window.KSP_CMS.getSection('members', DEFAULT_MEMBERS_LIST);
  const membersListEl = document.getElementById('admin-members-list');
  const memberForm = document.getElementById('form-add-member');
  const memberFormTitle = document.getElementById('member-form-title');
  const memberEditIndexInput = document.getElementById('member-edit-index');
  const memberSubmitBtn = document.getElementById('member-submit-btn');
  const memberCancelBtn = document.getElementById('member-cancel-btn');
  const btnRandomMemberPass = document.getElementById('btn-random-member-pass');
  const btnToggleMemberPass = document.getElementById('btn-toggle-member-pass');
  let currentEditingMemberPassword = null;

  /**
   * สุ่มอักขระพิเศษแทนการแสดงรหัสผ่านจริงเสมอ (เช่น *#@!&$%^~*?)
   * เพื่อความปลอดภัยสูงสุดในทุกเมนู ไม่แสดงรหัสผ่านจริงสู่หน้าจอ
   */
  function getRandomSpecialMask(len) {
    const specialSymbols = ['*', '#', '@', '&', '%', '$', '!', '~', '^', '?', '•'];
    const count = len || 10;
    let res = '';
    for (let i = 0; i < count; i++) {
      res += specialSymbols[Math.floor(Math.random() * specialSymbols.length)];
    }
    return res;
  }

  /**
   * สุ่มรหัสผ่านใหม่ที่มีอักขระพิเศษความปลอดภัยสูง
   */
  function generateStrongRandomPassword() {
    const specials = ['@', '#', '$', '!', '%', '&', '*', '^', '~'];
    const lowers = 'abcdefghijkmnpqrstuvwxyz';
    const uppers = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const numbers = '23456789';

    let pass = '';
    pass += uppers[Math.floor(Math.random() * uppers.length)];
    pass += lowers[Math.floor(Math.random() * lowers.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += specials[Math.floor(Math.random() * specials.length)];
    pass += uppers[Math.floor(Math.random() * uppers.length)];
    pass += lowers[Math.floor(Math.random() * lowers.length)];
    pass += numbers[Math.floor(Math.random() * numbers.length)];
    pass += specials[Math.floor(Math.random() * specials.length)];
    pass += lowers[Math.floor(Math.random() * lowers.length)];
    pass += specials[Math.floor(Math.random() * specials.length)];

    return pass.split('').sort(() => Math.random() - 0.5).join('');
  }

  // ปุ่มสุ่มรหัสผ่านที่มีอักขระพิเศษ
  if (btnRandomMemberPass) {
    btnRandomMemberPass.addEventListener('click', function () {
      const strongPass = generateStrongRandomPassword();
      const passInput = document.getElementById('member-password');
      if (passInput) {
        passInput.value = strongPass;
        passInput.dataset.originalMask = '';
        passInput.type = 'text'; // แสดงรหัสผ่านที่สุ่มให้ผู้ดูแลเห็นชั่วคราว
        if (btnToggleMemberPass) btnToggleMemberPass.textContent = '🙈';

        notify({
          type: 'info',
          title: 'สุ่มรหัสผ่านอักขระพิเศษสำเร็จ!',
          message: 'สร้างรหัสผ่านใหม่ที่มีอักขระพิเศษความปลอดภัยสูงเรียบร้อยแล้ว'
        });

        // หลังจาก 4 วินาที จะเปลี่ยนกลับเป็นโหมดซ่อนอัตโนมัติ
        setTimeout(function () {
          if (passInput.type === 'text') {
            passInput.type = 'password';
            if (btnToggleMemberPass) btnToggleMemberPass.textContent = '👁️';
          }
        }, 4000);
      }
    });
  }

  // ปุ่มสลับการซ่อน/แสดงรหัสผ่าน
  if (btnToggleMemberPass) {
    btnToggleMemberPass.addEventListener('click', function () {
      const passInput = document.getElementById('member-password');
      if (!passInput) return;
      if (passInput.type === 'password') {
        passInput.type = 'text';
        btnToggleMemberPass.textContent = '🙈';
        btnToggleMemberPass.title = 'ซ่อนรหัสผ่าน';
      } else {
        passInput.type = 'password';
        btnToggleMemberPass.textContent = '👁️';
        btnToggleMemberPass.title = 'แสดงรหัสผ่าน';
      }
    });
  }

  function resetMemberForm() {
    if (memberForm) {
      memberForm.reset();
      memberForm.classList.remove('is-editing');
    }
    if (memberEditIndexInput) memberEditIndexInput.value = '';
    if (memberFormTitle) memberFormTitle.textContent = '+ เพิ่มสมาชิกใหม่';
    if (memberSubmitBtn) memberSubmitBtn.textContent = 'บันทึกสมาชิกใหม่';
    if (memberCancelBtn) memberCancelBtn.style.display = 'none';

    currentEditingMemberPassword = null;
    const passInput = document.getElementById('member-password');
    if (passInput) {
      passInput.value = '';
      passInput.type = 'password';
      passInput.dataset.originalMask = '';
      passInput.setAttribute('placeholder', '•••••••••••• (สุ่มอักขระพิเศษแทนรหัสจริง)');
      passInput.required = true;
    }
    if (btnToggleMemberPass) btnToggleMemberPass.textContent = '👁️';
  }

  if (memberCancelBtn) {
    memberCancelBtn.addEventListener('click', function () {
      resetMemberForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มสมาชิกใหม่'
      });
    });
  }

  function renderAdminMembers() {
    if (!membersListEl) return;
    membersListEl.innerHTML = membersData.map(function (member, idx) {
      const isDefaultAdmin = member.username === 'admin' && idx === 0;
      // โชว์อักขระพิเศษแบบ Random แทนการแสดงรหัสจริงเสมอ
      const maskedPassword = getRandomSpecialMask(member.password ? member.password.length : 10);
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <div class="admin-list-text">
              <p class="admin-list-title">${member.fullName} (Username: <code>${member.username}</code>)</p>
              <p class="admin-list-sub">กลุ่มงาน/สิทธิ์: <strong>${member.role}</strong> | รหัสผ่าน: <code class="admin-pass-mask" title="รหัสผ่านถูกซ่อนด้วยอักขระพิเศษแบบสุ่มเสมอ">${maskedPassword}</code></p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-edit-member="${idx}">แก้ไข</button>
            ${
              isDefaultAdmin
                ? '<span style="font-size:0.78rem;color:#1f5a50;font-weight:600;padding:0 8px;">บัญชีหลัก</span>'
                : `<button type="button" class="admin-btn admin-btn-danger" data-del-member="${idx}">ลบ</button>`
            }
          </div>
        </div>
      `;
    }).join('');

    // ปุ่มแก้ไขข้อมูลสมาชิก
    membersListEl.querySelectorAll('[data-edit-member]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-member'));
        const member = membersData[idx];
        if (!member) return;

        if (memberEditIndexInput) memberEditIndexInput.value = idx;
        document.getElementById('member-username').value = member.username || '';
        document.getElementById('member-fullname').value = member.fullName || '';
        document.getElementById('member-role').value = member.role || 'ผู้ดูแลระบบ (Admin)';

        // เก็บรหัสผ่านเดิมไว้ และใส่อักขระพิเศษแบบสุ่มลงในช่องแทนรหัสจริงเสมอ
        currentEditingMemberPassword = member.password || '';
        const passInput = document.getElementById('member-password');
        if (passInput) {
          const randomMask = getRandomSpecialMask(10);
          passInput.value = randomMask;
          passInput.dataset.originalMask = randomMask;
          passInput.type = 'password';
          passInput.setAttribute('placeholder', '•••••••••••• (สุ่มอักขระพิเศษแทนรหัสจริง — เว้นไว้หากใช้รหัสเดิม)');
          passInput.required = false;
        }
        if (btnToggleMemberPass) btnToggleMemberPass.textContent = '👁️';

        if (memberFormTitle) memberFormTitle.textContent = `✎ แก้ไขข้อมูลสมาชิก: ${member.fullName}`;
        if (memberSubmitBtn) memberSubmitBtn.textContent = 'บันทึกการแก้ไขสมาชิก';
        if (memberCancelBtn) memberCancelBtn.style.display = 'inline-block';
        if (memberForm) {
          memberForm.classList.add('is-editing');
          memberForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขข้อมูลสมาชิก "${member.fullName}" (${member.username})`
        });
      });
    });

    // ปุ่มลบสมาชิก (มี Modal ยืนยันก่อนลบ)
    membersListEl.querySelectorAll('[data-del-member]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-member'));
        const targetMember = membersData[idx];
        if (!targetMember) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบสมาชิก',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบบัญชีผู้ใช้ "${targetMember.fullName}" (Username: ${targetMember.username}) ออกจากระบบ? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedName = targetMember.fullName;
        membersData.splice(idx, 1);
        await window.KSP_CMS.saveSection('members', 'สมาชิกผู้ดูแลระบบ', membersData, '../');
        renderAdminMembers();
        resetMemberForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบบัญชีผู้ใช้ "${deletedName}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminMembers();

  if (memberForm) {
    memberForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('member-username').value.trim();
      const passInput = document.getElementById('member-password');
      let password = passInput ? passInput.value.trim() : '';
      const fullName = document.getElementById('member-fullname').value.trim();
      const role = document.getElementById('member-role').value;
      const editIdxStr = memberEditIndexInput ? memberEditIndexInput.value : '';

      // กรณีแก้ไข: หากไม่ได้เปลี่ยนรหัส หรือยังเป็นอักขระพิเศษสุ่มเดิม ให้ใช้รหัสเดิม
      if (editIdxStr !== '') {
        const editIdx = Number(editIdxStr);
        if (!password || (passInput && passInput.dataset && password === passInput.dataset.originalMask)) {
          password = currentEditingMemberPassword || membersData[editIdx].password;
        }

        // ตรวจสอบ username ซ้ำกับคนอื่นที่ไม่ใช่ตัวเอง
        const duplicate = membersData.some(function (m, idx) {
          return idx !== editIdx && m.username.toLowerCase() === username.toLowerCase();
        });
        if (duplicate) {
          notify({
            type: 'warning',
            title: 'ชื่อผู้ใช้งานซ้ำ',
            message: 'ชื่อผู้ใช้งาน (Username) นี้ถูกใช้งานแล้ว กรุณาระบุชื่ออื่น'
          });
          return;
        }

        membersData[editIdx] = {
          username: username,
          password: password,
          fullName: fullName,
          role: role
        };

        await window.KSP_CMS.saveSection('members', 'สมาชิกผู้ดูแลระบบ', membersData, '../');
        resetMemberForm();
        renderAdminMembers();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตข้อมูลสมาชิก "${fullName}" สำเร็จเรียบร้อย`
        });
      } else {
        // --- กรณีเพิ่มสมาชิกใหม่ ---
        if (membersData.some(function (m) { return m.username.toLowerCase() === username.toLowerCase(); })) {
          notify({
            type: 'warning',
            title: 'ชื่อผู้ใช้งานซ้ำ',
            message: 'ชื่อผู้ใช้งาน (Username) นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่น'
          });
          return;
        }

        // หากผู้ใช้ไม่ได้ระบุรหัสผ่าน ให้สุ่มรหัสผ่านอักขระพิเศษให้อัตโนมัติ
        if (!password) {
          password = generateStrongRandomPassword();
        }

        membersData.push({
          username: username,
          password: password,
          fullName: fullName,
          role: role
        });

        await window.KSP_CMS.saveSection('members', 'สมาชิกผู้ดูแลระบบ', membersData, '../');
        resetMemberForm();
        renderAdminMembers();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `เพิ่มสมาชิกใหม่ "${fullName}" เรียบร้อย สามารถใช้เข้าสู่ระบบได้ทันที`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 2: จัดการข่าวสาร & กิจกรรม (ปรับขนาดภาพปกให้ชัดด้วย JS + กดดูภาพที่เพิ่มได้)
  // =========================================================================
  let newsData = window.KSP_CMS.getSection('news', DEFAULT_NEWS_LIST);
  const newsListEl = document.getElementById('admin-news-list');

  // ตัวแปรเก็บภาพปกและภาพงานที่ผ่านการปรับความคมชัดด้วย JS แล้ว
  let pendingEnhancedCoverUrl = null;
  let pendingEnhancedGalleryUrls = [];

  const newsCoverInput = document.getElementById('news-cover-file');
  const newsCoverPreviewBox = document.getElementById('news-cover-preview-box');
  const newsCoverPreviewImg = document.getElementById('news-cover-preview-img');
  const newsCoverStatus = document.getElementById('news-cover-status');

  const newsGalleryInput = document.getElementById('news-gallery-files');
  const newsGalleryPreviewBox = document.getElementById('news-gallery-preview-box');
  const newsGalleryPreviewGrid = document.getElementById('news-gallery-preview-grid');
  const newsGalleryStatus = document.getElementById('news-gallery-status');

  // เมื่อเลือก "ภาพปกข่าว": ใช้ JavaScript ปรับขนาดเป็น 1200x750 HD และเพิ่มความคมชัดทันที + คลิกดูภาพได้
  if (newsCoverInput) {
    newsCoverInput.addEventListener('change', async function () {
      const file = newsCoverInput.files && newsCoverInput.files[0];
      if (!file) {
        pendingEnhancedCoverUrl = null;
        if (newsCoverPreviewBox) newsCoverPreviewBox.style.display = 'none';
        return;
      }

      if (newsCoverStatus) {
        newsCoverStatus.textContent = 'กำลังปรับขนาดและเพิ่มความคมชัดภาพปกด้วย JavaScript...';
      }
      if (newsCoverPreviewBox) newsCoverPreviewBox.style.display = 'block';

      const result = await enhanceImageFileWithJS(file, {
        mode: 'cover',
        width: 1200,
        height: 750,
        sharpen: 0.28,
        quality: 0.92
      });

      if (result && result.dataUrl) {
        pendingEnhancedCoverUrl = result.dataUrl;
        newsCoverPreviewImg.src = result.dataUrl;
        newsCoverStatus.textContent = `✓ ปรับขนาดภาพปก (${result.width}×${result.height} px) และเพิ่มความคมชัด HD เรียบร้อย — คลิกที่ภาพเพื่อขยายดู`;
      }
    });
  }

  // คลิกที่พรีวิวภาพปกเพื่อเปิดดูขนาดใหญ่เต็มตา
  if (newsCoverPreviewImg) {
    newsCoverPreviewImg.addEventListener('click', function () {
      if (!pendingEnhancedCoverUrl) return;
      openAdminLightbox(
        'ภาพปกข่าวที่ผ่านการปรับความคมชัด HD ด้วย JavaScript',
        pendingEnhancedCoverUrl,
        pendingEnhancedGalleryUrls,
        'ภาพปกข่าวความละเอียดสูง (1200×750 px)'
      );
    });
  }

  // เมื่อเลือก "ภาพงานทั้งหมด": ใช้ JavaScript ปรับขนาดและความคมชัดทุกภาพ + แสดง Thumbnail ให้คลิกดูได้
  if (newsGalleryInput) {
    newsGalleryInput.addEventListener('change', async function () {
      const files = newsGalleryInput.files ? Array.from(newsGalleryInput.files) : [];
      if (files.length === 0) {
        pendingEnhancedGalleryUrls = [];
        if (newsGalleryPreviewBox) newsGalleryPreviewBox.style.display = 'none';
        return;
      }

      if (newsGalleryPreviewBox) newsGalleryPreviewBox.style.display = 'block';
      if (newsGalleryStatus) {
        newsGalleryStatus.textContent = `กำลังปรับความคมชัดภาพงานทั้งหมด ${files.length} ภาพ...`;
      }

      const enhancedResults = await Promise.all(
        files.map(function (f) {
          return enhanceImageFileWithJS(f, {
            mode: 'fit',
            width: 1280,
            sharpen: 0.22,
            quality: 0.9
          });
        })
      );

      pendingEnhancedGalleryUrls = enhancedResults
        .filter(Boolean)
        .map(function (r) { return r.dataUrl; });

      if (newsGalleryStatus) {
        newsGalleryStatus.textContent = `✓ ปรับความคมชัดภาพงานทั้งหมด ${pendingEnhancedGalleryUrls.length} ภาพเรียบร้อย — คลิกที่รูปใดก็ได้เพื่อดูภาพขยายใหญ่`;
      }

      if (newsGalleryPreviewGrid) {
        newsGalleryPreviewGrid.innerHTML = pendingEnhancedGalleryUrls.map(function (url, idx) {
          return `
            <div class="admin-gallery-preview-item" data-preview-gallery-idx="${idx}" title="คลิกเพื่อดูภาพที่ ${idx + 1} ขนาดเต็ม">
              <img src="${url}" alt="ภาพงานที่ ${idx + 1}" />
            </div>
          `;
        }).join('');

        newsGalleryPreviewGrid.querySelectorAll('[data-preview-gallery-idx]').forEach(function (itemEl) {
          itemEl.addEventListener('click', function () {
            const gIdx = Number(itemEl.getAttribute('data-preview-gallery-idx'));
            openAdminLightbox(
              `ภาพบรรยากาศงาน (ภาพที่ ${gIdx + 1} จาก ${pendingEnhancedGalleryUrls.length} ภาพ)`,
              pendingEnhancedGalleryUrls[gIdx],
              pendingEnhancedGalleryUrls,
              'ตรวจสอบภาพงานที่เพิ่ม'
            );
          });
        });
      }
    });
  }

  const newsForm = document.getElementById('form-add-news');
  const newsFormTitle = document.getElementById('news-form-title');
  const newsEditIndexInput = document.getElementById('news-edit-index');
  const newsSubmitBtn = document.getElementById('news-submit-btn');
  const newsCancelBtn = document.getElementById('news-cancel-btn');

  function resetNewsForm() {
    if (newsForm) {
      newsForm.reset();
      newsForm.classList.remove('is-editing');
    }
    pendingEnhancedCoverUrl = null;
    pendingEnhancedGalleryUrls = [];
    if (newsEditIndexInput) newsEditIndexInput.value = '';
    if (newsFormTitle) newsFormTitle.textContent = '+ เพิ่มข่าวสาร/กิจกรรมใหม่';
    if (newsSubmitBtn) newsSubmitBtn.textContent = 'บันทึกข่าวสารพร้อมอัลบั้มภาพงาน';
    if (newsCancelBtn) newsCancelBtn.style.display = 'none';
    if (newsCoverPreviewBox) newsCoverPreviewBox.style.display = 'none';
    if (newsGalleryPreviewBox) newsGalleryPreviewBox.style.display = 'none';
  }

  if (newsCancelBtn) {
    newsCancelBtn.addEventListener('click', function () {
      resetNewsForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มข่าวสารใหม่'
      });
    });
  }

  function resolveAdminImgPath(imgPath) {
    if (!imgPath) return '../assets/images/news/news-1.png';
    if (imgPath.startsWith('data:') || imgPath.startsWith('http')) return imgPath;
    return '../' + imgPath;
  }

  function renderAdminNews() {
    if (!newsListEl) return;
    newsListEl.innerHTML = newsData.map(function (item, idx) {
      const thumbSrc = resolveAdminImgPath(item.image);
      const galleryCount = Array.isArray(item.gallery) ? item.gallery.length : 1;
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <img
              src="${thumbSrc}"
              alt="${item.title}"
              class="admin-list-thumb"
              data-view-news="${idx}"
              title="คลิกเพื่อดูภาพปกและภาพงานทั้งหมด"
            />
            <div class="admin-list-text">
              <p class="admin-list-title">${item.title}</p>
              <p class="admin-list-sub">ภาพปก HD 1 ภาพ | ภาพงานทั้งหมด ${galleryCount} ภาพ — ${(item.excerpt || '').substring(0, 65)}...</p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-view-news="${idx}">ดูภาพ (${galleryCount})</button>
            <button type="button" class="admin-btn admin-btn-outline" data-edit-news="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-news="${idx}">ลบ</button>
          </div>
        </div>
      `;
    }).join('');

    // ปุ่มคลิกดูภาพปกและภาพงานทั้งหมดของแต่ละข่าว
    newsListEl.querySelectorAll('[data-view-news]').forEach(function (el) {
      el.addEventListener('click', function () {
        const idx = Number(el.getAttribute('data-view-news'));
        const item = newsData[idx];
        if (!item) return;
        const coverSrc = resolveAdminImgPath(item.image);
        const galleryArr = (Array.isArray(item.gallery) && item.gallery.length > 0 ? item.gallery : [item.image]).map(resolveAdminImgPath);
        openAdminLightbox(item.title, coverSrc, galleryArr, 'ภาพปกข่าว & อัลบั้มภาพงานทั้งหมด');
      });
    });

    // ปุ่มเข้าสู่โหมดแก้ไขข่าวสาร
    newsListEl.querySelectorAll('[data-edit-news]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-news'));
        const item = newsData[idx];
        if (!item) return;

        if (newsEditIndexInput) newsEditIndexInput.value = idx;
        document.getElementById('news-title').value = item.title || '';
        document.getElementById('news-excerpt').value = item.excerpt || '';

        // แสดงพรีวิวภาพปกเดิม
        pendingEnhancedCoverUrl = item.image || null;
        if (pendingEnhancedCoverUrl && newsCoverPreviewBox && newsCoverPreviewImg) {
          newsCoverPreviewImg.src = resolveAdminImgPath(pendingEnhancedCoverUrl);
          if (newsCoverStatus) newsCoverStatus.textContent = '✓ ภาพปกข่าวปัจจุบัน (หากต้องการเปลี่ยนให้เลือกไฟล์ใหม่)';
          newsCoverPreviewBox.style.display = 'block';
        }

        // แสดงพรีวิวภาพงานเดิม
        pendingEnhancedGalleryUrls = Array.isArray(item.gallery) ? item.gallery : (item.image ? [item.image] : []);
        if (pendingEnhancedGalleryUrls.length > 0 && newsGalleryPreviewBox && newsGalleryPreviewGrid) {
          if (newsGalleryStatus) newsGalleryStatus.textContent = `✓ ภาพงานปัจจุบันทั้งหมด ${pendingEnhancedGalleryUrls.length} ภาพ`;
          newsGalleryPreviewGrid.innerHTML = pendingEnhancedGalleryUrls.map(function (url, gIdx) {
            return `
              <div class="admin-gallery-preview-item" data-preview-gallery-idx="${gIdx}" title="คลิกเพื่อดูภาพที่ ${gIdx + 1} ขนาดเต็ม">
                <img src="${resolveAdminImgPath(url)}" alt="ภาพงานที่ ${gIdx + 1}" />
              </div>
            `;
          }).join('');
          newsGalleryPreviewBox.style.display = 'block';
        }

        if (newsFormTitle) newsFormTitle.textContent = `✎ แก้ไขข่าวสาร: ${item.title}`;
        if (newsSubmitBtn) newsSubmitBtn.textContent = 'บันทึกการแก้ไขข่าวสาร';
        if (newsCancelBtn) newsCancelBtn.style.display = 'inline-block';
        if (newsForm) {
          newsForm.classList.add('is-editing');
          newsForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขข่าวสาร: "${item.title}"`
        });
      });
    });

    // ปุ่มลบข่าวสาร (มี Modal ยืนยันก่อนลบ)
    newsListEl.querySelectorAll('[data-del-news]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-news'));
        const targetItem = newsData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบข่าวสาร',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบข่าวสาร "${targetItem.title}" ออกจากเว็บไซต์? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        newsData.splice(idx, 1);
        await window.KSP_CMS.saveSection('news', 'ข่าวสารและกิจกรรม', newsData, '../');
        renderAdminNews();
        resetNewsForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบข่าวสาร "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminNews();

  if (newsForm) {
    newsForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const title = document.getElementById('news-title').value.trim();
      const excerpt = document.getElementById('news-excerpt').value.trim();
      const editIdxStr = newsEditIndexInput ? newsEditIndexInput.value : '';

      // หากผู้ใช้เลือกไฟล์ใหม่ไว้แต่ยังไม่ได้ประมวลผล ให้ประมวลผลด้วย JS ก่อนบันทึก
      if (!pendingEnhancedCoverUrl && newsCoverInput && newsCoverInput.files && newsCoverInput.files[0]) {
        const r = await enhanceImageFileWithJS(newsCoverInput.files[0], { mode: 'cover', width: 1200, height: 750 });
        if (r) pendingEnhancedCoverUrl = r.dataUrl;
      }

      const finalCover = pendingEnhancedCoverUrl || (pendingEnhancedGalleryUrls[0] || 'assets/images/news/news-1.png');
      const finalGallery = pendingEnhancedGalleryUrls.length > 0 ? pendingEnhancedGalleryUrls : [finalCover];

      if (editIdxStr !== '') {
        // --- กรณีบันทึกการแก้ไขข่าวสารเดิม ---
        const editIdx = Number(editIdxStr);
        newsData[editIdx] = {
          image: finalCover,
          gallery: finalGallery,
          title: title,
          excerpt: excerpt,
          link: '/news'
        };

        await window.KSP_CMS.saveSection('news', 'ข่าวสารและกิจกรรม', newsData, '../');
        resetNewsForm();
        renderAdminNews();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตข้อมูลข่าวสาร "${title}" เรียบร้อยแล้ว`
        });
      } else {
        // --- กรณีเพิ่มข่าวสารใหม่ ---
        newsData.unshift({
          image: finalCover,
          gallery: finalGallery,
          title: title,
          excerpt: excerpt,
          link: '/news'
        });

        await window.KSP_CMS.saveSection('news', 'ข่าวสารและกิจกรรม', newsData, '../');
        resetNewsForm();
        renderAdminNews();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `บันทึกข่าวสาร "${title}" พร้อมภาพ HD (${finalGallery.length} ภาพ) สำเร็จเรียบร้อย`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 3: จัดการประกาศนโยบายโรงพยาบาล (แนบไฟล์เอกสาร + แนบรูปภาพประกาศ + วันที่ + ยอดวิว)
  // =========================================================================
  let policyData = window.KSP_CMS.getSection('policies', DEFAULT_POLICY_ANNOUNCEMENTS);
  const policyListEl = document.getElementById('admin-policy-list');
  const policyImageInput = document.getElementById('policy-image-file');
  const policyImgPreviewBox = document.getElementById('policy-img-preview-box');
  const policyImgPreview = document.getElementById('policy-img-preview');
  const policyForm = document.getElementById('form-add-policy');
  const policyFormTitle = document.getElementById('policy-form-title');
  const policyEditIndexInput = document.getElementById('policy-edit-index');
  const policySubmitBtn = document.getElementById('policy-submit-btn');
  const policyCancelBtn = document.getElementById('policy-cancel-btn');
  let pendingPolicyImageUrl = null;

  function resetPolicyForm() {
    if (policyForm) {
      policyForm.reset();
      policyForm.classList.remove('is-editing');
    }
    pendingPolicyImageUrl = null;
    if (policyEditIndexInput) policyEditIndexInput.value = '';
    if (policyFormTitle) policyFormTitle.textContent = '+ เพิ่มประกาศนโยบายใหม่';
    if (policySubmitBtn) policySubmitBtn.textContent = 'บันทึกประกาศนโยบายใหม่';
    if (policyCancelBtn) policyCancelBtn.style.display = 'none';
    if (policyImgPreviewBox) policyImgPreviewBox.style.display = 'none';
    const b = document.getElementById('policy-badge');
    if (b) b.value = 'ประกาศนโยบายโรงพยาบาล';
    const d = document.getElementById('policy-date');
    if (d) d.value = '30 ต.ค. 2569';
    const v = document.getElementById('policy-views');
    if (v) v.value = '0';
  }

  if (policyCancelBtn) {
    policyCancelBtn.addEventListener('click', function () {
      resetPolicyForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มประกาศนโยบายใหม่'
      });
    });
  }

  if (policyImageInput) {
    policyImageInput.addEventListener('change', async function () {
      const f = policyImageInput.files && policyImageInput.files[0];
      if (!f) {
        pendingPolicyImageUrl = null;
        if (policyImgPreviewBox) policyImgPreviewBox.style.display = 'none';
        return;
      }
      const res = await enhanceImageFileWithJS(f, { mode: 'fit', width: 1280, sharpen: 0.25 });
      if (res && res.dataUrl) {
        pendingPolicyImageUrl = res.dataUrl;
        policyImgPreview.src = res.dataUrl;
        if (policyImgPreviewBox) policyImgPreviewBox.style.display = 'block';
      }
    });
  }

  if (policyImgPreview) {
    policyImgPreview.addEventListener('click', function () {
      if (pendingPolicyImageUrl) {
        openAdminLightbox('พรีวิวรูปภาพใบประกาศนโยบายโรงพยาบาล', pendingPolicyImageUrl, [], 'รูปภาพประกาศนโยบาย');
      }
    });
  }

  function renderAdminPolicies() {
    if (!policyListEl) return;
    policyListEl.innerHTML = policyData.map(function (item, idx) {
      const fileStatus = item.fileName ? `มีไฟล์เอกสาร: ${item.fileName}` : 'พร้อมดาวน์โหลดเอกสาร/รูปภาพอัตโนมัติ';
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <img src="../assets/images/logo-ksp.png" alt="Logo" class="admin-list-thumb" style="object-fit:contain;background:#eee;padding:3px;" />
            <div class="admin-list-text">
              <p class="admin-list-title">${item.title}</p>
              <p class="admin-list-sub">วันที่ลงประกาศ: <strong>${item.date}</strong> | จำนวนคนเข้าดู: <strong>${item.views}</strong> ครั้ง | ${fileStatus}</p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-edit-policy="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-policy="${idx}">ลบ</button>
          </div>
        </div>
      `;
    }).join('');

    // ปุ่มแก้ไขประกาศนโยบาย
    policyListEl.querySelectorAll('[data-edit-policy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-policy'));
        const item = policyData[idx];
        if (!item) return;

        if (policyEditIndexInput) policyEditIndexInput.value = idx;
        document.getElementById('policy-title').value = item.title || '';
        document.getElementById('policy-badge').value = item.categoryBadge || 'ประกาศนโยบายโรงพยาบาล';
        document.getElementById('policy-date').value = item.date || '30 ต.ค. 2569';
        document.getElementById('policy-views').value = item.views || 0;

        pendingPolicyImageUrl = item.imageDataUrl || null;
        if (pendingPolicyImageUrl && policyImgPreview && policyImgPreviewBox) {
          policyImgPreview.src = pendingPolicyImageUrl;
          policyImgPreviewBox.style.display = 'block';
        } else if (policyImgPreviewBox) {
          policyImgPreviewBox.style.display = 'none';
        }

        if (policyFormTitle) policyFormTitle.textContent = `✎ แก้ไขประกาศ: ${item.title}`;
        if (policySubmitBtn) policySubmitBtn.textContent = 'บันทึกการแก้ไขประกาศ';
        if (policyCancelBtn) policyCancelBtn.style.display = 'inline-block';
        if (policyForm) {
          policyForm.classList.add('is-editing');
          policyForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขประกาศนโยบาย: "${item.title}"`
        });
      });
    });

    // ปุ่มลบประกาศนโยบาย (Modal ยืนยันก่อนลบ)
    policyListEl.querySelectorAll('[data-del-policy]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-policy'));
        const targetItem = policyData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบประกาศนโยบาย',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบประกาศ "${targetItem.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        policyData.splice(idx, 1);
        await window.KSP_CMS.saveSection('policies', 'ประกาศนโยบายโรงพยาบาล', policyData, '../');
        renderAdminPolicies();
        resetPolicyForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบประกาศนโยบาย "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminPolicies();

  if (policyForm) {
    policyForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const title = document.getElementById('policy-title').value.trim();
      const badge = document.getElementById('policy-badge').value.trim() || 'ประกาศนโยบายโรงพยาบาล';
      const date = document.getElementById('policy-date').value.trim() || '30 ต.ค. 2569';
      const views = Number(document.getElementById('policy-views').value || 0);
      const fileInput = document.getElementById('policy-file');
      const fileObj = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      const uploadedFileUrl = await readFileAsDataURL(fileInput);
      const editIdxStr = policyEditIndexInput ? policyEditIndexInput.value : '';

      if (editIdxStr !== '') {
        // --- กรณีแก้ไขประกาศเดิม ---
        const editIdx = Number(editIdxStr);
        policyData[editIdx] = {
          title: title,
          categoryBadge: badge,
          date: date,
          views: views,
          fileName: fileObj ? fileObj.name : (policyData[editIdx].fileName || ''),
          fileDataUrl: uploadedFileUrl || (policyData[editIdx].fileDataUrl || ''),
          imageDataUrl: pendingPolicyImageUrl || (policyData[editIdx].imageDataUrl || ''),
          link: '/policy'
        };

        await window.KSP_CMS.saveSection('policies', 'ประกาศนโยบายโรงพยาบาล', policyData, '../');
        resetPolicyForm();
        renderAdminPolicies();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตประกาศนโยบาย "${title}" เรียบร้อยแล้ว`
        });
      } else {
        // --- กรณีเพิ่มประกาศใหม่ ---
        policyData.unshift({
          title: title,
          categoryBadge: badge,
          date: date,
          views: views,
          fileName: fileObj ? fileObj.name : '',
          fileDataUrl: uploadedFileUrl || '',
          imageDataUrl: pendingPolicyImageUrl || '',
          link: '/policy'
        });

        await window.KSP_CMS.saveSection('policies', 'ประกาศนโยบายโรงพยาบาล', policyData, '../');
        resetPolicyForm();
        renderAdminPolicies();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `บันทึกประกาศนโยบาย "${title}" เรียบร้อยแล้ว`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 4: จัดการดาวน์โหลดเอกสาร (ลงไฟล์เอกสารจริง + คำนวณขนาดไฟล์อัตโนมัติ)
  // =========================================================================
  let downloadsData = window.KSP_CMS.getSection('downloads', DEFAULT_DOWNLOAD_ITEMS);
  const downloadsListEl = document.getElementById('admin-downloads-list');
  const dlFileInput = document.getElementById('dl-file');
  const downloadForm = document.getElementById('form-add-download');
  const dlFormTitle = document.getElementById('dl-form-title');
  const dlEditIndexInput = document.getElementById('dl-edit-index');
  const dlSubmitBtn = document.getElementById('dl-submit-btn');
  const dlCancelBtn = document.getElementById('dl-cancel-btn');

  function resetDownloadForm() {
    if (downloadForm) {
      downloadForm.reset();
      downloadForm.classList.remove('is-editing');
    }
    if (dlEditIndexInput) dlEditIndexInput.value = '';
    if (dlFormTitle) dlFormTitle.textContent = '+ ลงไฟล์เอกสารดาวน์โหลดใหม่';
    if (dlSubmitBtn) dlSubmitBtn.textContent = 'บันทึกและอัปโหลดเอกสาร';
    if (dlCancelBtn) dlCancelBtn.style.display = 'none';
    const s = document.getElementById('dl-size');
    if (s) s.value = '250 KB';
    const d = document.getElementById('dl-date');
    if (d) d.value = '30 ต.ค. 2569';
  }

  if (dlCancelBtn) {
    dlCancelBtn.addEventListener('click', function () {
      resetDownloadForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มเอกสารใหม่'
      });
    });
  }

  if (dlFileInput) {
    dlFileInput.addEventListener('change', function () {
      const f = dlFileInput.files && dlFileInput.files[0];
      if (!f) return;
      document.getElementById('dl-size').value = formatFileSize(f.size);

      const ext = (f.name.split('.').pop() || '').toUpperCase();
      const typeSelect = document.getElementById('dl-type');
      if (ext === 'PDF') typeSelect.value = 'PDF';
      else if (ext === 'DOC' || ext === 'DOCX') typeSelect.value = 'DOCX';
      else if (ext === 'XLS' || ext === 'XLSX') typeSelect.value = 'XLSX';
      else typeSelect.value = 'IMAGE';

      const titleInput = document.getElementById('dl-title');
      if (!titleInput.value.trim()) {
        titleInput.value = f.name.replace(/\.[^/.]+$/, '');
      }
    });
  }

  function renderAdminDownloads() {
    if (!downloadsListEl) return;
    downloadsListEl.innerHTML = downloadsData.map(function (item, idx) {
      const hasFileLabel = item.fileDataUrl ? `ไฟล์จริง: ${item.fileName}` : 'ลิงก์มาตรฐาน';
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <div class="admin-list-text">
              <p class="admin-list-title">[${item.fileType}] ${item.title}</p>
              <p class="admin-list-sub">หมวดหมู่: ${item.category} | ขนาด: ${item.fileSize} | วันที่ลง: ${item.updatedDate} | ${hasFileLabel}</p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-edit-download="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-download="${idx}">ลบ</button>
          </div>
        </div>
      `;
    }).join('');

    // ปุ่มแก้ไขเอกสารดาวน์โหลด
    downloadsListEl.querySelectorAll('[data-edit-download]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-download'));
        const item = downloadsData[idx];
        if (!item) return;

        if (dlEditIndexInput) dlEditIndexInput.value = idx;
        document.getElementById('dl-title').value = item.title || '';
        document.getElementById('dl-category').value = item.category || 'ผู้รับบริการ';
        document.getElementById('dl-type').value = item.fileType || 'PDF';
        document.getElementById('dl-size').value = item.fileSize || '250 KB';
        document.getElementById('dl-date').value = item.updatedDate || '30 ต.ค. 2569';

        if (dlFormTitle) dlFormTitle.textContent = `✎ แก้ไขเอกสาร: ${item.title}`;
        if (dlSubmitBtn) dlSubmitBtn.textContent = 'บันทึกการแก้ไขเอกสาร';
        if (dlCancelBtn) dlCancelBtn.style.display = 'inline-block';
        if (downloadForm) {
          downloadForm.classList.add('is-editing');
          downloadForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขเอกสาร: "${item.title}"`
        });
      });
    });

    // ปุ่มลบเอกสารดาวน์โหลด (Modal ยืนยันก่อนลบ)
    downloadsListEl.querySelectorAll('[data-del-download]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-download'));
        const targetItem = downloadsData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบเอกสาร',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบเอกสาร "${targetItem.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        downloadsData.splice(idx, 1);
        await window.KSP_CMS.saveSection('downloads', 'ดาวน์โหลดเอกสาร', downloadsData, '../');
        renderAdminDownloads();
        resetDownloadForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบเอกสาร "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminDownloads();

  if (downloadForm) {
    downloadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const title = document.getElementById('dl-title').value.trim();
      const category = document.getElementById('dl-category').value;
      const fileType = document.getElementById('dl-type').value;
      const fileSize = document.getElementById('dl-size').value.trim() || '250 KB';
      const updatedDate = document.getElementById('dl-date').value.trim() || '30 ต.ค. 2569';
      const fObj = dlFileInput && dlFileInput.files && dlFileInput.files[0] ? dlFileInput.files[0] : null;
      const uploadedDataUrl = await readFileAsDataURL(dlFileInput);
      const editIdxStr = dlEditIndexInput ? dlEditIndexInput.value : '';

      if (editIdxStr !== '') {
        // --- กรณีแก้ไขเอกสารเดิม ---
        const editIdx = Number(editIdxStr);
        downloadsData[editIdx] = {
          title: title,
          category: category,
          fileType: fileType,
          fileSize: fileSize,
          updatedDate: updatedDate,
          fileName: fObj ? fObj.name : (downloadsData[editIdx].fileName || ''),
          fileDataUrl: uploadedDataUrl || (downloadsData[editIdx].fileDataUrl || ''),
          fileUrl: '/downloads'
        };

        await window.KSP_CMS.saveSection('downloads', 'ดาวน์โหลดเอกสาร', downloadsData, '../');
        resetDownloadForm();
        renderAdminDownloads();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตเอกสารดาวน์โหลด "${title}" เรียบร้อยแล้ว`
        });
      } else {
        // --- กรณีเพิ่มเอกสารใหม่ ---
        downloadsData.unshift({
          title: title,
          category: category,
          fileType: fileType,
          fileSize: fileSize,
          updatedDate: updatedDate,
          fileName: fObj ? fObj.name : '',
          fileDataUrl: uploadedDataUrl || '',
          fileUrl: '/downloads'
        });

        await window.KSP_CMS.saveSection('downloads', 'ดาวน์โหลดเอกสาร', downloadsData, '../');
        resetDownloadForm();
        renderAdminDownloads();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `ลงไฟล์เอกสาร "${title}" เรียบร้อยแล้ว`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 5: จัดการสไลด์ประกาศ (Slide Bar)
  // =========================================================================
  let slidesData = window.KSP_CMS.getSection('slides', DEFAULT_SLIDE_ITEMS);
  const slidesListEl = document.getElementById('admin-slides-list');
  const slideFileInput = document.getElementById('slide-file');
  const slidePreviewBox = document.getElementById('slide-preview-box');
  const slidePreviewImg = document.getElementById('slide-preview-img');
  const slidePreviewStatus = document.getElementById('slide-preview-status');
  const slideFormTitle = document.getElementById('slide-form-title');
  const slideEditIndexInput = document.getElementById('slide-edit-index');
  const slideSubmitBtn = document.getElementById('slide-submit-btn');
  const slideCancelEditBtn = document.getElementById('slide-cancel-edit-btn');
  let pendingSlideImgUrl = null;

  if (slideFileInput) {
    slideFileInput.addEventListener('change', async function () {
      const f = slideFileInput.files && slideFileInput.files[0];
      if (!f) {
        pendingSlideImgUrl = null;
        if (slidePreviewBox) slidePreviewBox.style.display = 'none';
        return;
      }
      if (slidePreviewStatus) slidePreviewStatus.textContent = 'กำลังปรับขนาดและเพิ่มความคมชัดสไลด์...';
      if (slidePreviewBox) slidePreviewBox.style.display = 'block';

      const enhancedSlide = await enhanceImageFileWithJS(f, { mode: 'fit', width: 1400, sharpen: 0.22 });
      if (enhancedSlide && enhancedSlide.dataUrl) {
        pendingSlideImgUrl = enhancedSlide.dataUrl;
        if (slidePreviewImg) slidePreviewImg.src = enhancedSlide.dataUrl;
        if (slidePreviewStatus) slidePreviewStatus.textContent = `✓ พรีวิวรูปภาพสไลด์ HD (${enhancedSlide.width}×${enhancedSlide.height} px) — คลิกเพื่อดูภาพเต็ม`;
      }
    });
  }

  if (slidePreviewImg) {
    slidePreviewImg.addEventListener('click', function () {
      if (pendingSlideImgUrl) {
        openAdminLightbox('ภาพสไลด์ประกาศ', pendingSlideImgUrl, [], 'พรีวิวภาพสไลด์ Slide Bar');
      }
    });
  }

  function resetSlideForm() {
    if (slideForm) {
      slideForm.reset();
      slideForm.classList.remove('is-editing');
    }
    pendingSlideImgUrl = null;
    if (slideEditIndexInput) slideEditIndexInput.value = '';
    if (slideFormTitle) slideFormTitle.textContent = '+ เพิ่มสไลด์ประกาศใหม่';
    if (slideSubmitBtn) slideSubmitBtn.textContent = 'บันทึกสไลด์';
    if (slideCancelEditBtn) slideCancelEditBtn.style.display = 'none';
    if (slidePreviewBox) slidePreviewBox.style.display = 'none';
  }

  if (slideCancelEditBtn) {
    slideCancelEditBtn.addEventListener('click', function () {
      resetSlideForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มสไลด์ใหม่'
      });
    });
  }

  function renderAdminSlides() {
    if (!slidesListEl) return;
    slidesListEl.innerHTML = slidesData.map(function (item, idx) {
      const thumbSrc = resolveAdminImgPath(item.image);
      const isFirst = idx === 0;
      const isLast = idx === slidesData.length - 1;
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <img src="${thumbSrc}" alt="${item.title}" class="admin-list-thumb" data-view-slide="${idx}" title="คลิกเพื่อดูภาพเต็ม" />
            <div class="admin-list-text">
              <p class="admin-list-title"><span style="color:#196856;font-weight:700;">ลำดับที่ ${idx + 1}:</span> ${item.title}</p>
              <p class="admin-list-sub">หมวดหมู่: <strong>${item.category}</strong> | ลิงก์: <code>${item.link || '/departments'}</code></p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-move-slide-up="${idx}" ${isFirst ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} title="เลื่อนขึ้น">▲</button>
            <button type="button" class="admin-btn admin-btn-outline" data-move-slide-down="${idx}" ${isLast ? 'disabled style="opacity:0.4;cursor:not-allowed;"' : ''} title="เลื่อนลง">▼</button>
            <button type="button" class="admin-btn admin-btn-outline" data-edit-slide="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-slide="${idx}">ลบ</button>
          </div>
        </div>
      `;
    }).join('');

    // ดูรูปภาพขนาดเต็ม
    slidesListEl.querySelectorAll('[data-view-slide]').forEach(function (imgEl) {
      imgEl.addEventListener('click', function () {
        const idx = Number(imgEl.getAttribute('data-view-slide'));
        const item = slidesData[idx];
        if (item) {
          openAdminLightbox(item.title, resolveAdminImgPath(item.image), [], `หมวดหมู่: ${item.category}`);
        }
      });
    });

    // ปุ่มแก้ไขสไลด์
    slidesListEl.querySelectorAll('[data-edit-slide]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-slide'));
        const item = slidesData[idx];
        if (!item) return;

        if (slideEditIndexInput) slideEditIndexInput.value = idx;
        document.getElementById('slide-category').value = item.category || '';
        document.getElementById('slide-title').value = item.title || '';
        const linkSelect = document.getElementById('slide-link');
        if (linkSelect) linkSelect.value = item.link || '/departments';

        pendingSlideImgUrl = item.image;
        if (slidePreviewImg) slidePreviewImg.src = resolveAdminImgPath(item.image);
        if (slidePreviewStatus) slidePreviewStatus.textContent = '✓ ภาพปัจจุบันของสไลด์นี้ (หากต้องการเปลี่ยนให้เลือกไฟล์ใหม่)';
        if (slidePreviewBox) slidePreviewBox.style.display = 'block';

        if (slideFormTitle) slideFormTitle.textContent = `✎ แก้ไขสไลด์ลำดับที่ ${idx + 1}`;
        if (slideSubmitBtn) slideSubmitBtn.textContent = 'บันทึกการแก้ไขสไลด์';
        if (slideCancelEditBtn) slideCancelEditBtn.style.display = 'inline-block';
        if (slideForm) {
          slideForm.classList.add('is-editing');
          slideForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขสไลด์ลำดับที่ ${idx + 1}: "${item.title}"`
        });
      });
    });

    // ปุ่มเลื่อนลำดับขึ้น
    slidesListEl.querySelectorAll('[data-move-slide-up]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-move-slide-up'));
        if (idx > 0) {
          const temp = slidesData[idx];
          slidesData[idx] = slidesData[idx - 1];
          slidesData[idx - 1] = temp;
          await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
          renderAdminSlides();
          notify({
            type: 'info',
            title: 'สลับลำดับสไลด์',
            message: `เลื่อนสไลด์ "${temp.title}" ขึ้นเป็นลำดับที่ ${idx}`
          });
        }
      });
    });

    // ปุ่มเลื่อนลำดับลง
    slidesListEl.querySelectorAll('[data-move-slide-down]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-move-slide-down'));
        if (idx < slidesData.length - 1) {
          const temp = slidesData[idx];
          slidesData[idx] = slidesData[idx + 1];
          slidesData[idx + 1] = temp;
          await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
          renderAdminSlides();
          notify({
            type: 'info',
            title: 'สลับลำดับสไลด์',
            message: `เลื่อนสไลด์ "${temp.title}" ลงเป็นลำดับที่ ${idx + 2}`
          });
        }
      });
    });

    // ปุ่มลบสไลด์ (Modal ยืนยันก่อนลบ)
    slidesListEl.querySelectorAll('[data-del-slide]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-slide'));
        const targetItem = slidesData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบสไลด์ประกาศ',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบสไลด์ "${targetItem.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        slidesData.splice(idx, 1);
        await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
        renderAdminSlides();
        resetSlideForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบสไลด์ "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminSlides();

  const slideForm = document.getElementById('form-add-slide');
  if (slideForm) {
    slideForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const category = document.getElementById('slide-category').value.trim();
      const title = document.getElementById('slide-title').value.trim();
      const link = (document.getElementById('slide-link') && document.getElementById('slide-link').value) || '/departments';
      const fileInput = document.getElementById('slide-file');
      const editIdxStr = slideEditIndexInput ? slideEditIndexInput.value : '';

      let finalImgUrl = pendingSlideImgUrl;
      if (!finalImgUrl && fileInput && fileInput.files && fileInput.files[0]) {
        const enhancedSlide = await enhanceImageFileWithJS(fileInput.files[0], { mode: 'fit', width: 1400 });
        if (enhancedSlide) finalImgUrl = enhancedSlide.dataUrl;
      }

      if (editIdxStr !== '') {
        // --- กรณีแก้ไขสไลด์เดิม ---
        const editIdx = Number(editIdxStr);
        slidesData[editIdx].category = category || 'ประกาศประชาสัมพันธ์';
        slidesData[editIdx].title = title;
        slidesData[editIdx].link = link;
        if (finalImgUrl) {
          slidesData[editIdx].image = finalImgUrl;
        }
        await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
        resetSlideForm();
        renderAdminSlides();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตข้อมูลสไลด์ "${title}" เรียบร้อยแล้ว`
        });
      } else {
        // --- กรณีเพิ่มสไลด์ใหม่ ---
        slidesData.push({
          category: category || 'ประกาศประชาสัมพันธ์',
          title: title,
          image: finalImgUrl || 'assets/images/banners/banner-1.png',
          link: link
        });

        await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
        resetSlideForm();
        renderAdminSlides();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `เพิ่มสไลด์ประกาศ "${title}" เรียบร้อยแล้ว`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 6: จัดการข้อมูลผู้บริหารและวิสัยทัศน์
  // =========================================================================
  let execData = window.KSP_CMS.getSection('executive', DEFAULT_EXECUTIVE_DATA);
  const execForm = document.getElementById('form-edit-executive');
  if (execForm) {
    document.getElementById('exec-name').value = execData.name || '';
    document.getElementById('exec-rank').value = execData.rank || '';
    document.getElementById('exec-acting').value = execData.actingTitle || '';
    document.getElementById('exec-role').value = execData.role || '';
    document.getElementById('exec-headline').value = execData.visionHeadline || '';
    document.getElementById('exec-quote').value = execData.visionQuote || '';

    execForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fileInput = document.getElementById('exec-photo-file');
      const f = fileInput && fileInput.files && fileInput.files[0];
      const enhancedPhoto = f ? await enhanceImageFileWithJS(f, { mode: 'fit', width: 900 }) : null;

      execData.name = document.getElementById('exec-name').value.trim();
      execData.rank = document.getElementById('exec-rank').value.trim();
      execData.actingTitle = document.getElementById('exec-acting').value.trim();
      execData.role = document.getElementById('exec-role').value.trim();
      execData.visionHeadline = document.getElementById('exec-headline').value.trim();
      execData.visionQuote = document.getElementById('exec-quote').value.trim();
      if (enhancedPhoto && enhancedPhoto.dataUrl) {
        execData.photo = enhancedPhoto.dataUrl;
      }

      await window.KSP_CMS.saveSection('executive', 'ผู้บริหารและวิสัยทัศน์', execData, '../');

      notify({
        type: 'success',
        title: 'บันทึกข้อมูลผู้บริหารสำเร็จ!',
        message: 'อัปเดตข้อมูลผู้บริหารและวิสัยทัศน์โรงพยาบาลเรียบร้อยแล้ว'
      });
    });
  }

  // =========================================================================
  // เมนูที่ 7: จัดการแผนกและคลินิก (รองรับ บันทึก / แก้ไข / ลบ พร้อมระบบอัปโหลดรูปภาพ)
  // =========================================================================
  let deptsData = window.KSP_CMS.getSection('departments', DEFAULT_DEPARTMENTS_LIST);
  const deptsListEl = document.getElementById('admin-depts-list');
  const deptForm = document.getElementById('form-add-dept');
  const deptFormTitle = document.getElementById('dept-form-title');
  const deptEditIndexInput = document.getElementById('dept-edit-index');
  const deptSubmitBtn = document.getElementById('dept-submit-btn');
  const deptCancelBtn = document.getElementById('dept-cancel-btn');
  const deptImageInput = document.getElementById('dept-image-file');
  const deptPreviewBox = document.getElementById('dept-preview-box');
  const deptPreviewImg = document.getElementById('dept-preview-img');
  const deptPreviewStatus = document.getElementById('dept-preview-status');
  let pendingDeptImgUrl = null;

  // ฟัง event เมื่อเลือกไฟล์รูปภาพคลินิก
  if (deptImageInput) {
    deptImageInput.addEventListener('change', async function () {
      const f = deptImageInput.files && deptImageInput.files[0];
      if (!f) {
        pendingDeptImgUrl = null;
        if (deptPreviewBox) deptPreviewBox.style.display = 'none';
        return;
      }
      if (deptPreviewBox) deptPreviewBox.style.display = 'block';
      if (deptPreviewStatus) deptPreviewStatus.textContent = '⏳ กำลังประมวลผลและปรับความคมชัด HD...';

      const enhancedDept = await enhanceImageFileWithJS(f, { mode: 'fit', width: 1000, sharpen: 0.22 });
      if (enhancedDept && enhancedDept.dataUrl) {
        pendingDeptImgUrl = enhancedDept.dataUrl;
        if (deptPreviewImg) deptPreviewImg.src = enhancedDept.dataUrl;
        if (deptPreviewStatus) deptPreviewStatus.textContent = `✓ พรีวิวรูปภาพคลินิก (${enhancedDept.width}×${enhancedDept.height} px) — คลิกเพื่อดูภาพเต็ม`;
      }
    });
  }

  // พรีวิวรูปภาพคลินิกแบบ Lightbox ขยายใหญ่เมื่อคลิกที่รูป
  if (deptPreviewImg) {
    deptPreviewImg.addEventListener('click', function () {
      if (pendingDeptImgUrl) {
        openAdminLightbox('รูปภาพประจำคลินิก/แผนก', pendingDeptImgUrl, [], 'พรีวิวภาพคลินิก');
      }
    });
  }

  function resetDeptForm() {
    if (deptForm) {
      deptForm.reset();
      deptForm.classList.remove('is-editing');
    }
    pendingDeptImgUrl = null;
    if (deptImageInput) deptImageInput.value = '';
    if (deptPreviewBox) deptPreviewBox.style.display = 'none';
    if (deptPreviewImg) deptPreviewImg.src = '';
    if (deptEditIndexInput) deptEditIndexInput.value = '';
    if (deptFormTitle) deptFormTitle.textContent = '+ เพิ่มแผนก/คลินิกใหม่';
    if (deptSubmitBtn) deptSubmitBtn.textContent = 'บันทึกแผนกใหม่';
    if (deptCancelBtn) deptCancelBtn.style.display = 'none';
  }

  if (deptCancelBtn) {
    deptCancelBtn.addEventListener('click', function () {
      resetDeptForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มแผนกใหม่'
      });
    });
  }

  function renderAdminDepts() {
    if (!deptsListEl) return;
    deptsListEl.innerHTML = deptsData.map(function (item, idx) {
      const thumbSrc = item.image ? resolveAdminImgPath(item.image) : '';
      return `
        <div class="admin-list-row">
          <div class="admin-list-info" style="display:flex;gap:14px;align-items:center;">
            ${thumbSrc ? `<img src="${thumbSrc}" alt="${item.title}" class="admin-list-thumb" data-view-dept="${idx}" title="คลิกเพื่อดูภาพเต็ม" style="width:72px;height:52px;object-fit:cover;border-radius:6px;cursor:pointer;border:1px solid #cbd5e1;" />` : `<div style="width:72px;height:52px;background:#f1f5f9;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#64748b;font-size:0.75rem;border:1px dashed #cbd5e1;">ไม่มีรูป</div>`}
            <div class="admin-list-text">
              <p class="admin-list-title"><span style="color:#196856;font-weight:700;">ลำดับที่ ${idx + 1}:</span> ${item.title}</p>
              <p class="admin-list-sub">${item.description}</p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <button type="button" class="admin-btn admin-btn-outline" data-edit-dept="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-dept="${idx}">ลบ</button>
          </div>
        </div>
      `;
    }).join('');

    // คลิกรูป thumbnail ในรายการเพื่อดูภาพขยายใหญ่
    deptsListEl.querySelectorAll('[data-view-dept]').forEach(function (imgEl) {
      imgEl.addEventListener('click', function () {
        const idx = Number(imgEl.getAttribute('data-view-dept'));
        const item = deptsData[idx];
        if (item && item.image) {
          openAdminLightbox(`คลินิก/แผนก: ${item.title}`, resolveAdminImgPath(item.image), [], item.description || '');
        }
      });
    });

    // ปุ่มแก้ไขแผนก/คลินิก
    deptsListEl.querySelectorAll('[data-edit-dept]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-dept'));
        const item = deptsData[idx];
        if (!item) return;

        if (deptEditIndexInput) deptEditIndexInput.value = idx;
        document.getElementById('dept-title').value = item.title || '';
        document.getElementById('dept-desc').value = item.description || '';
        const iconSelect = document.getElementById('dept-icon');
        if (iconSelect) iconSelect.value = item.icon || 'heart';

        // โหลดรูปภาพเดิมถ้ามี
        pendingDeptImgUrl = item.image || null;
        if (pendingDeptImgUrl && deptPreviewImg && deptPreviewBox) {
          deptPreviewImg.src = resolveAdminImgPath(pendingDeptImgUrl);
          if (deptPreviewStatus) deptPreviewStatus.textContent = '✓ ภาพปัจจุบันของคลินิกนี้ (เลือกไฟล์ใหม่หากต้องการเปลี่ยน)';
          deptPreviewBox.style.display = 'block';
        } else if (deptPreviewBox) {
          deptPreviewBox.style.display = 'none';
        }

        if (deptFormTitle) deptFormTitle.textContent = `✎ แก้ไขแผนก: ${item.title}`;
        if (deptSubmitBtn) deptSubmitBtn.textContent = 'บันทึกการแก้ไขแผนก';
        if (deptCancelBtn) deptCancelBtn.style.display = 'inline-block';
        if (deptForm) {
          deptForm.classList.add('is-editing');
          deptForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขแผนก/คลินิก: "${item.title}"`
        });
      });
    });

    // ปุ่มลบแผนก/คลินิก (Modal ยืนยันก่อนลบ)
    deptsListEl.querySelectorAll('[data-del-dept]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-dept'));
        const targetItem = deptsData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบแผนก/คลินิก',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบแผนก "${targetItem.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        deptsData.splice(idx, 1);
        await window.KSP_CMS.saveSection('departments', 'แผนกและคลินิก', deptsData, '../');
        renderAdminDepts();
        resetDeptForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบแผนก "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminDepts();

  if (deptForm) {
    deptForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const title = document.getElementById('dept-title').value.trim();
      const desc = document.getElementById('dept-desc').value.trim();
      const icon = document.getElementById('dept-icon').value;
      const editIdxStr = deptEditIndexInput ? deptEditIndexInput.value : '';

      // ดึงรูปคลินิก ถ้ามีการเลือกไฟล์ใหม่แต่ยังไม่ได้ประมวลผล
      let finalImgUrl = pendingDeptImgUrl;
      if (!finalImgUrl && deptImageInput && deptImageInput.files && deptImageInput.files[0]) {
        const enhancedDept = await enhanceImageFileWithJS(deptImageInput.files[0], { mode: 'fit', width: 1000 });
        if (enhancedDept) finalImgUrl = enhancedDept.dataUrl;
      }

      if (editIdxStr !== '') {
        // --- กรณีแก้ไขแผนกเดิม ---
        const editIdx = Number(editIdxStr);
        deptsData[editIdx] = {
          icon: icon,
          title: title,
          description: desc,
          image: finalImgUrl || '',
          link: '/departments'
        };

        await window.KSP_CMS.saveSection('departments', 'แผนกและคลินิก', deptsData, '../');
        resetDeptForm();
        renderAdminDepts();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตข้อมูลแผนก "${title}" เรียบร้อยแล้ว`
        });
      } else {
        // --- กรณีเพิ่มแผนกใหม่ ---
        deptsData.push({
          icon: icon,
          title: title,
          description: desc,
          image: finalImgUrl || '',
          link: '/departments'
        });

        await window.KSP_CMS.saveSection('departments', 'แผนกและคลินิก', deptsData, '../');
        resetDeptForm();
        renderAdminDepts();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `เพิ่มแผนก/คลินิกใหม่ "${title}" เรียบร้อยแล้ว`
        });
      }
    });
  }

  // =========================================================================
  // เมนูที่ 8: จัดการเว็บไซต์ภายใน (รองรับ บันทึก / แก้ไข / ลบ)
  // =========================================================================
  let intranetData = window.KSP_CMS.getSection('intranet', DEFAULT_INTERNAL_WEBSITES);
  const intranetListEl = document.getElementById('admin-intranet-list');
  const intraForm = document.getElementById('form-add-intranet');
  const intraFormTitle = document.getElementById('intra-form-title');
  const intraEditIndexInput = document.getElementById('intra-edit-index');
  const intraSubmitBtn = document.getElementById('intra-submit-btn');
  const intraCancelEditBtn = document.getElementById('intra-cancel-edit-btn');
  const intraLogoFileInput = document.getElementById('intra-logo-file');
  const intraLogoPreviewBox = document.getElementById('intra-logo-preview-box');
  const intraLogoPreviewImg = document.getElementById('intra-logo-preview-img');
  const intraLogoPreviewStatus = document.getElementById('intra-logo-preview-status');
  let pendingIntraLogoUrl = null;

  if (intraLogoFileInput) {
    intraLogoFileInput.addEventListener('change', async function () {
      const f = intraLogoFileInput.files && intraLogoFileInput.files[0];
      if (!f) {
        pendingIntraLogoUrl = null;
        if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'none';
        return;
      }
      if (intraLogoPreviewStatus) intraLogoPreviewStatus.textContent = 'กำลังโหลดและปรับขนาดโลโก้...';
      if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'block';

      const enhancedLogo = await enhanceImageFileWithJS(f, { mode: 'fit', width: 300, quality: 0.95 });
      if (enhancedLogo && enhancedLogo.dataUrl) {
        pendingIntraLogoUrl = enhancedLogo.dataUrl;
        if (intraLogoPreviewImg) intraLogoPreviewImg.src = enhancedLogo.dataUrl;
        if (intraLogoPreviewStatus) intraLogoPreviewStatus.textContent = '✓ พรีวิว Logo ระบบงานที่เลือก';
      }
    });
  }

  function resolveAdminIntraLogo(logoPath) {
    if (!logoPath) return '../assets/images/logo-ksp.png';
    if (logoPath.startsWith('data:') || logoPath.startsWith('http')) return logoPath;
    return '../' + logoPath;
  }

  function resetIntraForm() {
    if (intraForm) {
      intraForm.reset();
      intraForm.classList.remove('is-editing');
    }
    pendingIntraLogoUrl = null;
    if (intraEditIndexInput) intraEditIndexInput.value = '';
    if (intraFormTitle) intraFormTitle.textContent = '+ เพิ่มระบบเว็บไซต์ภายในใหม่';
    if (intraSubmitBtn) intraSubmitBtn.textContent = 'บันทึกระบบภายในใหม่';
    if (intraCancelEditBtn) intraCancelEditBtn.style.display = 'none';
    if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'none';
    const themeSel = document.getElementById('intra-theme');
    if (themeSel) themeSel.value = 'white';
    const iconSel = document.getElementById('intra-icon');
    if (iconSel) iconSel.value = 'globe';
    const actInput = document.getElementById('intra-action-text');
    if (actInput) actInput.value = 'สมัครใช้งาน';
    const btnStyleSel = document.getElementById('intra-btn-style');
    if (btnStyleSel) btnStyleSel.value = 'green';
  }

  if (intraCancelEditBtn) {
    intraCancelEditBtn.addEventListener('click', function () {
      resetIntraForm();
      notify({
        type: 'warning',
        title: 'ยกเลิกการแก้ไข',
        message: 'ยกเลิกการแก้ไขและกลับสู่โหมดเพิ่มระบบงานใหม่'
      });
    });
  }

  function renderAdminIntranet() {
    if (!intranetListEl) return;
    intranetListEl.innerHTML = intranetData.map(function (item, idx) {
      const logoThumb = resolveAdminIntraLogo(item.logo);
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <img src="${logoThumb}" alt="${item.title}" class="admin-list-thumb" style="width:44px;height:44px;object-fit:contain;background:#ffffff;padding:3px;" />
            <div class="admin-list-text">
              <p class="admin-list-title">[${item.code}] ${item.title}</p>
              <p class="admin-list-sub">${item.description} (URL: <a href="${item.url}" target="_blank" rel="noopener noreferrer" style="color:#196856;text-decoration:underline;">${item.url}</a>)</p>
            </div>
          </div>
          <div class="admin-list-actions" style="display:flex;gap:6px;align-items:center;">
            <a href="${item.url}" target="_blank" rel="noopener noreferrer" class="admin-btn admin-btn-outline" style="text-decoration:none;">ทดสอบลิงก์ ↗</a>
            <button type="button" class="admin-btn admin-btn-outline" data-edit-intranet="${idx}">แก้ไข</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-intranet="${idx}">ลบลิงก์</button>
          </div>
        </div>
      `;
    }).join('');

    // ปุ่มแก้ไขข้อมูลระบบงาน
    intranetListEl.querySelectorAll('[data-edit-intranet]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const idx = Number(btn.getAttribute('data-edit-intranet'));
        const item = intranetData[idx];
        if (!item) return;

        if (intraEditIndexInput) intraEditIndexInput.value = idx;
        document.getElementById('intra-code').value = item.code || '';
        document.getElementById('intra-title').value = item.title || '';
        document.getElementById('intra-desc').value = item.description || '';
        document.getElementById('intra-url').value = item.url || '';

        const themeSel = document.getElementById('intra-theme');
        if (themeSel) themeSel.value = item.theme || 'white';
        const iconSel = document.getElementById('intra-icon');
        if (iconSel) iconSel.value = item.icon || 'globe';
        const actInput = document.getElementById('intra-action-text');
        if (actInput) actInput.value = item.actionText || 'สมัครใช้งาน';
        const btnStyleSel = document.getElementById('intra-btn-style');
        if (btnStyleSel) btnStyleSel.value = item.btnStyle || 'green';

        pendingIntraLogoUrl = item.logo || null;
        if (pendingIntraLogoUrl) {
          if (intraLogoPreviewImg) intraLogoPreviewImg.src = resolveAdminIntraLogo(pendingIntraLogoUrl);
          if (intraLogoPreviewStatus) intraLogoPreviewStatus.textContent = '✓ Logo ปัจจุบันของระบบงานนี้ (หากต้องการเปลี่ยนให้เลือกไฟล์ใหม่)';
          if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'block';
        } else {
          if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'none';
        }

        if (intraFormTitle) intraFormTitle.textContent = `✎ แก้ไขระบบงาน: [${item.code}] ${item.title}`;
        if (intraSubmitBtn) intraSubmitBtn.textContent = 'บันทึกการแก้ไข';
        if (intraCancelEditBtn) intraCancelEditBtn.style.display = 'inline-block';
        if (intraForm) {
          intraForm.classList.add('is-editing');
          intraForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }

        notify({
          type: 'info',
          title: 'เข้าสู่โหมดแก้ไขข้อมูล',
          message: `กำลังแก้ไขระบบงาน: [${item.code}] "${item.title}"`
        });
      });
    });

    // ปุ่มลบระบบงาน (Modal ยืนยันก่อนลบ)
    intranetListEl.querySelectorAll('[data-del-intranet]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-intranet'));
        const targetItem = intranetData[idx];
        if (!targetItem) return;

        const confirmed = await showConfirmDialog({
          title: 'ยืนยันการลบระบบเว็บไซต์ภายใน',
          message: `คุณแน่ใจหรือไม่ว่าต้องการลบระบบงาน "${targetItem.title}"? การกระทำนี้ไม่สามารถย้อนกลับได้`,
          confirmText: 'ยืนยันการลบ',
          type: 'danger'
        });

        if (!confirmed) return;

        const deletedTitle = targetItem.title;
        intranetData.splice(idx, 1);
        await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
        renderAdminIntranet();
        resetIntraForm();

        notify({
          type: 'danger',
          title: 'ลบข้อมูลสำเร็จ!',
          message: `ลบระบบงาน "${deletedTitle}" ออกจากระบบเรียบร้อยแล้ว`
        });
      });
    });
  }
  renderAdminIntranet();

  if (intraForm) {
    intraForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const code = document.getElementById('intra-code').value.trim();
      const title = document.getElementById('intra-title').value.trim();
      const desc = document.getElementById('intra-desc').value.trim();
      let url = document.getElementById('intra-url').value.trim();
      const theme = document.getElementById('intra-theme') ? document.getElementById('intra-theme').value : 'white';
      const icon = document.getElementById('intra-icon') ? document.getElementById('intra-icon').value : 'globe';
      const actionText = document.getElementById('intra-action-text') ? document.getElementById('intra-action-text').value.trim() : 'สมัครใช้งาน';
      const btnStyle = document.getElementById('intra-btn-style') ? document.getElementById('intra-btn-style').value : 'green';
      const editIdxStr = intraEditIndexInput ? intraEditIndexInput.value : '';

      // จัดการ URL ให้พร้อมเปิดได้ทันที
      if (url && !/^(?:[a-z+]+:)?\/\//i.test(url) && !url.startsWith('pages/')) {
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(url) || /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(url)) {
          url = 'http://' + url;
        }
      }

      // ดึงรูป Logo ถ้าเพิ่งเลือกไฟล์ใหม่
      if (!pendingIntraLogoUrl && intraLogoFileInput && intraLogoFileInput.files && intraLogoFileInput.files[0]) {
        const enhancedLogo = await enhanceImageFileWithJS(intraLogoFileInput.files[0], { mode: 'fit', width: 300 });
        if (enhancedLogo) pendingIntraLogoUrl = enhancedLogo.dataUrl;
      }

      if (editIdxStr !== '') {
        const editIdx = Number(editIdxStr);
        intranetData[editIdx] = {
          code: code,
          title: title,
          description: desc,
          url: url || '/internal-websites',
          theme: theme,
          icon: icon,
          actionText: actionText,
          btnStyle: btnStyle,
          logo: pendingIntraLogoUrl || intranetData[editIdx].logo || ''
        };
        await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
        resetIntraForm();
        renderAdminIntranet();

        notify({
          type: 'success',
          title: 'แก้ไขข้อมูลสำเร็จ!',
          message: `อัปเดตระบบงาน "${title}" เรียบร้อยแล้ว`
        });
      } else {
        intranetData.push({
          code: code,
          title: title,
          description: desc,
          url: url || '/internal-websites',
          theme: theme,
          icon: icon,
          actionText: actionText,
          btnStyle: btnStyle,
          logo: pendingIntraLogoUrl || ''
        });
        await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
        resetIntraForm();
        renderAdminIntranet();

        notify({
          type: 'success',
          title: 'บันทึกสำเร็จ!',
          message: `บันทึกระบบเว็บไซต์ภายใน "${title}" เรียบร้อยแล้ว`
        });
      }
    });
  }

  // =========================================================================
  // ระบบตรวจสอบและอัปเดตโค้ดจาก GitHub (สีเขียว = ปัจจุบัน, สีเหลือง = รออัปเดต)
  // =========================================================================
  const gitUpdateBtn = document.getElementById('admin-git-update-btn');
  const gitStatusIcon = document.getElementById('admin-git-status-icon');
  const gitStatusText = document.getElementById('admin-git-status-text');
  let currentGitStatus = { hasUpdate: false, localCommit: '', remoteCommit: '' };

  async function checkServerGitStatus(showToastOnCurrent = false) {
    if (!gitUpdateBtn) return;
    try {
      const res = await fetch('/api/git-status', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      currentGitStatus = data;

      if (data.hasUpdate) {
        // สีเหลือง: มีการเปลี่ยนแปลงใหม่บน GitHub (รออัปเดต)
        gitUpdateBtn.className = 'admin-btn admin-btn-git-update status-has-update';
        if (gitStatusIcon) gitStatusIcon.textContent = '🟡';
        if (gitStatusText) gitStatusText.textContent = `รออัปเดต (${data.remoteCommit})`;
        gitUpdateBtn.title = `พบการเปลี่ยนแปลงใหม่บน GitHub (${data.localCommit} ➜ ${data.remoteCommit})\nคลิกปุ่มนี้เพื่อดึงโค้ดและอัปเดต Server ทันที`;
      } else {
        // สีเขียว: เวอร์ชันปัจจุบัน
        gitUpdateBtn.className = 'admin-btn admin-btn-git-update status-current';
        if (gitStatusIcon) gitStatusIcon.textContent = '🟢';
        if (gitStatusText) gitStatusText.textContent = `เวอร์ชันปัจจุบัน (${data.localCommit})`;
        gitUpdateBtn.title = `ระบบเป็นเวอร์ชันล่าสุดแล้ว (${data.localCommit})\nคลิกเพื่อตรวจสอบการเปลี่ยนแปลงจาก GitHub อีกครั้ง`;
        if (showToastOnCurrent) {
          showToast(`🟢 ระบบบน Server เป็นเวอร์ชันล่าสุดแล้ว (${data.localCommit})`);
        }
      }
    } catch (err) {
      console.warn('[Git Status] Offline / Standalone mode:', err.message);
    }
  }

  async function triggerServerGitUpdate() {
    if (!gitUpdateBtn) return;
    if (!currentGitStatus.hasUpdate) {
      showToast('🔍 กำลังตรวจสอบการเปลี่ยนแปลงบน GitHub...');
      await checkServerGitStatus(true);
      return;
    }

    const confirmed = confirm(
      `พบการเปลี่ยนแปลงใหม่บน GitHub!\n\n` +
      `• เวอร์ชันปัจจุบัน: ${currentGitStatus.localCommit}\n` +
      `• เวอร์ชันใหม่บน GitHub: ${currentGitStatus.remoteCommit}\n\n` +
      `ต้องการอัปเดตโปรแกรมที่ Server เดี๋ยวนี้หรือไม่?`
    );

    if (!confirmed) return;

    gitUpdateBtn.className = 'admin-btn admin-btn-git-update status-updating';
    if (gitStatusIcon) gitStatusIcon.textContent = '⏳';
    if (gitStatusText) gitStatusText.textContent = 'กำลังอัปเดต...';
    gitUpdateBtn.disabled = true;
    showToast('🚀 กำลังดึงโค้ดล่าสุดจาก GitHub และอัปเดตโปรแกรมที่ Server...');

    try {
      const res = await fetch('/api/git-update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (data.success) {
        showToast('✓ อัปเดตโปรแกรมที่ Server สำเร็จแล้ว! กำลังรีโหลดใน 3 วินาที...');
        setTimeout(() => {
          window.location.reload(true);
        }, 3000);
      } else {
        alert('เกิดข้อผิดพลาดในการอัปเดต: ' + (data.error || 'Unknown error'));
        checkServerGitStatus();
      }
    } catch (err) {
      showToast('⚠️ เซิร์ฟเวอร์กำลังรีสตาร์ท... กำลังรีโหลดหน้าจอใหม่ใน 4 วินาที');
      setTimeout(() => {
        window.location.reload(true);
      }, 4000);
    } finally {
      gitUpdateBtn.disabled = false;
    }
  }

  if (gitUpdateBtn) {
    gitUpdateBtn.addEventListener('click', triggerServerGitUpdate);
    // ตรวจสอบสถานะทันทีเมื่อเปิดหน้า และตรวจสอบอัตโนมัติทุกๆ 60 วินาที
    checkServerGitStatus();
    setInterval(checkServerGitStatus, 60000);
  }

  // =========================================================================
  // เมนูที่ 9: ตั้งค่าข้อมูลติดต่อเรา & แผนที่
  // =========================================================================
  let contactData = window.KSP_CMS.getSection('contact', DEFAULT_CONTACT_DATA);
  const contactForm = document.getElementById('form-edit-contact');
  if (contactForm) {
    document.getElementById('contact-name').value = contactData.hospitalName || '';
    document.getElementById('contact-address').value = contactData.address || '';
    document.getElementById('contact-phone').value = contactData.phone || '';
    document.getElementById('contact-email').value = contactData.email || '';
    document.getElementById('contact-map-dir').value = contactData.googleMapsDirUrl || '';

    contactForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      contactData.hospitalName = document.getElementById('contact-name').value.trim();
      contactData.address = document.getElementById('contact-address').value.trim();
      contactData.phone = document.getElementById('contact-phone').value.trim();
      contactData.email = document.getElementById('contact-email').value.trim();
      contactData.googleMapsDirUrl = document.getElementById('contact-map-dir').value.trim();

      await window.KSP_CMS.saveSection('contact', 'ติดต่อเรา', contactData, '../');
      notify({
        type: 'success',
        title: 'บันทึกข้อมูลติดต่อสำเร็จ!',
        message: 'อัปเดตข้อมูลติดต่อโรงพยาบาลและแผนที่เรียบร้อยแล้ว'
      });
    });
  }
});
