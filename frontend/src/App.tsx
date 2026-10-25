import React, { useState, useEffect } from 'react';
import type { User, Vehicle } from './types';
import {
  fetchVehicles,
  searchVehiclesApi,
  purchaseVehicleApi,
  getStoredUser,
  getStoredToken,
  clearSession,
  loginUser,
} from './services/api';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VehicleCatalog } from './components/VehicleCatalog';
import { CompareModal } from './components/CompareModal';
import { VehicleModal } from './components/VehicleModal';
import { AdminPortal } from './components/AdminPortal';
import { AiConcierge } from './components/AiConcierge';
import { NewsSection } from './components/NewsSection';
import { CustomBuildStudio } from './components/CustomBuildStudio';
import { AuthModal } from './components/AuthModal';
import { CheckCircle2, AlertCircle, Sparkles, Scale, Car } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(getStoredUser());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [activeTab, setActiveTab] = useState<string>('showroom');
  const [comparedIds, setComparedIds] = useState<string[]>([]);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [selectedVehicleForModal, setSelectedVehicleForModal] = useState<Vehicle | null>(null);
  const [adminModal, setAdminModal] = useState<{
    mode: 'create' | 'edit' | 'restock' | 'delete' | null;
    vehicle: Vehicle | null;
  }>({ mode: null, vehicle: null });
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Initial load
  const loadVehicles = async () => {
    try {
      const data = await fetchVehicles();
      setVehicles(data);
    } catch (err: any) {
      console.warn('Initial vehicles fetch notice:', err.message);
    }
  };

  useEffect(() => {
    // If not logged in yet, perform quick auto-login with customer account for instant showcase
    const token = getStoredToken();
    if (!token) {
      loginUser({ email: 'customer@dealership.com', password: 'CustomerPassword123!' })
        .then((res) => {
          setCurrentUser(res.user);
          loadVehicles();
        })
        .catch(() => {
          loadVehicles();
        });
    } else {
      loadVehicles();
    }
  }, []);

  // Search handler
  const handleSearch = async (params: { make?: string; model?: string; category?: string; minPrice?: number; maxPrice?: number }) => {
    setIsSearching(true);
    try {
      const results = await searchVehiclesApi(params);
      setVehicles(results);
    } catch (err: any) {
      showNotification(err.message || 'Search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  // Purchase handler
  const handlePurchase = async (v: Vehicle) => {
    const vId = v.id || (v as any)._id;
    try {
      const updated = await purchaseVehicleApi(vId);
      showNotification(`Purchase confirmed! 1 unit of ${v.make} ${v.model} acquired.`, 'success');
      // Update local state
      setVehicles((prev) =>
        prev.map((item) => ((item.id || (item as any)._id) === vId ? updated : item))
      );
      if (selectedVehicleForModal && (selectedVehicleForModal.id || (selectedVehicleForModal as any)._id) === vId) {
        setSelectedVehicleForModal(updated);
      }
    } catch (err: any) {
      showNotification(err.message || 'Purchase failed', 'error');
    }
  };

  // Compare toggle
  const handleToggleCompare = (id: string) => {
    setComparedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        if (prev.length >= 4) {
          showNotification('You can compare up to 4 vehicles simultaneously.', 'error');
          return prev;
        }
        showNotification('Added to comparison deck!', 'success');
        return [...prev, id];
      }
    });
  };

  // Quick demo role switch
  const handleQuickRoleSwitch = async (role: 'customer' | 'admin') => {
    try {
      if (role === 'admin') {
        const res = await loginUser({ email: 'admin@dealership.com', password: 'AdminPassword123!' });
        setCurrentUser(res.user);
        showNotification('Switched to Dealership Admin privilege session.', 'success');
      } else {
        const res = await loginUser({ email: 'customer@dealership.com', password: 'CustomerPassword123!' });
        setCurrentUser(res.user);
        showNotification('Switched to Customer VIP session.', 'success');
      }
      loadVehicles();
    } catch (err: any) {
      showNotification(err.message || 'Role switch failed', 'error');
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentUser(null);
    showNotification('Signed out of session.', 'success');
  };

  // Compared vehicles objects
  const comparedVehicles = vehicles.filter((v) => comparedIds.includes(v.id || (v as any)._id));

  return (
    <div className="min-h-screen bg-dark-950 text-slate-100 flex flex-col font-sans selection:bg-luxury-gold selection:text-black">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-24 right-6 z-50 animate-bounce">
          <div
            className={`px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-xl border flex items-center gap-3 text-sm font-semibold ${
              notification.type === 'success'
                ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/50'
                : 'bg-rose-950/90 text-rose-200 border-rose-500/50'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        currentUser={currentUser}
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'compare') {
            setIsCompareOpen(true);
          }
        }}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        compareCount={comparedIds.length}
        onQuickRoleSwitch={handleQuickRoleSwitch}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'showroom' && (
          <>
            <HeroSection
              onExplore={() => {
                const el = document.getElementById('showroom');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              onOpenConcierge={() => setActiveTab('concierge')}
              totalVehicles={vehicles.length}
            />

            <VehicleCatalog
              vehicles={vehicles}
              currentUser={currentUser}
              onPurchase={handlePurchase}
              onOpenDetails={(v) => setSelectedVehicleForModal(v)}
              onOpenEdit={(v) => setAdminModal({ mode: 'edit', vehicle: v })}
              onOpenRestock={(v) => setAdminModal({ mode: 'restock', vehicle: v })}
              onDelete={(v) => setAdminModal({ mode: 'delete', vehicle: v })}
              onOpenCreate={() => setAdminModal({ mode: 'create', vehicle: null })}
              comparedIds={comparedIds}
              onToggleCompare={handleToggleCompare}
              onSearch={handleSearch}
              isSearching={isSearching}
            />
          </>
        )}

        {activeTab === 'concierge' && (
          <AiConcierge
            onOpenVehicleDetails={(v) => setSelectedVehicleForModal(v)}
            onPurchase={handlePurchase}
          />
        )}

        {activeTab === 'studio' && (
          <CustomBuildStudio onNotify={showNotification} />
        )}

        {activeTab === 'news' && (
          <NewsSection />
        )}

        {activeTab === 'admin' && currentUser?.role === 'admin' && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
              <div>
                <span className="text-xs font-bold text-rose-400 uppercase tracking-widest">
                  Dealership Management
                </span>
                <h2 className="text-3xl font-extrabold font-['Outfit'] text-white">
                  Administrator Inventory Suite
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Manage inventory stock, adjust MSRP pricing, and commission new vehicles into the catalog.
                </p>
              </div>

              <button
                onClick={() => setAdminModal({ mode: 'create', vehicle: null })}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg shadow-emerald-900/40"
              >
                <Sparkles className="w-4 h-4" /> Add Vehicle
              </button>
            </div>

            {/* Inventory Table */}
            <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-dark-900 text-slate-400 uppercase tracking-wider text-[11px] border-b border-white/10">
                    <tr>
                      <th className="px-6 py-4">Vehicle</th>
                      <th className="px-6 py-4">Category</th>
                      <th className="px-6 py-4">Price</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {vehicles.map((v) => (
                      <tr key={v.id || (v as any)._id} className="hover:bg-white/5 transition">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <img
                            src={v.imageUrl || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70'}
                            alt={v.model}
                            className="w-12 h-9 object-cover rounded-lg shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">
                              {v.make} {v.model}
                            </div>
                            <div className="text-[11px] text-slate-400">{v.year || 2024} • {v.fuelType || 'Gasoline'}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-300">{v.category}</td>
                        <td className="px-6 py-4 font-bold text-white">${v.price.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                              v.quantity <= 0
                                ? 'bg-rose-950 text-rose-300 border border-rose-500/40'
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                            }`}
                          >
                            {v.quantity} Units
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => setAdminModal({ mode: 'restock', vehicle: v })}
                            className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/50 text-xs font-semibold"
                          >
                            Restock
                          </button>
                          <button
                            onClick={() => setAdminModal({ mode: 'edit', vehicle: v })}
                            className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 hover:bg-blue-900 border border-blue-700/50 text-xs font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => setAdminModal({ mode: 'delete', vehicle: v })}
                            className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 hover:bg-rose-900 border border-rose-700/50 text-xs font-semibold"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Floating Compare Drawer Bar */}
      {comparedIds.length > 0 && !isCompareOpen && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
          <button
            onClick={() => setIsCompareOpen(true)}
            className="glass-panel px-6 py-3 rounded-full border border-luxury-gold/50 bg-black/90 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-3 shadow-2xl hover:scale-105 transition-all"
          >
            <Scale className="w-4 h-4 text-luxury-gold" />
            <span>Compare Deck ({comparedIds.length} Vehicles)</span>
            <span className="bg-luxury-gold text-black px-2 py-0.5 rounded-full text-[10px] font-extrabold">
              Open &rarr;
            </span>
          </button>
        </div>
      )}

      {/* Compare Modal */}
      {isCompareOpen && (
        <CompareModal
          vehicles={comparedVehicles}
          onClose={() => setIsCompareOpen(false)}
          onRemove={(id) => setComparedIds((prev) => prev.filter((item) => item !== id))}
          onClear={() => {
            setComparedIds([]);
            setIsCompareOpen(false);
          }}
          onPurchase={handlePurchase}
        />
      )}

      {/* Vehicle Details Modal */}
      {selectedVehicleForModal && (
        <VehicleModal
          vehicle={selectedVehicleForModal}
          currentUser={currentUser}
          onClose={() => setSelectedVehicleForModal(null)}
          onPurchase={handlePurchase}
          onOpenRestock={(v) => {
            setSelectedVehicleForModal(null);
            setAdminModal({ mode: 'restock', vehicle: v });
          }}
        />
      )}

      {/* Admin Portal Modal */}
      <AdminPortal
        mode={adminModal.mode}
        targetVehicle={adminModal.vehicle}
        onClose={() => setAdminModal({ mode: null, vehicle: null })}
        onSuccess={(msg) => {
          showNotification(msg, 'success');
          loadVehicles();
        }}
        onError={(msg) => showNotification(msg, 'error')}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showNotification(`Signed in as ${user.name} (${user.role}).`, 'success');
          loadVehicles();
        }}
        onError={(msg) => showNotification(msg, 'error')}
      />

      {/* Footer */}
      <footer className="border-t border-white/10 bg-dark-950 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-luxury-gold" />
            <span className="font-bold text-white tracking-widest font-['Outfit']">AURA MOTORS</span>
            <span>• Full-Stack Car Dealership Inventory System</span>
          </div>

          <div className="text-slate-400">
            TDD Kata Assessment • Built with TypeScript, Node.js, Express, MongoDB & React
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
