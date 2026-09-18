'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  ShoppingBag,
  ChevronDown,
  Star,
  Crown,
  Sparkle,
  Plus,
  Minus,
} from 'lucide-react';
import { LuxuryCurrency } from '@/components/parisian/TreatmentMenu';
import { CartItem } from './LuxuryCartDrawer';

export interface BottegaProduct {
  id: string;
  title: string;
  subtitle: string;
  italianTitle?: string;
  tagline: string;
  priceEUR: number;
  priceUSD: number;
  priceINR: number;
  priceAED: number;
  priceGBP: number;
  rating: number;
  reviewsCount: number;
  stockCount: number;
  batchNumber: string;
  sizes: string[];
  defaultSize: string;
  images: string[];
  story: string;
  storyDetails: string[];
  ingredients: { name: string; benefit: string; origin: string }[];
  applicationRitual: { step: string; instruction: string }[];
  editorsNote: {
    quote: string;
    author: string;
    role: string;
    avatarInitials: string;
  };
}

export const BOTTEGA_PRODUCTS: BottegaProduct[] = [
  {
    id: 'siero-doro-24k',
    title: "24k Gold Serum — Cellular Longevity Elixir",
    subtitle: "Sicilian 24k Gold & Bio-Peptide Serum",
    italianTitle: "Sicilian 24k Gold & Bio-Peptide Serum",
    tagline: 'Pure 24k gold leaf micro-infusion with cold-pressed Sicilian citrus and marine bio-peptides.',
    priceEUR: 280,
    priceUSD: 310,
    priceINR: 24500,
    priceAED: 1120,
    priceGBP: 240,
    rating: 4.99,
    reviewsCount: 312,
    stockCount: 14,
    batchNumber: 'Batch #084 • Harvest Autumn 2026',
    sizes: ['30ml / 1.0 fl. oz.', '50ml / 1.7 fl. oz.'],
    defaultSize: '50ml / 1.7 fl. oz.',
    images: ['/images/belladonna_ritual.jpg', '/images/facial.jpg', '/images/belladonna_bottega.jpg'],
    story:
      'Harvested from organic volcanic groves near Mount Etna, Sicily and cold-milled in Milan, the 24k Gold Serum represents eighteen months of bio-fermentation research. Each drop delivers pure suspended 24-karat gold flakes that melt upon skin contact, triggering cellular micro-circulation and delivering high-density peptide nutrition.',
    storyDetails: [
      'Pure 24-Karat Gold Leaf suspended in bio-fermented sea kelp nectar',
      'Cold-pressed Sicilian Neroli blossoms harvested at dawn to preserve volatile terpenes',
      'Encapsulated tri-peptides designed to replicate clinic cryogenic lifting at home',
    ],
    ingredients: [
      { name: '24k Gold Micro-Flakes (99.9% Pure)', benefit: 'Stimulates micro-circulation & cellular luminosity', origin: 'Florence, Italy' },
      { name: 'Bio-Fermented Marine Peptides', benefit: 'Increases dermal density & restores firm elasticity', origin: 'Venetian Bio-Lab' },
      { name: 'Sicilian Neroli Terpene Essence', benefit: 'Deep aromatherapy calm & antioxidant barrier protection', origin: 'Etna Groves, Sicily' },
      { name: 'Triple Molecular Hyaluronic Acid', benefit: 'Multi-depth hydration with zero greasy residue', origin: 'Milanese Bio-Lab' },
    ],
    applicationRitual: [
      { step: '01 • Awaken', instruction: 'Dispense 3 to 4 golden drops into the warmth of your palms and inhale the aromatic Neroli aroma deeply.' },
      { step: '02 • Sculpt', instruction: 'Press firmly across cheekbones, jawline, and forehead using upward sweeping lymphatic motions.' },
      { step: '03 • Seal', instruction: 'Gently tap remaining elixir around orbital eye contours and collarbone for an ethereal, cashmere glow.' },
    ],
    editorsNote: {
      quote:
        '“We formulated the 24k Gold Serum to bridge the gap between our private Milanese palazzo cryo-rituals and daily home longevity care. It absorbs without a trace of weight, leaving an unmistakable silk-satin luminescence.”',
      author: 'Chiara Belladonna',
      role: 'Master Formulator & Lead Facialist',
      avatarInitials: 'CB',
    },
  },
  {
    id: 'crema-nera-pantelleria',
    title: 'Obsidian Mineral Night Cream — Restorative Cell Nectar',
    subtitle: 'Volcanic Obsidian & Botanical Lipid Complex',
    italianTitle: 'Volcanic Obsidian & Botanical Lipid Complex',
    tagline: 'Volcanic mineral complex paired with organic Mediterranean botanical lipid balm.',
    priceEUR: 245,
    priceUSD: 270,
    priceINR: 21800,
    priceAED: 980,
    priceGBP: 210,
    rating: 4.97,
    reviewsCount: 188,
    stockCount: 19,
    batchNumber: 'Batch #062 • Mediterranean Reserve',
    sizes: ['50ml / 1.7 fl. oz.', '100ml / 3.4 fl. oz.'],
    defaultSize: '50ml / 1.7 fl. oz.',
    images: ['/images/facial.jpg', '/images/belladonna_bottega.jpg', '/images/hero_salon.jpg'],
    story:
      'Born from the mineral-dense obsidian soil of the island of Pantelleria, this restorative night nectar cocoon works in synchrony with your nighttime circadian repair cycle. Rich in polyphenols and ceramides, it seals cellular moisture and reverses oxidative stress while you sleep.',
    storyDetails: [
      'Obsidian volcanic mineral complex rich in silica, magnesium, and potassium',
      'Wild caper extract from Pantelleria providing intensive calming benefits',
      'Omega 3-6-9 ceramide matrix supporting lipid barrier reconstruction',
    ],
    ingredients: [
      { name: 'Obsidian Volcanic Mineral Extract', benefit: 'Reinforces cellular resilience against pollution', origin: 'Pantelleria Island, Sicily' },
      { name: 'Wild Caper Polyphenols', benefit: 'Soothes inflammation & reduces night moisture loss', origin: 'Pantelleria, Italy' },
      { name: 'Cold-Pressed Sweet Almond Lipid', benefit: 'Deep velvet hydration and suppleness', origin: 'Tuscany, Italy' },
    ],
    applicationRitual: [
      { step: '01 • Warm', instruction: 'Warm a pearl-sized amount between fingertips to activate the obsidian balm texture.' },
      { step: '02 • Massage', instruction: 'Glide upward along neck and jawline, focusing on areas of daytime tension.' },
      { step: '03 • Night Rest', instruction: 'Allow the restorative film to cocoon your skin overnight. Rinse with cool water in the morning.' },
    ],
    editorsNote: {
      quote:
        '“This night nectar is the quintessential recovery remedy after travel or high-stress days. Clients wake up with plump, calm, and visibly rested skin.”',
      author: 'Elena Russo',
      role: 'Master Aesthetician & Skincare Biologist',
      avatarInitials: 'ER',
    },
  },
  {
    id: 'olio-neroli-bergamotto',
    title: 'Neroli & Bergamot Body Silk Oil — Radiant Hydration',
    subtitle: 'Sublime Body & Massage Silk Infusion',
    italianTitle: 'Sublime Body & Massage Silk Infusion',
    tagline: 'Ultra-light dry oil infusion formulated with hand-pressed sweet almond and bergamot.',
    priceEUR: 165,
    priceUSD: 185,
    priceINR: 14800,
    priceAED: 660,
    priceGBP: 140,
    rating: 4.98,
    reviewsCount: 245,
    stockCount: 22,
    batchNumber: 'Batch #091 • Tuscan Press',
    sizes: ['100ml / 3.4 fl. oz.', '200ml / 6.8 fl. oz.'],
    defaultSize: '100ml / 3.4 fl. oz.',
    images: ['/images/massage.jpg', '/images/hair.jpg', '/images/belladonna_ritual.jpg'],
    story:
      'An intoxicating multi-use dry oil designed for body, décolletage, and hair tips. Blended using certified organic sweet almond oil and distilled green Calabrian bergamot zest, it absorbs in seconds, leaving an iridescent silk sheen without residue.',
    storyDetails: [
      'Zero greasy residue formulation with rapid absorption dry-finish esters',
      'Cold-distilled bergamot peel oil providing uplifting aromatherapy benefits',
      'Infused with Tuscan floral wax for long-lasting silken softness',
    ],
    ingredients: [
      { name: 'Cold-Pressed Sweet Almond Oil', benefit: 'Deep cutaneous softening and hydration', origin: 'Lucca, Tuscany' },
      { name: 'Calabrian Bergamot Zest', benefit: 'Bright, invigorating citrus aroma and tone', origin: 'Calabria, Italy' },
      { name: 'Vitamin E & Camellia Seed Extract', benefit: 'Potent free-radical neutralization', origin: 'Lake Como, Italy' },
    ],
    applicationRitual: [
      { step: '01 • Shower / Bath', instruction: 'Apply directly onto slightly damp skin post-bath to lock in maximum hydration.' },
      { step: '02 • Décolletage & Shoulders', instruction: 'Sweep along shoulders and collarbone for an immediate luminous sheen.' },
      { step: '03 • Hair Tips', instruction: 'Work 1 drop through hair ends to tame flyaways and impart subtle fragrance.' },
    ],
    editorsNote: {
      quote:
        '“The sensory signature of our body ceremonies. It transforms daily post-shower moisturizing into an opulent Italian sensory ritual.”',
      author: 'Matteo Romano',
      role: 'Wellness & Body Recovery Specialist',
      avatarInitials: 'MR',
    },
  },
];

interface LaBottegaSectionProps {
  onAddToCart: (item: CartItem) => void;
  currency: LuxuryCurrency;
}

export function LaBottegaSection({ onAddToCart, currency }: LaBottegaSectionProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>('siero-doro-24k');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [selectedSize, setSelectedSize] = useState<string>(BOTTEGA_PRODUCTS[0].defaultSize);
  const [quantity, setQuantity] = useState<number>(1);
  const [openAccordion, setOpenAccordion] = useState<'story' | 'ingredients' | 'ritual' | null>('story');
  const [showStickyBar, setShowStickyBar] = useState<boolean>(false);
  const galleryRef = useRef<HTMLDivElement>(null);
  const primaryButtonRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const product = BOTTEGA_PRODUCTS.find((p) => p.id === selectedProductId) || BOTTEGA_PRODUCTS[0];

  useEffect(() => {
    setSelectedSize(product.defaultSize);
    setActiveImageIdx(0);
    setQuantity(1);
  }, [product]);

  // Persistent Sticky Bar Scroll Detection when primary button leaves viewport
  useEffect(() => {
    const handleScroll = () => {
      if (!primaryButtonRef.current || !sectionRef.current) return;
      const btnRect = primaryButtonRef.current.getBoundingClientRect();
      const secRect = sectionRef.current.getBoundingClientRect();

      // Show sticky bar if primary button has scrolled above the viewport AND user is still near the bottega section
      const isPastButton = btnRect.bottom < 80;
      const isWithinBottega = secRect.bottom > 200 && secRect.top < window.innerHeight;

      if (isPastButton && isWithinBottega) {
        setShowStickyBar(true);
      } else {
        setShowStickyBar(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [product]);

  const formatPrice = (p: BottegaProduct, qty = 1) => {
    switch (currency) {
      case 'EUR':
        return `€${p.priceEUR * qty}`;
      case 'USD':
        return `$${p.priceUSD * qty}`;
      case 'INR':
        return `₹${(p.priceINR * qty).toLocaleString('en-IN')}`;
      case 'AED':
        return `AED ${(p.priceAED * qty).toLocaleString()}`;
      case 'GBP':
        return `£${p.priceGBP * qty}`;
      default:
        return `€${p.priceEUR * qty}`;
    }
  };

  const handleAddCurrentProduct = () => {
    onAddToCart({
      id: `${product.id}-${selectedSize}`,
      title: product.title,
      italianTitle: product.subtitle || product.title,
      subtitle: product.subtitle,
      priceEUR: product.priceEUR,
      priceUSD: product.priceUSD,
      priceINR: product.priceINR,
      priceAED: product.priceAED,
      priceGBP: product.priceGBP,
      size: selectedSize,
      image: product.images[0],
      quantity: quantity,
    });
  };

  const toggleAccordion = (key: 'story' | 'ingredients' | 'ritual') => {
    setOpenAccordion(openAccordion === key ? null : key);
  };

  return (
    <section ref={sectionRef} id="bottega" className="space-y-12 sm:space-y-16 py-12 sm:py-20 scroll-mt-28">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold-surface border border-gold-border text-xs font-label uppercase tracking-widest text-gold-hover">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>The Skincare Boutique • Luxury Collection</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-foreground tracking-tight">
          Artisanal <span className="italic font-serif font-light text-gold">Skincare &amp; Longevity</span> Formulations
        </h2>
        <p className="text-sm sm:text-base text-zinc-700 dark:text-zinc-300 font-sans max-w-xl mx-auto leading-relaxed font-normal">
          Small-batch bio-peptides, volcanic obsidian minerals, and 24k gold elixirs formulated exclusively for Villa Belladonna Milan.
        </p>
      </div>

      {/* Product Selector Bar */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 overflow-x-auto pb-2 px-2 no-scrollbar">
        {BOTTEGA_PRODUCTS.map((p) => {
          const isActive = p.id === product.id;
          return (
            <button
              key={p.id}
              onClick={() => setSelectedProductId(p.id)}
              className={`px-5 py-3 rounded-full text-xs font-label uppercase tracking-wider font-semibold transition-all whitespace-nowrap min-h-[44px] flex items-center gap-2 ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-luxury'
                  : 'bg-surface border border-border text-muted-foreground hover:text-foreground hover:border-gold-border'
              }`}
            >
              <Sparkle className={`w-3 h-3 ${isActive ? 'text-gold' : 'text-muted-foreground'}`} />
              <span>{p.title.split('—')[0].trim()}</span>
            </button>
          );
        })}
      </div>

      {/* Main PDP Layout Grid: Gallery on Left, Storytelling Content on Right */}
      <div className="rounded-[32px] sm:rounded-[44px] bg-surface border border-border/80 p-6 sm:p-12 lg:p-16 shadow-luxury">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Product Gallery & Macro Preview */}
          <div ref={galleryRef} className="lg:col-span-6 space-y-4 sticky top-24">
            {/* Main Featured Photo with Tactile Zoom Effect */}
            <div className="relative h-[380px] sm:h-[480px] lg:h-[540px] w-full rounded-[28px] overflow-hidden bg-surface-muted border border-border/80 group">
              <Image
                src={product.images[activeImageIdx]}
                alt={product.title}
                fill
                priority
                className="object-cover object-center img-luxury-zoom"
              />
              
              {/* Top Stock Badge */}
              <div className="absolute top-4 left-4 px-3.5 py-1.5 rounded-full bg-surface/90 glass-surface border border-border/80 text-[10px] font-label font-bold uppercase tracking-wider text-gold shadow-sm flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Small Batch: {product.stockCount} Available</span>
              </div>

              {/* Batch Certification Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono text-white/90">
                <span className="px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-md">
                  {product.batchNumber}
                </span>
                <span className="px-3 py-1 rounded-full bg-charcoal/80 backdrop-blur-md">
                  100% Recyclable Glass
                </span>
              </div>
            </div>

            {/* Thumbnail Selectors */}
            <div className="flex items-center gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImageIdx === i
                      ? 'border-gold shadow-md scale-105'
                      : 'border-border/80 opacity-70 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`View ${i}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Storytelling PDP Details */}
          <div className="lg:col-span-6 space-y-8">
            
            {/* Header, Rating & Price */}
            <div className="space-y-3 pb-6 border-b border-border/80">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-xs uppercase tracking-widest text-gold font-label font-bold">
                  {product.subtitle}
                </span>
                
                {/* Rating Badge */}
                <div className="flex items-center gap-1.5 text-xs">
                  <div className="flex text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="font-bold text-foreground">{product.rating}</span>
                  <span className="text-muted-foreground text-[11px]">({product.reviewsCount} VIP Reviews)</span>
                </div>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif text-foreground font-medium leading-tight">
                {product.title}
              </h1>

              <p className="text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed">
                {product.tagline}
              </p>

              {/* Price & Packaging */}
              <div className="pt-2 flex items-baseline gap-4">
                <span className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
                  {formatPrice(product)}
                </span>
                <span className="text-xs text-muted-foreground font-sans">
                  Taxes Included • Complimentary White-Glove Shipping
                </span>
              </div>
            </div>

            {/* Size & Quantity Selector */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs uppercase font-label tracking-widest text-muted-foreground font-semibold block">
                  Select Formulation Size
                </label>
                <div className="flex items-center gap-3">
                  {product.sizes.map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-medium font-sans border transition-all ${
                        selectedSize === sz
                          ? 'border-gold bg-gold-surface text-foreground font-semibold shadow-subtle'
                          : 'border-border bg-surface text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity & Add to Cart Primary Button */}
              <div ref={primaryButtonRef} className="flex items-center gap-4 pt-2">
                {/* Quantity Control */}
                <div className="flex items-center rounded-full border border-border bg-surface px-3 py-3 shadow-subtle">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-foreground">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-muted-foreground hover:text-foreground"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Primary Add To Bag Button */}
                <button
                  onClick={handleAddCurrentProduct}
                  className="btn-luxury-dark flex-1 py-4 px-6 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center justify-center gap-3"
                >
                  <ShoppingBag className="w-4 h-4 text-gold" />
                  <span>Add to Bag • {formatPrice(product, quantity)}</span>
                </button>
              </div>
            </div>

            {/* "Editor's Note" Block from Lead Aesthetician */}
            <div className="rounded-[24px] bg-gold-surface/50 border border-gold-border/80 p-6 space-y-3 shadow-subtle">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-label uppercase tracking-widest text-gold font-bold">
                  <Crown className="w-4 h-4" />
                  <span>Lead Aesthetician’s Formulation Note</span>
                </div>
                <span className="text-[10px] uppercase font-mono text-muted-foreground">Certified Luxury Skincare</span>
              </div>

              <p className="italic font-serif text-sm sm:text-base text-foreground/90 leading-relaxed">
                {product.editorsNote.quote}
              </p>

              <div className="pt-2 border-t border-gold-border/60 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-surface border border-gold text-gold font-serif font-bold text-xs flex items-center justify-center">
                  {product.editorsNote.avatarInitials}
                </div>
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    {product.editorsNote.author}
                  </span>
                  <span className="text-[11px] text-muted-foreground block font-sans">
                    {product.editorsNote.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Expandable Storytelling Accordions */}
            <div className="divide-y divide-border/80 border-t border-b border-border/80">
              
              {/* Accordion 1: The Story */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('story')}
                  className="w-full flex items-center justify-between text-left py-2 text-foreground font-serif text-lg font-medium group"
                >
                  <span className="group-hover:text-gold transition-colors">The Botanical Story</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold transition-transform duration-300 ${
                      openAccordion === 'story' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === 'story' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-2 pb-3 text-xs sm:text-sm text-muted-foreground font-sans leading-relaxed space-y-3"
                    >
                      <p>{product.story}</p>
                      <ul className="space-y-1.5 pt-1">
                        {product.storyDetails.map((det, i) => (
                          <li key={i} className="flex items-start gap-2 text-foreground/85">
                            <Sparkle className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                            <span>{det}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 2: The Artisanal Ingredients */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('ingredients')}
                  className="w-full flex items-center justify-between text-left py-2 text-foreground font-serif text-lg font-medium group"
                >
                  <span className="group-hover:text-gold transition-colors">The Artisanal Ingredients</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold transition-transform duration-300 ${
                      openAccordion === 'ingredients' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === 'ingredients' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-2 pb-3 space-y-3"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {product.ingredients.map((ing, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-surface-muted border border-border/80 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">{ing.name}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{ing.benefit}</p>
                            <span className="text-[10px] text-gold font-mono uppercase block">{ing.origin}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Accordion 3: The Application Ritual */}
              <div className="py-4">
                <button
                  onClick={() => toggleAccordion('ritual')}
                  className="w-full flex items-center justify-between text-left py-2 text-foreground font-serif text-lg font-medium group"
                >
                  <span className="group-hover:text-gold transition-colors">The Application Ritual</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gold transition-transform duration-300 ${
                      openAccordion === 'ritual' ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {openAccordion === 'ritual' && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden pt-2 pb-3 space-y-3"
                    >
                      <div className="space-y-3">
                        {product.applicationRitual.map((rit, i) => (
                          <div key={i} className="flex items-start gap-3 text-xs">
                            <span className="px-2.5 py-1 rounded-full bg-gold-surface border border-gold-border font-label font-bold text-gold text-[10px] shrink-0">
                              {rit.step}
                            </span>
                            <p className="text-foreground/85 font-sans leading-relaxed pt-0.5">
                              {rit.instruction}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Persistent Luxury E-Commerce Slide-Up Purchase Bar on Scroll */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-4 left-4 right-4 z-40 max-w-4xl mx-auto rounded-[28px] sm:rounded-full bg-surface/95 backdrop-blur-xl border border-border shadow-2xl p-3 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-6"
          >
            {/* Left Thumbnail, Rating & Product Info */}
            <div className="flex items-center gap-3.5 min-w-0 w-full sm:w-auto">
              <div className="relative w-12 h-12 rounded-2xl sm:rounded-full overflow-hidden shrink-0 border border-gold-border bg-surface-muted shadow-sm">
                <Image src={product.images[0]} alt={product.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-serif text-sm font-semibold text-foreground truncate">
                    {product.title.split('—')[0].trim()}
                  </h4>
                  <div className="hidden md:flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span className="text-foreground text-[11px]">{product.rating}</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground truncate font-sans">
                  {product.subtitle}
                </p>
              </div>
            </div>

            {/* Middle Size Selector Toggle */}
            <div className="flex items-center gap-1.5 p-1 rounded-full bg-surface-muted border border-border text-xs shrink-0">
              {product.sizes.map((sz) => (
                <button
                  key={sz}
                  onClick={() => setSelectedSize(sz)}
                  className={`px-3 py-1 rounded-full text-[11px] font-semibold transition-all ${
                    selectedSize === sz
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {sz.split('/')[0].trim()}
                </button>
              ))}
            </div>

            {/* Right Price & Quick Add Button */}
            <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto shrink-0">
              <div className="text-left sm:text-right">
                <span className="font-serif font-bold text-base sm:text-lg text-foreground block leading-tight">
                  {formatPrice(product, 1)}
                </span>
                <span className="text-[10px] text-muted-foreground uppercase font-label hidden sm:block">
                  Complimentary Delivery
                </span>
              </div>

              <button
                onClick={handleAddCurrentProduct}
                className="btn-luxury-dark px-5 sm:px-6 py-2.5 sm:py-3 rounded-full font-label text-xs uppercase tracking-widest font-bold shadow-luxury active:scale-95 flex items-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                <span>Quick Add • {formatPrice(product, 1)}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </section>
  );
}
