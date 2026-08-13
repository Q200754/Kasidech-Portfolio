import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  th: {
    // Navbar
    navHome: 'หน้าแรก',
    navAbout: 'เกี่ยวกับฉัน',
    navSkills: 'ทักษะ',
    navProjects: 'ผลงาน',
    navCertificates: 'เกียรติบัตร',
    navActivities: 'กิจกรรม',
    navGallery: 'คลังรูปภาพ',
    navResume: 'เรซูเม่',
    navContact: 'ติดต่อ',
    navAdmin: 'แดชบอร์ด',
    
    // Home / Hero
    heroTitle: 'กษิเดช น้อยลมทวน',
    heroSubtitle: 'นักเรียน • นักพัฒนาเว็บ • โปรแกรมเมอร์ • นักออกแบบ UI/UX',
    heroViewProjects: 'ดูผลงานของฉัน',
    heroDownloadResume: 'ดาวน์โหลดเรซูเม่',
    heroScrollDown: 'เลื่อนลงเพื่อดูข้อมูล',

    // About Me
    aboutTitle: 'เกี่ยวกับตัวฉัน',
    aboutSubtitle: 'ทำความรู้จักประวัติส่วนตัวและแรงบันดาลใจ',
    aboutNickname: 'ชื่อเล่น',
    aboutAge: 'อายุ',
    aboutYears: 'ปี',
    aboutSchool: 'โรงเรียน',
    aboutEducation: 'แผนการเรียน',
    aboutInterests: 'ความสนใจ',
    aboutHobbies: 'งานอดิเรก',
    aboutGoal: 'เป้าหมายในอนาคต',
    aboutTimelineTitle: 'เส้นทางการศึกษาและพัฒนาตนเอง',

    // Skills
    skillsTitle: 'ทักษะและความสามารถ',
    skillsSubtitle: 'เทคโนโลยีและเครื่องมือที่ฉันใช้งานและเชี่ยวชาญ',
    skillsProg: 'การเขียนโปรแกรม',
    skillsFramework: 'เฟรมเวิร์ก & เว็บ',
    skillsDatabase: 'ฐานข้อมูล',
    skillsTools: 'เครื่องมือพัฒนา',
    skillsDesign: 'งานออกแบบ & UI/UX',
    skillsOther: 'อื่นๆ',
    skillsLevel: 'ระดับความเชี่ยวชาญ',

    // Projects
    projectsTitle: 'ผลงานล่าสุด',
    projectsSubtitle: 'รวบรวมโปรเจกต์ที่น่าสนใจและพัฒนาขึ้นจริง',
    projectSearch: 'ค้นหาโปรเจกต์...',
    projectAll: 'ทั้งหมด',
    projectWeb: 'เว็บแอป',
    projectProg: 'โปรแกรมมิ่ง',
    projectDesign: 'ออกแบบ',
    projectSystem: 'ระบบหลังบ้าน',
    projectOther: 'อื่นๆ',
    projectBtnGithub: 'ดูโค้ดบน GitHub',
    projectBtnDemo: 'ดูตัวอย่างจริง',
    projectBtnDetail: 'ดูรายละเอียดเพิ่มเติม',
    projectModalOverview: 'ภาพรวมโปรเจกต์',
    projectModalProblem: 'ปัญหาและโจทย์',
    projectModalSolution: 'วิธีการแก้ไข',
    projectModalFeatures: 'คุณสมบัติเด่น',
    projectModalTech: 'เทคโนโลยีที่ใช้',
    projectModalGallery: 'ภาพประกอบผลงาน',
    projectModalProcess: 'กระบวนการพัฒนา',
    projectStatus: 'สถานะ',
    projectStartEnd: 'ระยะเวลาพัฒนา',

    // Certificates
    certTitle: 'ใบประกาศและเกียรติบัตร',
    certSubtitle: 'หลักฐานการเรียนรู้และผลการแข่งขันต่างๆ',
    certId: 'เลขที่ใบประกาศ',
    certOrg: 'สถาบันที่ออกให้',
    certDate: 'วันที่ได้รับ',
    certVerify: 'ตรวจสอบใบประกาศ',
    certFilterAll: 'ทั้งหมด',
    certFilterProg: 'โปรแกรมมิ่ง',
    certFilterDesign: 'ออกแบบ UI/UX',
    certFilterEnglish: 'ภาษาอังกฤษ',
    certFilterCompetition: 'การแข่งขัน',
    certFilterOther: 'อื่นๆ',

    // Activities
    actTitle: 'กิจกรรมและผลงานเด่น',
    actSubtitle: 'ประสบการณ์การเข้าร่วมค่าย อบรม และการทำกิจกรรมร่วมกับสังคม',
    actDate: 'วันที่จัดกิจกรรม',
    actLoc: 'สถานที่',
    actOrg: 'ผู้จัด/หน่วยงาน',
    actAchievement: 'ความสำเร็จ/รางวัล',

    // Gallery
    galleryTitle: 'ภาพกิจกรรมและบรรยากาศ',
    gallerySubtitle: 'ประมวลภาพประทับใจจากการเรียน ค่าย และกิจกรรม',
    galleryAll: 'ทั้งหมด',
    gallerySchool: 'ชีวิตในโรงเรียน',
    galleryActivities: 'กิจกรรมทั่วไป',
    galleryCompetition: 'การประกวดแข่งขัน',
    galleryProjects: 'ภาพการทำโปรเจกต์',
    galleryEvents: 'งานเทศกาลและนิทรรศการ',

    // Resume
    resumeTitle: 'ประวัติย่อแบบวิชาชีพ',
    resumeSubtitle: 'เรซูเม่ฉบับย่อพร้อมประวัติการศึกษาและการจัดทำโปรเจกต์',
    resumeDownloadPdf: 'ดาวน์โหลด Resume PDF',
    resumeEduSection: 'ประวัติการศึกษา',
    resumeExpSection: 'ประสบการณ์โปรเจกต์เด่น',
    resumeCertSection: 'เกียรติบัตรรับรอง',

    // Contact
    contactTitle: 'ช่องทางการติดต่อ',
    contactSubtitle: 'ยินดีรับฟังข้อเสนอแนะและร่วมงานกันครับ',
    contactEmail: 'อีเมล',
    contactPhone: 'เบอร์โทรศัพท์',
    contactFormName: 'ชื่อของคุณ',
    contactFormEmail: 'อีเมลติดต่อ',
    contactFormSubject: 'หัวข้อข้อความ',
    contactFormMsg: 'รายละเอียดข้อความของคุณ...',
    contactFormSend: 'ส่งข้อความหาฉัน',
    contactFormSending: 'กำลังส่งข้อความ...',
    contactSuccess: 'ส่งข้อความสำเร็จแล้ว! ขอบคุณที่ติดต่อเข้ามาครับ',
    contactError: 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง',
    
    // Command Palette
    cpTitle: 'เมนูทางลัดด่วน',
    cpSearchPlaceholder: 'พิมพ์คำค้นหาหรือคำสั่งด่วน... (เช่น ไปที่, สลับ)',
    cpGoTo: 'ไปที่หน้า',
    cpAction: 'คำสั่งด่วน',
    cpClose: 'ปิดเมนู (Esc)',
    cpShortcutInfo: 'กด Ctrl + K เพื่อเปิดเมนูนี้ได้จากทุกหน้า',
    cpMenuHome: 'ไปที่หน้าแรก',
    cpMenuAbout: 'ไปที่ข้อมูลส่วนตัว',
    cpMenuSkills: 'ไปที่หัวข้อทักษะ',
    cpMenuProjects: 'ดูหน้ารายการผลงาน',
    cpMenuCertificates: 'ดูใบประกาศเกียรติบัตร',
    cpMenuActivities: 'ดูบันทึกกิจกรรม',
    cpMenuGallery: 'ดูคลังรูปภาพ',
    cpMenuContact: 'ติดต่อกษิเดช',
    cpMenuToggleTheme: 'สลับโหมด มืด / สว่าง',
    cpMenuDownloadResume: 'ดาวน์โหลดเรซูเม่ทันที',

    // Common UI
    uiLoading: 'กำลังโหลดข้อมูล...',
    uiEmpty: 'ไม่พบข้อมูลในขณะนี้',
    uiBackToTop: 'กลับสู่ด้านบน',
    uiClose: 'ปิด',
    uiCancel: 'ยกเลิก',
    uiDelete: 'ลบข้อมูล',
    uiConfirm: 'ยืนยัน',
    uiReadMore: 'อ่านเพิ่มเติม',
    uiFeatured: 'ผลงานเด่น',
    uiSearch: 'ค้นหา'
  },
  en: {
    // Navbar
    navHome: 'Home',
    navAbout: 'About Me',
    navSkills: 'Skills',
    navProjects: 'Projects',
    navCertificates: 'Certificates',
    navActivities: 'Activities',
    navGallery: 'Gallery',
    navResume: 'Resume',
    navContact: 'Contact',
    navAdmin: 'Admin Panel',

    // Home / Hero
    heroTitle: 'Kasidet Noilomthuan',
    heroSubtitle: 'Student • Web Developer • Programmer • UI/UX Designer',
    heroViewProjects: 'View My Projects',
    heroDownloadResume: 'Download Resume',
    heroScrollDown: 'Scroll Down',

    // About Me
    aboutTitle: 'About Me',
    aboutSubtitle: 'Discover my background, motivation, and interests',
    aboutNickname: 'Nickname',
    aboutAge: 'Age',
    aboutYears: 'years',
    aboutSchool: 'School',
    aboutEducation: 'Education Plan',
    aboutInterests: 'Interests',
    aboutHobbies: 'Hobbies',
    aboutGoal: 'Career Goal',
    aboutTimelineTitle: 'Education & Self-Development Timeline',

    // Skills
    skillsTitle: 'Skills & Proficiencies',
    skillsSubtitle: 'Technologies and tools I frequently use and master',
    skillsProg: 'Programming',
    skillsFramework: 'Frameworks & Web',
    skillsDatabase: 'Databases',
    skillsTools: 'Development Tools',
    skillsDesign: 'Design & UI/UX',
    skillsOther: 'Other Tools',
    skillsLevel: 'Expertise Level',

    // Projects
    projectsTitle: 'Featured Projects',
    projectsSubtitle: 'A curated selection of systems and applications I developed',
    projectSearch: 'Search projects...',
    projectAll: 'All',
    projectWeb: 'Web App',
    projectProg: 'Programming',
    projectDesign: 'Design',
    projectSystem: 'Back-end System',
    projectOther: 'Other',
    projectBtnGithub: 'View Code on GitHub',
    projectBtnDemo: 'Live Demo',
    projectBtnDetail: 'View Details',
    projectModalOverview: 'Project Overview',
    projectModalProblem: 'The Problem',
    projectModalSolution: 'The Solution',
    projectModalFeatures: 'Key Features',
    projectModalTech: 'Technologies Used',
    projectModalGallery: 'Project Screenshots',
    projectModalProcess: 'Development Process',
    projectStatus: 'Status',
    projectStartEnd: 'Development Period',

    // Certificates
    certTitle: 'Certificates & Credentials',
    certSubtitle: 'Proof of continuous learning and contest awards',
    certId: 'Credential ID',
    certOrg: 'Issued by',
    certDate: 'Issue Date',
    certVerify: 'Verify Credential',
    certFilterAll: 'All',
    certFilterProg: 'Programming',
    certFilterDesign: 'UI/UX Design',
    certFilterEnglish: 'English Language',
    certFilterCompetition: 'Competitions',
    certFilterOther: 'Others',

    // Activities
    actTitle: 'Key Activities & Achievements',
    actSubtitle: 'Experiences participating in camps, training workshops, and social work',
    actDate: 'Event Date',
    actLoc: 'Location',
    actOrg: 'Organizer',
    actAchievement: 'Award/Achievement',

    // Gallery
    galleryTitle: 'Gallery & Event Photos',
    gallerySubtitle: 'Photos capturing study milestones, tech hackathons, and gatherings',
    galleryAll: 'All',
    gallerySchool: 'School Life',
    galleryActivities: 'General Activities',
    galleryCompetition: 'Competitions',
    galleryProjects: 'Project Development',
    galleryEvents: 'Exhibitions & Events',

    // Resume
    resumeTitle: 'Professional Resume Summary',
    resumeSubtitle: 'A structured developer resume showing skills, education, and portfolio highlights',
    resumeDownloadPdf: 'Download Resume PDF',
    resumeEduSection: 'Education History',
    resumeExpSection: 'Key Projects Experience',
    resumeCertSection: 'Key Certificates',

    // Contact
    contactTitle: 'Get in Touch',
    contactSubtitle: 'Drop a message if you are interested in collaborating or hiring',
    contactEmail: 'Email Address',
    contactPhone: 'Phone Number',
    contactFormName: 'Your Name',
    contactFormEmail: 'Contact Email',
    contactFormSubject: 'Subject',
    contactFormMsg: 'Type your message details here...',
    contactFormSend: 'Send Message',
    contactFormSending: 'Sending Message...',
    contactSuccess: 'Message sent successfully! Thank you for reaching out.',
    contactError: 'Failed to send message. Please try again later.',
    
    // Command Palette
    cpTitle: 'Quick Actions Menu',
    cpSearchPlaceholder: 'Type a keyword or command... (e.g. go to, toggle)',
    cpGoTo: 'Navigate To',
    cpAction: 'Command Shortcut',
    cpClose: 'Close Menu (Esc)',
    cpShortcutInfo: 'Press Ctrl + K from anywhere to trigger this palette',
    cpMenuHome: 'Go to Home',
    cpMenuAbout: 'Go to About Me',
    cpMenuSkills: 'Go to Skills section',
    cpMenuProjects: 'View Projects Grid',
    cpMenuCertificates: 'View Certificates Gallery',
    cpMenuActivities: 'View Activities timeline',
    cpMenuGallery: 'View Photo Gallery',
    cpMenuContact: 'Contact Kasidet',
    cpMenuToggleTheme: 'Toggle Dark / Light Mode',
    cpMenuDownloadResume: 'Download PDF Resume',

    // Common UI
    uiLoading: 'Loading information...',
    uiEmpty: 'No items found',
    uiBackToTop: 'Back to Top',
    uiClose: 'Close',
    uiCancel: 'Cancel',
    uiDelete: 'Delete',
    uiConfirm: 'Confirm',
    uiReadMore: 'Read More',
    uiFeatured: 'Featured',
    uiSearch: 'Search'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved === 'th' || saved === 'en') return saved;
    return 'th'; // Default to Thai
  });

  const setLanguage = (lang) => {
    if (lang === 'th' || lang === 'en') {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
