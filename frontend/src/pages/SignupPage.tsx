import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Lock, Mail, UserPlus } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/common/AuthLayout';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);

    try {
      await authApi.register(fullName, email, password);
      addToast('Account created. Sign in to continue.', 'success');
      navigate('/admin/login');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create account';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Create admin account" badge="Admin Access">
      <form onSubmit={handleSubmit} className="space-y-4">
        <p className="text-sm text-slate-600 leading-relaxed">
          Create your credentials to access the proposal management console.
        </p>

        <Input
          label="Full Name"
          icon={UserPlus}
          placeholder="e.g. Pravya Tech"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          autoComplete="name"
          required
        />

        <Input
          label="Admin Email"
          type="email"
          icon={Mail}
          placeholder="admin@pravyatech.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          autoComplete="email"
          required
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="At least 6 characters"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-7 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            icon={Lock}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            autoComplete="new-password"
            minLength={6}
            required
            className="pr-10"
          />
          <button
            type="button"
            className="absolute right-3 top-7 flex h-6 w-6 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-600"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showConfirmPassword}
            onClick={() => setShowConfirmPassword((current) => !current)}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        {error && <p className="text-xs text-rose-600 font-medium" role="alert">{error}</p>}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={UserPlus}
          isLoading={isLoading}
          className="w-full mt-2 font-bold"
        >
          Create account
        </Button>

        <div className="pt-1 text-center">
          <Link
            to="/admin/login"
            className="inline-flex items-center justify-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Already have an account? Sign in
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
