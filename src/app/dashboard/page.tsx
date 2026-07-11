"use client";
import React, { useState, useEffect } from 'react';
import { useStore, Order, Address, Product } from '@/store/useStore';
import {
  User,
  ShoppingBag,
  Heart,
  MapPin,
  Bell,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  RotateCcw,
  Truck,
  Trash2,
  CheckCircle,
  Eye,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function CustomerDashboardPage() {
  const user = useStore((state) => state.user);
  const login = useStore((state) => state.login);
  const logout = useStore((state) => state.logout);
  const addAddress = useStore((state) => state.addAddress);
  const removeAddress = useStore((state) => state.removeAddress);
  const requestRefund = useStore((state) => state.requestRefund);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const currencySymbol = useStore((state) => state.currencySymbol);
  const currency = useStore((state) => state.currency);
  const notifications = useStore((state) => state.notifications);
  const markNotificationsRead = useStore((state) => state.markNotificationsRead);

  const getConversionMultiplier = () => {
    if (currency === 'EUR') return 0.92;
    if (currency === 'GBP') return 0.79;
    if (currency === 'INR') return 83.5;
    return 1;
  };
  const mult = getConversionMultiplier();

  // Tabs: 'profile' | 'orders' | 'wishlist' | 'notifications'
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'wishlist' | 'notifications'>('profile');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Address Inputs
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [addrLabel, setAddrLabel] = useState('Home');
  const [addrName, setAddrName] = useState('');
  const [addrStreet, setAddrStreet] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrPost, setAddrPost] = useState('');
  const [addrCountry, setAddrCountry] = useState('');

  // Login inputs (if guest wants to log in as another collector)
  const [isLoggedOut, setIsLoggedOut] = useState(!user);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginName, setLoginName] = useState('');

  // Toast
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (user) {
      setIsLoggedOut(false);
    } else {
      setIsLoggedOut(true);
    }
  }, [user]);

  // Mark all notifications read when entering that tab
  useEffect(() => {
    if (activeTab === 'notifications') {
      markNotificationsRead();
    }
  }, [activeTab]);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginName) return;
    login(loginEmail, loginName);
    setToast(`Logged in successfully as ${loginName}`);
    setTimeout(() => setToast(''), 3000);
  };

  const handleAddAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrPost || !addrCountry) return;

    addAddress({
      label: addrLabel,
      fullName: addrName || user?.name || 'Collector',
      street: addrStreet,
      city: addrCity,
      postalCode: addrPost,
      country: addrCountry
    });

    setToast('Courier address cataloged.');
    setTimeout(() => setToast(''), 3000);
    
    // Reset form
    setShowAddressForm(false);
    setAddrStreet('');
    setAddrCity('');
    setAddrPost('');
    setAddrCountry('');
  };

  const handleRefund = (orderId: string) => {
    requestRefund(orderId);
    setToast(`Refund request logged for order ${orderId}.`);
    setTimeout(() => setToast(''), 3000);
    // Refresh active order detail view if open
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, status: 'Refund Requested' } : null);
    }
  };

  if (isLoggedOut) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <div className="glass p-8 rounded-3xl border border-luxury-white/5 space-y-6">
          <div className="flex justify-center">
            <User className="w-12 h-12 text-luxury-gold stroke-[1]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-serif text-luxury-white font-light">Collector Room Authorization</h2>
            <p className="text-xs text-luxury-gray font-light leading-relaxed">
              Authenticate your identity to view points logs, track active orders, or manage delivery registries.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Collector Name</label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                className="w-full bg-luxury-black border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Secure Email Address</label>
              <input
                type="email"
                required
                placeholder="collector@aether.luxury"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-luxury-black border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 shadow-md cursor-pointer"
            >
              Access Vault
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Active unread notification counts
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[2000] px-6 py-4 rounded-xl glass border border-luxury-gold/30 text-xs uppercase tracking-widest text-luxury-white flex items-center gap-3 shadow-2xl animate-fade-in">
          <Check className="w-4 h-4 text-luxury-gold animate-bounce" />
          <span>{toast}</span>
        </div>
      )}

      {/* Dashboard Grid Header */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* User Card */}
        <div className="glass p-6 rounded-2xl border border-luxury-white/5 md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex gap-4 items-center">
            <div className="w-16 h-16 rounded-full bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center">
              <User className="w-8 h-8 text-luxury-gold stroke-[1]" />
            </div>
            <div>
              <h2 className="text-xl font-serif text-luxury-white font-light">{user?.name}</h2>
              <p className="text-xs text-luxury-gray font-light mt-0.5">{user?.email}</p>
            </div>
          </div>

          <div className="flex gap-6 items-center">
            <div className="text-right">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold flex items-center justify-end gap-1">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Collector points
              </span>
              <span className="text-2xl font-semibold text-luxury-white block mt-1">{user?.points} pts</span>
            </div>
            <button
              onClick={() => {
                logout();
                setIsLoggedOut(true);
              }}
              className="px-4 py-2 border border-luxury-white/10 hover:border-red-500/30 hover:text-red-500 rounded-lg text-[10px] uppercase tracking-widest text-luxury-gray transition-all"
            >
              De-authorize
            </button>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="glass p-4 rounded-2xl border border-luxury-white/5 flex flex-col gap-2 justify-center">
          {[
            { id: 'profile', label: 'Collector Profile', icon: <User className="w-4 h-4" /> },
            { id: 'orders', label: 'Acquisitions Log', icon: <ShoppingBag className="w-4 h-4" /> },
            { id: 'wishlist', label: 'Favorites Vault', icon: <Heart className="w-4 h-4" /> },
            { id: 'notifications', label: 'System Notice', icon: <Bell className="w-4 h-4" />, count: unreadCount }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedOrder(null);
              }}
              className={`w-full py-2.5 px-4 rounded-xl flex items-center justify-between text-xs uppercase tracking-widest transition-all duration-200 cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-luxury-gold text-luxury-black font-semibold'
                  : 'text-luxury-gray hover:text-luxury-white hover:bg-luxury-white/5 font-light'
              }`}
            >
              <div className="flex gap-2 items-center">
                {tab.icon}
                <span>{tab.label}</span>
              </div>
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${activeTab === tab.id ? 'bg-luxury-black text-luxury-gold' : 'bg-luxury-gold text-luxury-black'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Panels */}
      <div className="glass p-8 rounded-3xl border border-luxury-white/5 min-h-[400px]">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              Collector Registry Details
            </h3>

            {/* Address Catalog */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-luxury-gold" /> Registered Drop-off Locations
                </h4>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className="px-3 py-1.5 border border-luxury-gold/30 hover:border-luxury-gold text-luxury-gold rounded-lg text-[10px] uppercase tracking-widest font-light transition-all"
                >
                  {showAddressForm ? 'Cancel Catalog' : 'Catalog New Address'}
                </button>
              </div>

              {/* Address Register Form */}
              {showAddressForm && (
                <form onSubmit={handleAddAddressSubmit} className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/40 space-y-4 max-w-xl">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Location Label</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Office, Vacation Home"
                        value={addrLabel}
                        onChange={(e) => setAddrLabel(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Recipient Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Full name"
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Street and Apt No."
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">City</label>
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Postal Code</label>
                      <input
                        type="text"
                        required
                        placeholder="ZIP"
                        value={addrPost}
                        onChange={(e) => setAddrPost(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Country</label>
                      <input
                        type="text"
                        required
                        placeholder="Country"
                        value={addrCountry}
                        onChange={(e) => setAddrCountry(e.target.value)}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-luxury-gold text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-luxury-gold-dark transition-all cursor-pointer"
                  >
                    Catalog Registry
                  </button>
                </form>
              )}

              {/* Address List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user?.savedAddresses.length === 0 ? (
                  <p className="text-xs text-luxury-gray font-light italic">No registered courier destinations yet.</p>
                ) : (
                  user?.savedAddresses.map((addr) => (
                    <div key={addr.id} className="p-4 rounded-xl border border-luxury-white/5 bg-luxury-dark/30 flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold">{addr.label}</span>
                        <p className="text-xs text-luxury-white font-medium mt-1">{addr.fullName}</p>
                        <p className="text-[11px] text-luxury-gray font-light mt-0.5">{addr.street}, {addr.city}</p>
                        <p className="text-[11px] text-luxury-gray font-light">{addr.postalCode}, {addr.country}</p>
                      </div>
                      <button
                        onClick={() => removeAddress(addr.id)}
                        className="p-1.5 text-luxury-gray hover:text-red-500 transition-colors"
                        title="Delete Address"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {!selectedOrder ? (
              /* ORDERS LIST */
              <>
                <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
                  Heritage Acquisition History
                </h3>
                {user?.orders.length === 0 ? (
                  <p className="text-xs text-luxury-gray font-light italic">No acquisition references logged in your catalog.</p>
                ) : (
                  <div className="divide-y divide-luxury-white/5">
                    {user?.orders.map((order) => (
                      <div
                        key={order.id}
                        className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-luxury-white/5 px-2 rounded-xl transition-all"
                      >
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-xs uppercase tracking-widest text-luxury-white font-medium">{order.id}</span>
                            <span className="text-[10px] text-luxury-gray font-light">{order.date}</span>
                          </div>
                          <p className="text-[10px] text-luxury-gray font-light mt-1 uppercase tracking-wider">
                            Settlement: {order.paymentMethod}
                          </p>
                        </div>

                        <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-right">
                            <span className="text-xs font-semibold text-luxury-gold">{currencySymbol}{order.total}</span>
                            <span className={`block text-[9px] uppercase tracking-widest mt-1 font-semibold ${
                              order.status === 'Delivered'
                                ? 'text-green-500'
                                : order.status === 'Processing'
                                ? 'text-luxury-gold'
                                : order.status === 'Refund Requested'
                                ? 'text-red-400'
                                : 'text-blue-400'
                            }`}>
                              {order.status}
                            </span>
                          </div>

                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-4 py-2 border border-luxury-white/10 hover:border-luxury-gold text-luxury-white hover:text-luxury-gold text-[10px] uppercase tracking-widest font-light rounded-lg flex items-center gap-1.5 transition-all"
                          >
                            Track <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* DETAILED ORDER TRACKER & REFUND INITIATOR */
              <div className="space-y-8">
                <div className="flex justify-between items-center pb-3 border-b border-luxury-white/5">
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-[10px] text-luxury-gray hover:text-luxury-white flex items-center gap-1 uppercase tracking-widest font-light"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to acquisitions list
                  </button>
                  <span className="text-xs text-luxury-gold font-medium uppercase tracking-widest">Order Ledger {selectedOrder.id}</span>
                </div>

                {/* Shipment progress timeline tracker */}
                <div className="p-6 rounded-2xl bg-luxury-dark/30 border border-luxury-white/5 space-y-6">
                  <div className="flex justify-between items-center text-xs text-luxury-gray uppercase tracking-widest">
                    <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-luxury-gold" /> Shipment Status</span>
                    <span>Waybill: <span className="text-luxury-white">{selectedOrder.tracking}</span></span>
                  </div>

                   {/* Shipment progress tracker bar */}
                  <div className="grid grid-cols-4 gap-1 md:gap-2 relative pt-8 pb-4">
                    {/* Background track line */}
                    <div className="absolute top-[48px] left-[12%] right-[12%] h-0.5 bg-luxury-white/10 z-0" />
                    {/* Active highlight line */}
                    <div
                      className="absolute top-[48px] left-[12%] h-0.5 bg-luxury-gold z-0 transition-all duration-500"
                      style={{
                        width:
                          selectedOrder.status === 'Processing'
                            ? '0%'
                            : selectedOrder.status === 'Shipped'
                            ? '33%'
                            : selectedOrder.status === 'Delivered'
                            ? '100%'
                            : '0%'
                      }}
                    />

                    {[
                      { id: 'Processing', label: 'Acquired Logs' },
                      { id: 'Shipped', label: 'In Transit' },
                      { id: 'Out for Delivery', label: 'Courier Hand' },
                      { id: 'Delivered', label: 'Arrived Desk' }
                    ].map((step, idx) => {
                      const isComplete =
                        selectedOrder.status === 'Delivered' ||
                        (selectedOrder.status === 'Shipped' && idx <= 1) ||
                        (selectedOrder.status === 'Processing' && idx === 0);

                      return (
                        <div key={step.id} className="flex flex-col items-center text-center relative z-10">
                          <div
                            className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300 ${
                              isComplete
                                ? 'bg-luxury-gold text-luxury-black border-luxury-gold'
                                : 'bg-luxury-black text-luxury-gray border-luxury-white/10'
                            }`}
                          >
                            {isComplete ? <Check className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span className={`text-[8px] md:text-[9px] uppercase tracking-widest mt-2 font-medium ${isComplete ? 'text-luxury-gold' : 'text-luxury-gray'} line-clamp-2 max-w-[80px]`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Items in order */}
                <div className="space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium">Acquired Articles</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedOrder.items.map((item) => (
                      <div key={item.id} className="p-4 rounded-xl border border-luxury-white/5 flex gap-4 items-center">
                        <div className="w-12 h-12 rounded bg-luxury-black overflow-hidden border border-luxury-white/5 shrink-0">
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-xs text-luxury-white font-medium">{item.name}</p>
                          <p className="text-[10px] text-luxury-gray font-light mt-0.5">Qty {item.quantity} | {item.size}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Return request initiator */}
                <div className="pt-6 border-t border-luxury-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium flex items-center gap-1.5">
                      <RotateCcw className="w-4 h-4 text-luxury-gold" /> Returns / Exchange Covenant
                    </h4>
                    <p className="text-[10px] text-luxury-gray font-light mt-1 max-w-lg leading-relaxed">
                      If you wish to return unopened fragrances, unworn watches, or pristine bags, you can trigger a direct courier recall within 30 days.
                    </p>
                  </div>

                  {selectedOrder.status === 'Delivered' ? (
                    <button
                      onClick={() => handleRefund(selectedOrder.id)}
                      className="px-4 py-2.5 border border-red-500/30 hover:border-red-500 text-red-500 rounded-lg text-[10px] uppercase tracking-widest font-light transition-all duration-300"
                    >
                      Request Recall Return
                    </button>
                  ) : selectedOrder.status === 'Refund Requested' ? (
                    <span className="px-3 py-1.5 rounded-lg bg-red-500/10 text-red-400 text-[10px] uppercase tracking-widest font-semibold border border-red-500/10 animate-pulse">
                      Recall active / evaluating
                    </span>
                  ) : (
                    <span className="text-[10px] text-luxury-gray font-light italic">
                      Refunds triggerable upon delivery completion.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              Collector Vault Favorites
            </h3>
            {wishlist.length === 0 ? (
              <p className="text-xs text-luxury-gray font-light italic">Your favorites vault is currently vacant.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {wishlist.map((p) => (
                  <div key={p.id} className="p-4 rounded-xl border border-luxury-white/5 bg-luxury-dark/30 flex flex-col justify-between h-fit relative">
                    <div className="aspect-[4/3] rounded-lg overflow-hidden bg-luxury-black mb-3 relative">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleWishlist(p)}
                        className="absolute top-2 right-2 p-1.5 rounded-full bg-luxury-black/80 hover:text-red-500 text-luxury-gold transition-colors"
                        title="Remove Favorite"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">{p.category}</span>
                      <h4 className="text-xs text-luxury-white font-medium mt-0.5">{p.name}</h4>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-luxury-white/5">
                      <span className="text-xs text-luxury-white font-semibold">
                        {currencySymbol}
                        {Math.floor(p.price * mult)}
                      </span>
                      <Link
                        href={`/product/${p.id}`}
                        className="px-3 py-1.5 bg-luxury-white/5 hover:bg-luxury-gold hover:text-luxury-black text-[9px] uppercase tracking-widest rounded transition-all"
                      >
                        Inspect offering
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* NOTIFICATIONS TAB */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              System notice transmissions
            </h3>
            {notifications.length === 0 ? (
              <p className="text-xs text-luxury-gray font-light italic">No notifications logged.</p>
            ) : (
              <div className="space-y-3">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-4 rounded-xl border border-luxury-white/5 bg-luxury-dark/20 flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-luxury-white font-light leading-relaxed">{notif.message}</p>
                      <span className="text-[8px] text-luxury-gray font-light tracking-wider block">{notif.date}</span>
                    </div>
                    {!notif.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-1 shrink-0 animate-ping" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
