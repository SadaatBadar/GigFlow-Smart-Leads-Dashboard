import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Zap, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useDarkMode } from '../context/DarkModeContext';
import { AuthFormData } from '../types';
import { Spinner } from '../components/ui/States';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required'),
});

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const { isDark, toggleDarkMode } = useDarkMode();
  const navigate = useNavigate();
  const [showPw, setShowPw] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AuthFormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: AuthFormData) => {
    try {
      await login(data);
      navigate('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand-100 dark:bg-brand-950 rounded-full blur-3xl opacity-50 dark:opacity-30" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 dark:bg-blue-950 rounded-full blur-3xl opacity-40 dark:opacity-20" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="absolute right-0 top-0 z-10 p-4">
          <button
            type="button"
            onClick={toggleDarkMode}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-sm text-slate-700 shadow-sm backdrop-blur transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            {isDark ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-600 rounded-2xl mb-4 shadow-lg shadow-brand-200 dark:shadow-brand-900">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="font-display text-2xl font-700 text-slate-900 dark:text-white">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Sign in to your GigFlow - Smart Leads account</p>
        </div>

        {/* Form card */}
        <div className="card p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-950">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Email address</label>
              <input
                {...register('email')}
                type="email"
                className="input"
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPw ? 'text' : 'password'}
                  className="input pr-10"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{errors.password.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full justify-center py-2.5 mt-2"
            >
              {isLoading ? <Spinner size="sm" /> : null}
              Sign in
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-5">
            Don't have an account?{' '}
            <Link to="/register" className="text-brand-600 font-medium hover:text-brand-700 transition-colors">
              Create one
            </Link>
          </p>
        </div>

        {/* Demo hint */}
        <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-100 dark:border-amber-800 rounded-xl text-xs text-amber-700 dark:text-amber-300 text-center">
          Register with role <strong>admin</strong> to access all features including delete & export
        </div>
      </div>
    </div>
  );
}
