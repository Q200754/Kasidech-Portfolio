import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from '../components/Toast';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Redirect if session is already active
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success('Access granted. Welcome back, Admin!');
        navigate('/admin');
      } else {
        setErrorMsg(res.message || 'Invalid administrative credentials.');
        toast.error('Authentication failed.');
      }
    } catch (err) {
      setErrorMsg('An error occurred. Check your server connection.');
      toast.error('Server offline.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background glow graphics */}
      <div className="absolute top-[20%] left-[30%] w-[40vw] h-[40vw] rounded-full bg-accent/5 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 text-left">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-accent/10 rounded-full w-fit mx-auto border border-accent/20">
            <Lock className="text-accent" size={24} />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white font-display">
            ADMIN ACCESS CONTROL
          </h2>
          <p className="text-xs text-zinc-500">
            Secure sign in to modify portfolio content in real-time
          </p>
        </div>

        {/* Local error message */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2.5">
            <ShieldAlert size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-sm text-zinc-300">
          
          {/* Email input */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">
              System Email
            </label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white placeholder-zinc-500 outline-none transition-colors"
                placeholder="admin@portfolio.com"
              />
            </div>
          </div>

          {/* Password input */}
          <div className="space-y-1.5">
            <label htmlFor="pass" className="text-xs font-semibold text-zinc-400 font-display block uppercase tracking-wider">
              Password
            </label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="password"
                id="pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 focus:border-accent/40 text-white placeholder-zinc-500 outline-none transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-accent hover:bg-accent-dark text-white font-semibold font-display shadow-md shadow-accent/10 active:scale-98 disabled:opacity-50 transition-all text-xs cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center pt-2">
          <a
            href="/"
            className="text-xs text-zinc-500 hover:text-zinc-300 font-display transition-colors"
          >
            ← Return to Portfolio Homepage
          </a>
        </div>
      </div>
    </div>
  );
}
