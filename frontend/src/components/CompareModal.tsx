import React from 'react';
import type { Vehicle } from '../types';
import { X, Scale, ShoppingCart, Zap, Gauge, Award, Fuel } from 'lucide-react';

interface CompareModalProps {
  vehicles: Vehicle[];
  onClose: () => void;
  onRemove: (id: string) => void;
  onClear: () => void;
  onPurchase: (v: Vehicle) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  vehicles,
  onClose,
  onRemove,
  onClear,
  onPurchase,
}) => {
  // Determine highest horsepower and lowest 0-60
  const maxHp = Math.max(...vehicles.map((v) => v.specs?.horsepower || 0));
  const minZeroToSixty = Math.min(...vehicles.map((v) => v.specs?.zeroToSixty || 999).filter((val) => val > 0));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-6xl glass-panel border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-luxury-gold/10 text-luxury-gold">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold font-['Outfit'] text-white">
                Interactive Vehicle Comparison
              </h2>
              <p className="text-xs text-slate-400">
                Evaluating {vehicles.length} vehicle{vehicles.length !== 1 ? 's' : ''} side-by-side
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {vehicles.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {vehicles.length === 0 ? (
          <div className="py-16 text-center">
            <Scale className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-base font-semibold text-slate-300">No vehicles selected for comparison</p>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Click the "Compare" button on any vehicle card in the showroom to evaluate specifications side-by-side.
            </p>
          </div>
        ) : (
          <div className="mt-8 overflow-x-auto pb-4">
            <div className={`grid gap-6 min-w-[700px]`} style={{ gridTemplateColumns: `repeat(${vehicles.length}, minmax(260px, 1fr))` }}>
              {vehicles.map((v) => {
                const vId = v.id || (v as any)._id;
                const isMaxHp = (v.specs?.horsepower || 0) === maxHp && maxHp > 0;
                const isFastest = (v.specs?.zeroToSixty || 999) === minZeroToSixty && minZeroToSixty < 999;
                const isOutOfStock = v.quantity <= 0;

                return (
                  <div key={vId} className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col justify-between relative">
                    
                    {/* Remove button */}
                    <button
                      onClick={() => onRemove(vId)}
                      className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-black/60 text-slate-400 hover:text-white hover:bg-rose-950 transition"
                      title="Remove from comparison"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    <div>
                      {/* Image */}
                      <div className="h-40 rounded-xl overflow-hidden mb-4 bg-dark-900">
                        <img
                          src={v.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
                          alt={v.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Title */}
                      <div className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">
                        {v.make}
                      </div>
                      <h3 className="text-xl font-bold font-['Outfit'] text-white">
                        {v.model}
                      </h3>
                      <div className="text-2xl font-extrabold text-white mt-1">
                        ${v.price.toLocaleString()}
                      </div>

                      {/* Specs Comparison Table */}
                      <div className="mt-6 space-y-3 text-xs">
                        
                        {/* Horsepower */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isMaxHp ? 'bg-luxury-gold/10 border-luxury-gold/40 text-luxury-gold' : 'bg-dark-900/60 border-white/5 text-slate-300'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Zap className="w-4 h-4" />
                            <span>Power</span>
                          </div>
                          <span className="font-bold flex items-center gap-1">
                            {v.specs?.horsepower ? `${v.specs.horsepower} HP` : 'N/A'}
                            {isMaxHp && <Award className="w-3.5 h-3.5 text-luxury-gold" />}
                          </span>
                        </div>

                        {/* 0-60 MPH */}
                        <div className={`p-2.5 rounded-xl border flex items-center justify-between ${
                          isFastest ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300' : 'bg-dark-900/60 border-white/5 text-slate-300'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            <Gauge className="w-4 h-4" />
                            <span>0-60 MPH</span>
                          </div>
                          <span className="font-bold flex items-center gap-1">
                            {v.specs?.zeroToSixty ? `${v.specs.zeroToSixty}s` : 'N/A'}
                            {isFastest && <Award className="w-3.5 h-3.5 text-emerald-400" />}
                          </span>
                        </div>

                        {/* Top Speed */}
                        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-slate-300">
                          <span>Top Speed</span>
                          <span className="font-bold text-white">
                            {v.specs?.topSpeed ? `${v.specs.topSpeed} MPH` : 'N/A'}
                          </span>
                        </div>

                        {/* Category */}
                        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-slate-300">
                          <span>Category</span>
                          <span className="font-semibold text-white">{v.category}</span>
                        </div>

                        {/* Fuel Type */}
                        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5" />
                            <span>Drivetrain</span>
                          </div>
                          <span className="font-semibold text-white">{v.fuelType || 'Gasoline'}</span>
                        </div>

                        {/* Transmission */}
                        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-slate-300">
                          <span>Gearbox</span>
                          <span className="font-semibold text-white truncate max-w-[130px]">{v.transmission || 'Automatic'}</span>
                        </div>

                        {/* Stock */}
                        <div className="p-2.5 rounded-xl bg-dark-900/60 border border-white/5 flex items-center justify-between text-slate-300">
                          <span>Inventory</span>
                          <span className={`font-bold ${isOutOfStock ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {isOutOfStock ? 'Out of Stock' : `${v.quantity} Available`}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Purchase Action */}
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <button
                        onClick={() => onPurchase(v)}
                        disabled={isOutOfStock}
                        className={`w-full py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition ${
                          isOutOfStock
                            ? 'bg-dark-800 text-slate-500 cursor-not-allowed'
                            : 'bg-luxury-gold hover:bg-yellow-500 text-black shadow-md shadow-luxury-gold/20'
                        }`}
                      >
                        <ShoppingCart className="w-3.5 h-3.5" />
                        {isOutOfStock ? 'Sold Out' : 'Purchase'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
