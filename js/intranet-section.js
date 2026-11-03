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
  mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>`
};

/**
 * รายการระบบเว็บไซต์ภายใน 32 ระบบงานตรงตามแบบระบบราชการสะดวก สสจ.สกลนคร
 * รวมทั้งระบบหลักของ รพ.โคกศรีสุพรรณ
 */
const DEFAULT_INTERNAL_WEBSITES = [
  // แถวที่ 1
  {
    title: '30 บาทรักษาทุกที่ ด้วยบัตรประชาชนใบเดียว.',
    code: '30 บาท',
    theme: 'purple',
    icon: 'globe',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://30baht.moph.go.th'
  },
  {
    title: 'Anti Drugs สกลนคร',
    code: 'Anti Drugs',
    theme: 'white',
    icon: 'pill',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://antidrug.skno.moph.go.th'
  },
  {
    title: 'CDC',
    code: 'CDC',
    theme: 'pink',
    icon: 'heart',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://cdc.moph.go.th'
  },
  {
    title: 'Cyber Security',
    code: 'Cyber Security',
    theme: 'white',
    icon: 'wall',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://cyber.skno.moph.go.th'
  },
  {
    title: 'e-Learning',
    code: 'e-Learning',
    theme: 'white',
    icon: 'grad',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://elearning.moph.go.th'
  },
  {
    title: 'Health Product Survey (อสม.อย. เยี่ยมบ้าน)',
    code: 'Health Product',
    theme: 'white',
    icon: 'capsule',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://survey.fda.moph.go.th'
  },

  // แถวที่ 2
  {
    title: 'Health Station',
    code: 'Health Station',
    theme: 'peach',
    icon: 'homeheart',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://healthstation.in.th'
  },
  {
    title: 'IOT',
    code: 'IOT',
    theme: 'white',
    icon: 'toggle',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://iot.skno.moph.go.th'
  },
  {
    title: 'KPI Cockpit',
    code: 'KPI',
    theme: 'sage',
    icon: 'gauge',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://cockpit.moph.go.th'
  },
  {
    title: 'MCH Net',
    code: 'MCH',
    theme: 'white',
    icon: 'gender',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://mchnet.anamai.moph.go.th'
  },
  {
    title: 'My Dashboard',
    code: 'Dashboard',
    theme: 'olive',
    icon: 'grid',
    actionText: 'รอตรวจสอบสิทธิ์',
    btnStyle: 'yellow',
    url: 'https://dashboard.skno.moph.go.th'
  },
  {
    title: 'OTP Server',
    code: 'OTP',
    theme: 'white',
    icon: 'lock',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://otp.skno.moph.go.th'
  },

  // แถวที่ 3
  {
    title: 'ProviderID Monitor',
    code: 'ProviderID',
    theme: 'taupe',
    icon: 'idcard',
    actionText: 'เข้าใช้งาน',
    btnStyle: 'transparent',
    url: 'https://provider.moph.go.th'
  },
  {
    title: 'Road Safety+',
    code: 'Safety+',
    theme: 'yellow',
    icon: 'car',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://roadsafety.moph.go.th'
  },
  {
    title: 'Student69',
    code: 'Student69',
    theme: 'white',
    icon: 'copy',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://student.skno.moph.go.th'
  },
  {
    title: 'Walk Run Bike 11',
    code: 'Walk Run Bike',
    theme: 'white',
    icon: 'activity',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://wrb11.moph.go.th'
  },
  {
    title: 'คัดกรองบุหรี่ แอลกอฮอล์',
    code: 'คัดกรอง',
    theme: 'mint',
    icon: 'search',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://screen.skno.moph.go.th'
  },
  {
    title: 'คุ้มครองผู้บริโภคและเภสัชสาธารณสุข',
    code: 'คุ้มครองผู้บริโภค',
    theme: 'lavender',
    icon: 'shieldcheck',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://consumer.skno.moph.go.th'
  },

  // แถวที่ 4
  {
    title: 'ตรวจร้านชำ SAKON SCAN',
    code: 'SAKON SCAN',
    theme: 'sky',
    icon: 'store',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://sakonscan.skno.moph.go.th'
  },
  {
    title: 'ตลาดสมุนไพรไกลกล',
    code: 'สมุนไพร',
    theme: 'white',
    icon: 'snowflake',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://herbal.skno.moph.go.th'
  },
  {
    title: 'ทะเบียนครุภัณฑ์',
    code: 'ครุภัณฑ์',
    theme: 'sage',
    icon: 'tools',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://assets.skno.moph.go.th'
  },
  {
    title: 'นักศึกษาราชภัฏสกลนคร',
    code: 'SNRU',
    theme: 'white',
    icon: 'contact',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://snru.ac.th'
  },
  {
    title: 'บ้านตุ้มโฮมปันสุข',
    code: 'ปันสุข',
    theme: 'white',
    icon: 'homeheart',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://tumhom.skno.moph.go.th'
  },
  {
    title: 'ภาพกิจกรรม',
    code: 'ภาพงาน',
    theme: 'white',
    icon: 'image',
    actionText: 'เข้าชมภาพ',
    btnStyle: 'transparent',
    url: '/news'
  },

  // แถวที่ 5
  {
    title: 'ยาเสพติด',
    code: 'บำบัดยาเสพติด',
    theme: 'gray',
    icon: 'drugpack',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://drug.skno.moph.go.th'
  },
  {
    title: 'ศูนย์ข้อมูลด้านจิตเวชจังหวัดสกลนคร',
    code: 'จิตเวช',
    theme: 'palegreen',
    icon: 'user',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://psych.skno.moph.go.th'
  },
  {
    title: 'ส่งผลงานวิชาการปี 2569',
    code: 'วิชาการ',
    theme: 'rose',
    icon: 'rss',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://academic.skno.moph.go.th'
  },
  {
    title: 'หมอพร้อม',
    code: 'หมอพร้อม',
    theme: 'white',
    icon: 'cross',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://mohpromt.moph.go.th'
  },
  {
    title: 'หมอไม่ล้า ประชาชนไม่รอฯ',
    code: 'หมอไม่ล้า',
    theme: 'forest',
    icon: 'pulsebadge',
    actionText: 'เข้าสู่ระบบ',
    btnStyle: 'transparent',
    url: 'https://smarthealth.moph.go.th'
  },
  {
    title: 'อย.สกล Alert',
    code: 'อย.สกล',
    theme: 'white',
    icon: 'megaphone',
    actionText: 'เปิดดูประกาศ',
    btnStyle: 'transparent',
    url: 'https://fda.skno.moph.go.th'
  },

  // แถวที่ 6
  {
    title: 'อสม. Sakon Plus+',
    code: 'อสม.Plus+',
    theme: 'magenta',
    icon: 'userplus',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://osm.skno.moph.go.th'
  },
  {
    title: 'เรียกเก็บOP นอกCUP ในจังหวัด',
    code: 'เรียกเก็บ OP',
    theme: 'maroon',
    icon: 'dollar',
    actionText: 'สมัครใช้งาน',
    btnStyle: 'green',
    url: 'https://claim.skno.moph.go.th'
  },

  // ระบบงานหลักโรงพยาบาลโคกศรีสุพรรณ
  {
    title: 'HOSxP / HIS โคกศรีสุพรรณ',
    code: 'HIS',
    theme: 'white',
    icon: 'server',
    actionText: 'เข้าใช้งานระบบ',
    btnStyle: 'green',
    url: 'http://192.168.2.202:3088'
  },
  {
    title: 'E-Office ระบบงานสารบรรณ',
    code: 'E-Office',
    theme: 'white',
    icon: 'mail',
    actionText: 'เข้าใช้งานระบบ',
    btnStyle: 'green',
    url: '/internal-websites'
  }
];

const INTERNAL_WEBSITES = (function () {
  try {
    const saved = localStorage.getItem('ksp_cms_v1_intranet');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return DEFAULT_INTERNAL_WEBSITES;
})();

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
 * ฟังก์ชันสร้างโครงสร้าง HTML ส่วนเว็บไซต์ภายในตามแบบระบบราชการสะดวก สสจ.สกลนคร
 */
function renderIntranetSectionHTML(rootPath) {
  const cardsMarkup = INTERNAL_WEBSITES.map(function (item, idx) {
    const targetUrl = resolveIntranetUrl(rootPath, item.url);
    const isExternal = /^(?:[a-z+]+:)?\/\//i.test(targetUrl);
    const targetAttr = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

    // เลือกธีมสีตามการ์ด
    const themeKey = item.theme || (idx % 2 === 0 ? 'white' : 'peach');
    const theme = INTRANET_THEMES[themeKey] || INTRANET_THEMES.white;

    // เลือกไอคอน
    let iconMarkup = INTRANET_ICONS[item.icon] || INTRANET_ICONS.globe;
    if (item.logo && (item.logo.startsWith('data:') || item.logo.startsWith('http') || item.logo.includes('/'))) {
      iconMarkup = `<img src="${item.logo.startsWith('http') || item.logo.startsWith('data:') ? item.logo : rootPath + item.logo}" alt="${item.title}" class="intranet-card-logo-img" />`;
    }

    // ข้อความและสีปุ่มแคปซูลด้านล่าง
    const actionText = item.actionText || 'สมัครใช้งาน';
    let btnClass = 'intranet-pill-green';
    if (item.btnStyle === 'yellow' || actionText.includes('รอ')) {
      btnClass = 'intranet-pill-yellow';
    } else if (item.btnStyle === 'transparent' || item.btnStyle === 'none') {
      btnClass = 'intranet-pill-ghost';
    }

    return `
      <a href="${targetUrl}" class="intranet-convenience-card theme-${themeKey}" ${targetAttr} style="background-color:${theme.bg}; color:${theme.color}; border-color:${theme.border};" title="${item.title}">
        <div class="intranet-card-icon-wrap">
          ${iconMarkup}
        </div>
        <div class="intranet-card-title-wrap">
          <span class="intranet-card-title-text">${item.title}</span>
        </div>
        ${actionText ? `<span class="intranet-pill-btn ${btnClass}">${actionText}</span>` : ''}
      </a>
    `;
  }).join('');

  return `
    <section class="intranet-convenience-section" aria-labelledby="intranet-heading">
      <div class="intranet-convenience-container">
        <!-- แถบหัวข้อตัวหนาสีเขียวตรงตามแบบราชการสะดวก สสจ.สกลนคร -->
        <div class="intranet-convenience-header">
          <h2 class="intranet-convenience-title" id="intranet-heading">ระบบราชการสะดวกสำนักงานสาธารณสุขจังหวัดสกลนคร</h2>
        </div>

        <!-- ตารางการ์ด Grid 6 คอลัมน์ต่อแถว (Responsive ลงตามขนาดจอ) -->
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

  intranetPlaceholder.innerHTML = renderIntranetSectionHTML(rootPath);
});
