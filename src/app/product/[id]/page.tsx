"use client";
import React, { use, useState, useEffect } from 'react';
import { useStore, Product } from '@/store/useStore';
import {
  Star,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  ChevronDown,
  Sparkles,
  ArrowRight,
  Check,
  Plus,
  Minus
} from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import 3D models to bypass SSR issues
const ProductFragrance = dynamic(() => import('@/components/canvas/ProductFragrance'), { ssr: false });
const ProductWatch = dynamic(() => import('@/components/canvas/ProductWatch'), { ssr: false });

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const products = useStore((state) => state.products);
  const addItem = useStore((state) => state.addItem);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const addReview = useStore((state) => state.addReview);
  const allReviews = useStore((state) => state.reviews);
  const currencySymbol = useStore((state) => state.currencySymbol);
  const currency = useStore((state) => state.currency);

  const product = products.find((p) => p.id === id);

  // States
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [postcode, setPostcode] = useState('');
  const [deliveryResult, setDeliveryResult] = useState('');
  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [showStickyBar, setShowStickyBar] = useState(false);

  // Review Form States
  const [reviewName, setReviewName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  // Toast State
  const [toastMessage, setToastMessage] = useState('');

  // 360 Viewer drag rotation state
  const [dragProgress, setDragProgress] = useState(0);
  const [is360Active, setIs360Active] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedColor(product.variants.colors[0] || '');
      setSelectedSize(product.variants.sizes[0] || '');
    }
  }, [product]);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky bar once scrolled past 600px
      setShowStickyBar(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-2xl font-serif text-luxury-white">Offering Not Found</h2>
        <p className="text-xs text-luxury-gray mt-2">This luxury reference code does not exist in our logs.</p>
        <Link href="/" className="mt-6 px-6 py-3 bg-luxury-gold text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl">
          Return to Curation
        </Link>
      </div>
    );
  }

  // Conversion calculations
  const getConversionMultiplier = () => {
    if (currency === 'EUR') return 0.92;
    if (currency === 'GBP') return 0.79;
    if (currency === 'INR') return 83.5;
    return 1;
  };
  const mult = getConversionMultiplier();
  const convertedPrice = Math.floor(product.price * mult);

  // Cart / Buy Now actions
  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      color: selectedColor,
      size: selectedSize,
      stock: product.stock
    });
    setToastMessage(`${product.name} (${selectedSize}) added to bag.`);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const handleBuyNow = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity,
      color: selectedColor,
      size: selectedSize,
      stock: product.stock
    });
    window.location.href = '/checkout';
  };

  // ZIP Code Delivery checker
  const checkDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postcode.trim()) return;
    const days = Math.floor(Math.random() * 2) + 1;
    const dateStr = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
    setDeliveryResult(`Guaranteed Complimentary Courier Delivery by ${dateStr}.`);
  };

  // FAQs
  const faqs = [
    { q: 'Complimentary Bespoke Gift Wrapping', a: 'Every purchase is enclosed in our signature textured charcoal presentation boxes with velvet cushions and individually hand-sealed log cards.' },
    { q: 'Global Express Shipments & Duties', a: 'We ship DDP (Delivery Duty Paid) globally via premium carbon-neutral DHL or FedEx air. Custom clearances are managed directly by AETHER.' },
    { q: 'Returns & Exchange Covenant', a: 'We accept returns of un-opened bottles, bags with security seals intact, and unworn timepieces within 30 days. We arrange direct home pick-up on demand.' }
  ];

  // Submit Review
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName.trim() || !reviewComment.trim()) return;

    addReview(product.id, product.name, reviewName, reviewRating, reviewComment);
    setReviewSuccess(true);
    setReviewName('');
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
  };

  // Filter reviews matching current product
  const reviews = allReviews.filter((r) => r.productId === product.id && r.approved);
  const relatedProducts = products.filter((p) => p.id !== product.id).slice(0, 3);
  const isInWishlist = wishlist.some((p) => p.id === product.id);

  // Handle Drag on 360 Viewer
  const handle360Drag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!is360Active) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.min(1, Math.max(0, x / rect.width));
    setDragProgress(pct);

    // Map drag progress (0-1) to image index
    const imgCount = product.images.length;
    const index = Math.min(imgCount - 1, Math.floor(pct * imgCount));
    setActiveImageIdx(index);
  };

  return (
    <div className="relative w-full pb-24">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 right-6 z-[2000] px-6 py-4 rounded-xl glass border border-luxury-gold/30 text-xs uppercase tracking-widest text-luxury-white flex items-center gap-3 shadow-2xl animate-fade-in-up">
          <Check className="w-4 h-4 text-luxury-gold animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main product overview */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Left Column: Media Presentation */}
        <div className="space-y-6">
          {/* Main Visual Display */}
          <div className="aspect-[5/6] rounded-3xl overflow-hidden bg-luxury-dark border border-luxury-white/5 relative group">
            {/* Interactive 3D Canvas toggle */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <span className="bg-luxury-black/70 backdrop-blur-md px-3 py-1.5 rounded-full text-[9px] uppercase tracking-widest text-luxury-gold font-semibold border border-luxury-white/5">
                Collector Asset
              </span>
            </div>

            {/* 3D Model Display */}
            {product.id === 'aether-no-ix' ? (
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <ProductFragrance hoverColor="#D4AF37" />
              </div>
            ) : product.id === 'chronos-chronograph' ? (
              <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
                <ProductWatch hoverColor="#D4AF37" />
              </div>
            ) : (
              // 360° Drag Viewer or Static Image Zoom
              <div
                onMouseDown={() => setIs360Active(true)}
                onMouseUp={() => setIs360Active(false)}
                onMouseLeave={() => setIs360Active(false)}
                onMouseMove={handle360Drag}
                className="w-full h-full relative cursor-ew-resize select-none overflow-hidden"
              >
                <img
                  src={product.images[activeImageIdx]}
                  alt={`${product.name} frame ${activeImageIdx}`}
                  className="w-full h-full object-cover transition-transform duration-300 pointer-events-none group-hover:scale-105"
                />
                {/* 360 Overlay HUD */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 glass rounded-full border border-luxury-white/10 text-[9px] uppercase tracking-widest text-luxury-white flex items-center gap-1.5 pointer-events-none shadow-lg">
                  <Sparkles className="w-3.5 h-3.5 text-luxury-gold" /> Drag left/right for 360° view
                </div>
              </div>
            )}
          </div>

          {/* Thumbnail Gallery Row */}
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveImageIdx(idx);
                  setIs360Active(false); // Reset 360 if selecting thumbnail
                }}
                className={`aspect-[4/3] rounded-xl overflow-hidden bg-luxury-dark border transition-all duration-300 ${
                  activeImageIdx === idx && !is360Active
                    ? 'border-luxury-gold scale-[0.98]'
                    : 'border-luxury-white/5 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Spec Curation & Controls */}
        <div className="flex flex-col justify-between">
          <div className="space-y-6">
            {/* Category, Title, Ratings */}
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-luxury-gold font-light block">
                Chapter offerings / {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-serif font-light text-luxury-white mt-1">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-0.5 text-luxury-gold">
                  <Star className="w-3.5 h-3.5 fill-luxury-gold stroke-[0]" />
                  <span className="text-xs font-semibold text-luxury-white">{product.rating.toFixed(1)}</span>
                </div>
                <span className="text-luxury-gray text-xs font-light">
                  ({product.reviewsCount} critiques in log)
                </span>
              </div>
            </div>

            {/* Price tag */}
            <div className="py-4 border-y border-luxury-white/5 flex justify-between items-center">
              <div>
                <span className="text-[10px] text-luxury-gray uppercase tracking-widest font-light block">
                  Aquisition Price
                </span>
                <span className="text-2xl text-luxury-white font-semibold mt-1 block">
                  {currencySymbol}
                  {convertedPrice}
                </span>
              </div>
              <span className="px-3 py-1.5 rounded-full bg-luxury-gold/10 border border-luxury-gold/10 text-[8px] uppercase tracking-widest text-luxury-gold font-semibold animate-pulse-slow">
                {product.stock > 0 ? `Limited stock: ${product.stock} items remaining` : 'Out of Stock'}
              </span>
            </div>

            {/* Detailed Description */}
            <p className="text-xs md:text-sm text-luxury-gray font-light leading-relaxed">
              {product.description}
            </p>

            {/* Features checkmarks */}
            <div className="space-y-2.5">
              <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                Crafted specifications
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {product.features.map((feat, i) => (
                  <li key={i} className="text-xs text-luxury-white/95 font-light flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Variant selections */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-luxury-white/5">
              {/* Scent / Color */}
              {product.variants.colors.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                    Vantage Point / Scent
                  </label>
                  <div className="relative">
                    <select
                      value={selectedColor}
                      onChange={(e) => setSelectedColor(e.target.value)}
                      className="w-full bg-luxury-dark text-xs text-luxury-white py-3 px-4 border border-luxury-white/10 rounded-xl outline-none focus:border-luxury-gold appearance-none"
                    >
                      {product.variants.colors.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-luxury-gray absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}

              {/* Volume / Size */}
              {product.variants.sizes.length > 0 && (
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                    Configuration / Size
                  </label>
                  <div className="relative">
                    <select
                      value={selectedSize}
                      onChange={(e) => setSelectedSize(e.target.value)}
                      className="w-full bg-luxury-dark text-xs text-luxury-white py-3 px-4 border border-luxury-white/10 rounded-xl outline-none focus:border-luxury-gold appearance-none"
                    >
                      {product.variants.sizes.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-luxury-gray absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              )}
            </div>

            {/* Qty Selector & Buttons */}
            <div className="flex gap-4 pt-4">
              <div className="flex items-center border border-luxury-white/10 rounded-xl overflow-hidden bg-luxury-dark w-32 justify-between">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-luxury-gray hover:text-luxury-white transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="text-xs text-luxury-white font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-3 text-luxury-gray hover:text-luxury-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 py-4 bg-luxury-white/5 hover:bg-luxury-gold hover:text-luxury-black border border-luxury-white/10 hover:border-transparent text-xs uppercase tracking-widest text-luxury-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-45"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Collection
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="px-6 py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black rounded-xl text-xs uppercase tracking-widest font-semibold flex items-center gap-1.5 transition-all duration-300 cursor-pointer disabled:opacity-45 shadow-[0_4px_15px_rgba(212,175,55,0.2)]"
              >
                Buy Now
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`p-4 rounded-xl border ${
                  isInWishlist
                    ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                    : 'border-luxury-white/10 text-luxury-white hover:border-luxury-gold hover:text-luxury-gold'
                } transition-all duration-200`}
                title="Add to Vault"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Postcode Delivery Checker */}
            <form onSubmit={checkDelivery} className="p-4 bg-luxury-card/30 rounded-2xl border border-luxury-white/5 mt-6">
              <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light block mb-2">
                Priority Delivery Estimate
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter postal code (e.g. 10012)"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-luxury-black border border-luxury-white/10 rounded-lg text-xs text-luxury-white outline-none focus:border-luxury-gold/40"
                />
                <button
                  type="submit"
                  className="px-4 py-2 border border-luxury-white/10 text-[10px] uppercase tracking-widest text-luxury-white hover:border-luxury-gold hover:text-luxury-gold transition-all duration-200 rounded-lg"
                >
                  Verify
                </button>
              </div>
              {deliveryResult && (
                <p className="text-[10px] text-luxury-gold font-light mt-2 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 animate-pulse" /> {deliveryResult}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Accordions FAQs Section */}
      <div className="max-w-4xl mx-auto px-6 mt-20">
        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold mb-6 text-center">
          Offerings Covenants & Guidelines
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = faqOpen[idx] || false;
            return (
              <div key={idx} className="glass rounded-xl border border-luxury-white/5 overflow-hidden">
                <button
                  onClick={() => setFaqOpen({ ...faqOpen, [idx]: !isOpen })}
                  className="w-full p-5 text-left flex justify-between items-center text-xs uppercase tracking-widest text-luxury-white hover:text-luxury-gold transition-colors font-medium cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180 text-luxury-gold' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs text-luxury-gray font-light leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Critiques/Reviews log */}
      <div className="max-w-4xl mx-auto px-6 mt-24">
        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold mb-6">
          Collector Critiques
        </h3>

        {/* Existing Reviews */}
        <div className="space-y-4 mb-12">
          {reviews.length === 0 ? (
            <p className="text-xs text-luxury-gray font-light italic">
              No critiques are currently registered for this offering. Submit your analysis below.
            </p>
          ) : (
            reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl glass border border-luxury-white/5">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-xs text-luxury-white font-medium">{rev.userName}</h4>
                    <span className="text-[9px] text-luxury-gray font-light mt-0.5 block">{rev.date}</span>
                  </div>
                  <div className="flex text-luxury-gold">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-luxury-gold stroke-[0]" />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-luxury-white/80 font-light mt-3 leading-relaxed">
                  &quot;{rev.comment}&quot;
                </p>
              </div>
            ))
          )}
        </div>

        {/* Submit Review Form */}
        <div className="p-6 rounded-2xl glass border border-luxury-white/5">
          <h4 className="text-xs uppercase tracking-widest text-luxury-white mb-4">
            Register Critique Analysis
          </h4>
          {reviewSuccess ? (
            <div className="p-4 bg-luxury-gold/10 border border-luxury-gold/20 rounded-xl text-xs text-luxury-gold font-light">
              Critique logged successfully. Undergoing administrative curation checklist.
            </div>
          ) : (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                    Collector Signature
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                    Sensory Score (1-5 Stars)
                  </label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 appearance-none"
                  >
                    {[5, 4, 3, 2, 1].map((r) => (
                      <option key={r} value={r}>
                        {r} Stars
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                  Critique Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your sensory findings..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 resize-none"
                />
              </div>

              <button
                type="submit"
                className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300 cursor-pointer"
              >
                Log Critique
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Related Products Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-28 border-t border-luxury-white/5 pt-16">
        <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold mb-8">
          Complementary Offerings
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {relatedProducts.map((p) => (
            <Link
              href={`/product/${p.id}`}
              key={p.id}
              className="glass p-5 rounded-2xl border border-luxury-white/5 block hover:border-luxury-gold/25 transition-all duration-300"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden bg-luxury-dark mb-4 border border-luxury-white/5">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
              </div>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">
                {p.category}
              </span>
              <h4 className="text-sm font-medium text-luxury-white mt-1">{p.name}</h4>
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-luxury-white/5">
                <span className="text-xs text-luxury-white font-semibold">
                  {currencySymbol}
                  {Math.floor(p.price * mult)}
                </span>
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold flex items-center gap-1">
                  Acquire <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Floating Sticky Purchase Bar (Conversion Feature) */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 z-[900] bg-luxury-black/90 backdrop-blur-md border-t border-luxury-white/5 py-4 px-6 md:px-12 flex items-center justify-between shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-luxury-dark border border-luxury-white/5 hidden md:block">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs text-luxury-white font-medium">{product.name}</h4>
                <span className="text-[10px] text-luxury-gold font-light uppercase tracking-wider block mt-0.5">
                  {selectedColor} | {selectedSize}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm text-luxury-white font-semibold">
                {currencySymbol}
                {convertedPrice * quantity}
              </span>
              <button
                onClick={handleAddToCart}
                className="px-6 py-3 bg-luxury-white/5 hover:bg-luxury-gold hover:text-luxury-black border border-luxury-white/10 hover:border-transparent text-[10px] uppercase tracking-widest text-luxury-white font-semibold rounded-lg transition-all duration-200"
              >
                Add
              </button>
              <button
                onClick={handleBuyNow}
                className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-[10px] uppercase tracking-widest font-semibold rounded-lg transition-all duration-200 shadow-md"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
