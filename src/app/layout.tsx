import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navigation/Navbar";
import LenisProvider from "@/components/navigation/LenisProvider";
import CustomCursor from "@/components/navigation/CustomCursor";

export const metadata: Metadata = {
  title: "AETHER | Ultra-Premium Luxury E-commerce",
  description: "Explore AETHER's curated offerings: hand-crafted fragrances, Swiss-movement kinetic timepieces, and bespoke audiophile audio. Experiential luxury, smooth animations, and premium craftsmanship.",
  keywords: "luxury perfume, Swiss watches, premium audio, designer bags, custom fragrances, luxury ecommerce, AETHER",
  authors: [{ name: "AETHER Brand Group" }],
  openGraph: {
    title: "AETHER | Luxury Living Concept Store",
    description: "Experience modern, minimalistic luxury with hand-finished products and seamless scrolling kinematics.",
    url: "https://aether.luxury",
    siteName: "AETHER Luxury",
    images: [
      {
        url: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&h=630&q=80",
        width: 1200,
        height: 630,
        alt: "AETHER Luxury Collection",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased selection:bg-luxury-gold selection:text-luxury-black bg-luxury-black text-luxury-white">
        <LenisProvider>
          <CustomCursor />
          <Navbar />
          <main className="min-h-screen flex flex-col pt-20">
            {children}
          </main>
        </LenisProvider>
      </body>
    </html>
  );
}
