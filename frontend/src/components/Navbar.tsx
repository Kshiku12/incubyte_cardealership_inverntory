import React from 'react';
import type { User } from '../types';
import { ShieldCheck, User as UserIcon, Sparkles, Scale, Newspaper, Wrench, LogOut, Car } from 'lucide-react';

interface NavbarProps {
  currentUser: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  compareCount: number;
  onQuickRoleSwitch: (role: 'customer' | 'admin') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenAuth,
  onLogout,
  compareCount,
  onQuickRoleSwitch,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/10 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('showroom')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-luxury-gold to-yellow-600 flex items-center justify-center shadow-lg shadow-luxury-gold/20 group-hover:scale-105 transition-transform">
              <Car className="w-6 h-6 text-black" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-widest text-white font-['Outfit'] block leading-none">
                AURA
              </span>
              <span className="text-[10px] tracking-[0.3em] text-luxury-gold uppercase font-medium">
                Motors • Dealership
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-dark-900/60 p-1.5 rounded-full border border-white/5">
            <button
              onClick={() => setActiveTab('showroom')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === 'showroom'
                  ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Showroom
            </button>

            <button
              onClick={() => setActiveTab('compare')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all relative flex items-center gap-1.5 ${
                activeTab === 'compare'
                  ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Scale className="w-4 h-4" />
              Compare
              {compareCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-luxury-electric text-black rounded-full font-bold">
                  {compareCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('concierge')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'concierge'
                  ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-4 h-4 text-luxury-electric" />
              AI Concierge
            </button>

            <button
              onClick={() => setActiveTab('studio')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'studio'
                  ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Bespoke Studio
            </button>

            <button
              onClick={() => setActiveTab('news')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'news'
                  ? 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black shadow-md font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Newspaper className="w-4 h-4" />
              Gazette
            </button>

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-md font-semibold'
                    : 'text-rose-400 hover:text-rose-300 hover:bg-rose-500/10'
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Suite
              </button>
            )}
          </nav>

          {/* User Auth & Quick Switcher */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3 bg-dark-900/80 pl-3 pr-2 py-1.5 rounded-full border border-white/10">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${currentUser.role === 'admin' ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'}`} />
                  <span className="text-xs font-medium text-slate-200 hidden sm:inline">
                    {currentUser.name}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    currentUser.role === 'admin' ? 'bg-rose-900/50 text-rose-300 border border-rose-500/30' : 'bg-luxury-gold/20 text-luxury-gold border border-luxury-gold/30'
                  }`}>
                    {currentUser.role}
                  </span>
                </div>

                <button
                  onClick={onLogout}
                  title="Sign out"
                  className="p-1.5 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {/* One click fast reviewer buttons */}
                <button
                  onClick={() => onQuickRoleSwitch('admin')}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-rose-950/60 text-rose-300 border border-rose-800/50 hover:bg-rose-900/60 transition"
                  title="Sign in instantly with seeded admin account"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Demo Admin
                </button>
                <button
                  onClick={() => onQuickRoleSwitch('customer')}
                  className="hidden md:flex items-center gap-1 px-3 py-1.5 text-xs font-semibold rounded-lg bg-dark-800 text-luxury-gold border border-luxury-gold/40 hover:bg-luxury-gold/10 transition"
                  title="Sign in instantly with seeded customer account"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  Demo Customer
                </button>
                
                <button
                  onClick={onOpenAuth}
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-luxury-gold to-yellow-600 text-black hover:brightness-110 shadow-lg shadow-luxury-gold/20 transition-all"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
