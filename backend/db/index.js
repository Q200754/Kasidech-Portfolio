const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Load environment variables
const dbType = process.env.DB_TYPE || 'sqlite';

let pgPool = null;
let mysqlPool = null;
let sqliteDb = null;

// Hashing helpers to avoid native binary compilation issues (using built-in crypto PBKDF2)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Convert standard "?" placeholders to PostgreSQL "$1, $2" style
function convertToPostgresPlaceholders(sql) {
  let count = 0;
  return sql.replace(/\?/g, () => `$${++count}`);
}

// Initialize connection based on DB_TYPE
function connectDB() {
  if (dbType === 'postgres') {
    const { Pool } = require('pg');
    const connectionString = process.env.DATABASE_URL;
    pgPool = new Pool(connectionString ? { 
      connectionString,
      ssl: { rejectUnauthorized: false }
    } : {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      ssl: { rejectUnauthorized: false }
    });
    console.log('Connected to PostgreSQL Database.');
  } else if (dbType === 'mysql') {
    const mysql = require('mysql2/promise');
    mysqlPool = mysql.createPool({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '3306'),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log('Connected to MySQL Database.');
  } else {
    // Default to SQLite
    const { DatabaseSync } = require('node:sqlite');
    const dbFile = process.env.DB_FILE || 'database.sqlite';
    const dbPath = path.resolve(__dirname, '..', dbFile);
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }
    sqliteDb = new DatabaseSync(dbPath);
    console.log(`Connected to SQLite Database at ${dbPath}`);
  }
}

// Execute queries asynchronously
async function query(sql, params = []) {
  if (!sqliteDb && !pgPool && !mysqlPool) {
    connectDB();
  }

  if (dbType === 'postgres') {
    const pgSql = convertToPostgresPlaceholders(sql);
    const res = await pgPool.query(pgSql, params);
    return { rows: res.rows, count: res.rowCount };
  } else if (dbType === 'mysql') {
    const [rows, fields] = await mysqlPool.execute(sql, params);
    // Standardize insertId/affectedRows for MySQL response
    const count = rows.affectedRows !== undefined ? rows.affectedRows : rows.length;
    return { rows, count, insertId: rows.insertId };
  } else {
    // SQLite
    return new Promise((resolve, reject) => {
      try {
        const stmt = sqliteDb.prepare(sql);
        // If SQL is a SELECT query, use all()
        if (sql.trim().toUpperCase().startsWith('SELECT')) {
          const rows = stmt.all(...params);
          resolve({ rows, count: rows.length });
        } else {
          // INSERT, UPDATE, DELETE
          const result = stmt.run(...params);
          resolve({ 
            rows: [], 
            count: result.changes, 
            insertId: result.lastInsertRowid 
          });
        }
      } catch (err) {
        reject(err);
      }
    });
  }
}

// Initialize tables
async function initTables() {
  const isSQLite = dbType === 'sqlite';
  const isPostgres = dbType === 'postgres';
  const isMySQL = dbType === 'mysql';

  const pkType = isPostgres ? 'SERIAL PRIMARY KEY' : (isMySQL ? 'INT AUTO_INCREMENT PRIMARY KEY' : 'INTEGER PRIMARY KEY AUTOINCREMENT');
  const textType = isSQLite ? 'TEXT' : 'VARCHAR(255)';
  const longTextType = isSQLite ? 'TEXT' : 'TEXT';
  const booleanType = isSQLite ? 'INTEGER' : 'BOOLEAN';

  console.log('Initializing database tables...');

  // 1. Users
  await query(`
    CREATE TABLE IF NOT EXISTS users (
      id ${pkType},
      email ${textType} UNIQUE NOT NULL,
      password_hash ${textType} NOT NULL,
      name ${textType} NOT NULL
    )
  `);

  // 2. Profiles
  await query(`
    CREATE TABLE IF NOT EXISTS profiles (
      id ${pkType},
      full_name_th ${textType},
      full_name_en ${textType},
      nickname_th ${textType},
      nickname_en ${textType},
      profile_image ${textType},
      age INTEGER,
      school_th ${textType},
      school_en ${textType},
      education_th ${textType},
      education_en ${textType},
      description_th ${longTextType},
      description_en ${longTextType},
      about_me_th ${longTextType},
      about_me_en ${longTextType},
      career_goal_th ${longTextType},
      career_goal_en ${longTextType},
      location_th ${textType},
      location_en ${textType},
      email ${textType},
      phone ${textType},
      github ${textType},
      facebook ${textType},
      instagram ${textType},
      discord ${textType}
    )
  `);

  // 3. Skills
  await query(`
    CREATE TABLE IF NOT EXISTS skills (
      id ${pkType},
      name ${textType} NOT NULL,
      category ${textType} NOT NULL,
      icon ${textType},
      description_th ${longTextType},
      description_en ${longTextType},
      level INTEGER DEFAULT 0,
      display_order INTEGER DEFAULT 0,
      enabled ${booleanType} DEFAULT 1
    )
  `);

  // 4. Projects
  await query(`
    CREATE TABLE IF NOT EXISTS projects (
      id ${pkType},
      name_th ${textType} NOT NULL,
      name_en ${textType} NOT NULL,
      slug ${textType} UNIQUE NOT NULL,
      description_th ${longTextType},
      description_en ${longTextType},
      full_description_th ${longTextType},
      full_description_en ${longTextType},
      cover_image ${textType},
      category ${textType} NOT NULL,
      technologies ${textType},
      github_url ${textType},
      live_demo_url ${textType},
      start_date ${textType},
      end_date ${textType},
      featured ${booleanType} DEFAULT 0,
      status ${textType} DEFAULT 'Completed'
    )
  `);

  // 5. Project Images
  await query(`
    CREATE TABLE IF NOT EXISTS project_images (
      id ${pkType},
      project_id INTEGER NOT NULL,
      image_url ${textType} NOT NULL,
      display_order INTEGER DEFAULT 0
    )
  `);

  // 6. Certificates
  await query(`
    CREATE TABLE IF NOT EXISTS certificates (
      id ${pkType},
      name_th ${textType} NOT NULL,
      name_en ${textType} NOT NULL,
      organization_th ${textType},
      organization_en ${textType},
      certificate_id ${textType},
      issue_date ${textType},
      category ${textType} NOT NULL,
      certificate_image ${textType},
      verification_url ${textType},
      description_th ${longTextType},
      description_en ${longTextType}
    )
  `);

  // 7. Activities
  await query(`
    CREATE TABLE IF NOT EXISTS activities (
      id ${pkType},
      name_th ${textType} NOT NULL,
      name_en ${textType} NOT NULL,
      date ${textType},
      location_th ${textType},
      location_en ${textType},
      description_th ${longTextType},
      description_en ${longTextType},
      category ${textType} NOT NULL,
      achievement_th ${textType},
      achievement_en ${textType},
      organization_th ${textType},
      organization_en ${textType}
    )
  `);

  // 8. Activity Images
  await query(`
    CREATE TABLE IF NOT EXISTS activity_images (
      id ${pkType},
      activity_id INTEGER NOT NULL,
      image_url ${textType} NOT NULL,
      display_order INTEGER DEFAULT 0
    )
  `);

  // 9. Gallery
  await query(`
    CREATE TABLE IF NOT EXISTS gallery (
      id ${pkType},
      image_url ${textType} NOT NULL,
      category ${textType} NOT NULL,
      title_th ${textType},
      title_en ${textType},
      description_th ${longTextType},
      description_en ${longTextType},
      file_size INTEGER DEFAULT 0,
      file_type ${textType},
      upload_date ${textType}
    )
  `);

  // 10. Resumes
  await query(`
    CREATE TABLE IF NOT EXISTS resumes (
      id ${pkType},
      file_name ${textType} NOT NULL,
      file_path ${textType} NOT NULL,
      file_size INTEGER DEFAULT 0,
      upload_date ${textType},
      is_current ${booleanType} DEFAULT 0
    )
  `);

  // 11. Settings
  await query(`
    CREATE TABLE IF NOT EXISTS settings (
      id ${pkType},
      key_name ${textType} UNIQUE NOT NULL,
      value_data ${longTextType}
    )
  `);

  // 12. Activity Logs
  await query(`
    CREATE TABLE IF NOT EXISTS activity_logs (
      id ${pkType},
      action ${textType} NOT NULL,
      user_email ${textType},
      date_time ${textType} NOT NULL
    )
  `);

  console.log('Tables initialized successfully.');
}

// Seed Initial Data
async function seedData() {
  // Check if any user already exists
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.com';
  const adminPass = process.env.ADMIN_PASSWORD || 'admin123';
  
  const userCheck = await query('SELECT * FROM users');
  
  if (userCheck.rows.length === 0) {
    console.log('Database empty. Seeding initial data...');
    
    // Seed User
    const hashed = hashPassword(adminPass);
    await query('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)', 
      [adminEmail, hashed, 'กษิเดช น้อยลมทวน']
    );
    console.log('- Admin user seeded.');

    // Seed Profile
    await query(`
      INSERT INTO profiles (
        full_name_th, full_name_en, nickname_th, nickname_en, profile_image, age,
        school_th, school_en, education_th, education_en,
        description_th, description_en, about_me_th, about_me_en,
        career_goal_th, career_goal_en, location_th, location_en,
        email, phone, github, facebook, instagram, discord
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      'กษิเดช น้อยลมทวน', 'Kasidet Noilomthuan', 'เดช', 'Dech',
      '/uploads/profile_default.jpg', 18,
      'โรงเรียนมัธยมศึกษาตอนปลายวิทยาศาสตร์', 'Science High School',
      'แผนการเรียน วิทยาศาสตร์ - คณิตศาสตร์ (ห้องเรียนพิเศษคอมพิวเตอร์)', 'Science-Mathematics (Computer Gifted Program)',
      'นักเรียนและนักพัฒนาเว็บไซต์ที่มีความหลงใหลในการสร้างสรรค์แอปพลิเคชันที่ทันสมัยและมีประสิทธิภาพ',
      'A student and web developer passionate about building modern, high-performance web applications.',
      'สวัสดีครับ ผมกษิเดช น้อยลมทวน ปัจจุบันเป็นนักเรียนและนักพัฒนาซอฟต์แวร์อิสระ ผมมีความสนใจด้านการออกแบบและพัฒนาเว็บไซต์อย่างลึกซึ้ง ชอบเรียนรู้เทคโนโลยีใหม่ๆ และมุ่งมั่นที่จะพัฒนาทักษะการเขียนโปรแกรมของตนเองเพื่อสร้างสรรค์นวัตกรรมที่เป็นประโยชน์ต่อผู้คนในวงกว้าง',
      'Hello, I am Kasidet Noilomthuan, currently a high school student and independent software developer. I have a deep interest in website design and development, love exploring new technologies, and strive to hone my coding skills to create innovations that impact people positively.',
      'เป็นนักพัฒนา Full Stack Developer ระดับมืออาชีพที่เชี่ยวชาญด้าน JavaScript Ecosystem และมีความเชี่ยวชาญด้าน UI/UX Design เพื่อมอบประสบการณ์การใช้งานเว็บไซต์ที่ดีที่สุด',
      'To become a professional Full Stack Developer specializing in the JavaScript Ecosystem and UI/UX Design to deliver the best web experiences.',
      'กรุงเทพฯ, ประเทศไทย', 'Bangkok, Thailand',
      'kasidet.noilom@gmail.com', '081-234-5678',
      'https://github.com/kasidet-dev', 'https://facebook.com/kasidet',
      'https://instagram.com/kasidet', 'kasidet#1234'
    ]);
    console.log('- Profile seeded.');

    // Seed Skills
    const initialSkills = [
      // Programming
      ['HTML', 'Programming', 'Code', 'โครงสร้างหน้าเว็บพื้นฐาน', 'Basic web page structure', 95, 1, 1],
      ['CSS', 'Programming', 'Palette', 'การตกแต่งและจัดเลย์เอาต์หน้าเว็บ', 'Web styling and layouts', 90, 2, 1],
      ['JavaScript', 'Programming', 'FileJson', 'การเขียนสคริปต์ควบคุมการทำงาน', 'Scripting and interactivity', 88, 3, 1],
      ['Python', 'Programming', 'Terminal', 'การเขียนโปรแกรมเอนกประสงค์และวิทยาศาสตร์ข้อมูล', 'General-purpose programming and data science', 75, 4, 1],
      ['C++', 'Programming', 'Cpu', 'โครงสร้างข้อมูลและการแก้ปัญหาเชิงอัลกอริทึม', 'Data structures and algorithms', 70, 5, 1],
      ['SQL', 'Programming', 'Database', 'การจัดการฐานข้อมูลเชิงสัมพันธ์', 'Relational database management', 80, 6, 1],
      
      // Frameworks
      ['React', 'Framework', 'Atom', 'การสร้าง Single Page Application เชิงคอมโพเนนต์', 'Component-based Single Page Application development', 85, 7, 1],
      ['Node.js', 'Framework', 'Server', 'การเขียนเซิร์ฟเวอร์ด้วย JavaScript', 'Server-side JavaScript environment', 80, 8, 1],
      ['Express.js', 'Framework', 'Cpu', 'การเขียน REST API และเว็บเซิร์ฟเวอร์', 'Web framework for REST APIs', 82, 9, 1],
      ['Tailwind CSS', 'Framework', 'Wind', 'การตกแต่งเว็บไซต์ด้วย Utility-first CSS framework', 'Utility-first CSS styling framework', 90, 10, 1],
      
      // Tools
      ['Git', 'Tools', 'GitBranch', 'การจัดการเวอร์ชันของซอร์สโค้ด', 'Source code version control', 85, 11, 1],
      ['GitHub', 'Tools', 'Github', 'แพลตฟอร์มฝากไฟล์และทำงานร่วมกัน', 'Code hosting and collaboration platform', 88, 12, 1],
      ['VS Code', 'Tools', 'Binary', 'เครื่องมือเขียนโค้ดคู่ใจสำหรับนักพัฒนา', 'Preferred code editor configuration', 95, 13, 1],
      ['Google Apps Script', 'Tools', 'Cpu', 'ระบบอัตโนมัติของบริการ Google', 'Automation for Google Workspace services', 80, 14, 1],

      // Design
      ['Figma', 'Design', 'Figma', 'การออกแบบหน้าจอและโปรโตไทป์ UI/UX', 'UI/UX layout design and prototyping', 82, 15, 1],
      ['Photoshop', 'Design', 'Image', 'การตัดต่อและตกแต่งรูปภาพ', 'Photo editing and asset generation', 70, 16, 1],
      ['UI/UX Design', 'Design', 'Layout', 'หลักการออกแบบหน้าเว็บเพื่อผู้ใช้งาน', 'User experience and interface principles', 80, 17, 1]
    ];

    for (const skill of initialSkills) {
      await query(`
        INSERT INTO skills (name, category, icon, description_th, description_en, level, display_order, enabled)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `, skill);
    }
    console.log('- Skills seeded.');

    // Seed Projects
    const initialProjects = [
      ['ระบบจองห้องประชุมออนไลน์', 'Meeting Room Booking System', 'meeting-room-booking', 
       'ระบบจองห้องประชุมผ่านเว็บ ช่วยอำนวยความสะดวกในการจัดสรรเวลาห้องประชุมพร้อมแจ้งเตือนไลน์บอท',
       'A web-based meeting room booking system streamlining room scheduling with Line Notify integration.',
       'ระบบเว็บแอปพลิเคชันสำหรับจองห้องประชุมออนไลน์ ช่วยแก้ปัญหาการจองชนกัน รองรับการกำหนดสิทธิ์ผู้ใช้ ตรวจสอบตารางห้องประชุมด้วยปฏิทินที่ตอบสนอง และส่งการแจ้งเตือนทาง Line/Email ทันทีที่มีการจอง',
       'A web application for booking meeting rooms online. It solves scheduling conflicts, supports role-based access control, displays schedules on a responsive interactive calendar, and triggers instant Line/Email notifications upon booking.',
       '/uploads/project_booking.jpg', 'Web', 'React, Tailwind CSS, Node.js, Express, SQLite', 
       'https://github.com/kasidet-dev/meeting-room-booking', 'https://demo-booking.kasidet.dev', 
       '2026-01', '2026-04', 1, 'Completed'],

      ['แกลเลอรี่รูปภาพเชิงโต้ตอบ', 'Interactive Photo Gallery', 'photo-gallery', 
       'แกลเลอรี่สำหรับโชว์ภาพถ่ายพร้อมระบบฟิลเตอร์ค้นหา และการเปิดรูปภาพขนาดใหญ่แบบ Lightbox',
       'A photo gallery dashboard featuring search filtering, category sorting, and an interactive Lightbox view.',
       'ผลงานหน้าเว็บจัดระเบียบและแสดงภาพกิจกรรมต่างๆ สามารถอัปโหลดภาพ แยกหมวดหมู่ ค้นหาตามคำสำคัญ และแสดงรูปภาพขนาดใหญ่ได้อย่างสวยงามพร้อมเอฟเฟกต์เบลอและการเปลี่ยนรูปที่ลื่นไหล',
       'An elegant photo gallery management interface that categorizes images, enables tags filtering, keyphrase search, and features a responsive fullscreen Lightbox carousel with glassmorphism overlays.',
       '/uploads/project_gallery.jpg', 'Design', 'HTML, CSS, JavaScript, Framer Motion', 
       'https://github.com/kasidet-dev/interactive-gallery', 'https://gallery.kasidet.dev', 
       '2026-05', '2026-06', 1, 'Completed'],

      ['เว็บไซต์ร้านค้าขายรองเท้าออนไลน์', 'Shoe Store E-commerce Website', 'shoe-store', 
       'เว็บไซต์อีคอมเมิร์ซจำลองสำหรับเลือกซื้อและดูรายละเอียดสินค้า รองรับการหยิบลงตะกร้า',
       'A mockup e-commerce platform for browsing, filtering, and ordering shoes with a responsive cart system.',
       'โครงการออกแบบพัฒนาหน้าร้านค้าออนไลน์สำหรับแบรนด์รองเท้า ออกแบบ UI ให้มีความสวยงาม ทันสมัย โทนสีเข้มพรีเมียม มีตัวเลือกขนาด สี และจำลองกระบวนการชำระเงินจนเสร็จสิ้น',
       'An aesthetic e-commerce prototype for a premium shoe brand. Features interactive dark mode, size/color selectors, filter queries, a cart panel sidebar, and simulated checkout flow.',
       '/uploads/project_shoes.jpg', 'Web', 'React, Tailwind CSS, Framer Motion', 
       'https://github.com/kasidet-dev/shoe-store-ui', 'https://shoes-store.kasidet.dev', 
       '2025-11', '2025-12', 0, 'Completed'],

      ['พอร์ตโฟลิโอส่วนตัวแบบ Full Stack', 'Personal Full Stack Portfolio', 'personal-portfolio', 
       'เว็บไซต์ประวัติและผลงานส่วนตัว พร้อมระบบหลังบ้านสำหรับควบคุมข้อมูล',
       'A comprehensive personal portfolio equipped with an administrative dashboard for real-time adjustments.',
       'เว็บไซต์ที่คุณกำลังรับชมนี้ ออกแบบมาเพื่อนำเสนอประวัติ ผลงาน ทักษะ และกิจกรรม มีระบบ Admin Panel เพื่อให้สามารถปรับปรุง เพิ่ม ลบ ข้อมูลทั้งหมดได้ทันทีโดยไม่ต้องเข้าแก้ซอร์สโค้ด ปลอดภัยด้วย JWT Cookie',
       'This portfolio website. Crafted to present background, skills, and activities. Features an Admin Panel enabling full CRUD operations dynamically without codebase adjustments, secured via JWT HttpOnly cookies.',
       '/uploads/project_portfolio.jpg', 'System', 'React, Vite, Tailwind CSS, Express, SQLite', 
       'https://github.com/kasidet-dev/modern-portfolio', 'https://kasidet.dev', 
       '2026-07', '2026-08', 1, 'In Progress']
    ];

    for (const proj of initialProjects) {
      await query(`
        INSERT INTO projects (
          name_th, name_en, slug, description_th, description_en,
          full_description_th, full_description_en, cover_image, category,
          technologies, github_url, live_demo_url, start_date, end_date, featured, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, proj);
    }
    console.log('- Projects seeded.');

    // Seed Certificates
    const initialCerts = [
      ['การพัฒนาเว็บด้วย React ระดับกลาง', 'Intermediate React Development', 
       'Tech Academy', 'CERT-12345', '2026-03-15', 'Programming', 
       '/uploads/cert_react.jpg', 'https://verification.techacademy/cert-12345',
       'เรียนรู้และทำความเข้าใจเรื่อง Hook, Context API, state management, optimization และการสื่อสารกับ REST API',
       'Covers advanced React hooks, Context API, application state management, performance optimization, and API communications.'],
      
      ['การออกแบบ UI/UX สำหรับมือใหม่', 'UI/UX Fundamentals for Beginners', 
       'Design Institute', 'CERT-UIUX-99', '2025-09-10', 'Design', 
       '/uploads/cert_uiux.jpg', 'https://verify.designinst.org/cert-99',
       'ครอบคลุมเรื่องทฤษฎีสี, ตารางกริด, พฤติกรรมผู้ใช้ และการทำ Wireframe/Interactive Prototype บน Figma',
       'Covers color theories, grid systems, typography, user behaviors, wireframing, and Figma prototyping.']
    ];

    for (const cert of initialCerts) {
      await query(`
        INSERT INTO certificates (
          name_th, name_en, organization_th, organization_en, certificate_id, issue_date,
          category, certificate_image, verification_url, description_th, description_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [cert[0], cert[1], cert[2], cert[2], cert[3], cert[4], cert[5], cert[6], cert[7], cert[8], cert[9]]);
    }
    console.log('- Certificates seeded.');

    // Seed Activities
    const initialActivities = [
      ['การประกวดเขียนโปรแกรมระดับชาติ', 'National Coding Olympiad Competition', '2026-02-10', 
       'มหาวิทยาลัยเทคโนโลยี', 'University of Technology', 
       'เข้าร่วมแข่งขันทักษะการเขียนโปรแกรมด้วยภาษา C++ เพื่อแก้โจทย์ปัญหาโครงสร้างข้อมูลและคณิตศาสตร์คอมพิวเตอร์',
       'Participated in the competitive coding arena, resolving complex algorithm challenges in C++ under timing constraints.',
       'Competition', 'รางวัลเหรียญเงิน', 'Silver Medal Award',
       'คณะวิศวกรรมศาสตร์', 'Faculty of Engineering'],

      ['ค่ายเยาวชนสร้างสรรค์นักพัฒนาเว็บ', 'Creative Web Developer Youth Camp', '2025-10-18', 
       'สมาคมพัฒนาเทคโนโลยี', 'Technology Development Association', 
       'ค่ายอบรมและประกวดสร้างสรรค์ผลงานพัฒนาเว็บไซต์เพื่อสิ่งแวดล้อม โดยกลุ่มของผมได้ออกแบบเว็บรายงานขยะชุมชน',
       'A 3-day hackathon focused on developing environment-friendly web apps. Built a community recycling tracker.',
       'Activities', 'รางวัลรองชนะเลิศอันดับ 1', '1st Runner-Up Innovation Award',
       'กรมส่งเสริมเทคโนโลยี', 'Department of Technology Promotion']
    ];

    for (const act of initialActivities) {
      await query(`
        INSERT INTO activities (
          name_th, name_en, date, location_th, location_en,
          description_th, description_en, category, achievement_th, achievement_en,
          organization_th, organization_en
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, act);
    }
    console.log('- Activities seeded.');

    // Seed Gallery
    const initialGallery = [
      ['/uploads/gallery_camp.jpg', 'Activities', 'ค่ายเยาวชนเทคโนโลยี', 'Youth Technology Camp', 
       'รูปหมู่ตอนเข้าร่วมค่ายเยาวชนสร้างสรรค์ผลงาน', 'Group photo in the creative tech camp.', 153000, 'image/jpeg', '2026-08-12'],
      ['/uploads/gallery_award.jpg', 'Competition', 'รับรางวัลการแข่งขันคอมพิวเตอร์', 'Award Ceremony', 
       'รับรางวัลการแข่งขันโปรแกรมมิ่ง ณ คณะวิศวกรรมศาสตร์', 'Silver medal award ceremony photo.', 210000, 'image/jpeg', '2026-08-12']
    ];

    for (const gal of initialGallery) {
      await query(`
        INSERT INTO gallery (image_url, category, title_th, title_en, description_th, description_en, file_size, file_type, upload_date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, gal);
    }
    console.log('- Gallery seeded.');

    // Seed Settings
    const initialSettings = [
      ['website_name', 'กษิเดช น้อยลมทวน | Personal Portfolio'],
      ['website_description', 'พอร์ตโฟลิโอและเว็บไซต์ประวัติผลงานของ กษิเดช น้อยลมทวน'],
      ['primary_color', '#09090b'],
      ['accent_color', '#FF6FAE'],
      ['section_home_visible', 'true'],
      ['section_about_visible', 'true'],
      ['section_skills_visible', 'true'],
      ['section_projects_visible', 'true'],
      ['section_certificates_visible', 'true'],
      ['section_activities_visible', 'true'],
      ['section_gallery_visible', 'true'],
      ['section_resume_visible', 'true'],
      ['section_contact_visible', 'true'],
      ['contact_email', 'kasidet.noilom@gmail.com'],
      ['contact_phone', '081-234-5678'],
      ['social_github', 'https://github.com/kasidet-dev'],
      ['social_facebook', 'https://facebook.com/kasidet'],
      ['social_instagram', 'https://instagram.com/kasidet'],
      ['social_discord', 'kasidet#1234']
    ];

    for (const set of initialSettings) {
      await query('INSERT INTO settings (key_name, value_data) VALUES (?, ?)', set);
    }
    console.log('- Settings seeded.');

    // Ensure upload folders have placeholder files so we don't get 404s
    const uploadsDir = path.resolve(__dirname, '..', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Write tiny dummy files for uploads so they exist
    const dummyFiles = [
      'profile_default.jpg',
      'project_booking.jpg',
      'project_gallery.jpg',
      'project_shoes.jpg',
      'project_portfolio.jpg',
      'cert_react.jpg',
      'cert_uiux.jpg',
      'gallery_camp.jpg',
      'gallery_award.jpg'
    ];

    // Check if files exist, if not, write standard transparent 1x1 png or empty file
    const dummyImgBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const dummyBuf = Buffer.from(dummyImgBase64, 'base64');
    
    for (const filename of dummyFiles) {
      const filePath = path.join(uploadsDir, filename);
      if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, dummyBuf);
      }
    }
    console.log('- Upload placeholders generated.');
  } else {
    console.log('Database already initialized and seeded.');
  }
}

// Global setup run at start
async function initDb() {
  try {
    connectDB();
    await initTables();
    await seedData();
    console.log('Database Bootstrapped Successfully.');
  } catch (err) {
    console.error('Database Initialization Failed:', err);
    throw err;
  }
}

module.exports = {
  query,
  initDb,
  hashPassword,
  verifyPassword: (password, storedHash) => {
    try {
      const [salt, hash] = storedHash.split(':');
      const verifyHash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
      return hash === verifyHash;
    } catch (e) {
      return false;
    }
  }
};
