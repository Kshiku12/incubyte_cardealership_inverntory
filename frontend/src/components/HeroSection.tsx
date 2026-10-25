import React from 'react';
import { Sparkles, ArrowRight, Zap, Award, Gauge } from 'lucide-react';

interface HeroSectionProps {
  onExplore: () => void;
  onOpenConcierge: () => void;
  totalVehicles: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExplore, onOpenConcierge, totalVehicles }) => {
  return (
    <div className="relative overflow-hidden border-b border-white/10 bg-dark-950">
      {/* Background ambient automotive light rays */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(212,175,55,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 -left-48 w-96 h-96 bg-luxury-electric/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -right-48 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-luxury-gold/30 backdrop-blur-md mb-6">
            <Sparkles className="w-4 h-4 text-luxury-gold animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-200">
              Next-Gen Dealership Experience • 2026 Fleet
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-extrabold font-['Outfit'] tracking-tight text-white uppercase leading-none">
            Precision Engineered. <br />
            <span className="bg-gradient-to-r from-luxury-gold via-yellow-200 to-luxury-gold bg-clip-text text-transparent">
              Effortlessly Acquired.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-400 font-normal leading-relaxed">
            Welcome to Aura Motors. Experience an uncompromising inventory of high-performance grand tourers, 
            tri-motor electric hypercars, and bespoke SUVs. Powered by test-driven inventory control and 
            real-time AI consultation.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onExplore}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold text-sm uppercase tracking-wider hover:brightness-110 shadow-xl shadow-luxury-gold/20 flex items-center gap-2 group transition-all"
            >
              Explore Showroom
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenConcierge}
              className="px-8 py-3.5 rounded-xl bg-dark-800/90 hover:bg-dark-700 text-white font-semibold text-sm border border-white/10 flex items-center gap-2 transition-all shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-luxury-electric" />
              Ask AI Concierge
            </button>
          </div>
        </div>

        {/* Fleet Metrics Strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-luxury-gold/10 text-luxury-gold">
              <Award className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-white">
              {totalVehicles > 0 ? totalVehicles : 9}+
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
              Available Models
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-luxury-electric/10 text-luxury-electric">
              <Zap className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-white">
              1,234 HP
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
              Peak Tri-Motor Output
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Gauge className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-white">
              1.89s
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
              Fastest 0-60 MPH
            </div>
          </div>

          <div className="glass-card p-4 rounded-2xl text-center">
            <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 rounded-lg bg-yellow-500/10 text-yellow-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold font-['Outfit'] text-white">
              100%
            </div>
            <div className="text-xs text-slate-400 uppercase tracking-wider mt-0.5">
              TDD Kata Certified
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
