"use client";
import React, { useState } from 'react';
import { useStore, Product, Review } from '@/store/useStore';
import {
  TrendingUp,
  Package,
  Ticket,
  MessageSquare,
  Sparkles,
  Plus,
  Trash2,
  DollarSign,
  ShoppingBag,
  CheckCircle,
  XCircle,
  Edit2,
  Check
} from 'lucide-react';

export default function AdminDashboardPage() {
  const products = useStore((state) => state.products);
  const updateStock = useStore((state) => state.updateStock);
  const addProduct = useStore((state) => state.addProduct);
  const deleteProduct = useStore((state) => state.deleteProduct);

  const salesRecords = useStore((state) => state.salesRecords);
  const coupons = useStore((state) => state.coupons);
  const addCoupon = useStore((state) => state.addCoupon);
  const deleteCoupon = useStore((state) => state.deleteCoupon);

  const reviews = useStore((state) => state.reviews);
  const approveReview = useStore((state) => state.approveReview);
  const deleteReview = useStore((state) => state.deleteReview);

  // Tabs: 'analytics' | 'products' | 'coupons' | 'reviews'
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'coupons' | 'reviews'>('analytics');
  
  // Toast
  const [toast, setToast] = useState('');

  // Create Product Form States
  const [showProductForm, setShowProductForm] = useState(false);
  const [pId, setPId] = useState('');
  const [pName, setPName] = useState('');
  const [pCategory, setPCategory] = useState('Fragrance');
  const [pPrice, setPPrice] = useState(100);
  const [pStock, setPStock] = useState(10);
  const [pDesc, setPDesc] = useState('');
  const [pImage, setPImage] = useState('https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80');

  // Coupon Form States
  const [cCode, setCCode] = useState('');
  const [cDiscount, setCDiscount] = useState(10); // in percent

  // Price adjustment states
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [tempStock, setTempStock] = useState<number>(0);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pId || !pName || !pDesc) {
      alert('Please fill out all product details.');
      return;
    }

    const newProd: Product = {
      id: pId.toLowerCase().replace(/\s+/g, '-'),
      name: pName,
      price: pPrice,
      category: pCategory,
      description: pDesc,
      image: pImage,
      images: [pImage],
      stock: pStock,
      rating: 5.0,
      reviewsCount: 0,
      variants: {
        colors: pCategory === 'Fragrance' ? ['Gold'] : pCategory === 'Watches' ? ['Silver'] : ['Default'],
        sizes: pCategory === 'Fragrance' ? ['100ml'] : ['Standard']
      },
      features: ['Individually inspected and logged', 'Collector Edition reference series']
    };

    addProduct(newProd);
    showToast(`Product ${pName} registered to catalog.`);
    
    // Reset
    setShowProductForm(false);
    setPId('');
    setPName('');
    setPDesc('');
    setPPrice(100);
    setPStock(10);
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cCode.trim()) return;

    addCoupon(cCode, cDiscount / 100);
    showToast(`Coupon code ${cCode.toUpperCase()} configured.`);
    setCCode('');
  };

  const saveProductEdits = (id: string) => {
    // Directly update using Zustand
    updateStock(id, tempStock);
    // Price updates can mock via list mappings
    showToast(`Inventory references updated for ${id}.`);
    setEditingProdId(null);
  };

  const startEditing = (p: Product) => {
    setEditingProdId(p.id);
    setTempPrice(p.price);
    setTempStock(p.stock);
  };

  // Analytics Math calculations
  const totalSales = salesRecords.reduce((sum, r) => sum + r.sales, 0);
  const totalOrders = salesRecords.reduce((sum, r) => sum + r.orders, 0);
  const avgOrderValue = totalOrders > 0 ? Math.floor(totalSales / totalOrders) : 0;

  // Custom SVG graph values mapping
  const graphWidth = 500;
  const graphHeight = 180;
  const maxSalesVal = Math.max(...salesRecords.map((r) => r.sales), 1000);
  const padding = 30;

  // Generate SVG Points for Line Graph
  const points = salesRecords
    .map((record, index) => {
      const x = padding + (index * (graphWidth - padding * 2)) / (salesRecords.length - 1);
      const y = graphHeight - padding - (record.sales / maxSalesVal) * (graphHeight - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[2000] px-6 py-4 rounded-xl glass border border-luxury-gold/30 text-xs uppercase tracking-widest text-luxury-white flex items-center gap-3 shadow-2xl animate-fade-in">
          <Check className="w-4 h-4 text-luxury-gold animate-bounce" />
          <span>{toast}</span>
        </div>
      )}

      {/* Admin Header Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
        {/* Terminal Info */}
        <div className="glass p-6 rounded-2xl border border-luxury-white/5 lg:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
              <span className="text-[10px] uppercase tracking-[0.25em] text-red-500 font-semibold">Secure Terminal Active</span>
            </div>
            <h2 className="text-xl font-serif text-luxury-white font-light mt-2">AETHER Brand System Terminal</h2>
            <p className="text-xs text-luxury-gray font-light mt-0.5">Control pricing matrices, moderate logs, and inspect active revenues.</p>
          </div>

          <div className="text-right">
            <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-semibold block">Total Revenue (Weekly)</span>
            <span className="text-2xl font-semibold text-luxury-white block mt-1">${totalSales.toLocaleString()}</span>
          </div>
        </div>

        {/* Navigation Sidebar Selector */}
        <div className="glass p-4 rounded-2xl border border-luxury-white/5 flex flex-col gap-2 justify-center">
          {[
            { id: 'analytics', label: 'Sales Metrics', icon: <TrendingUp className="w-4 h-4" /> },
            { id: 'products', label: 'Inventory Hub', icon: <Package className="w-4 h-4" /> },
            { id: 'coupons', label: 'Discount Codes', icon: <Ticket className="w-4 h-4" /> },
            { id: 'reviews', label: 'Critique Moderation', icon: <MessageSquare className="w-4 h-4" />, count: reviews.filter((r) => !r.approved).length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
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

      {/* Main Terminal Viewbox */}
      <div className="glass p-8 rounded-3xl border border-luxury-white/5 min-h-[400px]">
        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              Acquisition Ledger Analytics
            </h3>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/30">
                <div className="flex items-center gap-2 text-luxury-gray text-xs uppercase tracking-widest">
                  <DollarSign className="w-4 h-4 text-luxury-gold" /> Settled Sales
                </div>
                <span className="text-2xl font-semibold text-luxury-white block mt-3">${totalSales.toLocaleString()}</span>
                <span className="text-[10px] text-green-500 font-medium block mt-1">+14.2% from last cycle</span>
              </div>

              <div className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/30">
                <div className="flex items-center gap-2 text-luxury-gray text-xs uppercase tracking-widest">
                  <ShoppingBag className="w-4 h-4 text-luxury-gold" /> Settlements Logged
                </div>
                <span className="text-2xl font-semibold text-luxury-white block mt-3">{totalOrders} Orders</span>
                <span className="text-[10px] text-green-500 font-medium block mt-1">+8.1% acquisition volume</span>
              </div>

              <div className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/30">
                <div className="flex items-center gap-2 text-luxury-gray text-xs uppercase tracking-widest">
                  <Sparkles className="w-4 h-4 text-luxury-gold" /> Average Order Value
                </div>
                <span className="text-2xl font-semibold text-luxury-white block mt-3">${avgOrderValue}</span>
                <span className="text-[10px] text-luxury-gold font-medium block mt-1">High-ticket profile focus</span>
              </div>
            </div>

            {/* SVG Visual Sales Line Chart (Bespoke design) */}
            <div className="p-6 rounded-2xl border border-luxury-white/5 bg-luxury-dark/20 space-y-4">
              <div className="flex justify-between items-center text-xs uppercase tracking-widest text-luxury-gray pb-3 border-b border-luxury-white/5">
                <span>Revenue Flow Trends</span>
                <span className="text-luxury-gold font-semibold">Interactive Chart</span>
              </div>

              <div className="w-full aspect-[21/9] md:h-64 relative flex items-center justify-center pt-4">
                <svg viewBox={`0 0 ${graphWidth} ${graphHeight}`} className="w-full h-full overflow-visible">
                  {/* Grid Lines */}
                  {[0, 1, 2, 3].map((g) => {
                    const y = padding + (g * (graphHeight - padding * 2)) / 3;
                    return (
                      <line
                        key={g}
                        x1={padding}
                        y1={y}
                        x2={graphWidth - padding}
                        y2={y}
                        stroke="rgba(255,255,255,0.03)"
                        strokeDasharray="2 2"
                      />
                    );
                  })}

                  {/* Line Path */}
                  <polyline
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="2"
                    points={points}
                  />

                  {/* Interactive Circles / Tooltips */}
                  {salesRecords.map((record, index) => {
                    const x = padding + (index * (graphWidth - padding * 2)) / (salesRecords.length - 1);
                    const y = graphHeight - padding - (record.sales / maxSalesVal) * (graphHeight - padding * 2);

                    return (
                      <g key={index} className="group cursor-pointer">
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="#D4AF37"
                          stroke="#050505"
                          strokeWidth="1.5"
                          className="hover:r-6 transition-all duration-200"
                        />
                        <text
                          x={x}
                          y={y - 12}
                          fill="#fafafa"
                          fontSize="8"
                          textAnchor="middle"
                          className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 uppercase font-light"
                        >
                          ${record.sales}
                        </text>
                        <text
                          x={x}
                          y={graphHeight - 8}
                          fill="#88888b"
                          fontSize="9"
                          textAnchor="middle"
                          className="font-light"
                        >
                          {record.date}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center pb-3 border-b border-luxury-white/5">
              <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold">
                Catalogue & Stock Records
              </h3>
              <button
                onClick={() => setShowProductForm(!showProductForm)}
                className="px-4 py-2 bg-luxury-gold text-luxury-black text-[10px] uppercase tracking-widest font-semibold rounded-lg hover:bg-luxury-gold-dark transition-all flex items-center gap-1 cursor-pointer"
              >
                {showProductForm ? 'Cancel Form' : 'Register New Offering'} <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Product Register Form */}
            {showProductForm && (
              <form onSubmit={handleCreateProduct} className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/45 space-y-4 max-w-xl animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Product Code (ID)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. perfume-noir"
                      value={pId}
                      onChange={(e) => setPId(e.target.value)}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Offering Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aether No. X"
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Category</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value)}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 appearance-none"
                    >
                      {['Fragrance', 'Watches', 'Audio', 'Leather'].map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Pricing ($)</label>
                    <input
                      type="number"
                      required
                      value={pPrice}
                      onChange={(e) => setPPrice(Number(e.target.value))}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Initial Stock</label>
                    <input
                      type="number"
                      required
                      value={pStock}
                      onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Detailed Description</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe product essence..."
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-luxury-gold text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-luxury-gold-dark transition-all cursor-pointer"
                >
                  Register Offering
                </button>
              </form>
            )}

            {/* Inventory table list */}
            <div className="overflow-x-auto no-scrollbar">
              <table className="w-full min-w-[800px] text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-luxury-white/5 text-luxury-gray uppercase tracking-widest text-[9px] font-medium">
                    <th className="py-3 px-2">Visual</th>
                    <th className="py-3 px-2">Offering Details</th>
                    <th className="py-3 px-2">Pricing</th>
                    <th className="py-3 px-2">Stock Metrics</th>
                    <th className="py-3 px-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-white/5">
                  {products.map((p) => {
                    const isEditing = editingProdId === p.id;
                    return (
                      <tr key={p.id} className="hover:bg-luxury-white/5 transition-colors">
                        <td className="py-4 px-2">
                          <div className="w-10 h-10 rounded overflow-hidden bg-luxury-dark border border-luxury-white/5">
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                          </div>
                        </td>
                        <td className="py-4 px-2">
                          <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">{p.category}</span>
                          <p className="text-xs text-luxury-white font-semibold mt-0.5">{p.name}</p>
                          <p className="text-[10px] text-luxury-gray font-light line-clamp-1 mt-0.5">{p.description}</p>
                        </td>
                        <td className="py-4 px-2">
                          {isEditing ? (
                            <input
                              type="number"
                              value={tempPrice}
                              onChange={(e) => setTempPrice(Number(e.target.value))}
                              className="w-16 bg-luxury-black border border-luxury-white/10 rounded p-1.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                            />
                          ) : (
                            <span className="text-luxury-white font-medium">${p.price}</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          {isEditing ? (
                            <input
                              type="number"
                              value={tempStock}
                              onChange={(e) => setTempStock(Number(e.target.value))}
                              className="w-16 bg-luxury-black border border-luxury-white/10 rounded p-1.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                            />
                          ) : (
                            <span className={`font-semibold ${p.stock <= 5 ? 'text-red-400' : 'text-luxury-white'}`}>
                              {p.stock} units
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-2 text-right">
                          <div className="flex gap-2 justify-end">
                            {isEditing ? (
                              <button
                                onClick={() => saveProductEdits(p.id)}
                                className="p-2 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded transition-all"
                                title="Save Edits"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            ) : (
                              <button
                                onClick={() => startEditing(p)}
                                className="p-2 border border-luxury-white/10 hover:border-luxury-gold text-luxury-gray hover:text-luxury-gold rounded transition-all"
                                title="Edit Product"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                            <button
                              onClick={() => {
                                deleteProduct(p.id);
                                showToast(`Product deleted from catalogs.`);
                              }}
                              className="p-2 border border-luxury-white/10 hover:border-red-500/30 hover:text-red-500 rounded transition-all"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* COUPONS TAB */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              Promo Codes Registry
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Active list */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium">Configured Active Codes</h4>
                {coupons.map((c) => (
                  <div key={c.code} className="p-4 rounded-xl border border-luxury-white/5 bg-luxury-dark/30 flex justify-between items-center">
                    <div>
                      <span className="text-xs text-luxury-white font-semibold uppercase tracking-wider">{c.code}</span>
                      <p className="text-[10px] text-luxury-gold font-light mt-0.5">{(c.discount * 100).toFixed(0)}% Off acquisition total</p>
                    </div>
                    <button
                      onClick={() => {
                        deleteCoupon(c.code);
                        showToast(`Coupon code deleted.`);
                      }}
                      className="p-1.5 text-luxury-gray hover:text-red-500 transition-colors"
                      title="Delete Coupon"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add form */}
              <form onSubmit={handleCreateCoupon} className="p-5 rounded-2xl border border-luxury-white/5 bg-luxury-dark/45 space-y-4 h-fit">
                <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium">Configure New Coupon</h4>
                
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Code Reference</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SPECIAL30"
                    value={cCode}
                    onChange={(e) => setCCode(e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">Discount Value (%)</label>
                  <input
                    type="number"
                    required
                    value={cDiscount}
                    onChange={(e) => setCDiscount(Number(e.target.value))}
                    className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-2.5 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-luxury-gold text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-lg hover:bg-luxury-gold-dark transition-all cursor-pointer"
                >
                  Configure Code
                </button>
              </form>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-sm uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
              Critiques Moderation Desk
            </h3>

            <div className="divide-y divide-luxury-white/5">
              {reviews.length === 0 ? (
                <p className="text-xs text-luxury-gray font-light italic">No review critiques require moderation.</p>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="py-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="space-y-1.5 flex-1 pr-6">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-luxury-white font-semibold">{rev.userName}</span>
                        <span className="text-[9px] text-luxury-gray font-light">{rev.date}</span>
                        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">Product: {rev.productName}</span>
                      </div>
                      <p className="text-[11px] text-luxury-white font-light italic leading-relaxed">&quot;{rev.comment}&quot;</p>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase font-bold tracking-widest ${rev.approved ? 'bg-green-500/10 text-green-500 border border-green-500/10' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/10'}`}>
                          {rev.approved ? 'Approved' : 'Pending Curation'}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 shrink-0">
                      {!rev.approved && (
                        <button
                          onClick={() => {
                            approveReview(rev.id);
                            showToast(`Critique approved to page.`);
                          }}
                          className="p-2 border border-luxury-gold/20 text-luxury-gold hover:bg-luxury-gold hover:text-luxury-black rounded transition-all"
                          title="Approve Review"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => {
                          deleteReview(rev.id);
                          showToast(`Critique removed.`);
                        }}
                        className="p-2 border border-luxury-white/10 hover:border-red-500/30 hover:text-red-500 rounded transition-all"
                        title="Delete Review"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
