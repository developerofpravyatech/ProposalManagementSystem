import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { Card } from '../components/common/Card';

export function LoginPage() {
  const [email, setEmail] = useState('admin@pravyatech.com');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      addToast('Welcome back, Admin!', 'success');
      navigate('/admin/dashboard');
    } catch (err) {
      addToast(err.message || 'Login failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setEmail('admin@pravyatech.com');
    setPassword('admin123');
    login('admin@pravyatech.com', 'admin123').then(() => {
      addToast('Authenticated with Demo Superadmin credentials', 'success');
      navigate('/admin/dashboard');
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 mesh-bg relative overflow-hidden">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 via-brand-500 to-cyan-400 p-[1px] shadow-glow-brand mx-auto flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center font-display font-black text-white text-2xl tracking-wider">
              P<span className="text-cyan-400">T</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white font-display tracking-tight">
            PRAVYA TECH
          </h1>
          <p className="text-xs text-slate-400">
            Proposal & Quotation Management System (PMS)
          </p>
        </div>

        {/* Login Card */}
        <Card className="space-y-6 border-white/10 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h2 className="text-base font-bold text-white">Admin Command Center</h2>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-3 h-3" /> Secure Auth
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Admin Email"
              type="email"
              icon={Mail}
              placeholder="admin@pravyatech.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Input
              label="Password"
              type="password"
              icon={Lock}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              icon={ArrowRight}
              isLoading={isLoading}
              className="w-full mt-2"
            >
              Sign In to Command Center
            </Button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all flex items-center justify-center gap-2 group"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-12 transition-transform" />
              1-Click Superadmin Demo Login
            </button>
          </div>
        </Card>

        {/* Footer info */}
        <p className="text-center text-[11px] text-slate-400 font-mono">
          PRAVYA TECH Internal ERP • Authorized Access Only
        </p>
      </div>
    </div>
  );
}
