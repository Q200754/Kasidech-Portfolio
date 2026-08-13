import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Download, Briefcase, GraduationCap, Award, CheckCircle } from 'lucide-react';
import { api } from '../utils/api';

export default function Resume({ profile, skills = [], projects = [], activities = [], certificates = [], settings }) {
  const { t, language } = useLanguage();

  if (!profile) return null;

  const fullName = language === 'th' ? profile.full_name_th : profile.full_name_en;
  const school = language === 'th' ? profile.school_th : profile.school_en;
  const education = language === 'th' ? profile.education_th : profile.education_en;
  const aboutMe = language === 'th' ? profile.about_me_th : profile.about_me_en;
  const location = language === 'th' ? profile.location_th : profile.location_en;

  const activeSkills = skills.filter(s => !!s.enabled).slice(0, 8);
  const featuredProjects = projects.filter(p => !!p.featured).slice(0, 2);

  // Resume PDF link
  const resumeUrl = settings?.active_resume_url 
    ? `${api.baseUrl}${settings.active_resume_url}` 
    : '#';

  return (
    <section id="resume" className="py-24 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('resumeTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('resumeSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Professional Resume Sheet mockup */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto rounded-2xl glass-panel shadow-2xl border border-zinc-200/60 dark:border-zinc-850 p-6 sm:p-12 text-left relative overflow-hidden font-sans"
        >
          {/* Accent top gradient stripe */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-accent to-pink-400" />

          {/* Sheet Header */}
          <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-6 pb-8 border-b border-zinc-150 dark:border-zinc-800/60">
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold font-display text-zinc-900 dark:text-white leading-none">
                {fullName}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-accent font-display uppercase tracking-wider mt-2.5">
                Student & Creative Web Developer
              </p>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-zinc-500 mt-3 font-sans">
                <span>{profile.email}</span>
                <span>•</span>
                <span>{profile.phone}</span>
                <span>•</span>
                <span>{location}</span>
              </div>
            </div>

            {/* Download Action */}
            <a
              href={resumeUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="px-5 py-2.5 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 hover:bg-zinc-800 dark:hover:bg-zinc-100 font-semibold font-display text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-zinc-900/10 active:scale-95 transition-all w-fit cursor-pointer shrink-0"
            >
              <Download size={14} />
              {t('resumeDownloadPdf')}
            </a>
          </div>

          {/* Sheet Grid Content */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-8">
            
            {/* Left Sheet Body (cols: 8) */}
            <div className="md:col-span-8 space-y-8">
              
              {/* Summary */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-display text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText size={15} className="text-accent" />
                  {language === 'th' ? 'บทสรุปผู้สมัคร' : 'Professional Summary'}
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {aboutMe}
                </p>
              </div>

              {/* Projects Highlight */}
              {featuredProjects.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs font-bold font-display text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Briefcase size={15} className="text-accent" />
                    {t('resumeExpSection')}
                  </h4>
                  
                  <div className="space-y-4">
                    {featuredProjects.map(proj => {
                      const name = language === 'th' ? proj.name_th : proj.name_en;
                      const shortDesc = language === 'th' ? proj.description_th : proj.description_en;
                      return (
                        <div key={proj.id} className="space-y-1">
                          <div className="flex justify-between items-start">
                            <h5 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                              {name}
                            </h5>
                            <span className="text-[10px] font-mono text-zinc-400">{proj.start_date}</span>
                          </div>
                          <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                            {shortDesc}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sheet Sidebar (cols: 4) */}
            <div className="md:col-span-4 space-y-8 border-t md:border-t-0 md:border-l border-zinc-150 dark:border-zinc-800/60 pt-8 md:pt-0 md:pl-6">
              
              {/* Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold font-display text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <GraduationCap size={15} className="text-accent" />
                  {t('resumeEduSection')}
                </h4>
                <div className="space-y-2 text-xs">
                  <div>
                    <h5 className="font-bold text-zinc-800 dark:text-zinc-200 leading-tight">
                      {school}
                    </h5>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{education}</p>
                  </div>
                </div>
              </div>

              {/* Skills summary list */}
              {activeSkills.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-display text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <CheckCircle size={15} className="text-accent" />
                    {t('navSkills')}
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSkills.map(skill => (
                      <span
                        key={skill.id}
                        className="px-2 py-0.5 rounded bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/20 dark:border-zinc-800/20 text-zinc-700 dark:text-zinc-300 text-[10px] font-medium"
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Certificates count summary */}
              {certificates.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold font-display text-zinc-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <Award size={15} className="text-accent" />
                    {t('resumeCertSection')}
                  </h4>
                  <ul className="text-xs text-zinc-500 dark:text-zinc-400 space-y-1 list-disc list-inside">
                    {certificates.slice(0, 3).map(cert => (
                      <li key={cert.id} className="truncate">
                        {language === 'th' ? cert.name_th : cert.name_en}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
