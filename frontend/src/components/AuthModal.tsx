import React, { useState } from 'react';
import { loginUser, registerUser } from '../services/api';
import type { User } from '../types';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  onError: (msg: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess, onError }) => {
  if (!isOpen) return null;

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isRegister) {
        if (!name || !email || !password) {
          throw new Error('Please fill in all required fields.');
        }
        const data = await registerUser({ name, email, password, role });
        onSuccess(data.user);
        onClose();
      } else {
        if (!email || !password) {
          throw new Error('Please enter your email and password.');
        }
        const data = await loginUser({ email, password });
        onSuccess(data.user);
        onClose();
      }
    } catch (err: any) {
      onError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickFill = (demoRole: 'admin' | 'customer') => {
    if (demoRole === 'admin') {
      setEmail('admin@dealership.com');
      setPassword('AdminPassword123!');
      setIsRegister(false);
    } else {
      setEmail('customer@dealership.com');
      setPassword('CustomerPassword123!');
      setIsRegister(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md glass-panel border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-luxury-gold to-yellow-600 text-black mx-auto mb-3 shadow-lg shadow-luxury-gold/20">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold font-['Outfit'] text-white">
            {isRegister ? 'Create Dealership Account' : 'Welcome to Aura Motors'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {isRegister
              ? 'Register to acquire vehicles and save bespoke commissions.'
              : 'Sign in to access protected inventory and order vehicles.'}
          </p>
        </div>

        {/* Quick Demo Credentials Banner */}
        <div className="mb-6 p-3 rounded-2xl bg-dark-900 border border-white/10 text-xs">
          <div className="text-[10px] font-bold text-luxury-gold uppercase tracking-wider mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-luxury-electric" />
            Instant One-Click Reviewer Credentials:
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickFill('admin')}
              className="py-1.5 px-2 rounded-lg bg-rose-950/60 border border-rose-800/50 text-rose-300 font-semibold text-[11px] hover:bg-rose-900/60 transition flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3 h-3" />
              Demo Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('customer')}
              className="py-1.5 px-2 rounded-lg bg-dark-800 border border-luxury-gold/40 text-luxury-gold font-semibold text-[11px] hover:bg-luxury-gold/10 transition flex items-center justify-center gap-1"
            >
              <UserIcon className="w-3 h-3" />
              Demo Customer
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Elena Rostova"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="email"
                required
                placeholder="you@dealership.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
              />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">
                Account Privilege Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition border ${
                    role === 'customer'
                      ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold'
                      : 'bg-dark-900 border-white/10 text-slate-400'
                  }`}
                >
                  Customer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 rounded-xl text-xs font-bold uppercase transition border ${
                    role === 'admin'
                      ? 'bg-rose-950/60 border-rose-500 text-rose-300'
                      : 'bg-dark-900 border-white/10 text-slate-400'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-lg shadow-luxury-gold/20 disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Authenticating...' : isRegister ? 'Complete Registration' : 'Sign In to Account'}
          </button>
        </form>

        {/* Footer switch */}
        <div className="mt-6 text-center text-xs text-slate-400 border-t border-white/10 pt-4">
          {isRegister ? (
            <p>
              Already registered with Aura Motors?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(false)}
                className="text-luxury-gold font-bold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              New client?{' '}
              <button
                type="button"
                onClick={() => setIsRegister(true)}
                className="text-luxury-gold font-bold hover:underline"
              >
                Register Account
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
