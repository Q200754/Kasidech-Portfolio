export const fallbackProfile = {
  full_name_th: "กษิเดช น้อยลมทวน",
  full_name_en: "Kasidet Noilomthuan",
  nickname_th: "เดช",
  nickname_en: "Dech",
  profile_image: "/uploads/profile_default.jpg",
  age: 18,
  school_th: "โรงเรียนมัธยมศึกษาตอนปลายวิทยาศาสตร์",
  school_en: "Science High School",
  education_th: "แผนการเรียน วิทยาศาสตร์ - คณิตศาสตร์ (ห้องเรียนพิเศษคอมพิวเตอร์)",
  education_en: "Science-Mathematics (Computer Gifted Program)",
  description_th: "นักเรียนและนักพัฒนาเว็บไซต์ที่มีความหลงใหลในการสร้างสรรค์แอปพลิเคชันที่ทันสมัยและมีประสิทธิภาพ",
  description_en: "A student and web developer passionate about building modern, high-performance web applications.",
  about_me_th: "สวัสดีครับ ผมกษิเดช น้อยลมทวน ปัจจุบันเป็นนักเรียนและนักพัฒนาซอฟต์แวร์อิสระ ผมมีความสนใจด้านการออกแบบและพัฒนาเว็บไซต์อย่างลึกซึ้ง ชอบเรียนรู้เทคโนโลยีใหม่ๆ และมุ่งมั่นที่จะพัฒนาทักษะการเขียนโปรแกรมของตนเองเพื่อสร้างสรรค์นวัตกรรมที่เป็นประโยชน์ต่อผู้คนในวงกว้าง",
  about_me_en: "Hello, I am Kasidet Noilomthuan, currently a high school student and independent software developer. I have a deep interest in website design and development, love exploring new technologies, and strive to hone my coding skills to create innovations that impact people positively.",
  career_goal_th: "เป็นนักพัฒนา Full Stack Developer ระดับมืออาชีพที่สามารถสร้างระบบขนาดใหญ่และมีประโยชน์ต่อผู้ใช้งานจริง",
  career_goal_en: "To become a professional Full Stack Developer capable of building scalable, high-impact systems for real-world users.",
  location_th: "กรุงเทพฯ, ประเทศไทย",
  location_en: "Bangkok, Thailand",
  email: "kasidet.noilom@gmail.com",
  phone: "081-234-5678",
  github: "https://github.com/kasidet-dev",
  facebook: "https://facebook.com/kasidet",
  instagram: "https://instagram.com/kasidet",
  discord: "kasidet#1234"
};

export const fallbackSkills = [
  { id: 1, name: 'HTML', category: 'Programming', icon: 'Code', level: 95, enabled: 1 },
  { id: 2, name: 'CSS', category: 'Programming', icon: 'Palette', level: 90, enabled: 1 },
  { id: 3, name: 'JavaScript', category: 'Programming', icon: 'FileJson', level: 88, enabled: 1 },
  { id: 4, name: 'React', category: 'Framework', icon: 'Atom', level: 85, enabled: 1 },
  { id: 5, name: 'Node.js', category: 'Framework', icon: 'Server', level: 80, enabled: 1 },
  { id: 6, name: 'Tailwind CSS', category: 'Framework', icon: 'Wind', level: 90, enabled: 1 },
  { id: 7, name: 'GitHub', category: 'Tools', icon: 'Github', level: 88, enabled: 1 },
  { id: 8, name: 'Figma', category: 'Design', icon: 'Figma', level: 82, enabled: 1 }
];

export const fallbackProjects = [
  {
    id: 1,
    name_th: "ระบบจองห้องประชุมออนไลน์",
    name_en: "Meeting Room Booking System",
    cover_image: "/uploads/project_booking.jpg",
    category: "Web",
    technologies: "React, Tailwind CSS, Node.js, Express, SQLite",
    description_th: "ระบบจองห้องประชุมผ่านเว็บ ช่วยอำนวยความสะดวกในการจัดสรรเวลาห้องประชุมพร้อมแจ้งเตือนไลน์บอท",
    description_en: "A web-based meeting room booking system streamlining room scheduling with Line Notify integration.",
    full_description_th: "ระบบเว็บแอปพลิเคชันสำหรับจองห้องประชุมออนไลน์ ช่วยแก้ปัญหาการจองชนกัน รองรับการกำหนดสิทธิ์ผู้ใช้ ตรวจสอบตารางห้องประชุมด้วยปฏิทินที่ตอบสนอง และส่งการแจ้งเตือนทาง Line/Email ทันทีที่มีการจอง",
    full_description_en: "A web application for booking meeting rooms online. It solves scheduling conflicts, supports role-based access control, displays schedules on a responsive interactive calendar, and triggers instant Line/Email notifications upon booking.",
    github_url: "https://github.com/kasidet-dev/meeting-room-booking",
    live_demo_url: "https://demo-booking.kasidet.dev",
    start_date: "2026-01",
    end_date: "2026-04",
    featured: 1,
    status: "Completed",
    screenshots: []
  }
];

export const fallbackCertificates = [
  {
    id: 1,
    name_th: "การพัฒนาเว็บด้วย React ระดับกลาง",
    name_en: "Intermediate React Development",
    organization_th: "Tech Academy",
    organization_en: "Tech Academy",
    certificate_id: "CERT-12345",
    issue_date: "2026-03-15",
    category: "Programming",
    certificate_image: "/uploads/cert_react.jpg",
    verification_url: "https://verification.techacademy/cert-12345",
    description_th: "เรียนรู้และทำความเข้าใจเรื่อง Hook, Context API, state management, optimization และการสื่อสารกับ REST API",
    description_en: "Covers advanced React hooks, Context API, application state management, performance optimization, and API communications."
  }
];

export const fallbackActivities = [
  {
    id: 1,
    name_th: "การประกวดเขียนโปรแกรมระดับชาติ",
    name_en: "National Coding Olympiad Competition",
    date: "2026-02-10",
    location_th: "มหาวิทยาลัยเทคโนโลยี",
    location_en: "University of Technology",
    description_th: "เข้าร่วมแข่งขันทักษะการเขียนโปรแกรมด้วยภาษา C++ เพื่อแก้โจทย์ปัญหาโครงสร้างข้อมูลและคณิตศาสตร์คอมพิวเตอร์",
    description_en: "Participated in the competitive coding arena, resolving complex algorithm challenges in C++ under timing constraints.",
    category: "Competition",
    achievement_th: "รางวัลเหรียญเงิน",
    achievement_en: "Silver Medal Award",
    organization_th: "คณะวิศวกรรมศาสตร์",
    organization_en: "Faculty of Engineering",
    images: []
  }
];

export const fallbackSettings = {
  website_name: "กษิเดช น้อยลมทวน | Personal Portfolio",
  website_description: "พอร์ตโฟลิโอและเว็บไซต์ประวัติผลงานของ กษิเดช น้อยลมทวน",
  primary_color: "#09090b",
  accent_color: "#FF6FAE",
  section_home_visible: "true",
  section_about_visible: "true",
  section_skills_visible: "true",
  section_projects_visible: "true",
  section_certificates_visible: "true",
  section_activities_visible: "true",
  section_gallery_visible: "true",
  section_resume_visible: "true",
  section_contact_visible: "true"
};
