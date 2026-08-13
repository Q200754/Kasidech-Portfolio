import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Calendar, CheckCircle2, Server, Globe } from 'lucide-react';
import { Github } from './BrandIcons';
import { useLanguage } from '../context/LanguageContext';

export default function ProjectDetailModal({ project, onClose }) {
  const { language, t } = useLanguage();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!project) return null;

  const title = language === 'th' ? project.name_th : project.name_en;
  const description = language === 'th' ? project.description_th : project.description_en;
  const fullDescription = language === 'th' ? project.full_description_th : project.full_description_en;
  const status = project.status;
  const category = project.category;
  
  // Parse tech list
  const techList = project.technologies 
    ? project.technologies.split(',').map(tech => tech.trim()).filter(Boolean)
    : [];

  const allScreenshots = [];
  if (project.cover_image) {
    allScreenshots.push(project.cover_image);
  }
  if (project.screenshots && project.screenshots.length > 0) {
    project.screenshots.forEach(shot => {
      // Prevent duplicating cover if it is already in screenshots
      if (shot.image_url !== project.cover_image) {
        allScreenshots.push(shot.image_url);
      }
    });
  }

  // Handle ESC key to close
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-auto">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-sm"
        />

        {/* Modal content card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="relative w-full max-w-4xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200/60 dark:border-zinc-800/60 overflow-hidden flex flex-col max-h-[90vh] z-10"
        >
          {/* Top Bar Header */}
          <div className="flex justify-between items-center p-4 border-b border-zinc-100 dark:border-zinc-800/80 sticky top-0 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md z-20">
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent font-display uppercase tracking-wider">
                {category}
              </span>
              <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white mt-1">
                {title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Modal scroll area */}
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Screenshots Showcase */}
            {allScreenshots.length > 0 && (
              <div className="space-y-3">
                <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800/50 relative">
                  <img
                    src={allScreenshots[activeImageIndex]}
                    alt={`${title} screenshot`}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                </div>
                
                {/* Thumbnails list */}
                {allScreenshots.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 max-w-full">
                    {allScreenshots.map((shot, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImageIndex(idx)}
                        className={`aspect-video w-20 rounded-md overflow-hidden border-2 shrink-0 transition-all ${
                          activeImageIndex === idx 
                            ? 'border-accent scale-95 shadow-md shadow-accent/10' 
                            : 'border-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <img src={shot} alt="thumbnail" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Content Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Main Content (Left, cols: 2) */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h4 className="text-sm font-bold font-display text-zinc-900 dark:text-zinc-100 uppercase tracking-wide mb-2">
                    {t('projectModalOverview')}
                  </h4>
                  <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-line font-sans">
                    {fullDescription || description}
                  </p>
                </div>

                {/* Additional sections if we have custom fields or text (can divide dynamically) */}
              </div>

              {/* Sidebar details (Right, col: 1) */}
              <div className="bg-zinc-50 dark:bg-zinc-950/40 border border-zinc-100 dark:border-zinc-800/40 p-5 rounded-xl space-y-5 h-fit text-sm">
                
                {/* Links */}
                <div className="space-y-2">
                  {project.live_demo_url && (
                    <a
                      href={project.live_demo_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-lg bg-accent text-white font-medium hover:bg-accent-dark transition-colors flex items-center justify-center gap-2 cursor-pointer font-display shadow-md shadow-accent/10"
                    >
                      <ExternalLink size={16} />
                      {t('projectBtnDemo')}
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2 px-4 rounded-lg bg-zinc-800 dark:bg-zinc-800 hover:bg-zinc-950 dark:hover:bg-zinc-700 text-white font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer font-display"
                    >
                      <Github size={16} />
                      {t('projectBtnGithub')}
                    </a>
                  )}
                </div>

                <hr className="border-zinc-200/60 dark:border-zinc-800/60" />

                {/* Metadata details */}
                <div className="space-y-4">
                  {/* Status */}
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <CheckCircle2 size={15} className="text-zinc-400" />
                      {t('projectStatus')}
                    </span>
                    <span className={`font-semibold px-2 py-0.5 rounded text-xs ${
                      status === 'Completed' 
                        ? 'bg-green-500/10 text-green-500' 
                        : status === 'In Progress' 
                        ? 'bg-yellow-500/10 text-yellow-500'
                        : 'bg-zinc-500/10 text-zinc-500'
                    }`}>
                      {status}
                    </span>
                  </div>

                  {/* Dates */}
                  {(project.start_date || project.end_date) && (
                    <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                      <span className="flex items-center gap-1.5 font-medium">
                        <Calendar size={15} className="text-zinc-400" />
                        {t('projectStartEnd')}
                      </span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs">
                        {project.start_date} {project.end_date ? ` - ${project.end_date}` : ''}
                      </span>
                    </div>
                  )}

                  {/* Category */}
                  <div className="flex items-center justify-between text-zinc-600 dark:text-zinc-400">
                    <span className="flex items-center gap-1.5 font-medium">
                      <Globe size={15} className="text-zinc-400" />
                      Category
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                      {category}
                    </span>
                  </div>
                </div>

                <hr className="border-zinc-200/60 dark:border-zinc-800/60" />

                {/* Technologies tags */}
                {techList.length > 0 && (
                  <div className="space-y-2">
                    <h5 className="font-bold font-display text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                      <Server size={15} className="text-zinc-400" />
                      {t('projectModalTech')}
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {techList.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 rounded bg-zinc-200/50 dark:bg-zinc-900/80 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              </div>

            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
