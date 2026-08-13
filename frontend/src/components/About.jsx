import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { User, Calendar, BookOpen, MapPin, Target, Sparkles, Heart } from 'lucide-react';

export default function About({ profile }) {
  const { t, language } = useLanguage();

  if (!profile) return null;

  const aboutMe = language === 'th' ? profile.about_me_th : profile.about_me_en;
  const school = language === 'th' ? profile.school_th : profile.school_en;
  const education = language === 'th' ? profile.education_th : profile.education_en;
  const goal = language === 'th' ? profile.career_goal_th : profile.career_goal_en;
  const location = language === 'th' ? profile.location_th : profile.location_en;

  const profileDetails = [
    { icon: <User className="text-accent" size={16} />, label: t('aboutNickname'), value: language === 'th' ? profile.nickname_th : profile.nickname_en },
    { icon: <Calendar className="text-accent" size={16} />, label: t('aboutAge'), value: `${profile.age} ${t('aboutYears')}` },
    { icon: <BookOpen className="text-accent" size={16} />, label: t('aboutSchool'), value: school },
    { icon: <Sparkles className="text-accent" size={16} />, label: t('aboutEducation'), value: education },
    { icon: <MapPin className="text-accent" size={16} />, label: 'Location', value: location },
    { icon: <Target className="text-accent" size={16} />, label: t('aboutGoal'), value: goal, fullWidth: true }
  ];

  // Static timeline milestones representing education & coding milestones
  const timelineMilestones = language === 'th' ? [
    {
      year: '2026',
      title: 'ผู้ผ่านเข้ารอบสุดท้ายการแข่งประกวดเว็บไซต์ระดับชาติ',
      desc: 'พัฒนาโปรเจกต์นวัตกรรมสิ่งแวดล้อมโดยใช้ React และ Node.js จนผ่านเข้ารอบชิงชนะเลิศ'
    },
    {
      year: '2025',
      title: 'เข้าศึกษาแผนการเรียนวิทยาศาสตร์-คณิตศาสตร์ (ห้องเรียนพิเศษคอมพิวเตอร์)',
      desc: 'มุ่งเน้นศึกษาทฤษฎีการคำนวณขั้นสูง อัลกอริทึม และพัฒนาแอปพลิเคชันเพื่อชุมชน'
    },
    {
      year: '2024',
      title: 'เริ่มต้นการเรียนรู้พัฒนาเว็บไซต์ด้วยตัวเอง',
      desc: 'เข้าสู่เส้นทางสายโปรแกรมมิ่ง เริ่มต้นเรียนรู้ HTML, CSS และ JavaScript จากแหล่งเรียนรู้ออนไลน์ พัฒนาแอปแรกและแชร์ลง GitHub'
    }
  ] : [
    {
      year: '2026',
      title: 'National Web Design Competition Finalist',
      desc: 'Built an ecological tracker site using React and Node.js backend, qualifying for the final round of the National Youth Tech awards.'
    },
    {
      year: '2025',
      title: 'Enrolled in Science-Math (Computer Gifted Program)',
      desc: 'Expanded knowledge in programming logic, C++ data structures, database designs, and applied computing sciences.'
    },
    {
      year: '2024',
      title: 'Began Self-Taught Coding Journey',
      desc: 'Discovered passion for software development. Learnt HTML, CSS, JavaScript, and built several core responsive layouts uploaded to GitHub.'
    }
  ];

  return (
    <section id="about" className="py-24 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Title */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('aboutTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('aboutSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Contents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Modern Profile Card (cols: 7) */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-6 sm:p-8 rounded-2xl glass-panel shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 relative overflow-hidden text-left"
            >
              {/* Profile image background light */}
              <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-accent/5 dark:bg-accent/10 blur-xl pointer-events-none" />

              <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2 mb-4">
                <Sparkles size={18} className="text-accent animate-pulse" />
                {language === 'th' ? 'ข้อมูลประวัติส่วนตัว' : 'Personal Profile Information'}
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-300 text-sm sm:text-base leading-relaxed mb-6 font-sans">
                {aboutMe}
              </p>

              {/* Attributes Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-sans text-sm">
                {profileDetails.map((detail, idx) => (
                  <div 
                    key={idx} 
                    className={`p-3.5 rounded-xl bg-zinc-100/50 dark:bg-zinc-950/30 border border-zinc-200/30 dark:border-zinc-800/30 flex items-start gap-3 ${
                      detail.fullWidth ? 'sm:col-span-2' : ''
                    }`}
                  >
                    <div className="mt-0.5 p-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 shrink-0">
                      {detail.icon}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <span className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">
                        {detail.label}
                      </span>
                      <span className="font-medium text-zinc-800 dark:text-zinc-200 break-words leading-tight">
                        {detail.value}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column: Educational Timeline (cols: 5) */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white flex items-center gap-2">
              <Calendar size={18} className="text-accent" />
              {t('aboutTimelineTitle')}
            </h3>

            {/* Vertical line timeline */}
            <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 pl-8 py-2 space-y-8 font-sans">
              {timelineMilestones.map((stone, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative group"
                >
                  {/* Timeline dot badge */}
                  <span className="absolute -left-[41px] top-1 flex items-center justify-center w-6 h-6 rounded-full bg-white dark:bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 group-hover:border-accent group-hover:bg-accent/10 transition-colors z-10">
                    <span className="w-2 h-2 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-accent transition-colors" />
                  </span>

                  {/* Year Tag */}
                  <span className="inline-block text-[10px] font-bold font-display px-2.5 py-0.5 rounded bg-zinc-200/60 dark:bg-zinc-850 text-zinc-600 dark:text-zinc-300 group-hover:bg-accent/15 group-hover:text-accent transition-colors tracking-widest mb-1.5">
                    {stone.year}
                  </span>

                  {/* Title & Description */}
                  <h4 className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-accent transition-colors font-display">
                    {stone.title}
                  </h4>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {stone.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
