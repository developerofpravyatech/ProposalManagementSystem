import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, MailCheck } from 'lucide-react';
import { authApi } from '../api/authApi';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { AuthLayout } from '../components/common/AuthLayout';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { addToast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authApi.requestPasswordReset(email);
      setIsSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to request a password reset';
      setError(message);
      addToast(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Reset your password" badge="Account Recovery">
      {isSubmitted ? (
        <div className="space-y-4 py-2 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200">
            <MailCheck className="h-7 w-7" />
          </div>
          <div className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 font-display">Check your inbox</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If an account exists for <strong className="text-slate-900">{email}</strong>, password reset instructions will be sent shortly.
            </p>
          </div>
          <div className="space-y-3 pt-2">
            <Button
              type="button"
              variant="outline"
              icon={ArrowLeft}
              className="w-full"
              onClick={() => {
                setEmail('');
                setIsSubmitted(false);
              }}
            >
              Use another email
            </Button>
            <Link
              to="/admin/login"
              className="inline-flex items-center justify-center text-xs font-bold text-brand-600 hover:text-brand-700 transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-slate-600 leading-relaxed">
            Enter your admin email and we will send password reset instructions.
          </p>
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
          {error && <p className="text-xs text-rose-600 font-medium" role="alert">{error}</p>}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={Mail}
            isLoading={isLoading}
            className="w-full mt-2 font-bold"
          >
            Send reset link
          </Button>
          <div className="pt-1 text-center">
            <Link
              to="/admin/login"
              className="text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors"
            >
              Back to sign in
            </Link>
          </div>
        </form>
      )}
    </AuthLayout>
  );
}
