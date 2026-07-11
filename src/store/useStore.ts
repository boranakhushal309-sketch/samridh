import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image: string;
  images: string[];
  stock: number;
  rating: number;
  reviewsCount: number;
  variants: {
    colors: string[];
    sizes: string[];
  };
  features: string[];
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
  stock: number;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  date: string;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Returned' | 'Refund Requested';
  total: number;
  tracking: string;
  items: CartItem[];
  address: Address;
  paymentMethod: string;
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  approved: boolean;
}

export interface SalesRecord {
  date: string;
  sales: number;
  orders: number;
}

// Initial mock products
export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'aether-no-ix',
    name: 'Aether No. IX',
    price: 245,
    category: 'Fragrance',
    description: 'A modern olfactory signature balancing crisp amberwood, wet cedar, and cold spice. Housed in a custom hand-blown refractive glass flask that refracts light elegantly.',
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 14,
    rating: 4.9,
    reviewsCount: 124,
    variants: {
      colors: ['Classic Gold', 'Noir Black'],
      sizes: ['50ml', '100ml']
    },
    features: [
      'Sustainably sourced rare ingredients',
      'Extrait de Parfum concentration (24%)',
      'Up to 12 hours wear time',
      'Individually numbered glass decanter'
    ]
  },
  {
    id: 'chronos-chronograph',
    name: 'Chronos Chronograph',
    price: 1850,
    category: 'Watches',
    description: 'An automatic kinetic masterpiece featuring a 24-jewel Swiss movement, brushed champagne gold casing, and premium alligator leather straps.',
    image: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1547996160-81dfa63595aa?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 5,
    rating: 5.0,
    reviewsCount: 38,
    variants: {
      colors: ['Champagne Gold', 'Obsidian Black', 'Titanium Silver'],
      sizes: ['38mm', '42mm']
    },
    features: [
      '24-jewel automatic movement',
      'Scratch-resistant sapphire crystal front',
      'Water resistant up to 100 meters (10 ATM)',
      'Hand-stitched full-grain Italian leather'
    ]
  },
  {
    id: 'sonic-aura',
    name: 'Sonic Aura',
    price: 650,
    category: 'Audio',
    description: 'Precision-engineered open-back headphones delivering raw studio clarity. Features gold-accented aluminum housing with acoustic micro-mesh grids and memory foam cups.',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 8,
    rating: 4.8,
    reviewsCount: 89,
    variants: {
      colors: ['Gold Accent', 'Steel Grey', 'Alabaster White'],
      sizes: ['Standard']
    },
    features: [
      '50mm custom beryllium dynamic drivers',
      'Open-back design for expansive soundstage',
      'Detachable silver-plated oxygen-free cable',
      'Premium memory foam with sheepskin lining'
    ]
  },
  {
    id: 'terra-holdall',
    name: 'Terra Holdall',
    price: 1200,
    category: 'Leather',
    description: 'Hand-finished weekend duffel bag in vegetable-tanned Italian Vachetta leather. Designed to patinate beautifully, telling the unique story of your travel journeys.',
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80'
    ],
    stock: 3,
    rating: 4.7,
    reviewsCount: 45,
    variants: {
      colors: ['Tan Vachetta', 'Nero Carbon', 'Forest Moss'],
      sizes: ['Cabin Size', 'Overnight']
    },
    features: [
      'Vegetable-tanned full-grain leather',
      'Solid brass hardware and YKK Excella zippers',
      'Reinforced base with metal protective feet',
      'Complies with carry-on size regulations'
    ]
  }
];

const INITIAL_SALES: SalesRecord[] = [
  { date: 'Mon', sales: 4200, orders: 3 },
  { date: 'Tue', sales: 5900, orders: 4 },
  { date: 'Wed', sales: 3100, orders: 2 },
  { date: 'Thu', sales: 8400, orders: 6 },
  { date: 'Fri', sales: 12500, orders: 9 },
  { date: 'Sat', sales: 14800, orders: 11 },
  { date: 'Sun', sales: 9600, orders: 7 }
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    productId: 'aether-no-ix',
    productName: 'Aether No. IX',
    userName: 'Amélie Laurent',
    rating: 5,
    comment: 'An absolute masterpiece. The dry-down of amberwood and cedar is warm, comforting, yet striking. The bottle is a piece of art on my vanity.',
    date: '2026-06-25',
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'chronos-chronograph',
    productName: 'Chronos Chronograph',
    userName: 'Alexander V.',
    rating: 5,
    comment: 'The weight, the tick, the luxury of the leather strap—it screams craftsmanship. Exceeded all my high expectations. Perfect luxury watch.',
    date: '2026-07-02',
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'sonic-aura',
    productName: 'Sonic Aura',
    userName: 'Sarah Chen',
    rating: 4,
    comment: 'Remarkable clarity. The open-back nature creates an incredible soundstage. Subtracting one star because they leak sound (as expected, but worth noting).',
    date: '2026-07-08',
    approved: true
  }
];

interface UserProfile {
  name: string;
  email: string;
  points: number;
  savedAddresses: Address[];
  orders: Order[];
}

interface AetherState {
  // Theme & Preferences
  theme: 'dark' | 'light';
  currency: 'USD' | 'EUR' | 'GBP' | 'INR';
  currencySymbol: string;
  toggleTheme: () => void;
  setCurrency: (currency: 'USD' | 'EUR' | 'GBP' | 'INR') => void;

  // Products
  products: Product[];
  updateStock: (id: string, newStock: number) => void;
  addProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  promoCode: string | null;
  discount: number; // 0.1 for 10%
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateCartQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  applyPromo: (code: string) => boolean;
  clearCart: () => void;

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: string) => boolean;

  // Auth / User State
  user: UserProfile | null;
  notifications: { id: string; message: string; date: string; read: boolean }[];
  login: (email: string, name: string) => void;
  logout: () => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  removeAddress: (id: string) => void;
  placeOrder: (paymentMethod: string, addressId: string) => Order | null;
  requestRefund: (orderId: string) => void;
  addNotification: (message: string) => void;
  markNotificationsRead: () => void;

  // Admin Logs
  salesRecords: SalesRecord[];
  coupons: { code: string; discount: number }[];
  reviews: Review[];
  addCoupon: (code: string, discount: number) => void;
  deleteCoupon: (code: string) => void;
  addReview: (productId: string, productName: string, userName: string, rating: number, comment: string) => void;
  approveReview: (id: string) => void;
  deleteReview: (id: string) => void;
}

const getSymbol = (curr: string) => {
  if (curr === 'EUR') return '€';
  if (curr === 'GBP') return '£';
  if (curr === 'INR') return '₹';
  return '$';
};

const getConversionMultiplier = (curr: string) => {
  if (curr === 'EUR') return 0.92;
  if (curr === 'GBP') return 0.79;
  if (curr === 'INR') return 83.5;
  return 1;
};

export const useStore = create<AetherState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      currency: 'USD',
      currencySymbol: '$',
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
      setCurrency: (curr) => set({ currency: curr, currencySymbol: getSymbol(curr) }),

      products: INITIAL_PRODUCTS,
      updateStock: (id, newStock) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)),
        })),
      addProduct: (prod) =>
        set((state) => ({
          products: [prod, ...state.products],
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),

      cart: [],
      promoCode: null,
      discount: 0,
      addItem: (item) =>
        set((state) => {
          const exists = state.cart.find(
            (i) => i.id === item.id && i.color === item.color && i.size === item.size
          );
          if (exists) {
            return {
              cart: state.cart.map((i) =>
                i.id === item.id && i.color === item.color && i.size === item.size
                  ? { ...i, quantity: Math.min(i.stock, i.quantity + item.quantity) }
                  : i
              ),
            };
          }
          return { cart: [...state.cart, item] };
        }),
      removeItem: (id, color, size) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.id === id && i.color === color && i.size === size)
          ),
        })),
      updateCartQuantity: (id, quantity, color, size) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.id === id && i.color === color && i.size === size
              ? { ...i, quantity: Math.min(i.stock, Math.max(1, quantity)) }
              : i
          ),
        })),
      applyPromo: (code) => {
        const found = get().coupons.find((c) => c.code.toUpperCase() === code.toUpperCase());
        if (found) {
          set({ promoCode: found.code, discount: found.discount });
          return true;
        }
        return false;
      },
      clearCart: () => set({ cart: [], promoCode: null, discount: 0 }),

      wishlist: [],
      toggleWishlist: (product) =>
        set((state) => {
          const exists = state.wishlist.some((p) => p.id === product.id);
          if (exists) {
            return { wishlist: state.wishlist.filter((p) => p.id !== product.id) };
          }
          return { wishlist: [...state.wishlist, product] };
        }),
      isInWishlist: (id) => get().wishlist.some((p) => p.id === id),

      user: {
        name: 'Guest Collector',
        email: 'collector@aether.luxury',
        points: 450,
        savedAddresses: [
          {
            id: 'addr-1',
            label: 'Private Residence',
            fullName: 'Guest Collector',
            street: '12 Bond Street, Penthouse B',
            city: 'New York',
            postalCode: '10012',
            country: 'United States',
          },
        ],
        orders: [
          {
            id: 'AE-98214',
            date: '2026-05-18',
            status: 'Delivered',
            total: 245,
            tracking: 'LH-8321-9872',
            items: [
              {
                id: 'aether-no-ix',
                name: 'Aether No. IX',
                price: 245,
                image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80',
                quantity: 1,
                color: 'Classic Gold',
                size: '100ml',
                stock: 14,
              },
            ],
            address: {
              id: 'addr-1',
              label: 'Private Residence',
              fullName: 'Guest Collector',
              street: '12 Bond Street, Penthouse B',
              city: 'New York',
              postalCode: '10012',
              country: 'United States',
            },
            paymentMethod: 'Stripe Card',
          },
        ],
      },
      notifications: [
        {
          id: 'notif-1',
          message: 'Welcome to AETHER. Your account has been loaded with 450 luxury reward points.',
          date: '2026-07-11',
          read: false,
        },
      ],
      login: (email, name) =>
        set((state) => ({
          user: {
            name: name || 'Guest Collector',
            email,
            points: 100,
            savedAddresses: [],
            orders: [],
          },
          notifications: [
            {
              id: Math.random().toString(),
              message: `Successfully logged in as ${name}. Welcome back.`,
              date: new Date().toISOString().split('T')[0],
              read: false,
            },
            ...state.notifications,
          ],
        })),
      logout: () => set({ user: null }),
      addAddress: (addr) =>
        set((state) => {
          if (!state.user) return {};
          const newAddr = { ...addr, id: `addr-${Math.random()}` };
          return {
            user: {
              ...state.user,
              savedAddresses: [...state.user.savedAddresses, newAddr],
            },
          };
        }),
      removeAddress: (id) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              savedAddresses: state.user.savedAddresses.filter((a) => a.id !== id),
            },
          };
        }),
      placeOrder: (paymentMethod, addressId) => {
        const state = get();
        if (!state.user) return null;
        const address = state.user.savedAddresses.find((a) => a.id === addressId) || state.user.savedAddresses[0];
        if (!address) return null;

        const cartSub = state.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const subConverted = cartSub * getConversionMultiplier(state.currency);
        const totalAmount = subConverted * (1 - state.discount);

        const newOrder: Order = {
          id: `AE-${Math.floor(10000 + Math.random() * 90000)}`,
          date: new Date().toISOString().split('T')[0],
          status: 'Processing',
          total: Number(totalAmount.toFixed(2)),
          tracking: `LH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
          items: [...state.cart],
          address,
          paymentMethod,
        };

        // Deduct stocks
        state.cart.forEach((c) => {
          state.updateStock(c.id, c.stock - c.quantity);
        });

        // Add sales record to admin analytics
        const recordDate = new Date().toLocaleDateString('en-US', { weekday: 'short' });
        const updatedSales = state.salesRecords.map((r) =>
          r.date === recordDate
            ? { ...r, sales: r.sales + totalAmount, orders: r.orders + 1 }
            : r
        );

        set({
          user: {
            ...state.user,
            orders: [newOrder, ...state.user.orders],
            points: state.user.points + Math.floor(cartSub * 0.1), // 10% value back in points
          },
          salesRecords: updatedSales,
          notifications: [
            {
              id: Math.random().toString(),
              message: `Order ${newOrder.id} has been placed successfully. Thank you for collecting AETHER.`,
              date: new Date().toISOString().split('T')[0],
              read: false,
            },
            ...state.notifications,
          ],
        });

        state.clearCart();
        return newOrder;
      },
      requestRefund: (orderId) =>
        set((state) => {
          if (!state.user) return {};
          return {
            user: {
              ...state.user,
              orders: state.user.orders.map((o) =>
                o.id === orderId ? { ...o, status: 'Refund Requested' as const } : o
              ),
            },
            notifications: [
              {
                id: Math.random().toString(),
                message: `Refund request for order ${orderId} is being evaluated.`,
                date: new Date().toISOString().split('T')[0],
                read: false,
              },
              ...state.notifications,
            ],
          };
        }),
      addNotification: (msg) =>
        set((state) => ({
          notifications: [
            {
              id: Math.random().toString(),
              message: msg,
              date: new Date().toISOString().split('T')[0],
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      salesRecords: INITIAL_SALES,
      coupons: [
        { code: 'AETHER10', discount: 0.1 },
        { code: 'LUXURY20', discount: 0.2 },
        { code: 'AESOP', discount: 0.15 },
      ],
      reviews: INITIAL_REVIEWS,
      addCoupon: (code, discount) =>
        set((state) => ({
          coupons: [...state.coupons, { code: code.toUpperCase(), discount }],
        })),
      deleteCoupon: (code) =>
        set((state) => ({
          coupons: state.coupons.filter((c) => c.code !== code),
        })),
      addReview: (productId, productName, userName, rating, comment) =>
        set((state) => {
          const newReview: Review = {
            id: `rev-${Math.random()}`,
            productId,
            productName,
            userName,
            rating,
            comment,
            date: new Date().toISOString().split('T')[0],
            approved: false, // Moderated by default
          };
          return {
            reviews: [newReview, ...state.reviews],
          };
        }),
      approveReview: (id) =>
        set((state) => ({
          reviews: state.reviews.map((r) => (r.id === id ? { ...r, approved: true } : r)),
        })),
      deleteReview: (id) =>
        set((state) => ({
          reviews: state.reviews.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'aether-luxury-storage',
      partialize: (state) => ({
        theme: state.theme,
        currency: state.currency,
        currencySymbol: state.currencySymbol,
        cart: state.cart,
        wishlist: state.wishlist,
        user: state.user,
        products: state.products,
        salesRecords: state.salesRecords,
        coupons: state.coupons,
        reviews: state.reviews,
        notifications: state.notifications,
      }),
    }
  )
);
