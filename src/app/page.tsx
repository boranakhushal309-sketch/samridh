"use client";
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ArrowRight,
  Heart,
  Eye,
  ShoppingBag,
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  Check,
  Play,
  Volume2,
  X
} from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import Link from 'next/link';

// Dynamically import Three.js components to bypass SSR issues
const ProductFragrance = dynamic(() => import('@/components/canvas/ProductFragrance'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

const ProductWatch = dynamic(() => import('@/components/canvas/ProductWatch'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-transparent">
      <div className="w-8 h-8 border border-luxury-gold border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

export default function HomePage() {
  const products = useStore((state) => state.products);
  const addItem = useStore((state) => state.addItem);
  const wishlist = useStore((state) => state.wishlist);
  const toggleWishlist = useStore((state) => state.toggleWishlist);
  const currencySymbol = useStore((state) => state.currencySymbol);
  const currency = useStore((state) => state.currency);

  // States
  const [selectedVariants, setSelectedVariants] = useState<Record<string, { color: string; size: string }>>({
    'aether-no-ix': { color: 'Classic Gold', size: '100ml' },
    'chronos-chronograph': { color: 'Champagne Gold', size: '42mm' },
    'sonic-aura': { color: 'Gold Accent', size: 'Standard' },
    'terra-holdall': { color: 'Tan Vachetta', size: 'Cabin Size' }
  });

  const [activeHero3D, setActiveHero3D] = useState<'fragrance' | 'watch'>('fragrance');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [cartSuccessNotif, setCartSuccessNotif] = useState<string | null>(null);

  // Conversion calculations
  const getConversionMultiplier = () => {
    if (currency === 'EUR') return 0.92;
    if (currency === 'GBP') return 0.79;
    if (currency === 'INR') return 83.5;
    return 1;
  };
  const mult = getConversionMultiplier();

  // Handle Quick Add to Cart
  const handleAddToCart = (product: Product) => {
    const variant = selectedVariants[product.id] || {
      color: product.variants.colors[0],
      size: product.variants.sizes[0]
    };

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      color: variant.color,
      size: variant.size,
      stock: product.stock
    });

    setCartSuccessNotif(`${product.name} (${variant.size}) added to your collection.`);
    setTimeout(() => setCartSuccessNotif(null), 3000);
  };

  // Check if item is in wishlist
  const isInWishlist = (id: string) => wishlist.some((p) => p.id === id);

  return (
    <div className="relative w-full overflow-hidden">
      {/* Toast Notification for Cart Success */}
      <AnimatePresence>
        {cartSuccessNotif && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-[2000] px-6 py-4 rounded-xl glass border border-luxury-gold/30 text-xs uppercase tracking-widest text-luxury-white flex items-center gap-3 shadow-2xl"
          >
            <Check className="w-4 h-4 text-luxury-gold animate-bounce" />
            <span>{cartSuccessNotif}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-center items-center px-6 md:px-12 py-20 bg-gradient-to-b from-luxury-black via-luxury-dark to-luxury-black">
        {/* Abstract floating circles backing */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute top-[20%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-luxury-gold/5 blur-[120px]" />
          <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-luxury-gold/5 blur-[150px]" />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
            className="flex flex-col items-start text-left space-y-6"
          >
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-luxury-gold rounded-full" />
              <span className="text-[10px] md:text-xs uppercase tracking-[0.3em] text-luxury-gold font-light">
                Sensory Physics & Timecraft
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl xl:text-7xl font-serif font-light leading-[1.1] text-luxury-white">
              The Essence of <br />
              <span className="gold-gradient-text font-normal italic">Refined Living</span>
            </h1>

            <p className="text-sm md:text-base font-light text-luxury-gray max-w-lg leading-relaxed">
              Curating rare collections that merge olfactory artistry, mechanical precision, and acoustic purity. Beautiful, bespoke instruments for the sensory collector.
            </p>

            {/* Toggle 3D Hero product */}
            <div className="flex items-center gap-2 border border-luxury-white/5 bg-luxury-card/30 p-1.5 rounded-full backdrop-blur-md">
              <button
                onClick={() => setActiveHero3D('fragrance')}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  activeHero3D === 'fragrance'
                    ? 'bg-luxury-gold text-luxury-black font-semibold'
                    : 'text-luxury-gray hover:text-luxury-white'
                }`}
              >
                No. IX Scent
              </button>
              <button
                onClick={() => setActiveHero3D('watch')}
                className={`px-4 py-2 rounded-full text-[10px] uppercase tracking-wider transition-all duration-300 ${
                  activeHero3D === 'watch'
                    ? 'bg-luxury-gold text-luxury-black font-semibold'
                    : 'text-luxury-gray hover:text-luxury-white'
                }`}
              >
                Chronos Model
              </button>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#best-sellers"
                className="px-8 py-4 bg-luxury-white text-luxury-black hover:bg-luxury-gold hover:text-luxury-black text-xs uppercase tracking-[0.2em] font-semibold rounded-xl flex items-center gap-2.5 transition-all duration-300 shadow-lg"
              >
                Acquire Offerings <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/dashboard"
                className="px-8 py-4 border border-luxury-white/10 hover:border-luxury-gold text-luxury-white hover:text-luxury-gold text-xs uppercase tracking-[0.2em] font-light rounded-xl transition-all duration-300"
              >
                Heritage Room
              </Link>
            </div>
          </motion.div>

          {/* Floating 3D Product Presentation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.2 }}
            className="w-full aspect-square md:h-[500px] xl:h-[600px] relative flex items-center justify-center"
          >
            {/* Visual halo ring */}
            <div className="absolute w-[80%] h-[80%] border border-luxury-gold/5 rounded-full animate-spin-slow pointer-events-none" />
            <div className="absolute w-[60%] h-[60%] border border-luxury-gold/10 rounded-full animate-pulse-slow pointer-events-none" />

            <div className="w-full h-full relative cursor-grab active:cursor-grabbing">
              {activeHero3D === 'fragrance' ? (
                <ProductFragrance hoverColor="#D4AF37" />
              ) : (
                <ProductWatch hoverColor="#D4AF37" />
              )}
            </div>

            {/* Float Info Tag */}
            <div className="absolute bottom-6 left-6 p-4 glass rounded-2xl border border-luxury-white/5 max-w-[200px]">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold block font-semibold">
                Interactive Canvas
              </span>
              <p className="text-[10px] text-luxury-white mt-1 font-light leading-relaxed">
                Click & drag inside the canvas to inspect reflections and fluid dynamics.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 flex flex-col items-center gap-1 opacity-70">
          <span className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
            Scroll to Explore
          </span>
          <div className="w-1 h-8 rounded-full bg-luxury-white/10 relative overflow-hidden mt-1">
            <motion.div
              animate={{ y: [0, 24, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              className="w-full h-2.5 bg-luxury-gold rounded-full absolute top-0"
            />
          </div>
        </div>
      </section>

      {/* 2. FEATURED COLLECTIONS */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-black max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light">
            Architectural Chapters
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white">
            Explore Curated <span className="italic">Heritage</span>
          </h2>
          <div className="w-12 h-[1px] bg-luxury-gold/40 mt-2" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: 'Scented Chemistry',
              desc: 'Rare distillations, wood extracts, and cold oils.',
              image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=600&q=80',
              link: '#best-sellers',
            },
            {
              title: 'Kinetic Horology',
              desc: 'Automatic Swiss jewel motions and crystal sapphire casings.',
              image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=600&q=80',
              link: '#best-sellers',
            },
            {
              title: 'Sonic Acoustics',
              desc: 'Precision studio open-back grids and beryllium transducers.',
              image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=600&q=80',
              link: '#best-sellers',
            },
            {
              title: 'Bespoke Vachetta',
              desc: 'Weekend holdalls that patinate beautifully over time.',
              image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=600&q=80',
              link: '#best-sellers',
            },
          ].map((col, idx) => (
            <div
              key={idx}
              className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-luxury-white/5"
            >
              {/* Background Image */}
              <img
                src={col.image}
                alt={col.title}
                className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
              />
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent opacity-85" />

              {/* Text info */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end items-start text-left">
                <span className="text-[10px] tracking-widest text-luxury-gold uppercase font-light">
                  Chapter 0{idx + 1}
                </span>
                <h3 className="text-lg font-serif font-light text-luxury-white mt-1">
                  {col.title}
                </h3>
                <p className="text-xs text-luxury-gray font-light mt-1.5 line-clamp-2">
                  {col.desc}
                </p>
                <Link
                  href={col.link}
                  className="mt-4 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-luxury-white hover:text-luxury-gold transition-colors duration-200"
                >
                  Acquire offering <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. BEST SELLERS */}
      <section
        id="best-sellers"
        className="py-20 md:py-32 px-6 md:px-12 bg-luxury-dark border-y border-luxury-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-4">
            <div>
              <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light">
                Acquisition Room
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white mt-2">
                Flagship Masterpieces
              </h2>
            </div>
            <p className="text-xs md:text-sm text-luxury-gray font-light max-w-sm">
              Hand-finished designs in limited quantities. Tap color points to modify presentation values or add directly to bag.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => {
              const variant = selectedVariants[product.id] || {
                color: product.variants.colors[0],
                size: product.variants.sizes[0]
              };

              return (
                <div
                  key={product.id}
                  className="glass p-5 rounded-2xl border border-luxury-white/5 flex flex-col justify-between group hover:border-luxury-gold/25 transition-all duration-500 hover:shadow-2xl relative"
                >
                  {/* Stock tag */}
                  <div className="absolute top-8 left-8 z-10">
                    <span
                      className={`px-2 py-1 rounded text-[8px] uppercase tracking-widest font-semibold ${
                        product.stock <= 5
                          ? 'bg-red-500/20 text-red-500 border border-red-500/10 animate-pulse'
                          : 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/10'
                      }`}
                    >
                      {product.stock <= 5 ? `Only ${product.stock} Left` : 'Available'}
                    </span>
                  </div>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => toggleWishlist(product)}
                    className="absolute top-8 right-8 z-10 p-2.5 rounded-full bg-luxury-black/60 hover:bg-luxury-gold hover:text-luxury-black text-luxury-white transition-all duration-300 border border-luxury-white/5"
                    title={isInWishlist(product.id) ? 'Remove Favorite' : 'Save Favorite'}
                  >
                    <Heart
                      className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-luxury-gold text-luxury-gold hover:text-luxury-black' : ''}`}
                    />
                  </button>

                  <div>
                    {/* Image frame */}
                    <div className="aspect-[5/6] rounded-xl overflow-hidden bg-luxury-black relative mb-5 border border-luxury-white/5">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      {/* Action overlays on hover */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => setQuickViewProduct(product)}
                          className="p-3 bg-luxury-black hover:bg-luxury-gold text-luxury-white hover:text-luxury-black rounded-full transition-all duration-300"
                          title="Quick View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="p-3 bg-luxury-black hover:bg-luxury-gold text-luxury-white hover:text-luxury-black rounded-full transition-all duration-300"
                          title="Add to Collection"
                        >
                          <ShoppingBag className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">
                          {product.category}
                        </span>
                        <Link href={`/product/${product.id}`} className="block">
                          <h3 className="text-sm font-medium text-luxury-white mt-0.5 hover:text-luxury-gold transition-colors">
                            {product.name}
                          </h3>
                        </Link>
                      </div>
                      <span className="text-sm text-luxury-white font-semibold">
                        {currencySymbol}
                        {Math.floor(product.price * mult)}
                      </span>
                    </div>

                    {/* Description excerpt */}
                    <p className="text-[11px] text-luxury-gray font-light mt-2 line-clamp-2 leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Options Selector panel */}
                  <div className="mt-4 pt-4 border-t border-luxury-white/5 space-y-3">
                    {/* Color Swatch */}
                    {product.variants.colors.length > 0 && (
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[9px] text-luxury-gray uppercase tracking-wider font-light">
                          Vantage Point
                        </span>
                        <div className="flex gap-1.5">
                          {product.variants.colors.map((c) => (
                            <button
                              key={c}
                              onClick={() =>
                                setSelectedVariants({
                                  ...selectedVariants,
                                  [product.id]: {
                                    ...variant,
                                    color: c
                                  }
                                })
                              }
                              className={`w-3.5 h-3.5 rounded-full border transition-all duration-200 ${
                                variant.color === c
                                  ? 'border-luxury-gold scale-125'
                                  : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                              style={{
                                backgroundColor:
                                  c.includes('Gold') || c.includes('Tan')
                                    ? '#D4AF37'
                                    : c.includes('Black') || c.includes('Carbon') || c.includes('Noir')
                                    ? '#151515'
                                    : '#C0C0C0'
                              }}
                              title={c}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size Swatches */}
                    {product.variants.sizes.length > 0 && (
                      <div className="flex items-center gap-2 justify-between">
                        <span className="text-[9px] text-luxury-gray uppercase tracking-wider font-light">
                          Configuration
                        </span>
                        <div className="flex gap-1">
                          {product.variants.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={() =>
                                setSelectedVariants({
                                  ...selectedVariants,
                                  [product.id]: {
                                    ...variant,
                                    size: s
                                  }
                                })
                              }
                              className={`px-1.5 py-0.5 rounded text-[9px] font-light border uppercase transition-all duration-200 ${
                                variant.size === s
                                  ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-white'
                                  : 'border-transparent text-luxury-gray hover:text-luxury-white'
                              }`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Rating stars */}
                    <div className="flex items-center justify-between text-[10px] text-luxury-gray">
                      <div className="flex items-center gap-0.5 text-luxury-gold">
                        <Star className="w-3 h-3 fill-luxury-gold stroke-[0]" />
                        <span className="font-semibold text-luxury-white">{product.rating.toFixed(1)}</span>
                      </div>
                      <span className="font-light">({product.reviewsCount} reviews)</span>
                    </div>

                    <button
                      onClick={() => handleAddToCart(product)}
                      className="w-full py-3 bg-luxury-white/5 hover:bg-luxury-gold hover:text-luxury-black border border-luxury-white/5 hover:border-transparent text-[10px] uppercase tracking-widest text-luxury-white font-medium rounded-lg transition-all duration-300 mt-2 flex items-center justify-center gap-2"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Acquire Offering
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. NEW ARRIVALS (Horizontal scroll) */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-black overflow-hidden border-b border-luxury-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light">
              Current Horizon
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white mt-2">
              New Editions
            </h2>
          </div>
          <div className="flex gap-2">
            <button className="p-3 rounded-full border border-luxury-white/5 hover:border-luxury-gold text-luxury-gray hover:text-luxury-white transition-all">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="p-3 rounded-full border border-luxury-white/5 hover:border-luxury-gold text-luxury-gray hover:text-luxury-white transition-all">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scroll Container */}
        <div className="flex gap-8 overflow-x-auto no-scrollbar scroll-smooth px-2 pb-6 max-w-7xl mx-auto">
          {[
            {
              title: 'No. IX Intense',
              price: 280,
              cat: 'Fragrance',
              desc: 'Heavy amber notes infused with rare oud wood oils.',
              image: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Chronos Obsidian',
              price: 1950,
              cat: 'Watches',
              desc: 'Brushed carbon-fiber casing with mechanical black gears.',
              image: 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Bespoke Vachetta Tan',
              price: 1350,
              cat: 'Leather',
              desc: 'Hand-burnished leather cabin-sized travel bag.',
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
            },
            {
              title: 'Sonic Aura Alabaster',
              price: 680,
              cat: 'Audio',
              desc: 'Pure matte white edition with gold-woven mesh details.',
              image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="min-w-[280px] md:min-w-[340px] glass p-5 rounded-2xl border border-luxury-white/5 relative shrink-0"
            >
              <div className="aspect-square rounded-xl overflow-hidden bg-luxury-dark mb-4 border border-luxury-white/5 relative">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-4 left-4 bg-luxury-gold text-luxury-black font-semibold text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full">
                  New Edition
                </span>
              </div>
              <span className="text-[9px] uppercase tracking-widest text-luxury-gold font-light">
                {item.cat}
              </span>
              <h3 className="text-sm font-medium text-luxury-white mt-0.5">{item.title}</h3>
              <p className="text-xs text-luxury-gray font-light mt-1.5 line-clamp-1">{item.desc}</p>
              <div className="flex justify-between items-center mt-4 pt-4 border-t border-luxury-white/5">
                <span className="text-sm text-luxury-white font-semibold">
                  {currencySymbol}
                  {Math.floor(item.price * mult)}
                </span>
                <Link
                  href="/#best-sellers"
                  className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-luxury-white hover:text-luxury-gold transition-all duration-200"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. WHY CHOOSE US */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-dark border-b border-luxury-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <Truck className="w-6 h-6 text-luxury-gold" />,
              title: 'Complimentary Delivery',
              desc: 'Premium worldwide carbon-neutral courier service. Hand-packed in protective luxury gift cylinders.',
            },
            {
              icon: <ShieldCheck className="w-6 h-6 text-luxury-gold" />,
              title: 'Encrypted Checkout',
              desc: 'Fully secure checkout including integrated Stripe token structures and global card vaults.',
            },
            {
              icon: <RotateCcw className="w-6 h-6 text-luxury-gold" />,
              title: 'Heritage Return Policy',
              desc: 'Complimentary returns or exchanges within 30 days of acquisition. Courier pickup scheduled on demand.',
            },
            {
              icon: <Award className="w-6 h-6 text-luxury-gold" />,
              title: 'Bespoke Quality',
              desc: 'Every item is individually inspected and registered in the collector log with authentic serial values.',
            },
          ].map((trust, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass border border-luxury-white/5 flex flex-col justify-start text-left"
            >
              <div className="p-3 bg-luxury-white/5 rounded-xl w-fit mb-4">{trust.icon}</div>
              <h3 className="text-sm font-medium text-luxury-white mb-2">{trust.title}</h3>
              <p className="text-xs text-luxury-gray font-light leading-relaxed">{trust.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. CUSTOMER REVIEWS / TESTIMONIALS */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-black border-b border-luxury-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Testimonial Stats */}
          <div className="flex flex-col justify-center space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light">
              Collector Voice
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white">
              The Collector <span className="italic">Verdict</span>
            </h2>
            <p className="text-sm text-luxury-gray font-light leading-relaxed">
              We collect critiques from around the globe to refine the chemistry of our scents and the precision of our mechanics.
            </p>
            <div className="flex items-center gap-5 pt-4">
              <div>
                <span className="text-4xl font-serif text-luxury-gold">4.9</span>
                <span className="text-xs text-luxury-gray font-light block mt-1">Average rating score</span>
              </div>
              <div className="w-[1px] h-12 bg-luxury-white/10" />
              <div>
                <span className="text-4xl font-serif text-luxury-gold">99.1%</span>
                <span className="text-xs text-luxury-gray font-light block mt-1">Satisfied collectors</span>
              </div>
            </div>
          </div>

          {/* Video Mock testimonial */}
          <div className="aspect-[16/10] lg:aspect-auto lg:h-[400px] rounded-2xl overflow-hidden bg-luxury-dark relative border border-luxury-white/5 group">
            <img
              src="https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80"
              alt="Testimonial Video Portrait"
              className="w-full h-full object-cover opacity-80"
            />
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30">
              <button className="p-4 bg-luxury-gold rounded-full text-luxury-black hover:scale-110 transition-transform duration-300 shadow-2xl">
                <Play className="w-5 h-5 fill-luxury-black" />
              </button>
            </div>
            {/* Lower banner */}
            <div className="absolute bottom-4 left-4 right-4 p-4 glass rounded-xl border border-luxury-white/5 flex justify-between items-center">
              <div>
                <h4 className="text-xs text-luxury-white font-medium">Marcello G.</h4>
                <p className="text-[10px] text-luxury-gray font-light mt-0.5">Scent Collector, Milan</p>
              </div>
              <div className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-luxury-gold" />
                <span className="text-[9px] uppercase tracking-widest text-luxury-white font-semibold">Live Review</span>
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="flex flex-col justify-center space-y-4">
            {[
              {
                user: 'Aria Sterling',
                role: 'Horology enthusiast, London',
                comment: 'The Chronos Chronograph is a marvel. I own watches three times its price, but the finishing on this bezel stands shoulder-to-shoulder with them.',
                rating: 5,
              },
              {
                user: 'Dr. Ethan Vance',
                role: 'Audiologist, Portland',
                comment: 'Neutral, spacious, and extremely comfortable. The Sonic Aura reveals micro-details in recordings that other headphones compress. A triumph.',
                rating: 5,
              },
            ].map((rev, idx) => (
              <div key={idx} className="glass p-5 rounded-2xl border border-luxury-white/5">
                <div className="flex gap-0.5 mb-2 text-luxury-gold">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-luxury-gold stroke-[0]" />
                  ))}
                </div>
                <p className="text-xs text-luxury-white/90 font-light italic leading-relaxed">
                  &quot;{rev.comment}&quot;
                </p>
                <div className="mt-3 flex justify-between items-center">
                  <h4 className="text-xs text-luxury-white font-medium">{rev.user}</h4>
                  <span className="text-[9px] text-luxury-gray font-light uppercase tracking-wider">
                    {rev.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. INSTAGRAM / SOCIAL GALLERY */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-black max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light">
            Sensory Feed
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white">
            Collected Moments
          </h2>
          <p className="text-xs text-luxury-gray font-light max-w-sm mt-1">
            Tag <span className="text-luxury-white font-medium">@AetherLuxury</span> to share your curation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
          ].map((url, idx) => (
            <div
              key={idx}
              className="aspect-square rounded-2xl overflow-hidden border border-luxury-white/5 relative group cursor-pointer"
            >
              <img
                src={url}
                alt={`Social Curation Grid ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <span className="text-xs text-luxury-gold uppercase tracking-widest font-semibold">
                  Inspect Curation
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. NEWSLETTER */}
      <section className="py-20 md:py-32 px-6 md:px-12 bg-luxury-dark border-t border-luxury-white/5 relative">
        <div className="max-w-xl mx-auto text-center space-y-6 z-10 relative">
          <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light block">
            Collector Telegram
          </span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-luxury-white">
            Recollect First Access
          </h2>
          <p className="text-xs md:text-sm text-luxury-gray font-light leading-relaxed">
            Register your email to receive notice of limited mechanical releases, olfactory formulations, and collector room allocations.
          </p>

          <form className="flex gap-2 max-w-md mx-auto pt-4">
            <input
              type="email"
              placeholder="Your email address"
              required
              className="flex-1 px-4 py-3 bg-luxury-black border border-luxury-white/10 rounded-xl text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
            />
            <button
              type="submit"
              className="px-6 py-3 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300"
            >
              Register
            </button>
          </form>
        </div>
      </section>

      {/* 9. PREMIUM FOOTER */}
      <footer className="bg-luxury-black border-t border-luxury-white/5 py-16 px-6 md:px-12 text-left">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Logo & Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span className="text-base tracking-[0.3em] font-light text-luxury-white uppercase">
                Aether
              </span>
            </div>
            <p className="text-xs text-luxury-gray font-light leading-relaxed max-w-xs">
              A bespoke living concept store providing high-end scent notes, time horology, audio grids, and full-grain leather luggage. Built for collectors of the refined.
            </p>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-4">
              Offerings
            </h4>
            <ul className="space-y-2 text-xs text-luxury-gray font-light">
              <li>
                <a href="#best-sellers" className="hover:text-luxury-white transition-colors">
                  Aether Fragrances
                </a>
              </li>
              <li>
                <a href="#best-sellers" className="hover:text-luxury-white transition-colors">
                  Chronos Timepieces
                </a>
              </li>
              <li>
                <a href="#best-sellers" className="hover:text-luxury-white transition-colors">
                  Sonic Audio Devices
                </a>
              </li>
              <li>
                <a href="#best-sellers" className="hover:text-luxury-white transition-colors">
                  Terra Vachetta Bags
                </a>
              </li>
            </ul>
          </div>

          {/* Customer Room Links */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-4">
              Collector Room
            </h4>
            <ul className="space-y-2 text-xs text-luxury-gray font-light">
              <li>
                <Link href="/dashboard" className="hover:text-luxury-white transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard#orders" className="hover:text-luxury-white transition-colors">
                  Acquisitions Log
                </Link>
              </li>
              <li>
                <Link href="/dashboard#wishlist" className="hover:text-luxury-white transition-colors">
                  Favorites Vault
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-luxury-white transition-colors">
                  System Terminal (Admin)
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold mb-4">
              Policies
            </h4>
            <ul className="space-y-2 text-xs text-luxury-gray font-light">
              <li>
                <span className="cursor-pointer hover:text-luxury-white transition-colors">
                  Terms of Heritage
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-luxury-white transition-colors">
                  Privacy Covenant
                </span>
              </li>
              <li>
                <span className="cursor-pointer hover:text-luxury-white transition-colors">
                  Stripe Payment Security
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copy */}
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-luxury-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] text-luxury-gray font-light uppercase tracking-wider">
            &copy; 2026 Aether Luxury Group. All mechanical and aromatic designs registered.
          </p>
          <div className="flex gap-4 text-xs text-luxury-gray">
            <span className="hover:text-luxury-white transition-colors cursor-pointer">Instagram</span>
            <span className="hover:text-luxury-white transition-colors cursor-pointer">Pinterest</span>
            <span className="hover:text-luxury-white transition-colors cursor-pointer">Vimeo</span>
          </div>
        </div>
      </footer>

      {/* QUICK VIEW DETAILS DIALOG (AnimatePresence) */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setQuickViewProduct(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass max-w-3xl w-full rounded-3xl border border-luxury-white/10 relative overflow-hidden flex flex-col md:flex-row z-10 shadow-2xl"
            >
              {/* Close Button */}
              <button
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 z-20 p-2 text-luxury-gray hover:text-luxury-white hover:scale-105 transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Product Visual */}
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:h-full bg-luxury-dark border-r border-luxury-white/5 relative">
                <img
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-light">
                    {quickViewProduct.category}
                  </span>
                  <h3 className="text-xl font-serif text-luxury-white font-light mt-1">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-1 mt-2 text-luxury-gold text-xs">
                    <Star className="w-3.5 h-3.5 fill-luxury-gold stroke-[0]" />
                    <span className="font-semibold text-luxury-white">{quickViewProduct.rating.toFixed(1)}</span>
                    <span className="text-luxury-gray text-[10px] font-light">({quickViewProduct.reviewsCount} reviews)</span>
                  </div>

                  <span className="text-lg text-luxury-gold font-semibold block mt-4">
                    {currencySymbol}
                    {Math.floor(quickViewProduct.price * mult)}
                  </span>

                  <p className="text-xs text-luxury-gray font-light mt-4 leading-relaxed">
                    {quickViewProduct.description}
                  </p>

                  {/* Bullet points features list */}
                  <ul className="mt-6 space-y-2">
                    {quickViewProduct.features.slice(0, 3).map((feat, i) => (
                      <li key={i} className="text-[10px] text-luxury-white/85 font-light flex items-center gap-2">
                        <span className="w-1 h-1 bg-luxury-gold rounded-full shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 space-y-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleAddToCart(quickViewProduct);
                        setQuickViewProduct(null);
                      }}
                      className="flex-1 py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-lg cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" /> Add To Collection
                    </button>
                    <button
                      onClick={() => {
                        toggleWishlist(quickViewProduct);
                      }}
                      className={`p-4 rounded-xl border ${
                        isInWishlist(quickViewProduct.id)
                          ? 'border-luxury-gold text-luxury-gold bg-luxury-gold/5'
                          : 'border-luxury-white/10 text-luxury-white hover:border-luxury-gold hover:text-luxury-gold'
                      } transition-all duration-200`}
                      title="Toggle Wishlist"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    href={`/product/${quickViewProduct.id}`}
                    onClick={() => setQuickViewProduct(null)}
                    className="block text-center py-2 text-[10px] uppercase tracking-widest text-luxury-gray hover:text-luxury-white transition-colors"
                  >
                    View Comprehensive Specifications
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
