import { useState } from 'react';
import { ArrowRight, CalendarDays, Lock, Mail, ShieldCheck, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

const RegisterPage = () => {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const [formData, setFormData] = useState({
    name: '',
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
      const response = await api.post('/organizer/register', formData);
      const { user, token } = response.data;

      setAuth(user, token);
      localStorage.setItem('token', token);
      navigate('/login');
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else {
        setMessage(error.response?.data?.message || error.message || 'Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 font-sans text-slate-800 sm:px-6">
      <section className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-[480px] items-center justify-center">
        <div className="w-full rounded-[2rem] border border-teal-100 bg-[#EFFAF8] p-8 shadow-sm sm:p-10">
          <header className="mb-10 flex flex-col items-center text-center">
            <div className="mb-5 rounded-2xl bg-[#0F766E] p-4 shadow-lg shadow-teal-900/20">
              <CalendarDays className="h-8 w-8 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-black tracking-normal text-gray-950">EventHub</h1>
            <div className="mt-2 flex items-center gap-2">
              <span className="h-px w-8 bg-gray-300" />
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Organizer Portal</p>
              <span className="h-px w-8 bg-gray-300" />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              Create your organizer account to publish, manage, and track your events.
            </p>
          </header>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-600" htmlFor="name">
                Organizer Name
              </label>
              <div className="group relative">
                <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0F766E]" />
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Phuc Khue Events"
                  className="w-full rounded-xl border border-teal-100 bg-white py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-300 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  value={formData.name}
                  onChange={(event) => updateField('name', event.target.value)}
                />
              </div>
              {errors.name && <p className="text-xs font-medium italic text-red-500">*{errors.name[0]}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-600" htmlFor="email">
                Email Address
              </label>
              <div className="group relative">
                <Mail className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0F766E]" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="organizer@company.com"
                  className="w-full rounded-xl border border-teal-100 bg-white py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-300 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  value={formData.email}
                  onChange={(event) => updateField('email', event.target.value)}
                />
              </div>
              {errors.email && <p className="text-xs font-medium italic text-red-500">*{errors.email[0]}</p>}
            </div>

            <div className="space-y-1.5">
              <label className="ml-1 text-xs font-bold uppercase tracking-wider text-gray-600" htmlFor="password">
                Password
              </label>
              <div className="group relative">
                <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 transition-colors group-focus-within:text-[#0F766E]" />
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Min. 8 characters"
                  className="w-full rounded-xl border border-teal-100 bg-white py-3.5 pl-12 pr-4 outline-none transition-all placeholder:text-gray-300 focus:border-[#0F766E] focus:ring-4 focus:ring-[#0F766E]/10"
                  value={formData.password}
                  onChange={(event) => updateField('password', event.target.value)}
                />
              </div>
              {errors.password && <p className="text-xs font-medium italic text-red-500">*{errors.password[0]}</p>}
            </div>

            <div className="flex items-start gap-2 px-1">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-600" />
              <p className="text-[11px] leading-relaxed text-gray-500">
                Your account will be created with organizer access for event management.
              </p>
            </div>

            {message && (
              <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="mt-4 flex w-full items-center justify-center gap-3 rounded-xl bg-[#0F766E] py-4 text-base font-bold text-white shadow-lg shadow-teal-900/15 transition-all hover:bg-[#115E59] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
                  Processing...
                </>
              ) : (
                <>
                  Create Organizer Account <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <footer className="mt-10 border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link className="font-extrabold text-[#0F766E] underline-offset-4 hover:underline" to="/login">
                Sign In
              </Link>
            </p>
          </footer>
        </div>
      </section>
    </main>
  );
};

export default RegisterPage;
