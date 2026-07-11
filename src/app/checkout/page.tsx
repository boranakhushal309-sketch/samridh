"use client";
import React, { useState } from 'react';
import { useStore, Address, Order } from '@/store/useStore';
import {
  CreditCard,
  Truck,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Check
} from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const cart = useStore((state) => state.cart);
  const user = useStore((state) => state.user);
  const addAddress = useStore((state) => state.addAddress);
  const placeOrder = useStore((state) => state.placeOrder);
  const currencySymbol = useStore((state) => state.currencySymbol);
  const currency = useStore((state) => state.currency);
  const discount = useStore((state) => state.discount);
  const clearCart = useStore((state) => state.clearCart);

  // Checkout State
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Shipping, 2: Payment, 3: Success Confirmation
  const [shippingMethod, setShippingMethod] = useState<'complimentary' | 'express'>('complimentary');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'razorpay' | 'cod'>('stripe');
  const [placedOrderDetails, setPlacedOrderDetails] = useState<Order | null>(null);

  // Address Form States
  const [addrName, setAddrName] = useState(user?.name || '');
  const [addrStreet, setAddrStreet] = useState(user?.savedAddresses[0]?.street || '');
  const [addrCity, setAddrCity] = useState(user?.savedAddresses[0]?.city || '');
  const [addrPost, setAddrPost] = useState(user?.savedAddresses[0]?.postalCode || '');
  const [addrCountry, setAddrCountry] = useState(user?.savedAddresses[0]?.country || '');

  // Payment Form States
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [isPaying, setIsPaying] = useState(false);

  // Conversion calculations
  const getConversionMultiplier = () => {
    if (currency === 'EUR') return 0.92;
    if (currency === 'GBP') return 0.79;
    if (currency === 'INR') return 83.5;
    return 1;
  };
  const mult = getConversionMultiplier();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * mult;
  const discountAmount = subtotal * discount;
  const shippingCost = shippingMethod === 'complimentary' ? 0 : 45 * mult;
  const total = subtotal - discountAmount + shippingCost;

  // Handle Card input formatting
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 16);
    const sections = val.match(/.{1,4}/g);
    setCardNum(sections ? sections.join(' ') : val);
  };

  const handleCardExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.substring(0, 4);
    if (val.length >= 2) {
      setCardExp(`${val.substring(0, 2)}/${val.substring(2)}`);
    } else {
      setCardExp(val);
    }
  };

  const handleCardCvc = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').substring(0, 3);
    setCardCvc(val);
  };

  // Submit Shipping details
  const submitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrStreet || !addrCity || !addrPost || !addrCountry) return;

    // Check if address already exists in store
    const addressExists = user?.savedAddresses.some((a) => a.street === addrStreet);
    if (!addressExists) {
      addAddress({
        label: 'Courier Drop-off',
        fullName: addrName,
        street: addrStreet,
        city: addrCity,
        postalCode: addrPost,
        country: addrCountry
      });
    }
    setStep(2);
  };

  // Submit Payment / Order Creation
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod === 'stripe' && (cardNum.length < 19 || cardExp.length < 5 || cardCvc.length < 3)) {
      alert('Please fill correct credit card information.');
      return;
    }

    setIsPaying(true);

    // Simulate Payment delay (Apple/Aesop cinematic feel)
    setTimeout(() => {
      setIsPaying(false);
      
      // Select the first address ID
      const addressId = user?.savedAddresses[0]?.id || 'addr-1';
      const order = placeOrder(
        paymentMethod === 'stripe'
          ? 'Stripe Secured Card'
          : paymentMethod === 'razorpay'
          ? 'Razorpay UPI Vault'
          : 'Cash On Delivery (COD)',
        addressId
      );

      if (order) {
        setPlacedOrderDetails(order);
        setStep(3);
      } else {
        alert("Failed to process transaction. Please verify addresses.");
      }
    }, 2500);
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag className="w-12 h-12 text-luxury-gray/30 mb-4 stroke-[1]" />
        <h2 className="text-xl font-serif text-luxury-white">Your bag is vacant</h2>
        <p className="text-xs text-luxury-gray mt-2">Cannot checkout empty offerings. Please add products to proceed.</p>
        <Link href="/" className="mt-6 px-6 py-3 bg-luxury-gold text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl">
          Return to Curation
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
      {/* Checkout Step Headers */}
      {step !== 3 && (
        <div className="flex items-center gap-4 mb-12 pb-6 border-b border-luxury-white/5">
          <span className={`text-xs uppercase tracking-widest ${step === 1 ? 'text-luxury-gold font-medium' : 'text-luxury-gray font-light'}`}>
            01 Shipping address
          </span>
          <span className="w-4 h-[1px] bg-luxury-white/10" />
          <span className={`text-xs uppercase tracking-widest ${step === 2 ? 'text-luxury-gold font-medium' : 'text-luxury-gray font-light'}`}>
            02 Payment method
          </span>
        </div>
      )}

      {step === 3 ? (
        /* STAGE 3: ORDER SUCCESS CONFIRMATION (Cinematic design) */
        <div className="max-w-xl mx-auto text-center space-y-8 py-12">
          {/* Confetti & Success Mark */}
          <div className="relative inline-block">
            <div className="absolute inset-0 rounded-full bg-luxury-gold/15 blur-xl animate-pulse" />
            <CheckCircle2 className="w-20 h-20 text-luxury-gold stroke-[1] relative animate-bounce" />
          </div>

          <div className="space-y-3">
            <span className="text-xs uppercase tracking-[0.25em] text-luxury-gold font-light block">
              Heritage acquisition complete
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-light text-luxury-white">
              Acquisition Logged
            </h2>
            <p className="text-xs md:text-sm text-luxury-gray font-light leading-relaxed">
              Your offering transaction was successfully settled. An encrypted email receipt and live shipment details are transmitted.
            </p>
          </div>

          {/* Receipt summary card */}
          {placedOrderDetails && (
            <div className="p-6 rounded-2xl glass border border-luxury-gold/30 text-left space-y-4 shadow-2xl">
              <div className="flex justify-between items-center pb-3 border-b border-luxury-white/5 text-xs text-luxury-gray uppercase tracking-widest">
                <span>Log reference</span>
                <span className="text-luxury-white font-medium">{placedOrderDetails.id}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-luxury-gray uppercase tracking-widest">
                <span>Courier tracking</span>
                <span className="text-luxury-gold font-medium">{placedOrderDetails.tracking}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-luxury-gray uppercase tracking-widest">
                <span>Method settled</span>
                <span className="text-luxury-white font-light">{placedOrderDetails.paymentMethod}</span>
              </div>
              <div className="border-t border-luxury-white/5 pt-3 flex justify-between items-center text-sm font-medium">
                <span className="text-luxury-gray uppercase text-xs tracking-widest">Acquisition Total</span>
                <span className="text-luxury-gold font-semibold">
                  {currencySymbol}
                  {placedOrderDetails.total}
                </span>
              </div>

              {/* Reward Point notification */}
              <div className="p-3 bg-luxury-gold/10 border border-luxury-gold/15 rounded-xl flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-luxury-gold" />
                <span className="text-[10px] text-luxury-gold font-semibold uppercase tracking-wider">
                  +{Math.floor(placedOrderDetails.total * 0.1)} Collector points logged to dashboard
                </span>
              </div>
            </div>
          )}

          <div className="flex gap-4 justify-center">
            <Link
              href="/"
              className="px-6 py-3 bg-luxury-white text-luxury-black text-xs uppercase tracking-widest font-semibold rounded-xl transition-all duration-300"
            >
              Continue Curation
            </Link>
            <Link
              href="/dashboard"
              className="px-6 py-3 border border-luxury-white/10 hover:border-luxury-gold text-luxury-white hover:text-luxury-gold text-xs uppercase tracking-widest font-light rounded-xl transition-all duration-300"
            >
              Access Collector Room
            </Link>
          </div>
        </div>
      ) : (
        /* STAGE 1 & 2: ADDRESS & PAYMENT FORM */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Left Columns: Steps Forms */}
          <div className="lg:col-span-2">
            {step === 1 ? (
              /* STEP 1: ADDRESS INFO */
              <form onSubmit={submitShipping} className="space-y-6">
                <h3 className="text-lg font-serif text-luxury-white font-light">
                  Specify Courier Destination
                </h3>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                      Recipient Signature
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={addrName}
                      onChange={(e) => setAddrName(e.target.value)}
                      className="w-full bg-luxury-dark border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                      Street Residence / Suite
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="12 Bond Street, Apartment B"
                      value={addrStreet}
                      onChange={(e) => setAddrStreet(e.target.value)}
                      className="w-full bg-luxury-dark border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                        City
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="New York"
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full bg-luxury-dark border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="10012"
                        value={addrPost}
                        onChange={(e) => setAddrPost(e.target.value)}
                        className="w-full bg-luxury-dark border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                      Country
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="United States"
                      value={addrCountry}
                      onChange={(e) => setAddrCountry(e.target.value)}
                      className="w-full bg-luxury-dark border border-luxury-white/10 rounded-xl p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                    />
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-luxury-white/5">
                  <h4 className="text-[10px] uppercase tracking-widest text-luxury-gold font-semibold">
                    Courier Courier Options
                  </h4>
                  <div className="space-y-2">
                    <div
                      onClick={() => setShippingMethod('complimentary')}
                      className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        shippingMethod === 'complimentary'
                          ? 'border-luxury-gold bg-luxury-gold/5'
                          : 'border-luxury-white/10 hover:border-luxury-white/20'
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <Truck className="w-5 h-5 text-luxury-gold" />
                        <div>
                          <p className="text-xs text-luxury-white font-medium">Complimentary Courier</p>
                          <p className="text-[10px] text-luxury-gray font-light mt-0.5">Estimated delivery: 2-3 business days.</p>
                        </div>
                      </div>
                      <span className="text-xs text-luxury-gold uppercase font-semibold">Complimentary</span>
                    </div>

                    <div
                      onClick={() => setShippingMethod('express')}
                      className={`flex justify-between items-center p-4 rounded-xl border cursor-pointer transition-all duration-300 ${
                        shippingMethod === 'express'
                          ? 'border-luxury-gold bg-luxury-gold/5'
                          : 'border-luxury-white/10 hover:border-luxury-white/20'
                      }`}
                    >
                      <div className="flex gap-3 items-center">
                        <Sparkles className="w-5 h-5 text-luxury-gold animate-pulse" />
                        <div>
                          <p className="text-xs text-luxury-white font-medium">Priority Insured Courier</p>
                          <p className="text-[10px] text-luxury-gray font-light mt-0.5">Guaranteed delivery: Next business day.</p>
                        </div>
                      </div>
                      <span className="text-xs text-luxury-white font-medium">+{currencySymbol}{45 * mult}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-md cursor-pointer"
                >
                  Proceed to Settling <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              /* STEP 2: PAYMENT SELECTION */
              <form onSubmit={handlePlaceOrder} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-serif text-luxury-white font-light">
                    Settle Offering Balance
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-[10px] text-luxury-gray hover:text-luxury-white flex items-center gap-1 uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> Back to destination
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'stripe', label: 'Stripe Vault' },
                    { id: 'razorpay', label: 'Razorpay UPI' },
                    { id: 'cod', label: 'Cash / COD' }
                  ].map((pay) => (
                    <button
                      key={pay.id}
                      type="button"
                      onClick={() => setPaymentMethod(pay.id as any)}
                      className={`p-4 rounded-xl border text-[10px] uppercase tracking-widest font-medium transition-all duration-300 cursor-pointer ${
                        paymentMethod === pay.id
                          ? 'border-luxury-gold bg-luxury-gold/5 text-luxury-gold'
                          : 'border-luxury-white/10 text-luxury-white hover:border-luxury-white/20'
                      }`}
                    >
                      {pay.label}
                    </button>
                  ))}
                </div>

                {paymentMethod === 'stripe' && (
                  <div className="p-6 rounded-2xl glass border border-luxury-white/5 space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between pb-3 border-b border-luxury-white/5 text-[10px] uppercase tracking-widest text-luxury-gray">
                      <span className="flex items-center gap-1"><CreditCard className="w-4 h-4 text-luxury-gold" /> Encrypted stripe session</span>
                      <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-luxury-gold" /> SSL SECURE</span>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                        Credit Card Number
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="0000 0000 0000 0000"
                        value={cardNum}
                        onChange={handleCardNumber}
                        className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 tracking-wider"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                          Expiration (MM/YY)
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="MM/YY"
                          value={cardExp}
                          onChange={handleCardExpiry}
                          className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-widest text-luxury-gray font-light">
                          Security Code (CVC)
                        </label>
                        <input
                          type="password"
                          required
                          placeholder="123"
                          value={cardCvc}
                          onChange={handleCardCvc}
                          className="w-full bg-luxury-black border border-luxury-white/10 rounded-lg p-3 text-xs text-luxury-white outline-none focus:border-luxury-gold/50 tracking-widest"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'razorpay' && (
                  <div className="p-6 rounded-2xl glass border border-luxury-white/5 text-center space-y-3 animate-fade-in">
                    <Sparkles className="w-8 h-8 text-luxury-gold mx-auto animate-pulse" />
                    <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium">Razorpay Instant Gateway</h4>
                    <p className="text-[10px] text-luxury-gray font-light max-w-sm mx-auto leading-relaxed">
                      Completing settlement will prompt the secure Razorpay UPI wallet modal where you can settle via Netbanking or GooglePay.
                    </p>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-6 rounded-2xl glass border border-luxury-white/5 text-center space-y-3 animate-fade-in">
                    <Truck className="w-8 h-8 text-luxury-gold mx-auto" />
                    <h4 className="text-xs uppercase tracking-widest text-luxury-white font-medium">Cash On Delivery Selection</h4>
                    <p className="text-[10px] text-luxury-gray font-light max-w-sm mx-auto leading-relaxed">
                      Your balance will be settled in physical cash currency directly with our courier messenger upon receiving the hand-sealed presentation cylinders.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isPaying}
                  className="w-full py-4 bg-luxury-gold hover:bg-luxury-gold-dark text-luxury-black text-xs uppercase tracking-widest font-semibold flex items-center justify-center gap-2 rounded-xl transition-all duration-300 shadow-md cursor-pointer disabled:opacity-45"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Authorizing Settlement ...
                    </>
                  ) : (
                    <>
                      Complete Acquisition ({currencySymbol}{Math.floor(total)})
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Order Summary Details */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl glass border border-luxury-white/5 space-y-4">
              <h3 className="text-xs uppercase tracking-[0.2em] text-luxury-gold font-semibold pb-3 border-b border-luxury-white/5">
                Acquisition Summary
              </h3>

              {/* Items list */}
              <div className="space-y-3 max-h-[220px] overflow-y-auto no-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.color || ''}-${item.size || ''}`} className="flex gap-3 justify-between items-center text-xs">
                    <div className="flex gap-2.5 items-center">
                      <div className="w-8 h-8 rounded bg-luxury-dark overflow-hidden shrink-0 border border-luxury-white/5">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-luxury-white font-medium line-clamp-1">{item.name}</p>
                        <p className="text-[9px] text-luxury-gray uppercase tracking-widest font-light mt-0.5">Qty {item.quantity} | {item.size}</p>
                      </div>
                    </div>
                    <span className="text-luxury-white font-semibold">
                      {currencySymbol}
                      {Math.floor(item.price * mult * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totals calculations */}
              <div className="border-t border-luxury-white/5 pt-4 space-y-2.5 text-xs">
                <div className="flex justify-between text-luxury-gray font-light">
                  <span>Bag Subtotal</span>
                  <span>{currencySymbol}{Math.floor(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-luxury-gold font-light">
                    <span>Discount (Code applied)</span>
                    <span>-{currencySymbol}{Math.floor(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-luxury-gray font-light">
                  <span>Courier Delivery</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-luxury-gold font-semibold uppercase tracking-widest text-[9px]">Complimentary</span>
                    ) : (
                      `${currencySymbol}${Math.floor(shippingCost)}`
                    )}
                  </span>
                </div>
                <div className="border-t border-luxury-white/5 pt-2.5 flex justify-between text-sm font-semibold">
                  <span className="text-luxury-white uppercase text-xs tracking-widest font-light">Total Acquisition</span>
                  <span className="text-luxury-gold">
                    {currencySymbol}
                    {Math.floor(total)}
                  </span>
                </div>
              </div>
            </div>

            {/* Shield trust */}
            <div className="flex items-start gap-3 p-4 rounded-xl border border-luxury-white/5 bg-luxury-dark/30 text-[10px] text-luxury-gray font-light leading-relaxed">
              <ShieldCheck className="w-5 h-5 text-luxury-gold shrink-0 mt-0.5 animate-pulse" />
              <p>
                AETHER runs encrypted transaction sockets. We do not store raw card numbers. Every security key is tokenized by Stripe or Razorpay protocols.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
