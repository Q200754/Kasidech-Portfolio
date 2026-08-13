import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Home, User, Server, Folder, Award, Calendar, PhoneCall, Download, Sun, Moon, Shield } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

export default function CommandPalette() {
  const { t, language } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  // Monitor shortcut activation (Ctrl + K or Cmd + K)
  useEffect(() => {
    const handleGlobalKeys = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        setSearchQuery('');
        setSelectedIndex(0);
      }
    };

    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);

  // Prevent background scrolling and auto-focus input on open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const commandItems = [
    {
      id: 'home',
      label: t('cpMenuHome'),
      category: t('cpGoTo'),
      icon: <Home size={16} />,
      action: () => handleNavigate('home')
    },
    {
      id: 'about',
      label: t('cpMenuAbout'),
      category: t('cpGoTo'),
      icon: <User size={16} />,
      action: () => handleNavigate('about')
    },
    {
      id: 'skills',
      label: t('cpMenuSkills'),
      category: t('cpGoTo'),
      icon: <Server size={16} />,
      action: () => handleNavigate('skills')
    },
    {
      id: 'projects',
      label: t('cpMenuProjects'),
      category: t('cpGoTo'),
      icon: <Folder size={16} />,
      action: () => handleNavigate('projects')
    },
    {
      id: 'certificates',
      label: t('cpMenuCertificates'),
      category: t('cpGoTo'),
      icon: <Award size={16} />,
      action: () => handleNavigate('certificates')
    },
    {
      id: 'activities',
      label: t('cpMenuActivities'),
      category: t('cpGoTo'),
      icon: <Calendar size={16} />,
      action: () => handleNavigate('activities')
    },
    {
      id: 'contact',
      label: t('cpMenuContact'),
      category: t('cpGoTo'),
      icon: <PhoneCall size={16} />,
      action: () => handleNavigate('contact')
    },
    {
      id: 'toggle-theme',
      label: t('cpMenuToggleTheme'),
      category: t('cpAction'),
      icon: theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />,
      action: () => { toggleTheme(); setIsOpen(false); }
    },
    {
      id: 'download-resume',
      label: t('cpMenuDownloadResume'),
      category: t('cpAction'),
      icon: <Download size={16} />,
      action: () => {
        // Trigger click event on DOM resume download button if available, or navigate to resume
        const resumeBtn = document.getElementById('btn-download-resume');
        if (resumeBtn) {
          resumeBtn.click();
        } else {
          handleNavigate('resume');
        }
        setIsOpen(false);
      }
    },
    {
      id: 'admin',
      label: 'Go to Admin Dashboard',
      category: t('cpAction'),
      icon: <Shield size={16} />,
      action: () => { navigate('/admin'); setIsOpen(false); }
    }
  ];

  const handleNavigate = (id) => {
    setIsOpen(false);
    navigate('/');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Filter commands by search text
  const filteredCommands = commandItems.filter(item =>
    item.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Monitor list selection keystrokes
  useEffect(() => {
    const handleListKeys = (e) => {
      if (!isOpen) return;
      
      if (e.key === 'Escape') {
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleListKeys);
    return () => window.removeEventListener('keydown', handleListKeys);
  }, [isOpen, selectedIndex, filteredCommands]);

  // Sync scroll on keyboard arrow movements
  useEffect(() => {
    const selectedElement = containerRef.current?.querySelector(`[data-index="${selectedIndex}"]`);
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: 'nearest' });
    }
  }, [selectedIndex]);

  return (
    <>
      {/* Search trigger helper button in UI */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-20 z-[99] flex items-center gap-2 px-4 py-2.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-lg text-zinc-600 dark:text-zinc-400 hover:text-accent dark:hover:text-accent hover:border-accent/40 dark:hover:border-accent/40 font-display font-medium text-xs transition-all pointer-events-auto cursor-pointer"
        title="Search Shortcuts (Ctrl+K)"
      >
        <Search size={14} />
        <span className="hidden sm:inline">Search</span>
        <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 border border-zinc-200/60 dark:border-zinc-700/60 text-[10px] font-mono">
          Ctrl K
        </kbd>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh] px-4 pointer-events-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Panel box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -20 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-lg bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800/80 shadow-2xl rounded-xl overflow-hidden flex flex-col max-h-[50vh] z-10"
            >
              {/* Search Header Input */}
              <div className="flex items-center gap-3 px-4 py-3.5 border-b border-zinc-150 dark:border-zinc-800/80">
                <Search size={18} className="text-zinc-400 shrink-0" />
                <input
                  ref={inputRef}
                  type="text"
                  placeholder={t('cpSearchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  className="w-full bg-transparent border-none outline-none text-sm text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 font-sans"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-display px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-800"
                >
                  ESC
                </button>
              </div>

              {/* Commands List */}
              <div 
                ref={containerRef}
                className="overflow-y-auto flex-1 p-2 space-y-1 select-none"
              >
                {filteredCommands.length > 0 ? (
                  filteredCommands.map((cmd, idx) => {
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={cmd.id}
                        data-index={idx}
                        onClick={() => cmd.action()}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors text-sm font-sans ${
                          isSelected 
                            ? 'bg-accent/10 dark:bg-accent/15 text-accent font-medium' 
                            : 'text-zinc-700 dark:text-zinc-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`shrink-0 ${isSelected ? 'text-accent' : 'text-zinc-400'}`}>
                            {cmd.icon}
                          </span>
                          <span>{cmd.label}</span>
                        </div>
                        <span className="text-[10px] font-semibold text-zinc-400 bg-zinc-100 dark:bg-zinc-850 px-2 py-0.5 rounded font-display uppercase tracking-wider">
                          {cmd.category}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-6 text-sm text-zinc-400 font-sans">
                    {t('uiEmpty')}
                  </div>
                )}
              </div>

              {/* Shortcuts Footer info */}
              <div className="px-4 py-2 bg-zinc-50 dark:bg-zinc-950/40 border-t border-zinc-150 dark:border-zinc-850 text-[10px] text-zinc-400 flex items-center justify-between font-display">
                <span>↑↓ Navigation</span>
                <span>Enter Select</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
