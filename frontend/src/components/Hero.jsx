import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { Github, Facebook, Instagram } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';
import TypingAnimation from './TypingAnimation';
import { api } from '../utils/api';

export default function Hero({ profile, settings }) {
  const { t, language } = useLanguage();

  if (!profile) return null;

  const fullName = language === 'th' ? profile.full_name_th : profile.full_name_en;
  const description = language === 'th' ? profile.description_th : profile.description_en;
  
  const typingWords = language === 'th' 
    ? ["นักพัฒนาเว็บไซต์", "โปรแกรมเมอร์", "นักออกแบบ UI/UX", "นักพัฒนาเชิงสร้างสรรค์"]
    : ["Web Developer", "Programmer", "UI/UX Designer", "Creative Developer"];

  const handleScrollToProjects = () => {
    const el = document.getElementById('projects');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="relative min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-grid-pattern pt-20"
    >
      {/* Background glow animations */}
      <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-accent/5 dark:bg-accent/10 blur-[80px] sm:blur-[120px] animate-float pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] rounded-full bg-pink-400/5 dark:bg-pink-400/5 blur-[80px] sm:blur-[120px] animate-float pointer-events-none" style={{ animationDelay: '2s' }} />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full z-10">
        
        {/* Left Side: Short Text Details */}
        <div className="md:col-span-7 flex flex-col items-start text-left space-y-6 order-2 md:order-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col space-y-3"
          >
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-accent/15 text-accent font-display w-fit uppercase tracking-wider">
              {language === 'th' ? 'ยินดีต้อนรับสู่พอร์ตโฟลิโอของฉัน' : 'Welcome to my portfolio'}
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-display text-zinc-900 dark:text-white leading-none">
              {fullName}
            </h1>
          </motion.div>

          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="text-xl sm:text-2xl font-medium font-display text-zinc-700 dark:text-zinc-300"
          >
            {language === 'th' ? 'ผมเป็น ' : "I'm a "}{' '}
            <TypingAnimation words={typingWords} />
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400 max-w-lg leading-relaxed font-sans"
          >
            {description}
          </motion.p>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap gap-4 w-full"
          >
            <button
              onClick={handleScrollToProjects}
              className="px-6 py-3 rounded-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold font-display shadow-lg hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all text-sm cursor-pointer"
            >
              {t('heroViewProjects')}
            </button>
            
            {/* If there is an active resume loaded in settings, link it */}
            <a
              id="btn-download-resume"
              href={settings?.active_resume_url || '#resume'}
              className="px-6 py-3 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-accent/40 dark:hover:border-accent/40 text-zinc-800 dark:text-zinc-200 hover:text-accent dark:hover:text-accent font-semibold font-display backdrop-blur-md active:scale-95 transition-all text-sm flex items-center justify-center cursor-pointer"
            >
              {t('heroDownloadResume')}
            </a>
          </motion.div>

          {/* Social Icons links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex gap-4 items-center pt-2"
          >
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer"
              >
                <Github size={18} />
              </a>
            )}
            {profile.facebook && (
              <a
                href={profile.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer"
              >
                <Facebook size={18} />
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer"
              >
                <Instagram size={18} />
              </a>
            )}
          </motion.div>
        </div>

        {/* Right Side: Photo Display */}
        <div className="md:col-span-5 flex justify-center order-1 md:order-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.2 }}
            className="relative w-56 h-56 sm:w-80 sm:h-80 aspect-square group"
          >
            {/* Ambient back pink shadow */}
            <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-accent to-pink-400 blur-md opacity-30 group-hover:opacity-40 transition-opacity" />
            
            {/* Picture Frame */}
            <div className="absolute inset-0 rounded-[2rem] border-2 border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden glass-panel flex items-center justify-center p-2">
              <img
                src={profile.profile_image ? `${api.baseUrl}${profile.profile_image}` : ''}
                alt={fullName}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Micro details badge */}
            <div className="absolute -bottom-4 -right-4 p-3 rounded-2xl glass-panel shadow-lg border border-zinc-200/60 dark:border-zinc-800/60 flex items-center gap-2 animate-float">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 relative" />
              <span className="text-[10px] font-bold font-display uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
                {language === 'th' ? 'ว่างสำหรับร่วมงาน' : 'Available for Work'}
              </span>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Down indicators */}
      <div className="absolute bottom-6 flex justify-center w-full">
        <motion.button
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
          className="flex flex-col items-center gap-1 text-[10px] font-bold font-display uppercase tracking-widest text-zinc-400 hover:text-accent transition-colors cursor-pointer"
        >
          {t('heroScrollDown')}
          <ArrowDown size={14} />
        </motion.button>
      </div>
    </section>
  );
}
