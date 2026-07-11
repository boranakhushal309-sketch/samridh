"use client";
import React, { useState, useEffect, useRef } from 'react';
import { Search, Mic, MicOff, X, Sparkles, ArrowRight } from 'lucide-react';
import { useStore, Product } from '@/store/useStore';
import Link from 'next/link';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiResults, setAiResults] = useState<{ product: Product; match: number }[]>([]);
  const products = useStore((state) => state.products);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Initialize Web Speech API
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);
        recognition.onerror = () => setIsListening(false);
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setQuery(transcript);
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Semantic Mock Search Logic
  useEffect(() => {
    if (!query.trim()) {
      setAiResults([]);
      return;
    }

    const term = query.toLowerCase();
    const results = products
      .map((p) => {
        let score = 0;

        // Exact match
        if (p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)) {
          score += 50;
        }

        // Semantic synonym mapping
        const synonyms: Record<string, string[]> = {
          fragrance: ['perfume', 'scent', 'smell', 'cologne', 'bottle', 'spray', 'aroma', 'amberwood', 'cedar'],
          watches: ['timepiece', 'clock', 'gold watch', 'chronograph', 'wrist', 'strap', 'kinetic', 'automatic'],
          audio: ['headphones', 'music', 'sound', 'ears', 'speakers', 'earphone', 'acoustic', 'studio', 'bass'],
          leather: ['bag', 'luggage', 'duffel', 'holdall', 'tan', 'leather', 'travel', 'cabin'],
        };

        const currentSyns = synonyms[p.category.toLowerCase()] || [];
        currentSyns.forEach((syn) => {
          if (term.includes(syn)) score += 30;
        });

        // Feature descriptions
        p.features.forEach((feat) => {
          if (feat.toLowerCase().includes(term)) score += 15;
        });

        if (p.description.toLowerCase().includes(term)) {
          score += 10;
        }

        // Add some organic variation to match rating
        const finalScore = score > 0 ? Math.min(99, 45 + Math.floor(score / 2)) : 0;

        return { product: p, match: finalScore };
      })
      .filter((r) => r.match > 0)
      .sort((a, b) => b.match - a.match);

    setAiResults(results);
  }, [query, products]);

  // Toggle Voice Recognition
  const toggleVoice = () => {
    if (!recognitionRef.current) {
      alert("Voice search is not supported in this browser. Please use Google Chrome or Microsoft Edge.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      recognitionRef.current.start();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-luxury-black/95 backdrop-blur-2xl transition-all duration-300">
      {/* Search Header */}
      <div className="flex justify-between items-center p-6 md:px-12 border-b border-luxury-white/5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-luxury-gold animate-pulse-slow" />
          <span className="text-xs uppercase tracking-[0.2em] font-light text-luxury-gold">
            AETHER AI Search Engine
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-luxury-gray hover:text-luxury-white hover:scale-105 transition-all duration-200"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Input Field Container */}
      <div className="max-w-4xl w-full mx-auto px-6 py-12 flex-1 flex flex-col justify-start">
        <div className="relative flex items-center border-b border-luxury-gold/30 pb-4 focus-within:border-luxury-gold transition-colors duration-300">
          <Search className="w-6 h-6 text-luxury-gold mr-4" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Describe what you are looking for (e.g. 'gold timepiece with leather strap')"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-xl md:text-2xl font-light text-luxury-white placeholder:text-luxury-gray/50 border-none outline-none focus:ring-0"
          />
          <button
            onClick={toggleVoice}
            className={`p-2 rounded-full transition-colors duration-200 ${
              isListening ? 'bg-red-500/20 text-red-500 animate-pulse' : 'text-luxury-gray hover:text-luxury-gold'
            }`}
            title="Search by Voice"
          >
            {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </button>
        </div>

        {/* Suggestion tags */}
        {!query && (
          <div className="mt-6">
            <h4 className="text-xs uppercase tracking-[0.15em] text-luxury-gray font-light mb-3">
              Suggested Concepts
            </h4>
            <div className="flex flex-wrap gap-2">
              {['Extrait de Parfum', 'Swiss Movement Timepiece', 'Audiophile Acoustics', 'Vachetta Leather Bag'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-4 py-2 rounded-full glass text-xs text-luxury-white hover:border-luxury-gold/50 transition-all duration-200"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* AI Results */}
        {query && (
          <div className="mt-12 flex-1 overflow-y-auto no-scrollbar pb-12">
            <h3 className="text-xs uppercase tracking-[0.15em] text-luxury-gold font-light mb-6 flex items-center gap-2">
              <Sparkles className="w-4 h-4" /> Semantic Matching Results
            </h3>

            {aiResults.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-luxury-gray font-light text-sm">
                  No matches found for &quot;<span className="text-luxury-white">{query}</span>&quot;. Try terms like perfume, leather, gold, audio.
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {aiResults.map(({ product, match }) => (
                  <div
                    key={product.id}
                    className="glass p-5 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-luxury-gold/30 transition-all duration-300"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-luxury-dark relative border border-luxury-white/5">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-medium">
                          {product.category}
                        </span>
                        <h4 className="text-base text-luxury-white font-medium mt-0.5">{product.name}</h4>
                        <p className="text-xs text-luxury-gray font-light line-clamp-1 max-w-lg mt-1">
                          {product.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 w-full md:w-auto justify-between border-t border-luxury-white/5 pt-4 md:border-none md:pt-0">
                      <div className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          <Sparkles className="w-3.5 h-3.5 text-luxury-gold" />
                          <span className="text-xs text-luxury-gold font-semibold">{match}% AI Match</span>
                        </div>
                        <div className="w-24 h-1 bg-luxury-white/10 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-luxury-gold rounded-full"
                            style={{ width: `${match}%` }}
                          />
                        </div>
                      </div>

                      <Link
                        href={`/product/${product.id}`}
                        onClick={onClose}
                        className="px-4 py-2 bg-luxury-white/5 hover:bg-luxury-gold hover:text-luxury-black text-xs uppercase tracking-widest rounded-lg flex items-center gap-2 transition-all duration-200"
                      >
                        Acquire <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
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
