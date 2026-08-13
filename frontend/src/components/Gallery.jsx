import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Eye, Image as ImageIcon } from 'lucide-react';
import Lightbox from './Lightbox';
import { api } from '../utils/api';

export default function Gallery({ gallery = [] }) {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filters = [
    { id: 'All', label: t('galleryAll') },
    { id: 'School', label: t('gallerySchool') },
    { id: 'Activities', label: t('galleryActivities') },
    { id: 'Competition', label: t('galleryCompetition') },
    { id: 'Projects', label: t('galleryProjects') },
    { id: 'Events', label: t('galleryEvents') }
  ];

  const filteredGallery = gallery.filter((item) => {
    return activeFilter === 'All' || item.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section id="gallery" className="py-24 bg-zinc-100/30 dark:bg-zinc-950/20 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('galleryTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('gallerySubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Categories Tab selector */}
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

        {/* Masonry/Grid Photos Area */}
        <motion.div 
          layout
          className="masonry-grid font-sans"
        >
          <AnimatePresence mode="popLayout">
            {filteredGallery.length > 0 ? (
              filteredGallery.map((item, idx) => {
                const title = language === 'th' ? item.title_th : item.title_en;
                
                return (
                  <motion.div
                    layout
                    key={item.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="relative group rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 aspect-video sm:aspect-square border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm cursor-zoom-in"
                    onClick={() => setLightboxIndex(idx)}
                  >
                    <img
                      src={`${api.baseUrl}${item.image_url}`}
                      alt={title || "Gallery snap"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Dark gradient slide-up on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-350 p-4 flex flex-col justify-end text-left">
                      <div className="flex items-center gap-1.5 text-[9px] font-bold font-display text-accent uppercase tracking-wider mb-1">
                        <ImageIcon size={10} />
                        {item.category}
                      </div>
                      
                      {title && (
                        <h4 className="text-sm font-bold font-display text-white line-clamp-1 leading-snug">
                          {title}
                        </h4>
                      )}
                      
                      <div className="text-[10px] text-zinc-400 flex items-center gap-1 mt-1 font-display">
                        <Eye size={12} />
                        <span>View Larger</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12 text-sm text-zinc-400">
                {t('uiEmpty')}
              </div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Fullscreen Lightbox */}
        {lightboxIndex !== null && (
          <Lightbox
            images={filteredGallery}
            currentIndex={lightboxIndex}
            onClose={() => setLightboxIndex(null)}
            onNavigate={(index) => setLightboxIndex(index)}
          />
        )}
      </div>
    </section>
  );
}
