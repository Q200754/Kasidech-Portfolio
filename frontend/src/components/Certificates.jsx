import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Award, Calendar, Landmark, Eye, ExternalLink, Link } from 'lucide-react';
import Lightbox from './Lightbox';
import { api } from '../utils/api';

export default function Certificates({ certificates = [] }) {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filters = [
    { id: 'All', label: t('certFilterAll') },
    { id: 'Programming', label: t('certFilterProg') },
    { id: 'Design', label: t('certFilterDesign') },
    { id: 'English', label: t('certFilterEnglish') },
    { id: 'Competition', label: t('certFilterCompetition') },
    { id: 'Other', label: t('certFilterOther') }
  ];

  // Filtering logic
  const filteredCerts = certificates.filter(cert => {
    return activeFilter === 'All' || cert.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="certificates" className="py-24 bg-zinc-100/30 dark:bg-zinc-950/20 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('certTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('certSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap gap-1.5 justify-center font-sans">
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

        {/* Certificates Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-left font-sans"
        >
          <AnimatePresence mode="popLayout">
            {filteredCerts.length > 0 ? (
              filteredCerts.map((cert, idx) => {
                const name = language === 'th' ? cert.name_th : cert.name_en;
                const org = language === 'th' ? cert.organization_th : cert.organization_en;
                const desc = language === 'th' ? cert.description_th : cert.description_en;

                return (
                  <motion.div
                    layout
                    key={cert.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="group rounded-2xl glass-panel border border-zinc-200/50 dark:border-zinc-800/50 overflow-hidden flex flex-col justify-between h-[360px] shadow-sm"
                  >
                    <div>
                      {/* Cert Image Cover */}
                      <div className="aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950 relative border-b border-zinc-200/30 dark:border-zinc-800/30">
                        <img
                          src={cert.certificate_image ? `${api.baseUrl}${cert.certificate_image}` : ''}
                          alt={name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Interactive overlay on hover */}
                        <div className="absolute inset-0 bg-zinc-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                          <button
                            onClick={() => setLightboxIndex(idx)}
                            className="p-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 hover:text-accent transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
                            title="Fullscreen View"
                          >
                            <Eye size={18} />
                          </button>
                          {cert.verification_url && (
                            <a
                              href={cert.verification_url}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2.5 rounded-full bg-white hover:bg-zinc-100 text-zinc-950 hover:text-accent transition-all hover:scale-105 active:scale-95 shadow cursor-pointer"
                              title={t('certVerify')}
                            >
                              <ExternalLink size={18} />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Info details */}
                      <div className="p-4 space-y-2">
                        <span className="text-[9px] font-bold font-display text-accent uppercase tracking-wider">
                          {cert.category}
                        </span>
                        
                        <h4 className="text-sm font-bold font-display text-zinc-900 dark:text-white line-clamp-1 leading-snug">
                          {name}
                        </h4>

                        <div className="flex flex-col gap-1 text-[11px] text-zinc-500 dark:text-zinc-400">
                          <div className="flex items-center gap-1.5">
                            <Landmark size={12} className="text-zinc-400 shrink-0" />
                            <span className="truncate">{org}</span>
                          </div>
                          {cert.issue_date && (
                            <div className="flex items-center gap-1.5">
                              <Calendar size={12} className="text-zinc-400 shrink-0" />
                              <span>{cert.issue_date}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Details Footer */}
                    <div className="px-4 pb-4 pt-2 border-t border-zinc-150/40 dark:border-zinc-800/40 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-zinc-400 font-mono truncate max-w-[150px]" title={cert.certificate_id}>
                        ID: {cert.certificate_id || 'N/A'}
                      </span>

                      {cert.verification_url && (
                        <a
                          href={cert.verification_url}
                          target="_blank"
                          rel="noreferrer"
                          className="font-semibold font-display text-accent hover:text-accent-dark flex items-center gap-1 cursor-pointer"
                        >
                          {t('certVerify')}
                          <ExternalLink size={12} />
                        </a>
                      )}
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

        {/* Lightbox Modal */}
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredCerts}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(index) => setLightboxIndex(index)}
          />
        )}

      </div>
    </section>
  );
}
