import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Search, ExternalLink, ArrowRight, Eye, Grid } from 'lucide-react';
import { Github } from './BrandIcons';
import ProjectDetailModal from './ProjectDetailModal';
import { api } from '../utils/api';

export default function Projects({ projects = [] }) {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = [
    { id: 'All', label: t('projectAll') },
    { id: 'Web', label: t('projectWeb') },
    { id: 'Programming', label: t('projectProg') },
    { id: 'Design', label: t('projectDesign') },
    { id: 'System', label: t('projectSystem') },
    { id: 'Other', label: t('projectOther') }
  ];

  // Filtering + Searching logic
  const filteredProjects = projects.filter((project) => {
    const title = (language === 'th' ? project.name_th : project.name_en) || '';
    const desc = (language === 'th' ? project.description_th : project.description_en) || '';
    const tech = project.technologies || '';

    const matchesSearch =
      title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeFilter === 'All' || 
      project.category.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <section id="projects" className="py-24 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('projectsTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('projectsSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Filter Controls & Search Panel */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between font-sans">
          
          {/* Categories Tab list */}
          <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start w-full sm:w-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-full text-xs font-semibold font-display tracking-wide active:scale-95 transition-all cursor-pointer ${
                  activeFilter === filter.id
                    ? 'bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 shadow-md'
                    : 'bg-zinc-150 dark:bg-zinc-900 border border-zinc-200/30 dark:border-zinc-800/30 text-zinc-600 dark:text-zinc-400 hover:text-accent hover:border-accent/30 dark:hover:text-accent'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Search box input */}
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              placeholder={t('projectSearch')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 text-sm placeholder-zinc-400 outline-none focus:border-accent/40 dark:focus:border-accent/40 transition-colors text-zinc-800 dark:text-zinc-100"
            />
          </div>
        </div>

        {/* Projects Cards Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => {
                const title = language === 'th' ? project.name_th : project.name_en;
                const desc = language === 'th' ? project.description_th : project.description_en;
                const techList = project.technologies 
                  ? project.technologies.split(',').slice(0, 3).map(t => t.trim()) 
                  : [];

                return (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-2xl glass-panel border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden flex flex-col justify-between h-[420px] shadow-sm relative"
                  >
                    <div>
                      {/* Project Image Cover */}
                      <div className="aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative border-b border-zinc-200/30 dark:border-zinc-800/30">
                        {project.featured ? (
                          <span className="absolute top-3 left-3 z-10 text-[9px] font-bold font-display px-2 py-0.5 rounded-full bg-accent text-white uppercase tracking-wider shadow">
                            {t('uiFeatured')}
                          </span>
                        ) : null}
                        
                        <img
                          src={project.cover_image ? `${api.baseUrl}${project.cover_image}` : ''}
                          alt={title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Interactive glass overlay on hover */}
                        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button
                            onClick={() => setSelectedProject(project)}
                            className="p-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 hover:text-accent transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 hover:text-accent transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
                              title="GitHub Code"
                            >
                              <Github size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-5 space-y-3 font-sans">
                        <span className="text-[10px] font-bold font-display text-accent uppercase tracking-wider">
                          {project.category}
                        </span>
                        
                        <h4 className="text-base font-bold font-display text-zinc-900 dark:text-white line-clamp-1 leading-snug">
                          {title}
                        </h4>
                        
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                          {desc}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Footer Details (Tages + Action) */}
                    <div className="px-5 pb-5 pt-3 space-y-4 border-t border-zinc-150/40 dark:border-zinc-800/40 font-sans">
                      {/* Tech Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        {techList.map((t, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900/60 border border-zinc-200/30 dark:border-zinc-800/30 text-zinc-500 dark:text-zinc-400 text-[10px] font-mono"
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center justify-between text-xs pt-1">
                        <button
                          onClick={() => setSelectedProject(project)}
                          className="font-semibold font-display text-zinc-700 dark:text-zinc-300 hover:text-accent dark:hover:text-accent transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          {t('projectBtnDetail')}
                          <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="flex gap-2">
                          {project.github_url && (
                            <a
                              href={project.github_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              title="GitHub Repository"
                            >
                              <Github size={15} />
                            </a>
                          )}
                          {project.live_demo_url && (
                            <a
                              href={project.live_demo_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                              title="Live Demo"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>

                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 text-center py-12 text-sm text-zinc-400">
                {t('uiEmpty')}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Project Detail Modal Overlay */}
        {selectedProject && (
          <ProjectDetailModal
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </div>
    </section>
  );
}
