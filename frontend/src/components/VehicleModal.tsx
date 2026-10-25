import React from 'react';
import type { Vehicle, User } from '../types';
import { X, ShoppingCart, Zap, Gauge, Fuel, Check, Plus, Milestone } from 'lucide-react';

interface VehicleModalProps {
  vehicle: Vehicle | null;
  currentUser: User | null;
  onClose: () => void;
  onPurchase: (v: Vehicle) => void;
  onOpenRestock: (v: Vehicle) => void;
}

export const VehicleModal: React.FC<VehicleModalProps> = ({
  vehicle,
  currentUser,
  onClose,
  onPurchase,
  onOpenRestock,
}) => {
  if (!vehicle) return null;

  const isOutOfStock = vehicle.quantity <= 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl glass-panel border border-white/20 rounded-3xl overflow-hidden shadow-2xl my-8">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/60 text-slate-400 hover:text-white hover:bg-black/90 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image */}
        <div className="h-72 sm:h-96 relative bg-dark-900">
          <img
            src={vehicle.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
            alt={vehicle.model}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/30 to-transparent" />
          
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-luxury-gold text-black">
                {vehicle.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                isOutOfStock ? 'bg-rose-950/90 text-rose-300 border border-rose-500/50' : 'bg-emerald-950/90 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isOutOfStock ? 'Out of Stock' : `${vehicle.quantity} Units In Stock`}
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-extrabold font-['Outfit'] text-white">
              {vehicle.make} {vehicle.model}
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 space-y-8 bg-dark-950/90">
          
          {/* Price & Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <span className="text-xs text-slate-400 uppercase font-semibold">Acquisition Price</span>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">
                ${vehicle.price.toLocaleString()} <span className="text-xs text-slate-400 font-normal">MSRP USD</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {currentUser?.role === 'admin' && (
                <button
                  onClick={() => onOpenRestock(vehicle)}
                  className="px-4 py-3 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-700/50 hover:bg-emerald-900 font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                >
                  <Plus className="w-4 h-4" />
                  Restock (+Units)
                </button>
              )}

              <button
                onClick={() => {
                  onPurchase(vehicle);
                  onClose();
                }}
                disabled={isOutOfStock}
                className={`px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-lg ${
                  isOutOfStock
                    ? 'bg-dark-800 text-slate-500 cursor-not-allowed border border-white/5'
                    : 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black hover:brightness-110 shadow-luxury-gold/20'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}
              </button>
            </div>
          </div>

          {/* Description */}
          {vehicle.description && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-2">
                Executive Overview
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed font-serif">
                {vehicle.description}
              </p>
            </div>
          )}

          {/* Detailed Performance Telemetry */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-3">
              Factory Specifications & Telemetry
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="glass-card p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-luxury-gold" /> Horsepower
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {vehicle.specs?.horsepower ? `${vehicle.specs.horsepower} HP` : 'N/A'}
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                  <Gauge className="w-3.5 h-3.5 text-emerald-400" /> 0-60 MPH
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {vehicle.specs?.zeroToSixty ? `${vehicle.specs.zeroToSixty}s` : 'N/A'}
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                  <Fuel className="w-3.5 h-3.5 text-luxury-electric" /> Powertrain
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {vehicle.fuelType || 'Gasoline'}
                </div>
              </div>

              <div className="glass-card p-3 rounded-xl text-center">
                <div className="text-[10px] text-slate-400 uppercase flex items-center justify-center gap-1">
                  <Milestone className="w-3.5 h-3.5 text-yellow-400" /> Top Speed
                </div>
                <div className="text-base font-bold text-white mt-1">
                  {vehicle.specs?.topSpeed ? `${vehicle.specs.topSpeed} MPH` : 'N/A'}
                </div>
              </div>
            </div>
          </div>

          {/* Engine or Battery Details */}
          {(vehicle.specs?.engine || vehicle.specs?.batteryCapacity || vehicle.transmission) && (
            <div className="p-4 rounded-2xl bg-dark-900 border border-white/5 space-y-2 text-xs">
              {vehicle.specs?.engine && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Engine Architecture:</span>
                  <span className="font-semibold text-white">{vehicle.specs.engine}</span>
                </div>
              )}
              {vehicle.specs?.batteryCapacity && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Battery Capacity:</span>
                  <span className="font-semibold text-white">{vehicle.specs.batteryCapacity}</span>
                </div>
              )}
              {vehicle.transmission && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Transmission:</span>
                  <span className="font-semibold text-white">{vehicle.transmission}</span>
                </div>
              )}
              {vehicle.year && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Model Year:</span>
                  <span className="font-semibold text-white">{vehicle.year}</span>
                </div>
              )}
            </div>
          )}

          {/* Features Checklist */}
          {vehicle.features && vehicle.features.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-luxury-gold mb-3">
                Signature Amenities & Options
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {vehicle.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-slate-300">
                    <Check className="w-4 h-4 text-luxury-gold shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
