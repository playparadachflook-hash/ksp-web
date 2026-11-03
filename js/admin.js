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

  const toastEl = document.getElementById('admin-toast');
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = '✓ ' + msg;
    toastEl.classList.add('is-visible');
    setTimeout(function () {
      toastEl.classList.remove('is-visible');
    }, 3800);
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
    resetAllBtn.addEventListener('click', function () {
      if (confirm('ต้องการคืนค่าข้อมูลทุกส่วนกลับเป็นค่าเริ่มต้นของโรงพยาบาลใช่หรือไม่?')) {
        window.KSP_CMS.resetAll();
        window.location.reload();
      }
    });
  }

  // =========================================================================
  // เมนูที่ 1: เพิ่มสมาชิก / จัดการผู้ใช้งานระบบหลังบ้าน
  // =========================================================================
  let membersData = window.KSP_CMS.getSection('members', DEFAULT_MEMBERS_LIST);
  const membersListEl = document.getElementById('admin-members-list');

  function renderAdminMembers() {
    if (!membersListEl) return;
    membersListEl.innerHTML = membersData.map(function (member, idx) {
      const isDefaultAdmin = member.username === 'admin' && idx === 0;
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <div class="admin-list-text">
              <p class="admin-list-title">${member.fullName} (Username: <code>${member.username}</code>)</p>
              <p class="admin-list-sub">กลุ่มงาน/สิทธิ์: ${member.role} | รหัสผ่าน: ${member.password}</p>
            </div>
          </div>
          ${
            isDefaultAdmin
              ? '<span style="font-size:0.78rem;color:#1f5a50;font-weight:600;">บัญชีหลัก</span>'
              : `<button type="button" class="admin-btn admin-btn-danger" data-del-member="${idx}">ลบสมาชิก</button>`
          }
        </div>
      `;
    }).join('');

    membersListEl.querySelectorAll('[data-del-member]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-member'));
        membersData.splice(idx, 1);
        const res = await window.KSP_CMS.saveSection('members', 'สมาชิกผู้ดูแลระบบ', membersData, '../');
        renderAdminMembers();
        showToast(res.message);
      });
    });
  }
  renderAdminMembers();

  const memberForm = document.getElementById('form-add-member');
  if (memberForm) {
    memberForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const username = document.getElementById('member-username').value.trim();
      const password = document.getElementById('member-password').value.trim();
      const fullName = document.getElementById('member-fullname').value.trim();
      const role = document.getElementById('member-role').value;

      if (membersData.some(function (m) { return m.username === username; })) {
        alert('ชื่อผู้ใช้งาน (Username) นี้มีอยู่ในระบบแล้ว กรุณาใช้ชื่ออื่นครับ');
        return;
      }

      membersData.push({
        username: username,
        password: password,
        fullName: fullName,
        role: role
      });

      await window.KSP_CMS.saveSection('members', 'สมาชิกผู้ดูแลระบบ', membersData, '../');
      memberForm.reset();
      renderAdminMembers();
      showToast('เพิ่มสมาชิก "' + fullName + '" เรียบร้อย! สามารถใช้เข้าสู่ระบบได้ทันที');
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
              <p class="admin-list-sub">ภาพปก HD 1 ภาพ | ภาพงานทั้งหมด ${galleryCount} ภาพ — ${item.excerpt.substring(0, 65)}...</p>
            </div>
          </div>
          <div class="admin-list-actions">
            <button type="button" class="admin-btn admin-btn-outline" data-view-news="${idx}">ดูภาพที่เพิ่ม (${galleryCount} ภาพ)</button>
            <button type="button" class="admin-btn admin-btn-danger" data-del-news="${idx}">ลบข่าว</button>
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

    newsListEl.querySelectorAll('[data-del-news]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-news'));
        newsData.splice(idx, 1);
        const res = await window.KSP_CMS.saveSection('news', 'ข่าวสารและกิจกรรม', newsData, '../');
        renderAdminNews();
        showToast(res.message);
      });
    });
  }
  renderAdminNews();

  const newsForm = document.getElementById('form-add-news');
  if (newsForm) {
    newsForm.addEventListener('submit', async function (e) {
      e.preventDefault();

      // หากผู้ใช้เลือกไฟล์ไว้แต่ยังไม่ได้ประมวลผล ให้ประมวลผลด้วย JS ก่อนบันทึก
      if (!pendingEnhancedCoverUrl && newsCoverInput && newsCoverInput.files && newsCoverInput.files[0]) {
        const r = await enhanceImageFileWithJS(newsCoverInput.files[0], { mode: 'cover', width: 1200, height: 750 });
        if (r) pendingEnhancedCoverUrl = r.dataUrl;
      }

      const finalCover = pendingEnhancedCoverUrl || (pendingEnhancedGalleryUrls[0] || 'assets/images/news/news-1.png');
      const finalGallery = pendingEnhancedGalleryUrls.length > 0 ? pendingEnhancedGalleryUrls : [finalCover];

      newsData.unshift({
        image: finalCover,
        gallery: finalGallery,
        title: document.getElementById('news-title').value.trim(),
        excerpt: document.getElementById('news-excerpt').value.trim(),
        link: '/news'
      });

      await window.KSP_CMS.saveSection('news', 'ข่าวสารและกิจกรรม', newsData, '../');
      newsForm.reset();
      pendingEnhancedCoverUrl = null;
      pendingEnhancedGalleryUrls = [];
      if (newsCoverPreviewBox) newsCoverPreviewBox.style.display = 'none';
      if (newsGalleryPreviewBox) newsGalleryPreviewBox.style.display = 'none';

      renderAdminNews();
      showToast('บันทึกข่าวสารพร้อมภาพปกคมชัด HD และภาพงานทั้งหมด (' + finalGallery.length + ' ภาพ) สำเร็จ!');
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
  let pendingPolicyImageUrl = null;

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
          <button type="button" class="admin-btn admin-btn-danger" data-del-policy="${idx}">ลบประกาศ</button>
        </div>
      `;
    }).join('');

    policyListEl.querySelectorAll('[data-del-policy]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-policy'));
        policyData.splice(idx, 1);
        const res = await window.KSP_CMS.saveSection('policies', 'ประกาศนโยบายโรงพยาบาล', policyData, '../');
        renderAdminPolicies();
        showToast(res.message);
      });
    });
  }
  renderAdminPolicies();

  const policyForm = document.getElementById('form-add-policy');
  if (policyForm) {
    policyForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fileInput = document.getElementById('policy-file');
      const fileObj = fileInput && fileInput.files && fileInput.files[0] ? fileInput.files[0] : null;
      const uploadedFileUrl = await readFileAsDataURL(fileInput);

      policyData.unshift({
        title: document.getElementById('policy-title').value.trim(),
        categoryBadge: document.getElementById('policy-badge').value.trim() || 'ประกาศนโยบายโรงพยาบาล',
        date: document.getElementById('policy-date').value.trim() || '30 ต.ค. 2569',
        views: Number(document.getElementById('policy-views').value || 0),
        fileName: fileObj ? fileObj.name : '',
        fileDataUrl: uploadedFileUrl || '',
        imageDataUrl: pendingPolicyImageUrl || '',
        link: '/policy'
      });

      await window.KSP_CMS.saveSection('policies', 'ประกาศนโยบายโรงพยาบาล', policyData, '../');
      policyForm.reset();
      pendingPolicyImageUrl = null;
      if (policyImgPreviewBox) policyImgPreviewBox.style.display = 'none';
      document.getElementById('policy-badge').value = 'ประกาศนโยบายโรงพยาบาล';
      document.getElementById('policy-date').value = '30 ต.ค. 2569';
      document.getElementById('policy-views').value = '0';
      renderAdminPolicies();
      showToast('บันทึกประกาศนโยบายโรงพยาบาลเรียบร้อย! ผู้ชมสามารถกดดาวน์โหลดเอกสารและรูปภาพได้ทันที');
    });
  }

  // =========================================================================
  // เมนูที่ 4: จัดการดาวน์โหลดเอกสาร (ลงไฟล์เอกสารจริง + คำนวณขนาดไฟล์อัตโนมัติ)
  // =========================================================================
  let downloadsData = window.KSP_CMS.getSection('downloads', DEFAULT_DOWNLOAD_ITEMS);
  const downloadsListEl = document.getElementById('admin-downloads-list');
  const dlFileInput = document.getElementById('dl-file');

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
          <button type="button" class="admin-btn admin-btn-danger" data-del-download="${idx}">ลบเอกสาร</button>
        </div>
      `;
    }).join('');

    downloadsListEl.querySelectorAll('[data-del-download]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-download'));
        downloadsData.splice(idx, 1);
        const res = await window.KSP_CMS.saveSection('downloads', 'ดาวน์โหลดเอกสาร', downloadsData, '../');
        renderAdminDownloads();
        showToast(res.message);
      });
    });
  }
  renderAdminDownloads();

  const downloadForm = document.getElementById('form-add-download');
  if (downloadForm) {
    downloadForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      const fObj = dlFileInput && dlFileInput.files && dlFileInput.files[0] ? dlFileInput.files[0] ? dlFileInput.files[0] : null : null;
      const uploadedDataUrl = await readFileAsDataURL(dlFileInput);

      downloadsData.unshift({
        title: document.getElementById('dl-title').value.trim(),
        category: document.getElementById('dl-category').value,
        fileType: document.getElementById('dl-type').value,
        fileSize: document.getElementById('dl-size').value.trim() || '250 KB',
        updatedDate: document.getElementById('dl-date').value.trim() || '30 ต.ค. 2569',
        fileName: fObj ? fObj.name : '',
        fileDataUrl: uploadedDataUrl || '',
        fileUrl: '/downloads'
      });

      await window.KSP_CMS.saveSection('downloads', 'ดาวน์โหลดเอกสาร', downloadsData, '../');
      downloadForm.reset();
      document.getElementById('dl-size').value = '250 KB';
      document.getElementById('dl-date').value = '30 ต.ค. 2569';
      renderAdminDownloads();
      showToast('ลงไฟล์เอกสารดาวน์โหลดสำเร็จ!');
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
    if (slideForm) slideForm.reset();
    pendingSlideImgUrl = null;
    if (slideEditIndexInput) slideEditIndexInput.value = '';
    if (slideFormTitle) slideFormTitle.textContent = '+ เพิ่มสไลด์ประกาศใหม่';
    if (slideSubmitBtn) slideSubmitBtn.textContent = 'บันทึกสไลด์';
    if (slideCancelEditBtn) slideCancelEditBtn.style.display = 'none';
    if (slidePreviewBox) slidePreviewBox.style.display = 'none';
  }

  if (slideCancelEditBtn) {
    slideCancelEditBtn.addEventListener('click', resetSlideForm);
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
        if (slideSubmitBtn) slideSubmitBtn.textContent = 'บันทึกการแก้ไข';
        if (slideCancelEditBtn) slideCancelEditBtn.style.display = 'inline-block';

        slideForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
          showToast('สลับลำดับสไลด์เรียบร้อย!');
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
          showToast('สลับลำดับสไลด์เรียบร้อย!');
        }
      });
    });

    // ปุ่มลบสไลด์
    slidesListEl.querySelectorAll('[data-del-slide]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-slide'));
        if (confirm(`ต้องการลบสไลด์ "${slidesData[idx].title}" ใช่หรือไม่?`)) {
          slidesData.splice(idx, 1);
          const res = await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
          renderAdminSlides();
          showToast(res.message);
        }
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
        showToast('แก้ไขข้อมูลสไลด์ประกาศเรียบร้อย!');
      } else {
        slidesData.push({
          category: category || 'ประกาศประชาสัมพันธ์',
          title: title,
          image: finalImgUrl || 'assets/images/banners/banner-1.png',
          link: link
        });

        await window.KSP_CMS.saveSection('slides', 'Slide Bar', slidesData, '../');
        resetSlideForm();
        renderAdminSlides();
        showToast('เพิ่มสไลด์ประกาศใหม่เรียบร้อย!');
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

      const res = await window.KSP_CMS.saveSection('executive', 'ผู้บริหารและวิสัยทัศน์', execData, '../');
      showToast(res.message);
    });
  }

  // =========================================================================
  // เมนูที่ 7: จัดการแผนกและคลินิก
  // =========================================================================
  let deptsData = window.KSP_CMS.getSection('departments', DEFAULT_DEPARTMENTS_LIST);
  const deptsListEl = document.getElementById('admin-depts-list');

  function renderAdminDepts() {
    if (!deptsListEl) return;
    deptsListEl.innerHTML = deptsData.map(function (item, idx) {
      return `
        <div class="admin-list-row">
          <div class="admin-list-info">
            <div class="admin-list-text">
              <p class="admin-list-title">${item.title}</p>
              <p class="admin-list-sub">${item.description}</p>
            </div>
          </div>
          <button type="button" class="admin-btn admin-btn-danger" data-del-dept="${idx}">ลบ</button>
        </div>
      `;
    }).join('');

    deptsListEl.querySelectorAll('[data-del-dept]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-dept'));
        deptsData.splice(idx, 1);
        const res = await window.KSP_CMS.saveSection('departments', 'แผนกและคลินิก', deptsData, '../');
        renderAdminDepts();
        showToast(res.message);
      });
    });
  }
  renderAdminDepts();

  const deptForm = document.getElementById('form-add-dept');
  if (deptForm) {
    deptForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      deptsData.push({
        icon: document.getElementById('dept-icon').value,
        title: document.getElementById('dept-title').value.trim(),
        description: document.getElementById('dept-desc').value.trim(),
        link: '/departments'
      });
      const res = await window.KSP_CMS.saveSection('departments', 'แผนกและคลินิก', deptsData, '../');
      deptForm.reset();
      renderAdminDepts();
      showToast(res.message);
    });
  }

  // =========================================================================
  // เมนูที่ 8: จัดการเว็บไซต์ภายใน
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
    if (intraForm) intraForm.reset();
    pendingIntraLogoUrl = null;
    if (intraEditIndexInput) intraEditIndexInput.value = '';
    if (intraFormTitle) intraFormTitle.textContent = '+ เพิ่มระบบเว็บไซต์ภายในใหม่';
    if (intraSubmitBtn) intraSubmitBtn.textContent = 'บันทึกระบบภายในใหม่';
    if (intraCancelEditBtn) intraCancelEditBtn.style.display = 'none';
    if (intraLogoPreviewBox) intraLogoPreviewBox.style.display = 'none';
  }

  if (intraCancelEditBtn) {
    intraCancelEditBtn.addEventListener('click', resetIntraForm);
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

        intraForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    });

    intranetListEl.querySelectorAll('[data-del-intranet]').forEach(function (btn) {
      btn.addEventListener('click', async function () {
        const idx = Number(btn.getAttribute('data-del-intranet'));
        if (confirm(`ต้องการลบระบบงาน "${intranetData[idx].title}" ใช่หรือไม่?`)) {
          intranetData.splice(idx, 1);
          const res = await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
          renderAdminIntranet();
          showToast(res.message);
        }
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
          logo: pendingIntraLogoUrl || intranetData[editIdx].logo || ''
        };
        await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
        resetIntraForm();
        renderAdminIntranet();
        showToast('แก้ไขข้อมูลและ Logo เว็บไซต์ภายในเรียบร้อย!');
      } else {
        intranetData.push({
          code: code,
          title: title,
          description: desc,
          url: url || '/internal-websites',
          logo: pendingIntraLogoUrl || ''
        });
        await window.KSP_CMS.saveSection('intranet', 'เว็บไซต์ภายใน', intranetData, '../');
        resetIntraForm();
        renderAdminIntranet();
        showToast('บันทึกระบบเว็บไซต์ภายในพร้อม Logo เรียบร้อย!');
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

      const res = await window.KSP_CMS.saveSection('contact', 'ติดต่อเรา', contactData, '../');
      showToast(res.message);
    });
  }
});
