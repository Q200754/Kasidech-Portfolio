import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import * as Icons from 'lucide-react';

export default function Skills({ skills = [] }) {
  const { t, language } = useLanguage();

  // Helper to dynamically render Lucide icons by name
  const renderIcon = (iconName) => {
    const IconComponent = Icons[iconName] || Icons.Cpu;
    return <IconComponent size={20} className="text-accent" />;
  };

  // Group skills by category
  const categories = ['Programming', 'Framework', 'Tools', 'Design'];
  
  const getCategoryLabel = (cat) => {
    switch (cat) {
      case 'Programming': return t('skillsProg');
      case 'Framework': return t('skillsFramework');
      case 'Tools': return t('skillsTools');
      case 'Design': return t('skillsDesign');
      default: return t('skillsOther');
    }
  };

  const activeSkills = skills.filter(skill => !!skill.enabled);

  // Grouped skills map
  const groupedSkills = {};
  categories.forEach(cat => {
    groupedSkills[cat] = activeSkills.filter(s => s.category === cat);
  });
  
  // Any skills with other categories
  const otherSkills = activeSkills.filter(s => !categories.includes(s.category));
  if (otherSkills.length > 0) {
    groupedSkills['Other'] = otherSkills;
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', damping: 20, stiffness: 100 }
    }
  };

  return (
    <section id="skills" className="py-24 bg-zinc-100/30 dark:bg-zinc-950/20 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('skillsTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('skillsSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Group Grids */}
        <div className="space-y-12 text-left">
          {Object.entries(groupedSkills).map(([cat, list]) => {
            if (list.length === 0) return null;
            return (
              <div key={cat} className="space-y-6">
                {/* Category Banner */}
                <h3 className="text-lg font-bold font-display text-zinc-800 dark:text-zinc-200 border-l-4 border-accent pl-3 uppercase tracking-wider">
                  {getCategoryLabel(cat)}
                </h3>

                {/* Cards Grid */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
                >
                  {list.map((skill) => {
                    const desc = language === 'th' ? skill.description_th : skill.description_en;
                    return (
                      <motion.div
                        key={skill.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="p-5 rounded-2xl glass-panel glass-panel-hover flex flex-col justify-between h-40 border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm relative group"
                      >
                        {/* Top row */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="p-2 rounded-xl bg-accent/10 dark:bg-accent/15 flex items-center justify-center shrink-0">
                              {renderIcon(skill.icon)}
                            </div>
                            <span className="text-[10px] font-bold font-display text-zinc-400 dark:text-zinc-500 group-hover:text-accent transition-colors uppercase tracking-widest">
                              {skill.level}%
                            </span>
                          </div>

                          <h4 className="text-sm font-bold font-display text-zinc-900 dark:text-white mt-1">
                            {skill.name}
                          </h4>
                          {desc && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400 font-sans line-clamp-2 leading-relaxed mt-0.5">
                              {desc}
                            </p>
                          )}
                        </div>

                        {/* Level bar indicator */}
                        <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden mt-3">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.1 }}
                            className="h-full bg-accent rounded-full shadow-[0_0_8px_rgba(255,110,174,0.4)]"
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </motion.div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
