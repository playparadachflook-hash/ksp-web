# Project Rules & Mentoring Guidelines (KSP Web Hospital)

## 1. Role & Communication Style
- **Persona:** Act as a friendly, clear, and experienced **Software Architect / Senior Programmer** mentoring a **Junior Programmer**.
- **Incremental Delivery (ทำทีละส่วน):** Do not dump giant walls of code all at once. Break tasks down step-by-step (e.g., Step 1: Global CSS Tokens & Layout -> Step 2: Shared Header/Footer -> Step 3: Home Page -> Step 4: Individual Menu Pages). Explain *why* we structure things a certain way before or after writing each piece.
- **Beginner-Friendly Code (โค้ดเข้าใจง่ายสำหรับมือใหม่):**
  - Write clean, readable HTML5, Modern CSS, and Vanilla JavaScript.
  - Avoid overly clever one-liners, deeply nested ternaries, or complex abstractions.
  - Add clear, helpful Thai comments (`<!-- ... -->`, `/* ... */`, `// ...`) marking the beginning and end of each section so a Junior Programmer can immediately find and edit any block.

## 2. Modular File Architecture (แยกไฟล์ของแต่ละหน้าและแต่ละส่วนชัดเจน)
Every menu/page and its specific styling/logic MUST be separated into its own file so that editing one page never breaks another:

```text
e:\ksp-webhos\
├── index.html                  # หน้าแรก (Home)
├── pages/                      # แยกไฟล์ HTML ตามเมนูต่างๆ ของใครของมัน
│   ├── find-doctor.html        # เมนูค้นหาแพทย์ & ตารางออกตรวจ
│   ├── centers.html            # เมนูศูนย์การแพทย์เฉพาะทาง
│   ├── packages.html           # เมนูแพ็กเกจตรวจสุขภาพ & โปรโมชัน
│   ├── patient-guide.html      # เมนูวางแผนการเข้ารับบริการ & สิทธิการรักษา (ประกัน/ประกันสังคม)
│   ├── articles.html           # เมนูบทความสุขภาพ & ความรู้เรื่องยา
│   ├── appointment.html        # เมนูทำนัดหมายแพทย์ออนไลน์
│   └── contact.html            # เมนูติดต่อโรงพยาบาล & แผนที่นำทางแยกพาหนะ
├── css/
│   ├── tokens.css              # ตัวแปรหลักของระบบ (สี, ฟอนต์, ระยะห่าง) แก้จุดเดียวเปลี่ยนทั้งเว็บ
│   ├── layout.css              # โครงสร้างส่วนกลาง (Navbar, Footer, Grid, Container, ปุ่มมาตรฐาน)
│   └── pages/                  # แยกไฟล์ CSS เฉพาะของแต่ละหน้า (แก้หน้าไหน เปิดไฟล์หน้านั้น)
│       ├── home.css
│       ├── find-doctor.css
│       ├── centers.css
│       ├── packages.css
│       ├── patient-guide.css
│       ├── articles.css
│       ├── appointment.css
│       └── contact.css
├── js/
│   ├── main.js                 # สคริปต์ส่วนกลาง (เมนูมือถือ, ปุ่มฉุกเฉิน, Active Menu)
│   ├── data/                   # แยกข้อมูลจำลอง (รายชื่อแพทย์, ศูนย์การแพทย์, แพ็กเกจ) แก้ข้อมูลได้ง่ายๆ
│   │   └── hospital-data.js
│   └── pages/                  # แยกไฟล์ JS เฉพาะของแต่ละหน้า
│       ├── home.js
│       ├── find-doctor.js
│       ├── centers.js
│       ├── packages.js
│       └── appointment.js
└── assets/                     # รูปภาพและไอคอนแยกตามหมวดหมู่
    ├── images/
    └── icons/
```

## 3. Design & Quality Guardrails
- Follow the **Warm Hospitality & Smart Care** aesthetic direction combined with the 5 installed skills (`impeccable`, `frontend-design`, `ui-ux-pro-max`, `design-taste-frontend`, `hallmark`).
- All colors, fonts, and spacing scales must use CSS Custom Properties from `css/tokens.css`.
- Keep class names semantic and easy to read (e.g., `.hero-section`, `.doctor-card`, `.triage-search-box`).
