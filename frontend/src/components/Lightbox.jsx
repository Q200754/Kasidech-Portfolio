import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function Lightbox({ images = [], currentIndex = 0, onClose, onNavigate }) {
  const { language } = useLanguage();
  const hasMultiple = images.length > 1;
  const currentImage = images[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' && hasMultiple) handleNext();
      if (e.key === 'ArrowLeft' && hasMultiple) handlePrev();
    };

    // Prevent background scrolling
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentIndex, images, onClose]);

  if (!currentImage) return null;

  // Resolve image URL
  const imageUrl = currentImage.image_url || currentImage;
  const title = language === 'th' 
    ? (currentImage.title_th || currentImage.name_th || '') 
    : (currentImage.title_en || currentImage.name_en || '');
  const description = language === 'th' 
    ? (currentImage.description_th || '') 
    : (currentImage.description_en || '');

  const handlePrev = () => {
    if (!hasMultiple) return;
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    onNavigate(prevIndex);
  };

  const handleNext = () => {
    if (!hasMultiple) return;
    const nextIndex = (currentIndex + 1) % images.length;
    onNavigate(nextIndex);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 pointer-events-auto"
      >
        {/* Top bar */}
        <div className="flex justify-between items-center w-full z-10 text-white p-2">
          <div className="text-sm font-medium opacity-80 font-display">
            {hasMultiple && `${currentIndex + 1} / ${images.length}`}
          </div>
          <div className="flex gap-4">
            <a
              href={imageUrl}
              download
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              title="Open full image"
            >
              <Download size={20} />
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-white"
              title="Close (Esc)"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Mid Area (Image + Arrows) */}
        <div className="relative flex-1 flex items-center justify-center max-h-[85vh] w-full">
          {/* Left Arrow */}
          {hasMultiple && (
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all text-white border border-white/10 active:scale-95 cursor-pointer"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          {/* Active Image */}
          <motion.img
            key={imageUrl}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            src={imageUrl}
            alt={title || "Lightbox view"}
            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl select-none"
          />

          {/* Right Arrow */}
          {hasMultiple && (
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-white/5 hover:bg-white/15 transition-all text-white border border-white/10 active:scale-95 cursor-pointer"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Bottom Details Panel */}
        <div className="w-full text-center text-white p-4 max-w-2xl mx-auto z-10">
          {title && (
            <h4 className="text-lg font-bold font-display text-white mb-1">
              {title}
            </h4>
          )}
          {description && (
            <p className="text-sm text-zinc-400 font-sans break-words max-w-full">
              {description}
            </p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
