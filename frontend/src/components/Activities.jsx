import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, MapPin, Landmark, Award, Camera, Eye } from 'lucide-react';
import Lightbox from './Lightbox';
import { api } from '../utils/api';

export default function Activities({ activities = [] }) {
  const { t, language } = useLanguage();
  const [lightboxState, setLightboxState] = useState({ isOpen: false, images: [], index: 0 });

  const openLightbox = (activityImages, startIndex) => {
    setLightboxState({
      isOpen: true,
      images: activityImages.map(img => img.image_url),
      index: startIndex
    });
  };

  return (
    <section id="activities" className="py-24 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('actTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('actSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Vertical Timeline */}
        {activities.length > 0 ? (
          <div className="relative border-l border-zinc-200 dark:border-zinc-800/80 ml-4 md:mx-auto md:border-l-2 max-w-4xl py-4 space-y-12 text-left font-sans">
            {activities.map((activity, idx) => {
              const name = language === 'th' ? activity.name_th : activity.name_en;
              const desc = language === 'th' ? activity.description_th : activity.description_en;
              const loc = language === 'th' ? activity.location_th : activity.location_en;
              const org = language === 'th' ? activity.organization_th : activity.organization_en;
              const achievement = language === 'th' ? activity.achievement_th : activity.achievement_en;
              const isEven = idx % 2 === 0;

              return (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative flex flex-col md:flex-row gap-6 md:gap-12 pl-8 md:pl-0"
                >
                  {/* Circle Badge Icon */}
                  <span className="absolute -left-[13px] md:left-[50%] md:-translate-x-1/2 top-1.5 flex items-center justify-center w-6.5 h-6.5 rounded-full bg-white dark:bg-zinc-950 border-2 border-accent shadow-sm z-10">
                    <span className="w-2.5 h-2.5 rounded-full bg-accent animate-ping absolute" />
                    <span className="w-2 h-2 rounded-full bg-accent relative" />
                  </span>

                  {/* Left Side: Meta Info (Date, Award, Org) - cols: 4 */}
                  <div className={`w-full md:w-5/12 md:text-right flex flex-col gap-2 ${isEven ? 'md:order-1' : 'md:order-2 md:text-left'}`}>
                    {activity.date && (
                      <span className="text-xs font-bold font-display text-accent flex items-center gap-1.5 justify-start md:justify-end">
                        <Calendar size={13} className="text-accent" />
                        {activity.date}
                      </span>
                    )}

                    {achievement && (
                      <div className="flex items-center gap-2 text-xs font-semibold font-display text-amber-500 py-1 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 w-fit md:ml-auto select-none">
                        <Award size={14} />
                        {achievement}
                      </div>
                    )}

                    <div className="space-y-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {org && (
                        <div className="flex items-center gap-1.5 justify-start md:justify-end">
                          <Landmark size={13} className="text-zinc-400" />
                          <span>{org}</span>
                        </div>
                      )}
                      {loc && (
                        <div className="flex items-center gap-1.5 justify-start md:justify-end">
                          <MapPin size={13} className="text-zinc-400" />
                          <span>{loc}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mid Spacing spacer for Desktop */}
                  <div className="hidden md:block w-2/12" />

                  {/* Right Side: Main Text and Photo Grids - cols: 5 */}
                  <div className={`w-full md:w-5/12 space-y-4 ${isEven ? 'md:order-2' : 'md:order-1'}`}>
                    <div className="space-y-2">
                      <h4 className="text-base font-bold font-display text-zinc-900 dark:text-white leading-tight">
                        {name}
                      </h4>
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-sans">
                        {desc}
                      </p>
                    </div>

                    {/* Activity photos layout (small grid) */}
                    {activity.images && activity.images.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {activity.images.map((img, imgIdx) => (
                          <div
                            key={img.id}
                            onClick={() => openLightbox(activity.images, imgIdx)}
                            className="aspect-square rounded-lg overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100 dark:bg-zinc-900 relative group cursor-zoom-in"
                          >
                            <img
                              src={`${api.baseUrl}${img.image_url}`}
                              alt="Activity snap"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Camera size={14} className="text-white" />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-sm text-zinc-400 font-sans">
            {t('uiEmpty')}
          </div>
        )}

        {/* Lightbox Trigger overlay */}
        {lightboxState.isOpen && (
          <Lightbox
            images={lightboxState.images}
            currentIndex={lightboxState.index}
            onClose={() => setLightboxState({ isOpen: false, images: [], index: 0 })}
            onNavigate={(idx) => setLightboxState(prev => ({ ...prev, index: idx }))}
          />
        )}
      </div>
    </section>
  );
}
