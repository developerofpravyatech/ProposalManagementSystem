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
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 relative overflow-hidden mesh-bg">
      {/* Glow Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-900/5 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-slate-950 p-[1px] shadow-lg shadow-brand-600/10 mx-auto flex items-center justify-center border border-slate-900">
            <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center font-display font-black text-white text-2xl tracking-wider">
              P<span className="text-brand-500">T</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-slate-900 font-display tracking-tight">
            PRAVYA TECH
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Proposal & Quotation Management System (PMS)
          </p>
        </div>

        {/* Login Card */}
        <Card className="space-y-6 bg-white border border-slate-200 shadow-xl rounded-3xl p-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900 font-display">Admin Panel for PMS</h2>
            <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
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
              className="w-full mt-2 font-bold"
            >
              Sign In
            </Button>
          </form>
        </Card>
        <p className="text-center text-[11px] text-slate-400 font-mono font-medium">
          <a
            href="https://pravyatech.com"
            className="hover:underline hover:text-slate-300 transition-colors"
          >
            PRAVYA TECH Solutions Pvt. Ltd.
          </a>
        </p>
      </div>
    </div>
  );
}