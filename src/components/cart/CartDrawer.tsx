"use client";
import React, { useState } from 'react';
import { ShoppingBag, X, Plus, Minus, Trash2, Percent, Sparkles, ArrowRight } from 'lucide-react';
import { useStore, CartItem } from '@/store/useStore';
import Link from 'next/link';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const cart = useStore((state) => state.cart);
  const promoCode = useStore((state) => state.promoCode);
  const discount = useStore((state) => state.discount);
  const currencySymbol = useStore((state) => state.currencySymbol);
  const currency = useStore((state) => state.currency);
  const updateCartQuantity = useStore((state) => state.updateCartQuantity);
  const removeItem = useStore((state) => state.removeItem);
  const applyPromo = useStore((state) => state.applyPromo);
  const products = useStore((state) => state.products);

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(false);

  const getConversionMultiplier = () => {
    if (currency === 'EUR') return 0.92;
    if (currency === 'GBP') return 0.79;
    if (currency === 'INR') return 83.5;
    return 1;
  };

  const mult = getConversionMultiplier();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * mult;
  const discountAmount = subtotal * discount;
  const shippingThreshold = 500 * mult;
  const shippingCost = subtotal >= shippingThreshold ? 0 : 35 * mult;
  const total = subtotal - discountAmount + shippingCost;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess(false);

    if (!couponInput.trim()) return;

    const success = applyPromo(couponInput);
    if (success) {
      setCouponSuccess(true);
      setCouponInput('');
    } else {
      setCouponError('Invalid collector code');
    }
  };

  // Recommendations: products not in cart
  const recommendations = products.filter(
    (p) => !cart.some((item) => item.id === p.id)
  ).slice(0, 2);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[9990] bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Cart Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[9995] w-full max-w-md bg-luxury-black border-l border-luxury-white/5 flex flex-col h-full max-h-screen overflow-hidden transition-transform duration-500 ease-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Cart Header */}
        <div className="flex justify-between items-center p-6 border-b border-luxury-white/5">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-luxury-gold" />
            <h2 className="text-sm uppercase tracking-[0.2em] font-light text-luxury-white">
              Your Collection ({cart.reduce((sum, i) => sum + i.quantity, 0)})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-luxury-gray hover:text-luxury-white transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        {cart.length > 0 && (
          <div className="bg-luxury-card/30 px-6 py-3 border-b border-luxury-white/5 text-center">
            {subtotal >= shippingThreshold ? (
              <p className="text-xs text-luxury-gold flex items-center justify-center gap-1.5 font-light">
                <Sparkles className="w-3.5 h-3.5" /> Complimentary Priority Delivery Unlocked
              </p>
            ) : (
              <div>
                <p className="text-xs text-luxury-gray font-light">
                  Add{' '}
                  <span className="text-luxury-white font-medium">
                    {currencySymbol}
                    {Math.ceil(shippingThreshold - subtotal)}
                  </span>{' '}
                  more for complimentary delivery.
                </p>
                <div className="w-full h-1 bg-luxury-white/5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full bg-luxury-gold transition-all duration-300"
                    style={{ width: `${(subtotal / shippingThreshold) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar" data-lenis-prevent>
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <ShoppingBag className="w-12 h-12 text-luxury-gray/30 mb-4 stroke-[1]" />
              <p className="text-sm text-luxury-gray font-light mb-6">
                Your collection bag is currently vacant.
              </p>
              <button
                onClick={onClose}
                className="px-6 py-3 border border-luxury-gold text-luxury-gold text-xs uppercase tracking-widest hover:bg-luxury-gold hover:text-luxury-black transition-all duration-300 rounded-lg"
              >
                Explore Offerings
              </button>
            </div>
          ) : (
            <>
              {/* Product Cards */}
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={`${item.id}-${item.color || ''}-${item.size || ''}`}
                    className="flex gap-4 p-4 rounded-xl glass border border-luxury-white/5 relative group"
                  >
                    <div className="w-20 h-20 rounded-lg overflow-hidden bg-luxury-dark border border-luxury-white/5 relative shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm text-luxury-white font-medium line-clamp-1">
                            {item.name}
                          </h4>
                          <span className="text-sm text-luxury-white font-semibold ml-2">
                            {currencySymbol}
                            {Math.floor(item.price * mult * item.quantity)}
                          </span>
                        </div>
                        {(item.color || item.size) && (
                          <p className="text-[10px] text-luxury-gray font-light mt-1 uppercase tracking-wider">
                            {item.color && `Color: ${item.color}`}
                            {item.color && item.size && ' | '}
                            {item.size && `Size: ${item.size}`}
                          </p>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Qty selectors */}
                        <div className="flex items-center border border-luxury-white/10 rounded-lg overflow-hidden h-8 bg-luxury-dark/40">
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1, item.color, item.size)
                            }
                            className="p-1.5 text-luxury-gray hover:text-luxury-white transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 text-xs text-luxury-white">{item.quantity}</span>
                          <button
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1, item.color, item.size)
                            }
                            className="p-1.5 text-luxury-gray hover:text-luxury-white transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Delete button */}
                        <button
                          onClick={() => removeItem(item.id, item.color, item.size)}
                          className="p-1.5 text-luxury-gray hover:text-red-500 hover:scale-105 transition-all duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Promo Code Form */}
              <form onSubmit={handleApplyPromo} className="pt-4 border-t border-luxury-white/5">
                <div className="flex gap-2">
                  <div className="relative flex-1 flex items-center border border-luxury-white/10 rounded-lg focus-within:border-luxury-gold/50 bg-luxury-dark/40 px-3 py-2">
                    <Percent className="w-4 h-4 text-luxury-gray mr-2" />
                    <input
                      type="text"
                      placeholder="Collector Code (e.g. AETHER10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="bg-transparent text-xs text-luxury-white outline-none w-full placeholder:text-luxury-gray/40 border-none outline-none focus:ring-0 p-0"
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-luxury-white/10 rounded-lg text-xs uppercase tracking-widest text-luxury-white hover:border-luxury-gold hover:text-luxury-gold transition-all duration-200"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[10px] text-red-500 font-light mt-1.5">{couponError}</p>}
                {couponSuccess && (
                  <p className="text-[10px] text-luxury-gold font-light mt-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 animate-pulse" /> Collector code applied successfully!
                  </p>
                )}
                {promoCode && !couponSuccess && (
                  <p className="text-[10px] text-luxury-gold font-light mt-1.5">
                    Active Code: <span className="font-semibold">{promoCode}</span> ({(discount * 100).toFixed(0)}% Off)
                  </p>
                )}
              </form>

              {/* Bag Recommendations */}
              <div className="pt-6 border-t border-luxury-white/5">
                <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-light mb-3">
                  Complementary Additions
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  {recommendations.map((p) => (
                    <Link
                      href={`/product/${p.id}`}
                      key={p.id}
                      onClick={onClose}
                      className="glass p-3 rounded-xl border border-luxury-white/5 block hover:border-luxury-gold/20 transition-all duration-300"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden bg-luxury-dark mb-2 relative">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <h5 className="text-[11px] text-luxury-white font-medium line-clamp-1">
                        {p.name}
                      </h5>
                      <span className="text-[10px] text-luxury-gold mt-0.5 block font-semibold">
                        {currencySymbol}
                        {Math.floor(p.price * mult)}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Cart Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-luxury-white/5 bg-luxury-dark/45 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-luxury-gray font-light">
                <span>Value Subtotal</span>
                <span>
                  {currencySymbol}
                  {Math.floor(subtotal)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-xs text-luxury-gold font-light">
                  <span>Collector Discount</span>
                  <span>
                    -{currencySymbol}
                    {Math.floor(discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-xs text-luxury-gray font-light">
                <span>Premium Courier Shipping</span>
                <span>
                  {shippingCost === 0 ? (
                    <span className="text-luxury-gold uppercase tracking-wider font-semibold">
                      Complimentary
                    </span>
                  ) : (
                    `${currencySymbol}${Math.floor(shippingCost)}`
                  )}
                </span>
              </div>
              <div className="border-t border-luxury-white/5 pt-2 flex justify-between text-sm text-luxury-white font-medium">
                <span>Total Acquisition</span>
                <span className="text-luxury-gold font-semibold">
                  {currencySymbol}
                  {Math.floor(total)}
                </span>
              </div>
            </div>

            <Link
              href="/checkout"
              onClick={onClose}
              className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-[0.2em] font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              Initiate Acquisition <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
