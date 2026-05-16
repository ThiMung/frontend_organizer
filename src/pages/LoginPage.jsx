import { useState } from 'react';
import { CalendarDays, Lock, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});
    setMessage('');

    try {
      const response = await api.post('/organizer/login', {
        ...formData,
        required_role: 'organizer',
      });
      const { user, token } = response.data;

      setAuth(user, token);
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setMessage(error.response?.data?.message || error.message || 'Sign in failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-7 font-sans text-slate-900 sm:px-7">
      <p className="mb-2 text-xs font-semibold text-gray-300">Sign in</p>
      <section className="flex min-h-[calc(100vh-5rem)] items-center justify-center bg-white px-4 py-10">
        <div className="w-full max-w-[468px] rounded-md border border-gray-300 bg-[#FAF4F4] px-8 py-8 shadow-sm sm:px-16 sm:py-10">
          <header className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-[10px] bg-[#A02749]">
              <CalendarDays className="h-7 w-7 text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold text-[#A02749]">EventHub</span>
          </header>

          <div className="mb-3">
            <h1 className="text-[22px] font-bold leading-tight tracking-normal text-black">Welcome Back</h1>
            <p className="mt-1 text-sm text-stone-500">Sign in to your account to access your dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="block text-lg leading-none text-black" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="your@example.com"
                  className="h-8 w-full rounded-md border border-stone-400 bg-white pl-9 pr-3 text-sm text-stone-800 outline-none transition focus:border-[#A02749] focus:ring-2 focus:ring-[#A02749]/15"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </div>
              {errors.email && <p className="text-xs font-medium text-red-600">{errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-lg leading-none text-black" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-600" />
                <input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••"
                  className="h-8 w-full rounded-md border border-stone-400 bg-white pl-9 pr-3 text-sm text-stone-800 outline-none transition focus:border-[#A02749] focus:ring-2 focus:ring-[#A02749]/15"
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                />
              </div>
              {errors.password && <p className="text-xs font-medium text-red-600">{errors.password[0]}</p>}
            </div>

            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-[#A02749] hover:underline">
                Forgot password?
              </button>
            </div>

            {message && (
              <div className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="flex h-11 w-full items-center justify-center rounded-md bg-[#A02749] text-base font-medium text-white transition hover:bg-[#861d3d] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <footer className="mt-4 text-center text-sm text-stone-400">
            Don&apos;t have an account?{' '}
            <Link className="font-medium text-[#A02749] hover:underline" to="/register">
              Sign up
            </Link>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
