import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

// Sections Components
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import Certificates from '../components/Certificates';
import Activities from '../components/Activities';
import Gallery from '../components/Gallery';
import Resume from '../components/Resume';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import BackToTop from '../components/BackToTop';
import CommandPalette from '../components/CommandPalette';
import ToastContainer, { toast } from '../components/Toast';

// Static Fallbacks
import {
  fallbackProfile,
  fallbackSkills,
  fallbackProjects,
  fallbackCertificates,
  fallbackActivities,
  fallbackSettings
} from '../data/fallbackData';

export default function PortfolioHome() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    async function fetchPortfolioData() {
      try {
        setLoading(true);
        
        // Parallel queries to speed up loading
        const [
          profileRes,
          skillsRes,
          projectsRes,
          certsRes,
          activitiesRes,
          galleryRes,
          settingsRes,
          activeResumeRes
        ] = await Promise.allSettled([
          api.get('/api/profile'),
          api.get('/api/skills'),
          api.get('/api/projects'),
          api.get('/api/certificates'),
          api.get('/api/activities'),
          api.get('/api/gallery'),
          api.get('/api/settings'),
          api.get('/api/resume')
        ]);

        // Load profile
        if (profileRes.status === 'fulfilled' && profileRes.value.success) {
          setProfile(profileRes.value.profile);
        } else {
          setProfile(fallbackProfile);
        }

        // Load skills
        if (skillsRes.status === 'fulfilled' && skillsRes.value.success) {
          setSkills(skillsRes.value.skills);
        } else {
          setSkills(fallbackSkills);
        }

        // Load projects
        if (projectsRes.status === 'fulfilled' && projectsRes.value.success) {
          setProjects(projectsRes.value.projects);
        } else {
          setProjects(fallbackProjects);
        }

        // Load certificates
        if (certsRes.status === 'fulfilled' && certsRes.value.success) {
          setCertificates(certsRes.value.certificates);
        } else {
          setCertificates(fallbackCertificates);
        }

        // Load activities
        if (activitiesRes.status === 'fulfilled' && activitiesRes.value.success) {
          setActivities(activitiesRes.value.activities);
        } else {
          setActivities(fallbackActivities);
        }

        // Load gallery
        if (galleryRes.status === 'fulfilled' && galleryRes.value.success) {
          setGallery(galleryRes.value.gallery);
        }

        // Load settings
        let loadedSettings = {};
        if (settingsRes.status === 'fulfilled' && settingsRes.value.success) {
          loadedSettings = settingsRes.value.settings;
        } else {
          loadedSettings = fallbackSettings;
        }

        // Incorporate active resume link in settings if fetched
        if (activeResumeRes.status === 'fulfilled' && activeResumeRes.value.success && activeResumeRes.value.resume) {
          loadedSettings.active_resume_url = activeResumeRes.value.resume.file_path;
        }

        setSettings(loadedSettings);

      } catch (err) {
        console.error('Failed to load portfolio details:', err.message);
        // Fallback triggers
        setProfile(fallbackProfile);
        setSkills(fallbackSkills);
        setProjects(fallbackProjects);
        setCertificates(fallbackCertificates);
        setActivities(fallbackActivities);
        setSettings(fallbackSettings);
        toast.error('Could not sync with the database. Loaded offline portfolio.');
      } finally {
        // Enforce minor delay for transition animation loading WOW effect
        setTimeout(() => {
          setLoading(false);
        }, 800);
      }
    }

    fetchPortfolioData();

    // Scroll to hash on mount if preset
    if (window.location.hash) {
      setTimeout(() => {
        const hashId = window.location.hash.replace('#', '');
        const el = document.getElementById(hashId);
        el?.scrollIntoView({ behavior: 'smooth' });
      }, 950);
    }
  }, []);

  // Section Visibilities Helper checks
  const isVisible = (secName) => {
    if (!settings) return true;
    const key = `section_${secName}_visible`;
    // If not set, default to true, else check string 'true' / Boolean
    return settings[key] === undefined || settings[key] === 'true' || settings[key] === true || settings[key] === 1;
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <AnimatePresence mode="wait">
        {loading ? (
          /* Premium Loading Screen */
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            className="fixed inset-0 z-[9999] bg-zinc-950 flex flex-col items-center justify-center gap-4"
          >
            {/* Spinning Glow Circle */}
            <div className="relative w-16 h-16 flex items-center justify-center">
              <span className="w-12 h-12 rounded-full border-4 border-accent/20 border-t-accent animate-spin" />
              <span className="w-12 h-12 rounded-full border-4 border-accent/10 border-r-accent animate-ping absolute" />
            </div>
            
            <h3 className="text-sm font-bold font-display text-white uppercase tracking-widest mt-2 animate-pulse">
              K.NOILOM
            </h3>
          </motion.div>
        ) : (
          /* Main Portfolio View */
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex-1 flex flex-col"
          >
            <Navbar />
            
            {/* Conditional sections injection */}
            {isVisible('home') && <Hero profile={profile} settings={settings} />}
            {isVisible('about') && <About profile={profile} />}
            {isVisible('skills') && <Skills skills={skills} />}
            {isVisible('projects') && <Projects projects={projects} />}
            {isVisible('certificates') && <Certificates certificates={certificates} />}
            {isVisible('activities') && <Activities activities={activities} />}
            {isVisible('gallery') && <Gallery gallery={gallery} />}
            {isVisible('resume') && (
              <Resume 
                profile={profile} 
                skills={skills} 
                projects={projects}
                activities={activities}
                certificates={certificates}
                settings={settings}
              />
            )}
            {isVisible('contact') && <Contact profile={profile} />}
            
            <Footer profile={profile} />

            {/* Float controllers */}
            <CommandPalette />
            <BackToTop />
          </motion.div>
        )}
      </AnimatePresence>
      <ToastContainer />
    </div>
  );
}
