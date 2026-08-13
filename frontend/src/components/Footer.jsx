import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Github, Facebook, Instagram } from './BrandIcons';
import { Link } from 'react-router-dom';

export default function Footer({ profile }) {
  const { t } = useLanguage();

  return (
    <footer className="py-12 bg-white dark:bg-zinc-950 border-t border-zinc-250/20 dark:border-zinc-900/60 font-sans text-xs text-zinc-500">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Left Side: Brand name and credits */}
        <div className="text-center md:text-left space-y-1.5">
          <p className="font-bold text-zinc-800 dark:text-zinc-200 font-display text-sm tracking-wide">
            © 2026 กษิเดช น้อยลมทวน
          </p>
          <p className="text-[11px] text-zinc-400">
            Built with React, Vite, Tailwind CSS & Framer Motion.
          </p>
        </div>

        {/* Right Side: Social Media links */}
        {profile && (
          <div className="flex gap-4 items-center">
            {profile.github && (
              <a
                href={profile.github}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-accent hover:border-accent/25 dark:hover:text-accent transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/40"
                title="GitHub"
              >
                <Github size={15} />
              </a>
            )}
            {profile.facebook && (
              <a
                href={profile.facebook}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-accent hover:border-accent/25 dark:hover:text-accent transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/40"
                title="Facebook"
              >
                <Facebook size={15} />
              </a>
            )}
            {profile.instagram && (
              <a
                href={profile.instagram}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-full border border-zinc-200/50 dark:border-zinc-800/50 text-zinc-400 hover:text-accent hover:border-accent/25 dark:hover:text-accent transition-colors cursor-pointer bg-zinc-50 dark:bg-zinc-900/40"
                title="Instagram"
              >
                <Instagram size={15} />
              </a>
            )}
          </div>
        )}

      </div>
    </footer>
  );
}
