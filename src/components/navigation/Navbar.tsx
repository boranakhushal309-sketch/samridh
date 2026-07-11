"use client";
import React, { useState, useEffect } from 'react';
import { Search, Heart, ShoppingBag, User, Sun, Moon, Sparkles, ChevronDown, Menu, X } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Link from 'next/link';
import SearchOverlay from './SearchOverlay';
import CartDrawer from '../cart/CartDrawer';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currDropdownOpen, setCurrDropdownOpen] = useState(false);

  const cartCount = useStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0));
  const wishlistCount = useStore((state) => state.wishlist.length);
  const theme = useStore((state) => state.theme);
  const toggleTheme = useStore((state) => state.toggleTheme);
  const currency = useStore((state) => state.currency);
  const setCurrency = useStore((state) => state.setCurrency);
  const user = useStore((state) => state.user);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-theme');
    } else {
      root.classList.remove('light-theme');
    }
  }, [theme]);

  const handleCurrencyChange = (curr: 'USD' | 'EUR' | 'GBP' | 'INR') => {
    setCurrency(curr);
    setCurrDropdownOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-6 md:px-12 py-5 ${
          scrolled
            ? 'bg-luxury-black/75 backdrop-blur-xl border-b border-luxury-white/5 py-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <Sparkles className="w-5 h-5 text-luxury-gold group-hover:rotate-12 transition-transform duration-300" />
            <span className="text-base tracking-[0.25em] font-light text-luxury-white uppercase">
              Aether
            </span>
          </Link>

          {/* Navigation Links (Desktop only) */}
          <nav className="hidden md:flex items-center gap-10">
            <Link
              href="/"
              className="text-[11px] uppercase tracking-[0.18em] text-luxury-white/80 hover:text-luxury-gold transition-colors duration-200 font-light"
            >
              Collection
            </Link>
            <Link
              href="/#best-sellers"
              className="text-[11px] uppercase tracking-[0.18em] text-luxury-white/80 hover:text-luxury-gold transition-colors duration-200 font-light"
            >
              Offerings
            </Link>
            <Link
              href="/dashboard"
              className="text-[11px] uppercase tracking-[0.18em] text-luxury-white/80 hover:text-luxury-gold transition-colors duration-200 font-light"
            >
              Collector Room
            </Link>
            <Link
              href="/admin"
              className="text-[11px] uppercase tracking-[0.18em] text-luxury-white/80 hover:text-luxury-gold transition-colors duration-200 font-light"
            >
              System Terminal
            </Link>
          </nav>

          {/* Action icons */}
          <div className="flex items-center gap-3.5 md:gap-5">
            {/* Currency Selector (Desktop only) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrDropdownOpen(!currDropdownOpen)}
                className="flex items-center gap-1 text-[10px] uppercase tracking-wider text-luxury-white/90 hover:text-luxury-gold px-2 py-1 rounded transition-colors duration-200"
              >
                {currency} <ChevronDown className="w-3 h-3 text-luxury-gold" />
              </button>
              {currDropdownOpen && (
                <div className="absolute right-0 mt-3 py-1.5 w-24 glass rounded-xl border border-luxury-white/10 shadow-2xl text-center z-[1100]">
                  {['USD', 'EUR', 'GBP', 'INR'].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => handleCurrencyChange(curr as any)}
                      className="block w-full py-1.5 text-[10px] tracking-wider text-luxury-white hover:bg-luxury-gold hover:text-luxury-black transition-all duration-200 uppercase font-light cursor-pointer"
                    >
                      {curr}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Theme toggle (Desktop only) */}
            <button
              onClick={toggleTheme}
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold hover:scale-105 transition-all duration-200 cursor-pointer hidden md:block"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Search Trigger (Always visible) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold hover:scale-105 transition-all duration-200 cursor-pointer"
              title="Search Offerings"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Wishlist Link (Desktop only) */}
            <Link
              href="/dashboard#wishlist"
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold hover:scale-105 transition-all duration-200 relative hidden md:block"
              title="Wishlist Room"
            >
              <Heart className="w-4 h-4" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-luxury-gold text-luxury-black font-semibold text-[8px] flex items-center justify-center rounded-full border border-luxury-black">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Trigger (Always visible) */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold hover:scale-105 transition-all duration-200 relative cursor-pointer"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-luxury-gold text-luxury-black font-semibold text-[8px] flex items-center justify-center rounded-full border border-luxury-black animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Collector Account (Desktop only) */}
            <Link
              href="/dashboard"
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold hover:scale-105 transition-all duration-200 hidden md:block"
              title="Collector Dashboard"
            >
              <User className="w-4 h-4" />
            </Link>

            {/* Mobile Hamburger menu toggle (Mobile only) */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-1.5 text-luxury-white/80 hover:text-luxury-gold cursor-pointer block md:hidden"
              title="Open Navigation Menu"
            >
              <Menu className="w-5 h-5 text-luxury-white" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE FULL-SCREEN NAVIGATION OVERLAY */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1500] bg-luxury-black/95 backdrop-blur-2xl flex flex-col p-6 overflow-y-auto no-scrollbar animate-fade-in" data-lenis-prevent>
          {/* Mobile Overlay Header */}
          <div className="flex justify-between items-center pb-6 border-b border-luxury-white/5 mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-luxury-gold" />
              <span className="text-sm tracking-[0.2em] font-light text-luxury-white uppercase">Aether</span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-luxury-gray hover:text-luxury-white hover:scale-105 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Large Vertical Navigation Links */}
          <div className="flex flex-col gap-6 text-left">
            {[
              { label: 'Collection', url: '/' },
              { label: 'Offerings', url: '/#best-sellers' },
              { label: 'Collector Room', url: '/dashboard' },
              { label: 'System Terminal', url: '/admin' }
            ].map((link) => (
              <Link
                key={link.label}
                href={link.url}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-2xl font-serif text-luxury-white hover:text-luxury-gold transition-colors font-light py-2"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-[1px] bg-luxury-white/5 my-8" />

          {/* Additional Mobile Utilities */}
          <div className="space-y-6 text-left">
            {/* Account & Wishlist */}
            <div className="flex flex-col gap-4">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-luxury-white/90 hover:text-luxury-gold font-light"
              >
                <User className="w-4 h-4 text-luxury-gold" /> Collector Profile
              </Link>
              <Link
                href="/dashboard#wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2 text-sm text-luxury-white/90 hover:text-luxury-gold font-light"
              >
                <Heart className="w-4 h-4 text-luxury-gold" /> Favorites Vault ({wishlistCount})
              </Link>
            </div>

            {/* Currency Selector (Mobile options) */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gray font-light block">Currency Selection</span>
              <div className="flex gap-2">
                {['USD', 'EUR', 'GBP', 'INR'].map((curr) => (
                  <button
                    key={curr}
                    onClick={() => {
                      setCurrency(curr as any);
                    }}
                    className={`px-3 py-1.5 rounded-lg border text-xs uppercase tracking-widest font-light transition-all ${
                      currency === curr
                        ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold'
                        : 'border-luxury-white/10 text-luxury-white'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Mode Toggle */}
            <div className="space-y-2">
              <span className="text-[9px] uppercase tracking-widest text-luxury-gray font-light block">Theme Mode</span>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 border border-luxury-white/10 rounded-lg text-xs uppercase tracking-widest text-luxury-white flex items-center gap-2 hover:border-luxury-gold transition-all"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun className="w-4 h-4 text-luxury-gold" /> Light Palette
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-luxury-gold" /> Velvet Dark
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
