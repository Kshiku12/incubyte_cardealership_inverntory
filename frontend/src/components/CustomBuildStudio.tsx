import React, { useState } from 'react';
import type { CustomBuildConfig, CustomBuildResult } from '../types';
import { customBuildVehicleApi } from '../services/api';
import { Wrench, CheckCircle2, Sparkles } from 'lucide-react';

interface CustomBuildStudioProps {
  onNotify: (msg: string, type: 'success' | 'error') => void;
}

const BASE_MODELS = [
  { name: 'Porsche 911 GT3 RS', basePrice: 241300, image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e' },
  { name: 'Tesla Model S Plaid', basePrice: 89990, image: 'https://images.unsplash.com/photo-1617788138017-80ad40651399' },
  { name: 'Audi RS e-tron GT', basePrice: 106500, image: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a' },
  { name: 'Mercedes-AMG G 63', basePrice: 183000, image: 'https://images.unsplash.com/photo-1520050206274-a1ae44613e6d' },
  { name: 'Ferrari 296 GTB', basePrice: 322986, image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae' }
];

const COLORS = [
  { name: 'Frozen Metallic Blue', hex: '#1E3A8A', price: 3500 },
  { name: 'Matte Stealth Carbon', hex: '#18181B', price: 4500 },
  { name: 'British Racing Green', hex: '#064E3B', price: 3500 },
  { name: 'Liquid Silver Chrome', hex: '#E2E8F0', price: 3000 },
  { name: 'Rosso Corsa Crimson', hex: '#991B1B', price: 4000 }
];

const WHEELS = [
  { name: '21" Carbon Aero Blades', price: 4200 },
  { name: '20" Forged Monoblock Lightweight', price: 3800 },
  { name: '21" Diamond-Cut V-Spoke', price: 3200 }
];

const INTERIORS = [
  { name: 'Nappa Bordeaux Wine Leather', price: 3800 },
  { name: 'Lightweight Dark Alcantara Track', price: 2900 },
  { name: 'Cognac Executive Diamond-Quilt', price: 4500 }
];

const SOUND_SYSTEMS = [
  { name: 'Burmester 3D High-End Surround (1400W)', price: 4800 },
  { name: 'Bang & Olufsen 3D Spatial Audio (1200W)', price: 3800 },
  { name: 'Standard Studio Premium (800W)', price: 0 }
];

export const CustomBuildStudio: React.FC<CustomBuildStudioProps> = ({ onNotify }) => {
  const [selectedModel, setSelectedModel] = useState(BASE_MODELS[0]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [selectedWheel, setSelectedWheel] = useState(WHEELS[0]);
  const [selectedInterior, setSelectedInterior] = useState(INTERIORS[0]);
  const [performancePack, setPerformancePack] = useState(true);
  const [selectedSound, setSelectedSound] = useState(SOUND_SYSTEMS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [buildResult, setBuildResult] = useState<CustomBuildResult | null>(null);

  // Compute live price
  const optionsTotal =
    selectedColor.price +
    selectedWheel.price +
    selectedInterior.price +
    (performancePack ? 7500 : 0) +
    selectedSound.price;

  const totalCalculatedPrice = selectedModel.basePrice + optionsTotal;

  const handleSubmitBuild = async () => {
    setIsSubmitting(true);
    try {
      const config: CustomBuildConfig = {
        baseModel: selectedModel.name,
        exteriorColor: selectedColor.name,
        wheelPackage: selectedWheel.name,
        interiorTrim: selectedInterior.name,
        performancePackage: performancePack,
        soundSystem: selectedSound.name
      };

      const result = await customBuildVehicleApi(config);
      setBuildResult(result);
      onNotify(`Custom build ${result.buildCode} registered successfully!`, 'success');
    } catch (err: any) {
      onNotify(err.message || 'Failed to submit build', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/30 text-luxury-gold text-xs font-bold uppercase tracking-widest mb-3">
          <Wrench className="w-4 h-4" />
          Bespoke Commission Studio
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
          Configure Your Masterpiece
        </h2>
        <p className="text-sm text-slate-400 mt-2 max-w-xl mx-auto">
          Tailor every detail from aerospace composites to hand-finished hides. Receive an immediate 
          official build certificate and telemetry code.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Options Panel */}
        <div className="lg:col-span-7 space-y-8 glass-panel p-6 sm:p-8 rounded-3xl border border-white/10">
          
          {/* 1. Base Model */}
          <div>
            <label className="text-xs font-bold text-luxury-gold uppercase tracking-wider block mb-3">
              1. Select Base Vehicle Platform
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BASE_MODELS.map((model) => (
                <button
                  key={model.name}
                  onClick={() => setSelectedModel(model)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition ${
                    selectedModel.name === model.name
                      ? 'bg-luxury-gold/10 border-luxury-gold text-white shadow-lg shadow-luxury-gold/10'
                      : 'bg-dark-900 border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <img src={model.image} alt={model.name} className="w-14 h-10 object-cover rounded-lg" />
                  <div>
                    <div className="text-xs font-bold">{model.name}</div>
                    <div className="text-[11px] text-slate-400">${model.basePrice.toLocaleString()} Base</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Exterior Finish */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-luxury-gold uppercase tracking-wider">
                2. Exterior Paint & Finish
              </label>
              <span className="text-xs text-slate-400">Selected: {selectedColor.name} (+${selectedColor.price})</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {COLORS.map((col) => (
                <button
                  key={col.name}
                  onClick={() => setSelectedColor(col)}
                  className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition ${
                    selectedColor.name === col.name
                      ? 'border-luxury-gold bg-luxury-gold/10 text-white font-bold'
                      : 'border-white/10 bg-dark-900 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span className="w-4 h-4 rounded-full border border-white/20 shrink-0" style={{ backgroundColor: col.hex }} />
                  <span>{col.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Wheels */}
          <div>
            <label className="text-xs font-bold text-luxury-gold uppercase tracking-wider block mb-3">
              3. Wheel Architecture
            </label>
            <div className="space-y-2">
              {WHEELS.map((w) => (
                <button
                  key={w.name}
                  onClick={() => setSelectedWheel(w)}
                  className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                    selectedWheel.name === w.name
                      ? 'bg-luxury-gold/10 border-luxury-gold text-white font-bold'
                      : 'bg-dark-900 border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{w.name}</span>
                  <span className="text-luxury-gold font-bold">+${w.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Interior Trim */}
          <div>
            <label className="text-xs font-bold text-luxury-gold uppercase tracking-wider block mb-3">
              4. Bespoke Cockpit & Leather
            </label>
            <div className="space-y-2">
              {INTERIORS.map((int) => (
                <button
                  key={int.name}
                  onClick={() => setSelectedInterior(int)}
                  className={`w-full p-3 rounded-xl border text-xs flex items-center justify-between transition ${
                    selectedInterior.name === int.name
                      ? 'bg-luxury-gold/10 border-luxury-gold text-white font-bold'
                      : 'bg-dark-900 border-white/5 text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <span>{int.name}</span>
                  <span className="text-luxury-gold font-bold">+${int.price.toLocaleString()}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Performance Pack Toggle */}
          <div className="p-4 rounded-2xl bg-dark-900/90 border border-white/10 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                Track Aerodynamics & Performance Launch Pack
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Includes carbon ceramic brake package, active rear wing telemetry, and launch software.
              </div>
            </div>
            <button
              onClick={() => setPerformancePack(!performancePack)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase transition ${
                performancePack ? 'bg-luxury-gold text-black' : 'bg-dark-800 text-slate-400'
              }`}
            >
              {performancePack ? 'Included (+ $7,500)' : 'Not Added'}
            </button>
          </div>
        </div>

        {/* Right Summary & Certificate Panel */}
        <div className="lg:col-span-5 sticky top-28 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl">
            <div className="h-44 rounded-2xl overflow-hidden mb-6 bg-dark-900 relative">
              <img
                src={selectedModel.image}
                alt={selectedModel.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/70 backdrop-blur-md text-luxury-gold border border-luxury-gold/30">
                Live Specification
              </div>
            </div>

            <div className="text-xs font-bold uppercase tracking-widest text-luxury-gold">
              Commission Summary
            </div>
            <h3 className="text-2xl font-bold font-['Outfit'] text-white mt-0.5">
              {selectedModel.name}
            </h3>

            {/* Price breakdown */}
            <div className="mt-6 space-y-2.5 text-xs text-slate-300 border-t border-white/10 pt-4">
              <div className="flex justify-between">
                <span>Base Chassis MSRP</span>
                <span className="font-bold text-white">${selectedModel.basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Paint: {selectedColor.name}</span>
                <span className="text-luxury-gold">+${selectedColor.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Wheels: {selectedWheel.name}</span>
                <span className="text-luxury-gold">+${selectedWheel.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Interior: {selectedInterior.name}</span>
                <span className="text-luxury-gold">+${selectedInterior.price.toLocaleString()}</span>
              </div>
              {performancePack && (
                <div className="flex justify-between">
                  <span>Track Dynamics Package</span>
                  <span className="text-luxury-gold">+$7,500</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="mt-6 pt-4 border-t border-white/20 flex items-baseline justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Total Estimated Price</span>
                <span className="text-3xl font-extrabold font-['Outfit'] text-white">
                  ${totalCalculatedPrice.toLocaleString()}
                </span>
              </div>
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-500/30">
                MSRP Guaranteed
              </span>
            </div>

            {/* Submit Action */}
            <button
              onClick={handleSubmitBuild}
              disabled={isSubmitting}
              className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-extrabold text-xs uppercase tracking-wider hover:brightness-110 transition shadow-xl shadow-luxury-gold/20 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              {isSubmitting ? 'Calculating Telemetry...' : 'Generate Build Specification'}
            </button>
          </div>

          {/* Generated Build Certificate */}
          {buildResult && (
            <div className="glass-card rounded-3xl p-6 border border-emerald-500/40 bg-emerald-950/20 text-center animate-fade-in shadow-xl">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                Official Commission Certificate
              </div>
              <h4 className="text-xl font-bold text-white mt-1">
                Build Code: <span className="font-mono text-luxury-gold">{buildResult.buildCode}</span>
              </h4>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Your custom build specification has been successfully filed in the Aura Motors production registry. 
                Total Commission Price: <span className="font-bold text-white">${buildResult.totalPrice.toLocaleString()}</span>.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
