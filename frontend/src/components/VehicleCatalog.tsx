import React, { useState } from 'react';
import type { Vehicle, User } from '../types';
import { Search, SlidersHorizontal, ShoppingCart, Scale, Eye, Plus, Edit2, Trash2, ShieldAlert, Sparkles, Zap, Fuel, Activity } from 'lucide-react';

interface VehicleCatalogProps {
  vehicles: Vehicle[];
  currentUser: User | null;
  onPurchase: (vehicle: Vehicle) => void;
  onOpenDetails: (vehicle: Vehicle) => void;
  onOpenEdit: (vehicle: Vehicle) => void;
  onOpenRestock: (vehicle: Vehicle) => void;
  onDelete: (vehicle: Vehicle) => void;
  onOpenCreate: () => void;
  comparedIds: string[];
  onToggleCompare: (id: string) => void;
  onSearch: (params: { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number }) => void;
  isSearching: boolean;
}

const CATEGORIES = ['All', 'Sports', 'Electric Sedan', 'Electric Sports', 'Luxury SUV', 'Coupe', 'Supercar'];

export const VehicleCatalog: React.FC<VehicleCatalogProps> = ({
  vehicles,
  currentUser,
  onPurchase,
  onOpenDetails,
  onOpenEdit,
  onOpenRestock,
  onDelete,
  onOpenCreate,
  comparedIds,
  onToggleCompare,
  onSearch,
  isSearching,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const handleApplyFilter = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      make: searchTerm.trim() || undefined,
      category: selectedCategory !== 'All' ? selectedCategory : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleCategoryClick = (cat: string) => {
    setSelectedCategory(cat);
    onSearch({
      make: searchTerm.trim() || undefined,
      category: cat !== 'All' ? cat : undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined,
    });
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  const handlePurchaseClick = async (v: Vehicle) => {
    setPurchasingId(v.id || (v as any)._id);
    try {
      await onPurchase(v);
    } finally {
      setPurchasingId(null);
    }
  };

  return (
    <section id="showroom" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Catalog Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 text-luxury-gold text-xs font-bold uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            Curated Dealership Collection
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-['Outfit'] text-white">
            Available Vehicles
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Showing {vehicles.length} high-performance vehicles ready for delivery.
          </p>
        </div>

        {/* Admin Quick Action Button */}
        {currentUser?.role === 'admin' && (
          <button
            onClick={onOpenCreate}
            className="self-start md:self-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-emerald-900/30 flex items-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add New Vehicle (Admin)
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-6 rounded-2xl mb-10 border border-white/10 shadow-2xl">
        <form onSubmit={handleApplyFilter} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search by make, model, or keywords (e.g. Porsche, Tesla, SUV)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-luxury-gold transition"
              />
            </div>

            {/* Min Price */}
            <div className="md:col-span-2">
              <input
                type="number"
                placeholder="Min Price ($)"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-luxury-gold transition"
              />
            </div>

            {/* Max Price */}
            <div className="md:col-span-2">
              <input
                type="number"
                placeholder="Max Price ($)"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-dark-900/90 border border-white/10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-luxury-gold transition"
              />
            </div>

            {/* Action Buttons */}
            <div className="md:col-span-3 flex items-center gap-2">
              <button
                type="submit"
                disabled={isSearching}
                className="flex-1 py-2.5 rounded-xl bg-luxury-gold hover:bg-yellow-500 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition disabled:opacity-50"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {isSearching ? 'Filtering...' : 'Filter'}
              </button>

              <button
                type="button"
                onClick={handleResetFilters}
                className="px-4 py-2.5 rounded-xl bg-dark-800 hover:bg-dark-700 text-slate-300 font-medium text-xs transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider mr-1">
              Category:
            </span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-luxury-gold text-black font-bold shadow-md shadow-luxury-gold/20'
                    : 'bg-dark-900/80 text-slate-400 hover:text-white hover:bg-white/5 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </form>
      </div>

      {/* Vehicles Grid */}
      {vehicles.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/10">
          <ShieldAlert className="w-12 h-12 text-luxury-gold mx-auto mb-3 opacity-60" />
          <h3 className="text-xl font-bold text-white mb-1">No Vehicles Found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
            No inventory matches your current search filters. Try adjusting price range or clearing search criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2 rounded-xl bg-luxury-gold text-black font-bold text-xs uppercase tracking-wider hover:brightness-110"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {vehicles.map((v) => {
            const vId = v.id || (v as any)._id;
            const isOutOfStock = v.quantity <= 0;
            const isCompared = comparedIds.includes(vId);
            const isBuying = purchasingId === vId;

            return (
              <div
                key={vId}
                className="glass-card rounded-2xl overflow-hidden flex flex-col group border border-white/10 hover:border-luxury-gold/40 transition-all duration-300"
              >
                {/* Vehicle Image Header */}
                <div className="relative h-56 overflow-hidden bg-dark-900">
                  <img
                    src={v.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
                    alt={`${v.make} ${v.model}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  
                  {/* Category Pill */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-black/70 backdrop-blur-md text-white border border-white/10">
                    {v.category}
                  </div>

                  {/* Stock Status Badge */}
                  <div className="absolute top-3 right-3">
                    {isOutOfStock ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-950/90 text-rose-300 border border-rose-500/50 shadow-md">
                        Out of Stock
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-950/90 text-emerald-300 border border-emerald-500/40 shadow-md">
                        {v.quantity} Available
                      </span>
                    )}
                  </div>

                  {/* Year Tag */}
                  {v.year && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/60 text-slate-300">
                      {v.year}
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Make and Model */}
                    <div className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-1">
                      {v.make}
                    </div>
                    <h3 className="text-2xl font-bold font-['Outfit'] text-white group-hover:text-luxury-gold transition-colors">
                      {v.model}
                    </h3>

                    {/* Price */}
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="text-2xl font-extrabold text-white">
                        ${v.price.toLocaleString()}
                      </span>
                      <span className="text-xs text-slate-400">MSRP</span>
                    </div>

                    {/* Description snippet */}
                    {v.description && (
                      <p className="mt-2 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {v.description}
                      </p>
                    )}

                    {/* Quick Specs Grid */}
                    <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-3 gap-2 text-center">
                      <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase font-semibold">
                          <Zap className="w-3 h-3 text-luxury-gold" />
                          Power
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          {v.specs?.horsepower ? `${v.specs.horsepower} HP` : 'N/A'}
                        </div>
                      </div>

                      <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase font-semibold">
                          <Activity className="w-3 h-3 text-emerald-400" />
                          0-60
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5">
                          {v.specs?.zeroToSixty ? `${v.specs.zeroToSixty}s` : 'N/A'}
                        </div>
                      </div>

                      <div className="bg-dark-900/60 p-2 rounded-xl border border-white/5">
                        <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400 uppercase font-semibold">
                          <Fuel className="w-3 h-3 text-luxury-electric" />
                          Type
                        </div>
                        <div className="text-xs font-bold text-white mt-0.5 truncate">
                          {v.fuelType || 'Gasoline'}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                    
                    {/* Primary Button: PURCHASE (Disabled if quantity is zero as per Kata requirements) */}
                    <button
                      onClick={() => handlePurchaseClick(v)}
                      disabled={isOutOfStock || isBuying}
                      className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                        isOutOfStock
                          ? 'bg-dark-800 text-slate-500 cursor-not-allowed border border-white/5'
                          : 'bg-gradient-to-r from-luxury-gold to-yellow-600 text-black hover:brightness-110 shadow-luxury-gold/20'
                      }`}
                      title={isOutOfStock ? 'Vehicle is out of stock' : 'Purchase vehicle'}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {isBuying ? 'Processing...' : isOutOfStock ? 'Out of Stock' : 'Purchase Vehicle'}
                    </button>

                    {/* Secondary Actions: Compare & View Details */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleCompare(vId)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition border ${
                          isCompared
                            ? 'bg-luxury-electric/20 text-luxury-electric border-luxury-electric/50'
                            : 'bg-dark-900/80 text-slate-300 border-white/10 hover:bg-white/5'
                        }`}
                      >
                        <Scale className="w-3.5 h-3.5" />
                        {isCompared ? 'Compared' : 'Compare'}
                      </button>

                      <button
                        onClick={() => onOpenDetails(v)}
                        className="flex-1 py-2 px-3 rounded-lg text-xs font-semibold bg-dark-900/80 text-slate-300 border border-white/10 hover:bg-white/5 flex items-center justify-center gap-1.5 transition"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Details
                      </button>
                    </div>

                    {/* Admin Actions Bar (Forms/UI to add, update, and delete vehicles, plus restock) */}
                    {currentUser?.role === 'admin' && (
                      <div className="mt-2 pt-2 border-t border-rose-950/40 bg-rose-950/20 p-2 rounded-xl flex items-center justify-between gap-1 text-xs">
                        <span className="text-[10px] font-bold text-rose-400 uppercase tracking-widest pl-1">
                          Admin:
                        </span>

                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => onOpenRestock(v)}
                            className="px-2 py-1 rounded bg-emerald-950/80 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/40 text-[11px] font-semibold flex items-center gap-1"
                            title="Restock vehicle inventory"
                          >
                            <Plus className="w-3 h-3" /> Restock
                          </button>

                          <button
                            onClick={() => onOpenEdit(v)}
                            className="px-2 py-1 rounded bg-blue-950/80 text-blue-300 hover:bg-blue-900 border border-blue-800/40 text-[11px] font-semibold flex items-center gap-1"
                            title="Edit vehicle details"
                          >
                            <Edit2 className="w-3 h-3" /> Edit
                          </button>

                          <button
                            onClick={() => onDelete(v)}
                            className="px-2 py-1 rounded bg-rose-900/80 text-rose-200 hover:bg-rose-800 border border-rose-700/50 text-[11px] font-semibold flex items-center gap-1"
                            title="Delete vehicle permanently"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
