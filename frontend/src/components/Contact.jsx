import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, Send } from 'lucide-react';
import { Github, Facebook, Instagram } from './BrandIcons';
import { toast } from './Toast';

export default function Contact({ profile }) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [isSending, setIsSending] = useState(false);

  if (!profile) return null;

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Invalid email address';
    }

    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) tempErrors.message = 'Message details are required';

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field error on typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSending(true);

    // Simulate sending message API
    setTimeout(() => {
      setIsSending(false);
      toast.success(t('contactSuccess'));
      setFormData({ name: '', email: '', subject: '', message: '' });
      setErrors({});
    }, 1500);
  };

  const contactCards = [
    { icon: <Mail size={18} className="text-accent" />, title: t('contactEmail'), value: profile.email, href: `mailto:${profile.email}` },
    { icon: <Phone size={18} className="text-accent" />, title: t('contactPhone'), value: profile.phone, href: `tel:${profile.phone}` }
  ];

  return (
    <section id="contact" className="py-24 border-b border-zinc-200/50 dark:border-zinc-800/30">
      <div className="max-w-7xl mx-auto px-6 space-y-16">
        
        {/* Section Header */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gradient">
            {t('contactTitle')}
          </h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans max-w-lg mx-auto">
            {t('contactSubtitle')}
          </p>
          <div className="w-12 h-1 bg-accent mx-auto rounded-full" />
        </div>

        {/* Content Panel Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">
          
          {/* Left Column: Direct Contacts & Socials (cols: 5) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-xl font-bold font-display text-zinc-900 dark:text-white">
              {t('contactTitle')}
            </h3>
            
            {/* Quick Detail Cards */}
            <div className="space-y-4 font-sans text-sm">
              {contactCards.map((card, idx) => (
                <a
                  key={idx}
                  href={card.href}
                  className="flex items-center gap-4 p-4 rounded-2xl glass-panel border border-zinc-200/40 dark:border-zinc-800/40 shadow-sm hover:border-accent/40 dark:hover:border-accent/40 transition-colors cursor-pointer group"
                >
                  <div className="p-3 rounded-xl bg-accent/10 dark:bg-accent/15 group-hover:bg-accent/20 transition-colors">
                    {card.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">
                      {card.title}
                    </span>
                    <span className="font-semibold text-zinc-800 dark:text-zinc-200 block truncate max-w-[250px] sm:max-w-none mt-0.5">
                      {card.value}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex gap-4 items-center pt-4">
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm"
                >
                  <Github size={18} />
                </a>
              )}
              {profile.facebook && (
                <a
                  href={profile.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm"
                >
                  <Facebook size={18} />
                </a>
              )}
              {profile.instagram && (
                <a
                  href={profile.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-full border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent hover:border-accent/20 dark:hover:border-accent/20 transition-all cursor-pointer bg-white dark:bg-zinc-900 shadow-sm"
                >
                  <Instagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Right Column: Contact form box (cols: 7) */}
          <div className="lg:col-span-7">
            <motion.form
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl glass-panel shadow-xl border border-zinc-200/60 dark:border-zinc-800/60 space-y-5 font-sans text-sm"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-zinc-500 font-display block uppercase tracking-wider">
                    {t('contactFormName')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-950/20 border text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors ${
                      errors.name 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-zinc-200/80 dark:border-zinc-800/80 focus:border-accent/40 dark:focus:border-accent/40'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && <span className="text-[10px] text-red-500 block">{errors.name}</span>}
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-zinc-500 font-display block uppercase tracking-wider">
                    {t('contactFormEmail')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-950/20 border text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors ${
                      errors.email 
                        ? 'border-red-500/50 focus:border-red-500' 
                        : 'border-zinc-200/80 dark:border-zinc-800/80 focus:border-accent/40 dark:focus:border-accent/40'
                    }`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <span className="text-[10px] text-red-500 block">{errors.email}</span>}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-1.5">
                <label htmlFor="subject" className="text-xs font-semibold text-zinc-500 font-display block uppercase tracking-wider">
                  {t('contactFormSubject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-950/20 border text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors ${
                    errors.subject 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-zinc-200/80 dark:border-zinc-800/80 focus:border-accent/40 dark:focus:border-accent/40'
                  }`}
                  placeholder="Inquiry about project..."
                />
                {errors.subject && <span className="text-[10px] text-red-500 block">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label htmlFor="message" className="text-xs font-semibold text-zinc-500 font-display block uppercase tracking-wider">
                  {t('contactFormMsg')}
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleInputChange}
                  className={`w-full p-3 rounded-xl bg-zinc-100/50 dark:bg-zinc-950/20 border text-zinc-800 dark:text-zinc-100 placeholder-zinc-400 outline-none transition-colors resize-none ${
                    errors.message 
                      ? 'border-red-500/50 focus:border-red-500' 
                      : 'border-zinc-200/80 dark:border-zinc-800/80 focus:border-accent/40 dark:focus:border-accent/40'
                  }`}
                  placeholder="I would like to speak with you about..."
                />
                {errors.message && <span className="text-[10px] text-red-500 block">{errors.message}</span>}
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={isSending}
                className="w-full py-3 rounded-xl bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-semibold font-display shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-98 disabled:opacity-50 transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={14} className={isSending ? 'animate-bounce' : ''} />
                {isSending ? t('contactFormSending') : t('contactFormSend')}
              </button>

            </motion.form>
          </div>

        </div>

      </div>
    </section>
  );
}
