/* ==========================================================================
   ไฟล์: js/intranet-section.js
   หน้าที่: สร้างส่วน "ระบบราชการสะดวก / เว็บไซต์ภายใน" (สสจ.สกลนคร & รพ.โคกศรีสุพรรณ)
   ตามรูปแบบ Grid 6 คอลัมน์ การ์ดขอบมนสไตล์ราชการสะดวก พร้อมปุ่มสมัครใช้งาน/เข้าสู่ระบบ
   ========================================================================== */

/**
 * ชุดสีและธีมประจำการ์ดตามต้นฉบับระบบราชการสะดวก สสจ.สกลนคร
 */
const INTRANET_THEMES = {
  white: { bg: '#ffffff', color: '#1e293b', border: '#e2e8f0', btnStyle: 'green' },
  purple: { bg: '#8e7bbd', color: '#ffffff', border: '#806cb0', btnStyle: 'green' },
  pink: { bg: '#f1b3af', color: '#4a1515', border: '#e89e9a', btnStyle: 'green' },
  peach: { bg: '#f7ceb1', color: '#5c290a', border: '#ecc1a2', btnStyle: 'green' },
  sage: { bg: '#d4ebd8', color: '#1b4329', border: '#c3e2c8', btnStyle: 'green' },
  olive: { bg: '#a9cd9f', color: '#1c3b16', border: '#97bf8c', btnStyle: 'yellow' },
  taupe: { bg: '#d5b5a7', color: '#422922', border: '#c8a494', btnStyle: 'transparent' },
  yellow: { bg: '#f6ebb6', color: '#4e4010', border: '#ebdca0', btnStyle: 'green' },
  mint: { bg: '#bee4d9', color: '#0f3d32', border: '#abd7cb', btnStyle: 'green' },
  lavender: { bg: '#b8abeb', color: '#2e1a66', border: '#a597e0', btnStyle: 'green' },
  sky: { bg: '#b1daf0', color: '#0c364d', border: '#9ccde6', btnStyle: 'green' },
  palegreen: { bg: '#d9f3c8', color: '#254013', border: '#c7e8b2', btnStyle: 'green' },
  gray: { bg: '#cacacf', color: '#25252b', border: '#bcbcc2', btnStyle: 'green' },
  rose: { bg: '#f6b4be', color: '#50131d', border: '#e99ea9', btnStyle: 'green' },
  forest: { bg: '#174233', color: '#ffffff', border: '#12372a', btnStyle: 'transparent' },
  magenta: { bg: '#d924d5', color: '#ffffff', border: '#c21bbe', btnStyle: 'green' },
  maroon: { bg: '#460f08', color: '#ffffff', border: '#360a04', btnStyle: 'green' }
};

/**
 * คลังไอคอน SVG สัญลักษณ์ประจำระบบงาน
 */
const INTRANET_ICONS = {
  globe: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>`,
  pill: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>`,
  heart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>`,
  wall: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"></rect><path d="M3 9h18"></path><path d="M3 15h18"></path><path d="M9 3v6"></path><path d="M15 9v6"></path><path d="M9 15v6"></path><path d="M15 3v6"></path><path d="M9 9v6"></path></svg>`,
  grad: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>`,
  capsule: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="8" x="4" y="8" rx="4" transform="rotate(-45 12 12)"></rect><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
  home: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>`,
  toggle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="12" x="2" y="6" rx="6" ry="6"></rect><circle cx="8" cy="12" r="3"></circle></svg>`,
  gauge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path></svg>`,
  gender: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="10" cy="14" r="5"></circle><line x1="14" y1="10" x2="20" y2="4"></line><polyline points="15 4 20 4 20 9"></polyline><line x1="10" y1="19" x2="10" y2="22"></line><line x1="7" y1="21" x2="13" y2="21"></line></svg>`,
  grid: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>`,
  lock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>`,
  idcard: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"></rect><circle cx="9" cy="11" r="2"></circle><path d="M15 9h2"></path><path d="M15 13h2"></path><path d="M6 17a3 3 0 0 1 6 0"></path></svg>`,
  car: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"></path><circle cx="7" cy="17" r="2"></circle><path d="M9 17h6"></path><circle cx="17" cy="17" r="2"></circle></svg>`,
  copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>`,
  activity: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
  shieldcheck: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path><polyline points="9 12 11 14 15 10"></polyline></svg>`,
  store: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"></path><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"></path><path d="M2 7h20"></path><path d="M22 7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2"></path></svg>`,
  snowflake: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="2" y1="12" x2="22" y2="12"></line><line x1="12" y1="2" x2="12" y2="22"></line><path d="m20 16-4-4 4-4"></path><path d="m4 8 4 4-4 4"></path><path d="m16 4-4 4-4-4"></path><path d="m8 20 4-4 4 4"></path></svg>`,
  tools: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m14.7 10.7 5.3 5.3-4 4-5.3-5.3"></path><path d="m7 7 4-4 5.3 5.3-4 4z"></path><path d="M2 22h4"></path><path d="M4 20v2"></path><path d="M20 4v2"></path><path d="M22 2h-4"></path></svg>`,
  contact: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="14" x="3" y="5" rx="2"></rect><circle cx="9" cy="11" r="2"></circle><line x1="15" y1="9" x2="17" y2="9"></line><line x1="15" y1="13" x2="17" y2="13"></line></svg>`,
  homeheart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M12 11.5c-1-1.3-2.5-1-3 .5-.5 1.5 1.5 3 3 4 1.5-1 3.5-2.5 3-4-.5-1.5-2-1.8-3-.5Z"></path></svg>`,
  image: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect><circle cx="9" cy="9" r="2"></circle><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path></svg>`,
  drugpack: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="20" x="5" y="2" rx="2"></rect><line x1="12" y1="2" x2="12" y2="22"></line><line x1="5" y1="8" x2="19" y2="8"></line><line x1="5" y1="16" x2="19" y2="16"></line><circle cx="8.5" cy="5" r="1"></circle><circle cx="15.5" cy="5" r="1"></circle><circle cx="8.5" cy="12" r="1"></circle><circle cx="15.5" cy="12" r="1"></circle></svg>`,
  user: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>`,
  rss: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11a9 9 0 0 1 9 9"></path><path d="M4 4a16 16 0 0 1 16 16"></path><circle cx="5" cy="19" r="1"></circle></svg>`,
  cross: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20M2 12h20"></path></svg>`,
  pulsebadge: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path><path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h6.28"></path></svg>`,
  megaphone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 11 18-5v12L3 14v-3z"></path><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"></path></svg>`,
  userplus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="19" y1="8" x2="19" y2="14"></line><line x1="22" y1="11" x2="16" y2="11"></line></svg>`,
  dollar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="6" x2="12" y2="18"></line><path d="M14.5 9h-4a1.5 1.5 0 0 0 0 3h3a1.5 1.5 0 0 1 0 3h-4"></path></svg>`,
  server: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect><rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect><line x1="6" y1="6" x2="6.01" y2="6"></line><line x1="6" y1="18" x2="6.01" y2="18"></line></svg>`,
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`,
  bed: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 8v11"></path><path d="M2 15h20v4"></path><path d="M6 15v-4a2 2 0 0 1 2-2h10a4 4 0 0 1 4 4v2"></path><circle cx="6" cy="11" r="1.5"></circle></svg>`,
  wrench: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.7-3.7a6 6 0 0 1-7.9 7.9l-6.9 6.9a2.1 2.1 0 0 1-3-3l6.9-6.9a6 6 0 0 1 7.9-7.9l-3.7 3.7z"></path></svg>`,
  barchart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line><line x1="3" y1="20" x2="21" y2="20"></line></svg>`,
  calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="4" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`,
  monitor: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`,
  packagebox: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path><polyline points="3.3 7 12 12 20.7 7"></polyline><line x1="12" y1="22" x2="12" y2="12"></line></svg>`,
  stethoscope: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 3v6a4.5 4.5 0 0 0 9 0V3"></path><path d="M9 13.5V16a4 4 0 0 0 8 0v-3"></path><circle cx="19" cy="11" r="2"></circle></svg>`,
  handheart: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 10.5c-.8-1.3-2.5-1.5-3.5-.3-1 1.2-.5 3 3.5 5.3 4-2.3 4.5-4.1 3.5-5.3-1-1.2-2.7-1-3.5.3Z"></path><path d="M3 15h4l3 3h6a2 2 0 0 1 0 4H8l-5-3Z"></path></svg>`,
  nursing: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 14h18l-2-7H5l-2 7Z"></path><path d="M5 14v3a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3v-3"></path><path d="M12 8.5v3M10.5 10h3"></path></svg>`,
  palette: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="9" r="1.2"></circle><circle cx="14.5" cy="9" r="1.2"></circle><circle cx="8.5" cy="13.5" r="1.2"></circle><circle cx="15" cy="14" r="1.5"></circle></svg>`,
  flask: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6"></path><path d="M10 3v5l-5 9a2 2 0 0 0 1.7 3h10.6a2 2 0 0 0 1.7-3l-5-9V3"></path><line x1="7.5" y1="15" x2="16.5" y2="15"></line></svg>`,
  medbook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5Z"></path><path d="M12 8v6M9 11h6"></path></svg>`
};

/**
 * รายการระบบเว็บไซต์ภายในของโรงพยาบาลโคกศรีสุพรรณ
 * จัดรูปแบบตามมาตรฐาน "ระบบราชการสะดวก"
 */
const DEFAULT_INTERNAL_WEBSITES = [
  {
    code: 'HIS',
    title: 'ระบบสารสนเทศโรงพยาบาล (HOSxP / HIS)',
    description: 'ระบบเวชระเบียนอิเล็กทรอนิกส์และการให้บริการผู้ป่วยนอก-ผู้ป่วยใน',
    url: 'http://192.168.2.202:3088',
    theme: 'purple',
    icon: 'server',
    actionText: 'เข้าใช้งานระบบ',
    btnStyle: 'green'
  },
  {
    code: 'E-Office',
    title: 'ระบบงานสารบรรณอิเล็กทรอนิกส์',
    description: 'ระบบรับ-ส่งหนังสือราชการ แจ้งเวียนประกาศ และเอกสารภายในองค์กร',
    url: '/internal-websites',
    theme: 'white',
    icon: 'mail',
    actionText: 'เข้าสู่ระบบ',
    btnStyle: 'green'
  },
  {
    code: 'Digital Health',
    title: 'กลุ่มงานสุขภาพดิจิทัล (IT Helpdesk)',
    description: 'ระบบแจ้งซ่อมคอมพิวเตอร์ เครือข่ายอินเทอร์เน็ต และความมั่นคงปลอดภัยไซเบอร์',
    url: '/internal-websites',
    theme: 'sage',
    icon: 'wall',
    actionText: 'แจ้งซ่อม IT',
    btnStyle: 'green'
  },
  {
    code: 'HR & E-Leave',
    title: 'ระบบบริหารทรัพยากรบุคคล',
    description: 'ระบบฐานข้อมูลบุคลากร ตารางปฏิบัติงาน และระบบการลาอิเล็กทรอนิกส์',
    url: '/internal-websites',
    theme: 'peach',
    icon: 'idcard',
    actionText: 'ระบบการลา',
    btnStyle: 'green'
  },
  {
    code: 'HDC / Data',
    title: 'คลังข้อมูลสุขภาพและตัวชี้วัด (HDC)',
    description: 'ระบบรายงานข้อมูลสถิติทางการแพทย์และตัวชี้วัดกระทรวงสาธารณสุข',
    url: '/internal-websites',
    theme: 'olive',
    icon: 'gauge',
    actionText: 'รอตรวจสอบสิทธิ์',
    btnStyle: 'yellow'
  },
  {
    code: 'Back Office',
    title: 'ระบบบริหารคลังยาและพัสดุ',
    description: 'ระบบเบิก-จ่ายเวชภัณฑ์ยา พัสดุทางการแพทย์ และครุภัณฑ์โรงพยาบาล',
    url: '/internal-websites',
    theme: 'sky',
    icon: 'tools',
    actionText: 'เบิกเวชภัณฑ์',
    btnStyle: 'green'
  },
  {
    code: 'HA / Risk',
    title: 'ระบบบริหารความเสี่ยงและคุณภาพ (HA)',
    description: 'ระบบรายงานอุบัติการณ์ความเสี่ยงและเอกสารมาตรฐานคุณภาพโรงพยาบาล',
    url: '/internal-websites',
    theme: 'mint',
    icon: 'shieldcheck',
    actionText: 'รายงานความเสี่ยง',
    btnStyle: 'green'
  },
  {
    code: 'Smart Booking',
    title: 'ระบบจองห้องประชุมและยานพาหนะ',
    description: 'บริการจองห้องประชุมวิชาการและขออนุญาตใช้รถยนต์ส่วนกลางออนไลน์',
    url: '/internal-websites',
    theme: 'yellow',
    icon: 'car',
    actionText: 'จองห้องประชุม',
    btnStyle: 'green'
  },
  {
    code: 'Queue',
    title: 'ระบบเรียกคิวผู้ป่วยอัจฉริยะ (Smart Queue)',
    description: 'ระบบจัดการคิวตรวจผู้ป่วย แผนกเวชระเบียนและจุดบริการผู้ป่วยนอก',
    url: '/internal-websites',
    theme: 'pink',
    icon: 'activity',
    actionText: 'เปิดดูระบบคิว',
    btnStyle: 'green'
  }
];

function getLatestIntranetList() {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_intranet');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (e) {}
  return DEFAULT_INTERNAL_WEBSITES;
}
let INTERNAL_WEBSITES = getLatestIntranetList();

function resolveIntranetUrl(rootPath, url) {
  if (!url) return '#';
  const cleanUrl = url.trim();
  if (/^(?:[a-z+]+:)?\/\//i.test(cleanUrl)) return cleanUrl;
  if (/^www\./i.test(cleanUrl) || /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(cleanUrl)) {
    return 'http://' + cleanUrl;
  }
  return rootPath + cleanUrl;
}

/**
 * จับคู่โลโก้/ไอคอน SVG ให้ตรงกับชื่อระบบของแต่ละช่องโดยอัตโนมัติ
 */
function resolveSmartIntranetIconKey(item) {
  const title = (item.title || '').toLowerCase();
  if (title.includes('บุคลากร') || title.includes('hr')) return 'idcard';
  if (title.includes('ผู้ป่วยใน') || title.includes('ipd') || title.includes('ภาระงาน')) return 'bed';
  if (title.includes('ครุภัณฑ์ทางการแพทย์') || title.includes('เครื่องมือแพทย์')) return 'stethoscope';
  if (title.includes('ซ่อมบำรุง') || title.includes('ช่าง')) return 'wrench';
  if (title.includes('รายงาน') || title.includes('report')) return 'barchart';
  if (title.includes('รถ') || title.includes('car')) return 'car';
  if (title.includes('ประชุม') || title.includes('meeting')) return 'calendar';
  if (title.includes('คอมพิวเตอร์') || title.includes('it') || title.includes('เซอร์วิส')) return 'monitor';
  if (title.includes('ยืมครุภัณฑ์') || title.includes('ครุภัณฑ์')) return 'packagebox';
  if (title.includes('palliative')) return 'handheart';
  if (title.includes('long term') || title.includes('ltc')) return 'homeheart';
  if (title.includes('พยาบาล') || title.includes('nurs')) return 'nursing';
  if (title.includes('ผลิตสื่อ') || title.includes('ออกแบบ') || title.includes('ป้าย')) return 'palette';
  if (title.includes('lab') || title.includes('แล็บ')) return 'flask';
  if (title.includes('cpg') || title.includes('cup')) return 'medbook';
  return item.icon || 'globe';
}

/**
 * สร้างคำอธิบายรายละเอียดระบบอัตโนมัติ (กรณีในฐานข้อมูลยังไม่ได้กรอก description)
 */
function resolveSmartIntranetDesc(item) {
  const rawDesc = (item.description || '').trim();
  if (rawDesc && rawDesc.length > 8) return rawDesc;

  const title = (item.title || '').toLowerCase();
  if (title.includes('บุคลากร')) return 'ระบบจัดการข้อมูลบุคลากร การลาป่วย ลากิจ ลาพักผ่อน และทะเบียนประวัติเจ้าหน้าที่โรงพยาบาลโคกศรีสุพรรณ';
  if (title.includes('ผู้ป่วยใน')) return 'ระบบบันทึกภาระงานทางการพยาบาล การประเมินระดับความรุนแรง และสถิติการดูแลผู้ป่วยในประจำวัน';
  if (title.includes('ซ่อมบำรุง')) return 'ระบบแจ้งซ่อมอาคารสถานที่ ระบบไฟฟ้า ประปา และสาธารณูปโภคออนไลน์ พร้อมติดตามสถานะงานช่างแบบเรียลไทม์';
  if (title.includes('รายงาน')) return 'ระบบยื่นคำขอรายงานข้อมูลสถิติจากฐานข้อมูล HOSxP สำหรับหน่วยงานภายในเพื่อใช้พัฒนาคุณภาพบริการ';
  if (title.includes('รถ')) return 'ระบบขออนุญาตใช้รถยนต์ส่วนกลางและรถพยาบาลออนไลน์ พร้อมตรวจสอบตารางเดินรถและสถานะการอนุมัติ';
  if (title.includes('ประชุม')) return 'ระบบตรวจสอบตารางว่างและจองห้องประชุมออนไลน์ พร้อมจัดเตรียมโสตทัศนูปกรณ์ของโรงพยาบาล';
  if (title.includes('คอมพิวเตอร์')) return 'ระบบแจ้งปัญหาด้านคอมพิวเตอร์ เครือข่ายอินเทอร์เน็ต โปรแกรมโรงพยาบาล และขอรับบริการจากทีมไอที';
  if (title.includes('ยืมครุภัณฑ์')) return 'ระบบบันทึกการยืม-คืนครุภัณฑ์และวัสดุอุปกรณ์ภายในโรงพยาบาล เพื่อควบคุมและติดตามการใช้งานอย่างเป็นระบบ';
  if (title.includes('ทางการแพทย์')) return 'ระบบแจ้งซ่อมและบำรุงรักษาเครื่องมือแพทย์ออนไลน์ เพื่อความพร้อมและความปลอดภัยในการดูแลรักษาผู้ป่วย';
  if (title.includes('palliative')) return 'ระบบติดตามและประสานงานการดูแลผู้ป่วยแบบประคับประคอง (Palliative Care) ต่อเนื่องทั้งในโรงพยาบาลและที่บ้าน';
  if (title.includes('long term')) return 'ระบบข้อมูลและวางแผนการดูแลผู้สูงอายุและผู้ป่วยที่มีภาวะพึ่งพิงระยะยาว (LTC) ร่วมกับเครือข่ายชุมชน';
  if (title.includes('พยาบาล')) return 'ศูนย์กลางข้อมูล ข่าวสาร มาตรฐานวิชาชีพ และระบบงานบริหารจัดการของกลุ่มการพยาบาล โรงพยาบาลโคกศรีสุพรรณ';
  if (title.includes('ผลิตสื่อ')) return 'ระบบขอรับบริการออกแบบสื่อประชาสัมพันธ์ ป้ายไวนิล โปสเตอร์ และสื่อให้ความรู้ด้านสุขภาพออนไลน์';
  if (title.includes('lab')) return 'ระบบสืบค้นและติดตามผลการตรวจทางห้องปฏิบัติการ (LAB) ออนไลน์ สำหรับแพทย์และบุคลากรทางการแพทย์';
  if (title.includes('cpg')) return 'คลังแนวทางเวชปฏิบัติทางคลินิก (Clinical Practice Guidelines) สำหรับเครือข่ายบริการสุขภาพอำเภอโคกศรีสุพรรณ';
  return 'ระบบสารสนเทศและบริการงานภายในสำหรับบุคลากร โรงพยาบาลโคกศรีสุพรรณ เพื่อความสะดวก รวดเร็ว และมีประสิทธิภาพ';
}

/**
 * ฟังก์ชันสร้างโครงสร้าง HTML ส่วนเว็บไซต์ภายในตามภาพต้นแบบ (1=Logo, 2=รหัส/ชื่อระบบ, 3=ชื่อระบบ, 4=รายละเอียด)
 */
function renderIntranetSectionHTML(rootPath) {
  const cardsMarkup = INTERNAL_WEBSITES.map(function (item) {
    const targetUrl = resolveIntranetUrl(rootPath, item.url);
    const isExternal = /^(?:[a-z+]+:)?\/\//i.test(targetUrl);
    const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

    // 1. Logo (วงกลมมุมซ้ายบน)
    const smartIconKey = resolveSmartIntranetIconKey(item);
    let iconMarkup = INTRANET_ICONS[smartIconKey] || INTRANET_ICONS[item.icon] || INTRANET_ICONS.globe;
    if (item.logo && (item.logo.startsWith('data:') || item.logo.startsWith('http') || item.logo.includes('/'))) {
      iconMarkup = `<img src="${item.logo.startsWith('http') || item.logo.startsWith('data:') ? item.logo : rootPath + item.logo}" alt="${item.title}" class="intranet-card-logo-img" />`;
    }

    // 2. ชื่อระบบ / รหัสระบบด้านขวา Logo
    const systemTag = (item.code && item.code.trim()) ? item.code.trim() : 'KSP SYSTEM';

    // 3. ชื่อระบบหลัก และ 4. รายละเอียดของระบบ
    const systemDesc = resolveSmartIntranetDesc(item);

    return `
      <a href="${targetUrl}" class="intranet-convenience-card" ${targetAttr} title="${item.title}">
        <div class="intranet-card-top-row">
          <div class="intranet-card-icon-wrap">
            ${iconMarkup}
          </div>
          <div class="intranet-card-code-wrap">
            <span class="intranet-card-code-badge">${systemTag}</span>
          </div>
        </div>
        <h3 class="intranet-card-title-text">${item.title}</h3>
        <p class="intranet-card-desc-text">${systemDesc}</p>
      </a>
    `;
  }).join('');

  return `
    <section class="intranet-convenience-section" aria-label="ระบบงานภายใน โรงพยาบาลโคกศรีสุพรรณ">
      <div class="intranet-convenience-container">
        <div class="intranet-convenience-header">
          <span class="intranet-convenience-badge">SMART HOSPITAL PORTAL • ระบบงานภายใน</span>
        </div>

        <div class="intranet-convenience-grid">
          ${cardsMarkup}
        </div>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', function () {
  const normalizedPath = window.location.pathname.replace(/\\/g, '/');
  const isSubPage = normalizedPath.includes('/pages/');
  const rootPath = isSubPage ? '../' : '';

  const intranetPlaceholder = document.getElementById('intranet-placeholder');
  if (!intranetPlaceholder) return;

  function mountIntranet() {
    INTERNAL_WEBSITES = getLatestIntranetList();
    intranetPlaceholder.innerHTML = renderIntranetSectionHTML(rootPath);
  }

  mountIntranet();

  window.addEventListener('ksp:cms-synced', function (e) {
    if (e.detail && e.detail.hasChanges) {
      mountIntranet();
    }
  });
});
