import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import { toast } from '../components/Toast';
import {
  LayoutDashboard, User, Server, Folder, Award, Calendar, Image as ImageIcon,
  FileText, Settings, LogOut, Search, Plus, Edit, Trash2, Shield,
  Upload, CheckCircle, X, ChevronLeft, ChevronRight, HelpCircle, Eye, Globe
} from 'lucide-react';

export default function AdminPanel() {
  const { user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();
  
  // Dashboard state tabs
  const [activeTab, setActiveTab] = useState('dashboard');
  
  // Core lists
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [activities, setActivities] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [settings, setSettings] = useState({});
  const [logs, setLogs] = useState([]);
  
  // Loading lists
  const [fetching, setFetching] = useState(true);
  
  // Modal configurations
  const [modalState, setModalState] = useState({ isOpen: false, type: '', data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, entity: '', id: null });
  
  // Search state queries
  const [searchQueries, setSearchQueries] = useState({
    skills: '',
    projects: '',
    certificates: '',
    activities: '',
    gallery: '',
    resumes: ''
  });

  // Redirect unauthorized visitors
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load all dashboard records from DB
  const loadAllData = async () => {
    try {
      setFetching(true);
      const [
        pRes, sRes, prRes, cRes, aRes, gRes, rRes, setRes, lRes
      ] = await Promise.allSettled([
        api.get('/api/profile'),
        api.get('/api/skills'),
        api.get('/api/projects'),
        api.get('/api/certificates'),
        api.get('/api/activities'),
        api.get('/api/gallery'),
        api.get('/api/resume/list'),
        api.get('/api/settings'),
        api.get('/api/logs')
      ]);

      if (pRes.status === 'fulfilled' && pRes.value.success) setProfile(pRes.value.profile);
      if (sRes.status === 'fulfilled' && sRes.value.success) setSkills(sRes.value.skills);
      if (prRes.status === 'fulfilled' && prRes.value.success) setProjects(prRes.value.projects);
      if (cRes.status === 'fulfilled' && cRes.value.success) setCertificates(cRes.value.certificates);
      if (aRes.status === 'fulfilled' && aRes.value.success) setActivities(aRes.value.activities);
      if (gRes.status === 'fulfilled' && gRes.value.success) setGallery(gRes.value.gallery);
      if (rRes.status === 'fulfilled' && rRes.value.success) setResumes(rRes.value.resumes);
      if (setRes.status === 'fulfilled' && setRes.value.success) setSettings(setRes.value.settings);
      if (lRes.status === 'fulfilled' && lRes.value.success) setLogs(lRes.value.logs);

    } catch (e) {
      toast.error('Failed to reload database records.');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center font-sans">
        <span className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
      </div>
    );
  }

  // Handle global deletes
  const triggerDelete = (entity, id) => {
    setDeleteConfirm({ isOpen: true, entity, id });
  };

  const executeDelete = async () => {
    const { entity, id } = deleteConfirm;
    setDeleteConfirm({ isOpen: false, entity: '', id: null });
    
    try {
      let res;
      if (entity === 'skill') res = await api.delete(`/api/skills/${id}`);
      if (entity === 'project') res = await api.delete(`/api/projects/${id}`);
      if (entity === 'certificate') res = await api.delete(`/api/certificates/${id}`);
      if (entity === 'activity') res = await api.delete(`/api/activities/${id}`);
      if (entity === 'gallery') res = await api.delete(`/api/gallery/${id}`);
      if (entity === 'resume') res = await api.delete(`/api/resume/${id}`);

      if (res && res.success) {
        toast.success('Record removed successfully.');
        loadAllData();
      } else {
        toast.error('Could not delete selected item.');
      }
    } catch (err) {
      toast.error(err.message || 'Deletion error.');
    }
  };

  const sidebarMenu = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
    { id: 'profile', label: 'Profile', icon: <User size={16} /> },
    { id: 'skills', label: 'Skills', icon: <Server size={16} /> },
    { id: 'projects', label: 'Projects', icon: <Folder size={16} /> },
    { id: 'certificates', label: 'Certificates', icon: <Award size={16} /> },
    { id: 'activities', label: 'Activities', icon: <Calendar size={16} /> },
    { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={16} /> },
    { id: 'resume', label: 'Resume', icon: <FileText size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={16} /> }
  ];

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col md:flex-row font-sans">
      
      {/* 1. Sidebar Panel Layout */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col justify-between shrink-0 p-4 space-y-6">
        <div className="space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-2.5 px-2 py-1">
            <Shield size={20} className="text-accent animate-pulse" />
            <span className="font-display font-bold tracking-wider text-white">ADMIN SUITE</span>
          </div>

          {/* Nav Items */}
          <nav className="flex flex-col gap-1 text-sm">
            {sidebarMenu.map(menu => (
              <button
                key={menu.id}
                onClick={() => setActiveTab(menu.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors font-medium cursor-pointer ${
                  activeTab === menu.id 
                    ? 'bg-accent/15 text-accent border border-accent/20' 
                    : 'text-zinc-400 hover:bg-zinc-850 hover:text-white'
                }`}
              >
                {menu.icon}
                <span>{menu.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Footer Admin profile & Logout */}
        <div className="border-t border-zinc-800 pt-4 flex flex-col gap-3">
          <div className="px-2 flex flex-col text-left">
            <span className="text-xs font-bold text-white truncate">{user.name}</span>
            <span className="text-[10px] text-zinc-500 truncate">{user.email}</span>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors text-sm font-semibold cursor-pointer w-full text-left"
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* 2. Main Dashboard panel scroll space */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6 max-h-screen">
        
        {/* Top Header bar info */}
        <header className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
          <h2 className="text-lg font-bold font-display text-white uppercase tracking-wider">
            {sidebarMenu.find(m => m.id === activeTab)?.label}
          </h2>
          
          <div className="flex gap-2">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-colors"
            >
              View Live Portfolio
            </a>
            <button
              onClick={loadAllData}
              disabled={fetching}
              className="text-xs font-semibold px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 disabled:opacity-50 transition-colors"
            >
              {fetching ? 'Syncing...' : 'Sync Database'}
            </button>
          </div>
        </header>

        {/* 3. Sub-pages contents renderers */}
        <div className="space-y-6">
          {fetching && activeTab !== 'dashboard' ? (
            <div className="py-24 text-center">
              <span className="w-6 h-6 rounded-full border-2 border-accent border-t-transparent animate-spin inline-block align-middle mr-3" />
              <span className="text-zinc-400 text-sm">Syncing records...</span>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && <RenderDashboard stats={{ skills, projects, certificates, activities, gallery }} logs={logs} />}
              {activeTab === 'profile' && <RenderProfile profile={profile} reload={loadAllData} />}
              {activeTab === 'skills' && <RenderSkills skills={skills} query={searchQueries.skills} setQuery={(q) => setSearchQueries(p => ({ ...p, skills: q }))} onAdd={() => setModalState({ isOpen: true, type: 'skill', data: null })} onEdit={(s) => setModalState({ isOpen: true, type: 'skill', data: s })} onDelete={(id) => triggerDelete('skill', id)} />}
              {activeTab === 'projects' && <RenderProjects projects={projects} query={searchQueries.projects} setQuery={(q) => setSearchQueries(p => ({ ...p, projects: q }))} onAdd={() => setModalState({ isOpen: true, type: 'project', data: null })} onEdit={(p) => setModalState({ isOpen: true, type: 'project', data: p })} onDelete={(id) => triggerDelete('project', id)} />}
              {activeTab === 'certificates' && <RenderCertificates certificates={certificates} query={searchQueries.certificates} setQuery={(q) => setSearchQueries(p => ({ ...p, certificates: q }))} onAdd={() => setModalState({ isOpen: true, type: 'certificate', data: null })} onEdit={(c) => setModalState({ isOpen: true, type: 'certificate', data: c })} onDelete={(id) => triggerDelete('certificate', id)} />}
              {activeTab === 'activities' && <RenderActivities activities={activities} query={searchQueries.activities} setQuery={(q) => setSearchQueries(p => ({ ...p, activities: q }))} onAdd={() => setModalState({ isOpen: true, type: 'activity', data: null })} onEdit={(a) => setModalState({ isOpen: true, type: 'activity', data: a })} onDelete={(id) => triggerDelete('activity', id)} />}
              {activeTab === 'gallery' && <RenderGallery gallery={gallery} query={searchQueries.gallery} setQuery={(q) => setSearchQueries(p => ({ ...p, gallery: q }))} onAdd={() => setModalState({ isOpen: true, type: 'gallery', data: null })} onDelete={(id) => triggerDelete('gallery', id)} />}
              {activeTab === 'resume' && <RenderResume resumes={resumes} reload={loadAllData} onDelete={(id) => triggerDelete('resume', id)} />}
              {activeTab === 'settings' && <RenderSettings settings={settings} reload={loadAllData} />}
            </>
          )}
        </div>
      </main>

      {/* 4. CRUD Modals Overlays */}
      {modalState.isOpen && (
        <AdminFormModal
          type={modalState.type}
          data={modalState.data}
          onClose={() => setModalState({ isOpen: false, type: '', data: null })}
          reload={loadAllData}
        />
      )}

      {/* 5. Delete Confirmation Modal Overlay */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setDeleteConfirm({ isOpen: false, entity: '', id: null })} />
          <div className="relative w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl p-6 space-y-5 text-left z-10">
            <h3 className="text-base font-bold font-display text-white">
              Confirm Delete Record
            </h3>
            <p className="text-xs text-zinc-400 font-sans leading-relaxed">
              Are you sure you want to delete this {deleteConfirm.entity} item? This action is permanent and cannot be undone.
            </p>
            <div className="flex justify-end gap-3 text-xs">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, entity: '', id: null })}
                className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-medium shadow-md shadow-red-600/10"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/* =========================================================================
   SUB-RENDERERS MODULES
   ========================================================================= */

// TABS 1: Dashboard
function RenderDashboard({ stats, logs }) {
  const counts = [
    { label: 'Skills Added', count: stats.skills.length, icon: <Server size={18} /> },
    { label: 'Total Projects', count: stats.projects.length, icon: <Folder size={18} /> },
    { label: 'Certificates Listed', count: stats.certificates.length, icon: <Award size={18} /> },
    { label: 'Registered Activities', count: stats.activities.length, icon: <Calendar size={18} /> },
    { label: 'Gallery Images', count: stats.gallery.length, icon: <ImageIcon size={18} /> }
  ];

  return (
    <div className="space-y-6">
      {/* Counters grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-5">
        {counts.map((card, idx) => (
          <div key={idx} className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-between shadow-sm">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-zinc-500 font-display block uppercase tracking-wider">{card.label}</span>
              <span className="text-xl font-bold font-display text-white">{card.count}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-zinc-950 border border-zinc-850 text-accent">
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* History Log Stream & Activity lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Activity Logs (cols: 8) */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            Recent Admin Action Logs
          </h3>
          
          <div className="overflow-x-auto w-full">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-widest font-display text-[10px] pb-2">
                  <th className="py-2.5">Action Executed</th>
                  <th className="py-2.5">Triggered By</th>
                  <th className="py-2.5 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300 font-sans">
                {logs.length > 0 ? (
                  logs.slice(0, 10).map((log) => (
                    <tr key={log.id} className="hover:bg-zinc-850/40">
                      <td className="py-3 font-medium text-white">{log.action}</td>
                      <td className="py-3 text-zinc-400">{log.user_email}</td>
                      <td className="py-3 text-right text-zinc-500 font-mono text-[10px]">
                        {new Date(log.date_time).toLocaleString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-zinc-500">No action logs found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links / Status (cols: 4) */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-xs font-sans">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            System Environment Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Database Driver</span>
              <span className="font-semibold text-white uppercase font-mono">{api.baseUrl.includes('localhost') ? 'SQLite / Dev' : 'Production'}</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">API Port Host</span>
              <span className="font-semibold text-white font-mono">5000</span>
            </div>
            <div className="flex justify-between border-b border-zinc-800 pb-2">
              <span className="text-zinc-500">Language Modes</span>
              <span className="font-semibold text-white">Thai & English (Dual)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Asset Storage</span>
              <span className="font-semibold text-white">Local Upload Folder</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// TABS 2: Profile
function RenderProfile({ profile, reload }) {
  const [formData, setFormData] = useState({ ...profile });
  const [file, setFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({ ...profile });
      setPreview(profile.profile_image ? `${api.baseUrl}${profile.profile_image}` : '');
    }
  }, [profile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const uploaded = e.target.files[0];
    if (uploaded) {
      setFile(uploaded);
      setPreview(URL.createObjectURL(uploaded));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, val]) => {
        // Skip null values or IDs
        if (val !== null && key !== 'id') {
          data.append(key, val);
        }
      });
      if (file) {
        data.append('profileImage', file);
      }

      const res = await api.put('/api/profile', data);
      if (res.success) {
        toast.success('System profile updated successfully.');
        reload();
      } else {
        toast.error(res.message || 'Failed to update profile.');
      }
    } catch (err) {
      toast.error('Failed to submit form details.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-6 text-left text-sm font-sans">
      <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider mb-2">
        Portfolio Owner Credentials
      </h3>

      {/* Picture upload row */}
      <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-zinc-800">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-800 flex items-center justify-center shrink-0">
          {preview ? (
            <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon size={24} className="text-zinc-600" />
          )}
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <label className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-2 w-fit mx-auto sm:ml-0 transition-colors">
            <Upload size={14} />
            Upload Profile Picture
            <input type="file" onChange={handleFileChange} className="hidden" accept="image/*" />
          </label>
          <span className="text-[10px] text-zinc-500 block">Requires JPG, PNG or WEBP formats. Size limit 2MB.</span>
        </div>
      </div>

      {/* Form sections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Fullname TH */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Full Name (TH)</label>
          <input type="text" name="full_name_th" value={formData.full_name_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Fullname EN */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Full Name (EN)</label>
          <input type="text" name="full_name_en" value={formData.full_name_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Nickname TH */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Nickname (TH)</label>
          <input type="text" name="nickname_th" value={formData.nickname_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Nickname EN */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Nickname (EN)</label>
          <input type="text" name="nickname_en" value={formData.nickname_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Age */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Age</label>
          <input type="number" name="age" value={formData.age || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* School TH */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">School (TH)</label>
          <input type="text" name="school_th" value={formData.school_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* School EN */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">School (EN)</label>
          <input type="text" name="school_en" value={formData.school_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Edu TH */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Education Plan (TH)</label>
          <input type="text" name="education_th" value={formData.education_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Edu EN */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Education Plan (EN)</label>
          <input type="text" name="education_en" value={formData.education_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Contact Email</label>
          <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Phone */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Contact Phone</label>
          <input type="text" name="phone" value={formData.phone || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Location TH */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Location (TH)</label>
          <input type="text" name="location_th" value={formData.location_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Location EN */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Location (EN)</label>
          <input type="text" name="location_en" value={formData.location_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Short description TH */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Hero Description (TH)</label>
          <input type="text" name="description_th" value={formData.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Short description EN */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Hero Description (EN)</label>
          <input type="text" name="description_en" value={formData.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* About details TH */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Detailed About Me (TH)</label>
          <textarea name="about_me_th" rows={3} value={formData.about_me_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none resize-none" />
        </div>
        {/* About details EN */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Detailed About Me (EN)</label>
          <textarea name="about_me_en" rows={3} value={formData.about_me_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none resize-none" />
        </div>

        {/* Goal TH */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Career Goal (TH)</label>
          <input type="text" name="career_goal_th" value={formData.career_goal_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        {/* Goal EN */}
        <div className="sm:col-span-2 space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Career Goal (EN)</label>
          <input type="text" name="career_goal_en" value={formData.career_goal_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>

        {/* Social URL columns */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">GitHub URL</label>
          <input type="text" name="github" value={formData.github || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Facebook URL</label>
          <input type="text" name="facebook" value={formData.facebook || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Instagram URL</label>
          <input type="text" name="instagram" value={formData.instagram || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Discord Handle</label>
          <input type="text" name="discord" value={formData.discord || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
        </div>
      </div>

      <div className="flex justify-end gap-3 text-xs pt-4 border-t border-zinc-800">
        <button type="button" onClick={() => setFormData({ ...profile })} className="px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
          Reset Changes
        </button>
        <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer disabled:opacity-50">
          {saving ? 'Saving...' : 'Save Profile Changes'}
        </button>
      </div>
    </form>
  );
}

// TABS 3: Skills
function RenderSkills({ skills, query, setQuery, onAdd, onEdit, onDelete }) {
  const filtered = skills.filter(s => s.name.toLowerCase().includes(query.toLowerCase()) || s.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-sm font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search skills..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        {/* Add */}
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Add Skill
        </button>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-display text-[10px] pb-2">
              <th className="py-2.5">Skill Name</th>
              <th className="py-2.5">Category</th>
              <th className="py-2.5">Icon ID</th>
              <th className="py-2.5">Proficiency</th>
              <th className="py-2.5">Display Order</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtered.length > 0 ? (
              filtered.map((skill) => (
                <tr key={skill.id} className="hover:bg-zinc-850/30">
                  <td className="py-3 font-bold text-white">{skill.name}</td>
                  <td className="py-3 text-zinc-400">{skill.category}</td>
                  <td className="py-3 font-mono text-zinc-500">{skill.icon || 'Cpu'}</td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-zinc-850 rounded-full overflow-hidden">
                        <div className="h-full bg-accent" style={{ width: `${skill.level}%` }} />
                      </div>
                      <span>{skill.level}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-zinc-500 font-mono">{skill.display_order}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${skill.enabled ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {skill.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button onClick={() => onEdit(skill)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer" title="Edit"><Edit size={12} /></button>
                    <button onClick={() => onDelete(skill.id)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-zinc-500">No matching skills found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TABS 4: Projects
function RenderProjects({ projects, query, setQuery, onAdd, onEdit, onDelete }) {
  const filtered = projects.filter(p => p.name_en.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()) || p.technologies.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-sm font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search projects..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        {/* Add */}
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Add Project
        </button>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-display text-[10px] pb-2">
              <th className="py-2.5">Cover</th>
              <th className="py-2.5">Project Name (EN)</th>
              <th className="py-2.5">Category</th>
              <th className="py-2.5">Technologies</th>
              <th className="py-2.5">Status</th>
              <th className="py-2.5">Featured</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtered.length > 0 ? (
              filtered.map((proj) => (
                <tr key={proj.id} className="hover:bg-zinc-850/30">
                  <td className="py-3 pr-2">
                    <div className="w-12 h-8 rounded bg-zinc-950 border border-zinc-850 overflow-hidden shrink-0">
                      {proj.cover_image && <img src={`${api.baseUrl}${proj.cover_image}`} alt="cover" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-3 font-bold text-white">{proj.name_en}</td>
                  <td className="py-3 text-zinc-400">{proj.category}</td>
                  <td className="py-3 text-zinc-500 font-mono text-[10px] max-w-[150px] truncate" title={proj.technologies}>{proj.technologies}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${proj.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      {proj.status}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${proj.featured ? 'bg-accent/10 text-accent' : 'bg-zinc-800 text-zinc-500'}`}>
                      {proj.featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button onClick={() => onEdit(proj)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer" title="Edit"><Edit size={12} /></button>
                    <button onClick={() => onDelete(proj.id)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-zinc-500">No matching projects found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TABS 5: Certificates
function RenderCertificates({ certificates, query, setQuery, onAdd, onEdit, onDelete }) {
  const filtered = certificates.filter(c => c.name_en.toLowerCase().includes(query.toLowerCase()) || c.organization_en.toLowerCase().includes(query.toLowerCase()) || c.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-sm font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search certificates..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        {/* Add */}
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Add Certificate
        </button>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-display text-[10px] pb-2">
              <th className="py-2.5">Image</th>
              <th className="py-2.5">Certificate Name (EN)</th>
              <th className="py-2.5">Issuer Organization</th>
              <th className="py-2.5">Credential ID</th>
              <th className="py-2.5">Issue Date</th>
              <th className="py-2.5">Category</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtered.length > 0 ? (
              filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-zinc-850/30">
                  <td className="py-3 pr-2">
                    <div className="w-12 h-8 rounded bg-zinc-950 border border-zinc-850 overflow-hidden shrink-0">
                      {cert.certificate_image && <img src={`${api.baseUrl}${cert.certificate_image}`} alt="cert" className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-3 font-bold text-white">{cert.name_en}</td>
                  <td className="py-3 text-zinc-400">{cert.organization_en}</td>
                  <td className="py-3 text-zinc-500 font-mono text-[10px]">{cert.certificate_id || 'N/A'}</td>
                  <td className="py-3 text-zinc-450">{cert.issue_date}</td>
                  <td className="py-3"><span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-400 uppercase font-display">{cert.category}</span></td>
                  <td className="py-3 text-right space-x-2">
                    <button onClick={() => onEdit(cert)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer" title="Edit"><Edit size={12} /></button>
                    <button onClick={() => onDelete(cert.id)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-zinc-500">No matching certificates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TABS 6: Activities
function RenderActivities({ activities, query, setQuery, onAdd, onEdit, onDelete }) {
  const filtered = activities.filter(a => a.name_en.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-sm font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search activities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        {/* Add */}
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={14} />
          Add Activity
        </button>
      </div>

      {/* Table list */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-display text-[10px] pb-2">
              <th className="py-2.5">Activity Name (EN)</th>
              <th className="py-2.5">Date</th>
              <th className="py-2.5">Location</th>
              <th className="py-2.5">Category</th>
              <th className="py-2.5">Photos Count</th>
              <th className="py-2.5">Achievement</th>
              <th className="py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {filtered.length > 0 ? (
              filtered.map((act) => (
                <tr key={act.id} className="hover:bg-zinc-850/30">
                  <td className="py-3 font-bold text-white">{act.name_en}</td>
                  <td className="py-3 text-zinc-400 font-mono text-[10px]">{act.date}</td>
                  <td className="py-3 text-zinc-500">{act.location_en}</td>
                  <td className="py-3 font-display uppercase text-[10px] text-zinc-400">{act.category}</td>
                  <td className="py-3 font-mono text-zinc-400">{act.images ? act.images.length : 0} photos</td>
                  <td className="py-3">
                    {act.achievement_en ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-500 font-medium">
                        {act.achievement_en}
                      </span>
                    ) : (
                      <span className="text-zinc-600">-</span>
                    )}
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button onClick={() => onEdit(act)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-white cursor-pointer" title="Edit"><Edit size={12} /></button>
                    <button onClick={() => onDelete(act.id)} className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer" title="Delete"><Trash2 size={12} /></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-6 text-center text-zinc-500">No matching activities found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// TABS 7: Gallery
function RenderGallery({ gallery, query, setQuery, onAdd, onDelete }) {
  const filtered = gallery.filter(g => (g.title_en || '').toLowerCase().includes(query.toLowerCase()) || g.category.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4 text-left text-sm font-sans">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            placeholder="Search media..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-white placeholder-zinc-500 outline-none"
          />
        </div>
        {/* Upload box */}
        <button
          onClick={onAdd}
          className="px-4 py-2 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer w-full sm:w-auto justify-center"
        >
          <Upload size={14} />
          Upload Image
        </button>
      </div>

      {/* Grid of gallery assets */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm flex flex-col justify-end">
              <img src={`${api.baseUrl}${item.image_url}`} alt="Gallery asset" className="absolute inset-0 w-full h-full object-cover" />
              
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => onDelete(item.id)}
                  className="p-2 rounded bg-red-600/90 text-white hover:bg-red-500 transition-colors cursor-pointer"
                  title="Delete image"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              <div className="p-2 bg-gradient-to-t from-black/90 to-black/20 z-10 text-[9px] text-zinc-400 font-sans truncate">
                <span className="text-accent font-semibold block">{item.category}</span>
                <span className="text-white truncate block">{item.title_en || 'Untitled'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-zinc-500">
          No matching images found
        </div>
      )}
    </div>
  );
}

// TABS 8: Resume PDF Management
function RenderResume({ resumes, reload, onDelete }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    try {
      const data = new FormData();
      data.append('resumeFile', file);
      
      const res = await api.post('/api/resume/upload', data);
      if (res.success) {
        toast.success('Resume PDF uploaded successfully.');
        setFile(null);
        reload();
      } else {
        toast.error(res.message || 'Failed to upload PDF.');
      }
    } catch (e) {
      toast.error('Connection error.');
    } finally {
      setUploading(false);
    }
  };

  const handleSetActive = async (id) => {
    try {
      const res = await api.put(`/api/resume/${id}/active`);
      if (res.success) {
        toast.success('Selected resume marked as active.');
        reload();
      } else {
        toast.error('Could not activate resume.');
      }
    } catch (e) {
      toast.error('Network failure.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left text-sm font-sans">
      {/* Upload Panel (cols: 4) */}
      <form onSubmit={handleUpload} className="lg:col-span-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Upload Resume PDF
        </h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          Upload a new curriculum vitae PDF file. Max size 5MB.
        </p>

        <div className="border border-dashed border-zinc-800 rounded-xl p-6 bg-zinc-950 flex flex-col items-center gap-3 text-center">
          <FileText size={28} className="text-zinc-600" />
          {file ? (
            <div className="space-y-1">
              <span className="text-xs font-semibold text-white block truncate max-w-[180px]">{file.name}</span>
              <span className="text-[10px] text-zinc-500 block">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
            </div>
          ) : (
            <span className="text-xs text-zinc-500 block">Drag & drop or browse resume file</span>
          )}
          
          <label className="px-3.5 py-1.5 rounded-lg bg-zinc-850 hover:bg-zinc-800 text-white font-semibold text-xs cursor-pointer transition-colors block">
            Select PDF File
            <input type="file" onChange={(e) => setFile(e.target.files[0])} accept="application/pdf" className="hidden" />
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || uploading}
          className="w-full py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold text-xs disabled:opacity-50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
        >
          <Upload size={14} />
          {uploading ? 'Uploading...' : 'Upload PDF'}
        </button>
      </form>

      {/* Resumes Records List (cols: 8) */}
      <div className="lg:col-span-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Resume Version History
        </h3>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider font-display text-[10px] pb-2">
                <th className="py-2.5">File Name</th>
                <th className="py-2.5">Uploaded Date</th>
                <th className="py-2.5">File Size</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {resumes.length > 0 ? (
                resumes.map((res) => (
                  <tr key={res.id} className="hover:bg-zinc-850/30">
                    <td className="py-3 font-bold text-white truncate max-w-[200px]">{res.file_name}</td>
                    <td className="py-3 text-zinc-500 font-mono text-[10px]">
                      {new Date(res.upload_date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-mono text-zinc-400">
                      {(res.file_size / 1024 / 1024).toFixed(2)} MB
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${res.is_current ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                        {res.is_current ? 'Active Download' : 'Backup Version'}
                      </span>
                    </td>
                    <td className="py-3 text-right space-x-2 shrink-0">
                      {!res.is_current && (
                        <button
                          onClick={() => handleSetActive(res.id)}
                          className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-accent hover:text-white text-zinc-400 text-[10px] font-semibold cursor-pointer"
                        >
                          Activate
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(res.id)}
                        className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-zinc-500">No resumes uploaded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// TABS 9: Settings
function RenderSettings({ settings, reload }) {
  const [formData, setFormData] = useState({ ...settings });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleToggle = (key) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key] === 'true' || prev[key] === true ? 'false' : 'true'
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await api.put('/api/settings', formData);
      if (res.success) {
        toast.success('System settings saved successfully.');
        reload();
      } else {
        toast.error('Failed to save settings.');
      }
    } catch (e) {
      toast.error('Connection failed.');
    } finally {
      setSaving(false);
    }
  };

  const activeSectionsList = [
    { key: 'section_home_visible', label: 'Home / Hero Banner' },
    { key: 'section_about_visible', label: 'About Me Details' },
    { key: 'section_skills_visible', label: 'Skills & Proficiencies' },
    { key: 'section_projects_visible', label: 'Projects Grid Showcase' },
    { key: 'section_certificates_visible', label: 'Certificates List & Lightbox' },
    { key: 'section_activities_visible', label: 'Activities Timelines' },
    { key: 'section_gallery_visible', label: 'Photo Gallery Layout' },
    { key: 'section_resume_visible', label: 'Resume mockup summary' },
    { key: 'section_contact_visible', label: 'Contact Information Form' }
  ];

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left text-sm font-sans">
      
      {/* Settings inputs (cols: 8) */}
      <div className="lg:col-span-8 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-5">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Website Settings Configurations
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Website Header Name</label>
            <input type="text" name="website_name" value={formData.website_name || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">SEO Description Meta</label>
            <input type="text" name="website_description" value={formData.website_description || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Primary Theme Color</label>
            <input type="text" name="primary_color" value={formData.primary_color || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none font-mono" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">Accent Pink Color</label>
            <input type="text" name="accent_color" value={formData.accent_color || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white rounded-lg outline-none font-mono" />
          </div>
        </div>

        <div className="flex justify-end gap-3 text-xs pt-4 border-t border-zinc-800">
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>

      {/* Visibility toggles (cols: 4) */}
      <div className="lg:col-span-4 p-5 rounded-xl bg-zinc-900 border border-zinc-800 space-y-4">
        <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
          Section visibilities
        </h3>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          Enable or disable sections on the public homepage.
        </p>

        <div className="space-y-3 font-sans text-xs">
          {activeSectionsList.map((item) => {
            const isValTrue = formData[item.key] === 'true' || formData[item.key] === true || formData[item.key] === 1;
            return (
              <div key={item.key} className="flex justify-between items-center py-2 border-b border-zinc-850">
                <span className="text-zinc-300 font-medium">{item.label}</span>
                <button
                  type="button"
                  onClick={() => handleToggle(item.key)}
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer relative shrink-0 ${isValTrue ? 'bg-accent' : 'bg-zinc-800'}`}
                >
                  <span className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${isValTrue ? 'translate-x-5.5' : 'translate-x-1'}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </form>
  );
}

/* =========================================================================
   Unified Admin Modal Forms Handler (CRUD Add / Edit Inputs)
   ========================================================================= */

function AdminFormModal({ type, data, onClose, reload }) {
  const [submitting, setSubmitting] = useState(false);
  const [formFields, setFormFields] = useState({});
  const [files, setFiles] = useState({});
  const [previews, setPreviews] = useState({});

  useEffect(() => {
    // Populate form data based on creation or modification mode
    if (data) {
      setFormFields({ ...data });
      if (type === 'project' && data.cover_image) {
        setPreviews({ coverImage: `${api.baseUrl}${data.cover_image}` });
      }
      if (type === 'certificate' && data.certificate_image) {
        setPreviews({ certificateImage: `${api.baseUrl}${data.certificate_image}` });
      }
    } else {
      // Default creation fields
      if (type === 'skill') {
        setFormFields({ name: '', category: 'Programming', icon: 'Cpu', level: 80, display_order: 0, enabled: 1, description_th: '', description_en: '' });
      } else if (type === 'project') {
        setFormFields({ name_th: '', name_en: '', slug: '', category: 'Web', technologies: '', description_th: '', description_en: '', full_description_th: '', full_description_en: '', github_url: '', live_demo_url: '', start_date: '', end_date: '', featured: 0, status: 'Completed' });
      } else if (type === 'certificate') {
        setFormFields({ name_th: '', name_en: '', organization_th: '', organization_en: '', certificate_id: '', issue_date: '', category: 'Programming', verification_url: '', description_th: '', description_en: '' });
      } else if (type === 'activity') {
        setFormFields({ name_th: '', name_en: '', date: '', location_th: '', location_en: '', description_th: '', description_en: '', category: 'Activities', achievement_th: '', achievement_en: '', organization_th: '', organization_en: '' });
      } else if (type === 'gallery') {
        setFormFields({ category: 'Activities', title_th: '', title_en: '', description_th: '', description_en: '' });
      }
    }
  }, [type, data]);

  const handleInputChange = (e) => {
    const { name, value, type: inputType, checked } = e.target;
    const finalVal = inputType === 'checkbox' ? (checked ? 1 : 0) : value;
    setFormFields(prev => ({ ...prev, [name]: finalVal }));
  };

  const handleFileChange = (e, fieldKey) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFiles(prev => ({ ...prev, [fieldKey]: uploadedFile }));
      setPreviews(prev => ({ ...prev, [fieldKey]: URL.createObjectURL(uploadedFile) }));
    }
  };

  // Activity multiple images handler
  const handleMultipleFilesChange = (e) => {
    const uploadedList = Array.from(e.target.files);
    setFiles(prev => ({ ...prev, activityFiles: uploadedList }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const isEdit = !!data;
      let res;

      // Handle simple JSON vs FormData uploads
      const hasFiles = Object.keys(files).length > 0;
      let bodyData;

      if (hasFiles || type === 'project' || type === 'certificate' || type === 'activity' || type === 'gallery') {
        bodyData = new FormData();
        Object.entries(formFields).forEach(([k, v]) => {
          if (v !== null && k !== 'screenshots' && k !== 'images') {
            bodyData.append(k, typeof v === 'object' ? JSON.stringify(v) : String(v));
          }
        });

        // Append files
        if (files.coverImage) bodyData.append('coverImage', files.coverImage);
        if (files.certificateImage) bodyData.append('certificateImage', files.certificateImage);
        if (files.galleryImage) bodyData.append('galleryImage', files.galleryImage);
        
        // Append project screenshots multiple files
        if (files.projectScreenshots) {
          Array.from(files.projectScreenshots).forEach(f => {
            bodyData.append('screenshots', f);
          });
        }
        // Append activity multiple files
        if (files.activityFiles) {
          files.activityFiles.forEach(f => {
            bodyData.append('images', f);
          });
        }
      } else {
        bodyData = { ...formFields };
      }

      // 1. Skill submission
      if (type === 'skill') {
        res = isEdit 
          ? await api.put(`/api/skills/${data.id}`, bodyData)
          : await api.post('/api/skills', bodyData);
      }
      // 2. Project submission
      else if (type === 'project') {
        res = isEdit
          ? await api.put(`/api/projects/${data.id}`, bodyData)
          : await api.post('/api/projects', bodyData);
      }
      // 3. Certificate submission
      else if (type === 'certificate') {
        res = isEdit
          ? await api.put(`/api/certificates/${data.id}`, bodyData)
          : await api.post('/api/certificates', bodyData);
      }
      // 4. Activity submission
      else if (type === 'activity') {
        res = isEdit
          ? await api.put(`/api/activities/${data.id}`, bodyData)
          : await api.post('/api/activities', bodyData);
      }
      // 5. Gallery upload
      else if (type === 'gallery') {
        res = await api.post('/api/gallery', bodyData);
      }

      if (res && res.success) {
        toast.success('Database record saved.');
        onClose();
        reload();
      } else {
        toast.error(res?.message || 'Error occurred.');
      }
    } catch (err) {
      toast.error('Failed to submit form data.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto pointer-events-auto">
      <div className="fixed inset-0 bg-black/75 backdrop-blur-xs" onClick={onClose} />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 15 }}
        className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10 text-left text-sm"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-zinc-800 sticky top-0 bg-zinc-900 z-10">
          <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
            {data ? 'Modify' : 'Create New'} {type}
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white cursor-pointer"><X size={18} /></button>
        </div>

        {/* Form scroll inputs */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4 text-zinc-300">
          
          {/* A. SKILL FORMS */}
          {type === 'skill' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Skill Name</label>
                <input type="text" name="name" required value={formFields.name || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white focus:border-accent/40" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Category</label>
                <select name="category" value={formFields.category || 'Programming'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="Programming">Programming</option>
                  <option value="Framework">Framework</option>
                  <option value="Tools">Tools</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Lucide Icon Name</label>
                <input type="text" name="icon" value={formFields.icon || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white focus:border-accent/40 font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Proficiency Level (1-100)</label>
                <input type="number" name="level" min="1" max="100" value={formFields.level || 80} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Display Order (Display weight)</label>
                <input type="number" name="display_order" value={formFields.display_order || 0} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="skill-enabled" name="enabled" checked={formFields.enabled === 1 || formFields.enabled === true} onChange={(e) => setFormFields(prev => ({ ...prev, enabled: e.target.checked ? 1 : 0 }))} className="rounded border-zinc-850 bg-zinc-950 accent-accent" />
                <label htmlFor="skill-enabled" className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Enable Skill</label>
              </div>
              
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Short Description (TH)</label>
                <input type="text" name="description_th" value={formFields.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white focus:border-accent/40" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Short Description (EN)</label>
                <input type="text" name="description_en" value={formFields.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white focus:border-accent/40" />
              </div>
            </div>
          )}

          {/* B. PROJECT FORMS */}
          {type === 'project' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Project Name (TH)</label>
                <input type="text" name="name_th" required value={formFields.name_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Project Name (EN)</label>
                <input type="text" name="name_en" required value={formFields.name_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Slug (Auto-generated if empty)</label>
                <input type="text" name="slug" value={formFields.slug || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Category</label>
                <select name="category" value={formFields.category || 'Web'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="Web">Web</option>
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="System">System</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Technologies Pills (Comma separated)</label>
                <input type="text" name="technologies" placeholder="React, Node.js, SQLite" value={formFields.technologies || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white font-mono" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">GitHub Repo URL</label>
                <input type="text" name="github_url" value={formFields.github_url || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Live Demo URL</label>
                <input type="text" name="live_demo_url" value={formFields.live_demo_url || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Start Date</label>
                <input type="text" name="start_date" placeholder="YYYY-MM" value={formFields.start_date || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">End Date</label>
                <input type="text" name="end_date" placeholder="YYYY-MM or Present" value={formFields.end_date || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Status</label>
                <select name="status" value={formFields.status || 'Completed'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="Completed">Completed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input type="checkbox" id="proj-feat" name="featured" checked={formFields.featured === 1 || formFields.featured === true} onChange={(e) => setFormFields(prev => ({ ...prev, featured: e.target.checked ? 1 : 0 }))} className="rounded border-zinc-850 bg-zinc-950" />
                <label htmlFor="proj-feat" className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Mark Featured project</label>
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Short description (TH)</label>
                <input type="text" name="description_th" value={formFields.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Short description (EN)</label>
                <input type="text" name="description_en" value={formFields.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Full description / Details (TH)</label>
                <textarea name="full_description_th" rows={3} value={formFields.full_description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white resize-none" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Full description / Details (EN)</label>
                <textarea name="full_description_en" rows={3} value={formFields.full_description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white resize-none" />
              </div>

              {/* Upload cover image */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Cover Image</span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-12 bg-zinc-950 border border-zinc-800 overflow-hidden rounded shrink-0 flex items-center justify-center">
                    {previews.coverImage ? <img src={previews.coverImage} alt="Cover preview" className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-zinc-650" />}
                  </div>
                  <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    Choose Cover
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'coverImage')} accept="image/*" />
                  </label>
                </div>
              </div>

              {/* Upload multiple screenshots */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Upload Multiple Screenshots</span>
                <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors w-fit">
                  <Upload size={13} />
                  Choose Files
                  <input type="file" multiple className="hidden" onChange={(e) => setFiles(p => ({ ...p, projectScreenshots: e.target.files }))} accept="image/*" />
                </label>
                {files.projectScreenshots && (
                  <span className="text-xs text-zinc-400 block font-mono">{files.projectScreenshots.length} new screenshots selected</span>
                )}
              </div>
            </div>
          )}

          {/* C. CERTIFICATE FORMS */}
          {type === 'certificate' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Certificate Name (TH)</label>
                <input type="text" name="name_th" required value={formFields.name_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Certificate Name (EN)</label>
                <input type="text" name="name_en" required value={formFields.name_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Issuer Organization (TH)</label>
                <input type="text" name="organization_th" value={formFields.organization_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Issuer Organization (EN)</label>
                <input type="text" name="organization_en" value={formFields.organization_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Credential ID</label>
                <input type="text" name="certificate_id" value={formFields.certificate_id || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white font-mono" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Issue Date</label>
                <input type="text" name="issue_date" placeholder="YYYY-MM-DD" value={formFields.issue_date || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Category</label>
                <select name="category" value={formFields.category || 'Programming'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="Programming">Programming</option>
                  <option value="Design">Design</option>
                  <option value="English">English</option>
                  <option value="Competition">Competition</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Verification URL</label>
                <input type="text" name="verification_url" value={formFields.verification_url || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Description (TH)</label>
                <input type="text" name="description_th" value={formFields.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Description (EN)</label>
                <input type="text" name="description_en" value={formFields.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              {/* Image upload */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Certificate Image</span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-12 bg-zinc-950 border border-zinc-800 overflow-hidden rounded shrink-0 flex items-center justify-center">
                    {previews.certificateImage ? <img src={previews.certificateImage} alt="Cert preview" className="w-full h-full object-cover" /> : <Award size={18} className="text-zinc-650" />}
                  </div>
                  <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    Choose Image
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'certificateImage')} accept="image/*" />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* D. ACTIVITY FORMS */}
          {type === 'activity' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Activity Name (TH)</label>
                <input type="text" name="name_th" required value={formFields.name_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Activity Name (EN)</label>
                <input type="text" name="name_en" required value={formFields.name_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Date</label>
                <input type="text" name="date" placeholder="YYYY-MM-DD" value={formFields.date || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Category</label>
                <select name="category" value={formFields.category || 'Activities'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="School">School</option>
                  <option value="Activities">Activities</option>
                  <option value="Competition">Competition</option>
                  <option value="Projects">Projects</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Location (TH)</label>
                <input type="text" name="location_th" value={formFields.location_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Location (EN)</label>
                <input type="text" name="location_en" value={formFields.location_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Organizer Organization (TH)</label>
                <input type="text" name="organization_th" value={formFields.organization_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Organizer Organization (EN)</label>
                <input type="text" name="organization_en" value={formFields.organization_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Award / Achievement (TH)</label>
                <input type="text" name="achievement_th" placeholder="เช่น เกียรติบัตรเข้าร่วม" value={formFields.achievement_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Award / Achievement (EN)</label>
                <input type="text" name="achievement_en" placeholder="e.g. Silver Medal" value={formFields.achievement_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Detailed Description (TH)</label>
                <textarea name="description_th" rows={3} value={formFields.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white resize-none" />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Detailed Description (EN)</label>
                <textarea name="description_en" rows={3} value={formFields.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white resize-none" />
              </div>

              {/* Multiple Upload */}
              <div className="sm:col-span-2 space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Upload Activity Photos</span>
                <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors w-fit">
                  <Upload size={13} />
                  Choose Images
                  <input type="file" multiple className="hidden" onChange={handleMultipleFilesChange} accept="image/*" />
                </label>
                {files.activityFiles && (
                  <span className="text-xs text-zinc-400 block font-mono">{files.activityFiles.length} photos selected</span>
                )}
              </div>
            </div>
          )}

          {/* E. GALLERY UPLOAD FORM */}
          {type === 'gallery' && (
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Category</label>
                <select name="category" value={formFields.category || 'Activities'} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white">
                  <option value="School">School</option>
                  <option value="Activities">Activities</option>
                  <option value="Competition">Competition</option>
                  <option value="Projects">Projects</option>
                  <option value="Events">Events</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Title (TH)</label>
                  <input type="text" name="title_th" value={formFields.title_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Title (EN)</label>
                  <input type="text" name="title_en" value={formFields.title_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Description (TH)</label>
                  <input type="text" name="description_th" value={formFields.description_th || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Description (EN)</label>
                  <input type="text" name="description_en" value={formFields.description_en || ''} onChange={handleInputChange} className="w-full p-2.5 bg-zinc-950 border border-zinc-850 rounded-lg outline-none text-white" />
                </div>
              </div>

              {/* Upload image */}
              <div className="space-y-2 pt-2 border-t border-zinc-800">
                <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Image File</span>
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 overflow-hidden rounded shrink-0 flex items-center justify-center">
                    {previews.galleryImage ? <img src={previews.galleryImage} alt="Gallery preview" className="w-full h-full object-cover" /> : <ImageIcon size={22} className="text-zinc-650" />}
                  </div>
                  <label className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5 transition-colors">
                    <Upload size={13} />
                    Choose File
                    <input type="file" className="hidden" onChange={(e) => handleFileChange(e, 'galleryImage')} accept="image/*" required={!data} />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-3 text-xs pt-4 border-t border-zinc-800 sticky bottom-0 bg-zinc-900 z-10">
            <button type="button" onClick={onClose} className="px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors cursor-pointer">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-dark text-white font-semibold transition-colors cursor-pointer disabled:opacity-50">
              {submitting ? 'Saving...' : 'Save Record'}
            </button>
          </div>

        </form>
      </motion.div>
    </div>
  );
}
