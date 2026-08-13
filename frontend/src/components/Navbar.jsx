import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { Menu, X, Sun, Moon, Globe, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const location = useLocation();

  const isMainPage = location.pathname === '/';

  // Toggle scrolling background shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }

      // Highlight active section on scroll
      if (isMainPage) {
        const sections = ['home', 'about', 'skills', 'projects', 'certificates', 'activities', 'contact'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const top = el.offsetTop;
            const height = el.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isMainPage]);

  const navItems = [
    { id: 'home', label: t('navHome') },
    { id: 'about', label: t('navAbout') },
    { id: 'skills', label: t('navSkills') },
    { id: 'projects', label: t('navProjects') },
    { id: 'certificates', label: t('navCertificates') },
    { id: 'activities', label: t('navActivities') },
    { id: 'contact', label: t('navContact') }
  ];

  const handleNavClick = (id) => {
    setIsOpen(false);
    if (isMainPage) {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on admin or another page, redirect to home with hash
      window.location.href = `/#${id}`;
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
      isScrolled 
        ? 'glass-nav py-3 shadow-md shadow-zinc-950/5 dark:shadow-zinc-950/20' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand / Logo */}
        <Link 
          to="/" 
          onClick={() => isMainPage && window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="font-display font-bold text-xl tracking-tight text-gradient-accent shrink-0"
        >
          K.NOILOM
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center gap-8">
          {isMainPage && navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-sm font-semibold tracking-wide font-display transition-colors hover:text-accent cursor-pointer ${
                activeSection === item.id 
                  ? 'text-accent' 
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          {!isMainPage && (
            <Link 
              to="/" 
              className="text-sm font-semibold tracking-wide font-display text-zinc-600 dark:text-zinc-300 hover:text-accent"
            >
              ← Back to Portfolio
            </Link>
          )}
        </div>

        {/* Right Side Settings Controls */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-zinc-200 dark:border-zinc-800 hover:border-accent/40 dark:hover:border-accent/40 text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent text-xs font-bold font-display cursor-pointer transition-all"
            title="Switch Language"
          >
            <Globe size={13} />
            {language === 'th' ? 'TH | EN' : 'EN | TH'}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-accent hover:border-accent/40 dark:hover:text-accent dark:hover:border-accent/40 cursor-pointer transition-colors"
            title="Toggle Dark Mode"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Admin panel link / Logout */}
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Link
                to="/admin"
                className="px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold font-display shadow-sm"
              >
                {t('navAdmin')}
              </Link>
              <button
                onClick={logout}
                className="p-2 rounded-full border border-red-500/20 text-red-500 hover:bg-red-500/10 cursor-pointer"
                title="Log Out"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              className="text-xs font-semibold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 font-display transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>

        {/* Mobile Navbar Controllers */}
        <div className="flex lg:hidden items-center gap-3">
          {/* Mobile Lang Button */}
          <button
            onClick={() => setLanguage(language === 'th' ? 'en' : 'th')}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-accent text-xs font-bold font-display"
          >
            {language === 'th' ? 'EN' : 'TH'}
          </button>

          {/* Mobile Theme Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300"
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Panel */}
      {isOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full glass-nav shadow-lg border-t border-zinc-200/30 dark:border-zinc-800/30 py-4 px-6 flex flex-col gap-4">
          {isMainPage && navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left text-sm font-semibold py-1.5 font-display transition-colors ${
                activeSection === item.id 
                  ? 'text-accent' 
                  : 'text-zinc-600 dark:text-zinc-300'
              }`}
            >
              {item.label}
            </button>
          ))}
          {!isMainPage && (
            <Link 
              to="/" 
              onClick={() => setIsOpen(false)}
              className="text-sm font-semibold py-1.5 font-display text-zinc-600 dark:text-zinc-300"
            >
              ← Back to Portfolio
            </Link>
          )}

          <hr className="border-zinc-200/40 dark:border-zinc-800/40 my-1" />

          {/* Mobile Dashboard session */}
          {isAuthenticated ? (
            <div className="flex gap-2">
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="flex-1 text-center py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold font-display"
              >
                {t('navAdmin')}
              </Link>
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="py-2 px-3 rounded-lg border border-red-500/20 text-red-500 text-xs font-semibold font-display"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/admin/login"
              onClick={() => setIsOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs font-semibold font-display"
            >
              Sign In Admin
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
