/* ==========================================================================
   ไฟล์: js/data/cms-store.js
   หน้าที่: ตัวกลางจัดการข้อมูลระบบหลังบ้านแบบ Hybrid (LocalStorage + PHP/MySQL)
   การทำงานสำหรับมือใหม่:
     1. โหมด LocalStorage (ข้อ 1): บันทึกและดึงข้อมูลในเบราว์เซอร์ทันที เปิดไฟล์เว็บตรงๆ ก็ใช้งานระบบหลังบ้านได้เลย
     2. โหมด PHP + MySQL (ข้อ 3): เมื่อเปิดผ่าน XAMPP (http://localhost/...) ระบบจะส่งข้อมูลไปบันทึกลงฐานข้อมูล MySQL ที่ api/cms.php ให้พร้อมกันอัตโนมัติ!
   ========================================================================== */

const KSP_STORAGE_PREFIX = 'ksp_cms_v1_';

window.KSP_CMS = {
  /**
   * ดึงข้อมูลของแต่ละส่วน (ถ้าแอดมินเคยแก้ไขไว้ในระบบหลังบ้าน จะดึงข้อมูลใหม่มาแสดงแทนค่าเริ่มต้น)
   */
  getSection: function (sectionKey, defaultData) {
    try {
      const raw = localStorage.getItem(KSP_STORAGE_PREFIX + sectionKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed !== null && parsed !== undefined) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('ไม่สามารถอ่านข้อมูล LocalStorage ส่วน ' + sectionKey, err);
    }
    return defaultData;
  },

  /**
   * บันทึกข้อมูลของแต่ละส่วน (บันทึกลงทั้ง LocalStorage และส่งไปที่ PHP + MySQL ถ้ารันบนเซิร์ฟเวอร์)
   */
  saveSection: async function (sectionKey, sectionName, sectionData, rootPath) {
    // 1. บันทึกลง LocalStorage ทันที (ข้อ 1)
    try {
      localStorage.setItem(KSP_STORAGE_PREFIX + sectionKey, JSON.stringify(sectionData));
    } catch (err) {
      console.error('บันทึกลง LocalStorage ไม่สำเร็จ (ไฟล์รูปอาจมีขนาดใหญ่เกินไป):', err);
      throw new Error('ขนาดข้อมูลหรือรูปภาพใหญ่เกินพื้นที่จัดเก็บของเบราว์เซอร์');
    }

    // 2. ถ้าเปิดผ่านเว็บเซิร์ฟเวอร์ XAMPP (http:// หรือ https://) ให้ส่งไปบันทึกลงฐานข้อมูล MySQL ด้วย (ข้อ 3)
    if (window.location.protocol === 'http:' || window.location.protocol === 'https:') {
      try {
        const apiUrl = (rootPath || '') + 'api/cms.php?action=save_section';
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            section_key: sectionKey,
            section_name: sectionName,
            section_data: sectionData
          })
        });
        if (response.ok) {
          const resJson = await response.json();
          return { mode: 'mysql+local', message: resJson.message || 'บันทึกลง MySQL และ LocalStorage สำเร็จ' };
        }
      } catch (networkErr) {
        // กรณีไม่ได้เปิด XAMPP MySQL ระบบจะใช้ LocalStorage ทำงานต่อได้ปกติโดยไม่พัง
      }
    }

    return {
      mode: 'local',
      message: 'บันทึกข้อมูลสำเร็จ (อัปเดตหน้าเว็บไซต์เรียบร้อย!)'
    };
  },

  /**
   * รีเซ็ตข้อมูลส่วนนั้นกลับเป็นค่าเริ่มต้นของโรงพยาบาล
   */
  resetSection: function (sectionKey) {
    localStorage.removeItem(KSP_STORAGE_PREFIX + sectionKey);
  },

  /**
   * รีเซ็ตข้อมูลทั้งหมดกลับเป็นค่าเริ่มต้น
   */
  resetAll: function () {
    Object.keys(localStorage).forEach(function (k) {
      if (k.startsWith(KSP_STORAGE_PREFIX)) {
        localStorage.removeItem(k);
      }
    });
  }
};
