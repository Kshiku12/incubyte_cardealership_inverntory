import React, { useState, useEffect } from 'react';
import type { Vehicle } from '../types';
import { createVehicleApi, updateVehicleApi, restockVehicleApi, deleteVehicleApi } from '../services/api';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';

interface AdminPortalProps {
  mode: 'create' | 'edit' | 'restock' | 'delete' | null;
  targetVehicle: Vehicle | null;
  onClose: () => void;
  onSuccess: (msg: string) => void;
  onError: (msg: string) => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  mode,
  targetVehicle,
  onClose,
  onSuccess,
  onError,
}) => {
  if (!mode) return null;

  // Form State
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [category, setCategory] = useState('Sports');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [year, setYear] = useState('2024');
  const [mileage, setMileage] = useState('0');
  const [fuelType, setFuelType] = useState('Gasoline');
  const [transmission, setTransmission] = useState('Automatic');
  const [imageUrl, setImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [horsepower, setHorsepower] = useState('');
  const [zeroToSixty, setZeroToSixty] = useState('');
  const [topSpeed, setTopSpeed] = useState('');
  
  // Restock amount
  const [restockAmount, setRestockAmount] = useState('5');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && targetVehicle) {
      setMake(targetVehicle.make);
      setModel(targetVehicle.model);
      setCategory(targetVehicle.category);
      setPrice(targetVehicle.price.toString());
      setQuantity(targetVehicle.quantity.toString());
      setYear(targetVehicle.year?.toString() || '2024');
      setMileage(targetVehicle.mileage?.toString() || '0');
      setFuelType(targetVehicle.fuelType || 'Gasoline');
      setTransmission(targetVehicle.transmission || 'Automatic');
      setImageUrl(targetVehicle.imageUrl || '');
      setDescription(targetVehicle.description || '');
      setHorsepower(targetVehicle.specs?.horsepower?.toString() || '');
      setZeroToSixty(targetVehicle.specs?.zeroToSixty?.toString() || '');
      setTopSpeed(targetVehicle.specs?.topSpeed?.toString() || '');
    } else if (mode === 'create') {
      setMake('');
      setModel('');
      setCategory('Sports');
      setPrice('');
      setQuantity('1');
      setYear('2024');
      setMileage('0');
      setFuelType('Gasoline');
      setTransmission('Automatic');
      setImageUrl('https://images.unsplash.com/photo-1503376780353-7e6692767b70');
      setDescription('');
      setHorsepower('');
      setZeroToSixty('');
      setTopSpeed('');
    }
  }, [mode, targetVehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        if (!make || !model || !price) {
          throw new Error('Make, model, and price are required.');
        }

        await createVehicleApi({
          make,
          model,
          category,
          price: Number(price),
          quantity: Number(quantity) || 1,
          year: Number(year) || 2024,
          mileage: Number(mileage) || 0,
          fuelType,
          transmission,
          imageUrl: imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
          description,
          specs: {
            horsepower: horsepower ? Number(horsepower) : undefined,
            zeroToSixty: zeroToSixty ? Number(zeroToSixty) : undefined,
            topSpeed: topSpeed ? Number(topSpeed) : undefined,
          }
        });

        onSuccess(`Vehicle ${make} ${model} added to inventory successfully!`);
        onClose();
      } else if (mode === 'edit' && targetVehicle) {
        const vId = targetVehicle.id || (targetVehicle as any)._id;
        await updateVehicleApi(vId, {
          make,
          model,
          category,
          price: Number(price),
          quantity: Number(quantity),
          year: Number(year),
          mileage: Number(mileage),
          fuelType,
          transmission,
          imageUrl,
          description,
          specs: {
            horsepower: horsepower ? Number(horsepower) : undefined,
            zeroToSixty: zeroToSixty ? Number(zeroToSixty) : undefined,
            topSpeed: topSpeed ? Number(topSpeed) : undefined,
          }
        });

        onSuccess(`Vehicle ${make} ${model} updated successfully!`);
        onClose();
      } else if (mode === 'restock' && targetVehicle) {
        const vId = targetVehicle.id || (targetVehicle as any)._id;
        const amount = Number(restockAmount);
        if (isNaN(amount) || amount <= 0) {
          throw new Error('Please enter a valid positive restock quantity.');
        }

        await restockVehicleApi(vId, amount);
        onSuccess(`Restocked ${amount} units for ${targetVehicle.make} ${targetVehicle.model}!`);
        onClose();
      } else if (mode === 'delete' && targetVehicle) {
        const vId = targetVehicle.id || (targetVehicle as any)._id;
        await deleteVehicleApi(vId);
        onSuccess(`Vehicle ${targetVehicle.make} ${targetVehicle.model} removed from inventory.`);
        onClose();
      }
    } catch (err: any) {
      onError(err.message || 'Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl glass-panel border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
          <div className="flex items-center gap-2.5">
            <div className={`p-2 rounded-xl ${mode === 'delete' ? 'bg-rose-950 text-rose-400' : 'bg-luxury-gold/10 text-luxury-gold'}`}>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-['Outfit'] text-white">
                {mode === 'create' && 'Add New Showroom Vehicle'}
                {mode === 'edit' && `Edit Vehicle: ${targetVehicle?.make} ${targetVehicle?.model}`}
                {mode === 'restock' && `Restock Inventory: ${targetVehicle?.make} ${targetVehicle?.model}`}
                {mode === 'delete' && `Delete Vehicle Confirmation`}
              </h3>
              <p className="text-xs text-slate-400">
                Authorized Dealership Administrator Portal
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Delete Mode */}
        {mode === 'delete' && targetVehicle && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-800/40 flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              <div className="text-sm text-slate-200">
                Are you sure you want to delete <span className="font-bold text-white">{targetVehicle.make} {targetVehicle.model}</span> (${targetVehicle.price.toLocaleString()})?
                This action will permanently purge this vehicle from the database.
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-rose-900/30"
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </form>
        )}

        {/* Restock Mode */}
        {mode === 'restock' && targetVehicle && (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-700/40 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold">Current Available Stock</span>
                <div className="text-2xl font-bold text-emerald-400">
                  {targetVehicle.quantity} Units
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold">After Restock</span>
                <div className="text-2xl font-bold text-white">
                  {targetVehicle.quantity + (Number(restockAmount) || 0)} Units
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-luxury-gold block mb-2">
                Quantity to Add to Stock
              </label>
              <input
                type="number"
                min="1"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-dark-900 border border-white/10 text-white font-bold focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-emerald-900/30"
              >
                {isSubmitting ? 'Restocking...' : 'Execute Restock'}
              </button>
            </div>
          </form>
        )}

        {/* Create / Edit Form */}
        {(mode === 'create' || mode === 'edit') && (
          <form onSubmit={handleSubmit} className="space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Make *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Porsche, Tesla, BMW"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Model *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 911 GT3 RS, Model S Plaid"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                >
                  <option value="Sports">Sports</option>
                  <option value="Electric Sedan">Electric Sedan</option>
                  <option value="Electric Sports">Electric Sports</option>
                  <option value="Luxury SUV">Luxury SUV</option>
                  <option value="Coupe">Coupe</option>
                  <option value="Supercar">Supercar</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Price ($ USD) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 182900"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Initial Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="e.g. 3"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Model Year</label>
                <input
                  type="number"
                  placeholder="e.g. 2024"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Powertrain / Fuel</label>
                <input
                  type="text"
                  placeholder="e.g. Electric, Gasoline, Hybrid"
                  value={fuelType}
                  onChange={(e) => setFuelType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Transmission</label>
                <input
                  type="text"
                  placeholder="e.g. 7-Speed Dual-Clutch"
                  value={transmission}
                  onChange={(e) => setTransmission(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Horsepower (HP)</label>
                <input
                  type="number"
                  placeholder="e.g. 502"
                  value={horsepower}
                  onChange={(e) => setHorsepower(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-slate-300 block mb-1">0-60 MPH (Seconds)</label>
                <input
                  type="number"
                  step="0.01"
                  placeholder="e.g. 3.2"
                  value={zeroToSixty}
                  onChange={(e) => setZeroToSixty(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Image URL</label>
              <input
                type="url"
                placeholder="https://images.unsplash.com/..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase text-slate-300 block mb-1">Description / Overview</label>
              <textarea
                rows={3}
                placeholder="Enter executive vehicle overview and track dynamics details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-dark-900 border border-white/10 text-sm text-white focus:border-luxury-gold focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-dark-800 text-slate-300 font-semibold text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-luxury-gold to-yellow-600 text-black font-bold text-xs uppercase tracking-wider transition shadow-lg shadow-luxury-gold/20"
              >
                {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Vehicle' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
