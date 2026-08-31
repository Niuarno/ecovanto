import { Product } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'prod-01',
    name: 'ANATOMICAL CORSET DRESS',
    slug: 'anatomical-corset-dress',
    price: 490,
    compareAtPrice: 580,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Dresses',
    categorySlug: 'dresses',
    collection: 'Life Force',
    collectionSlug: 'life-force',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' },
      { name: 'Graphite Slate', hex: '#262626' }
    ],
    badge: 'BEST SELLER',
    tagline: 'Internal boning with bias-cut Italian viscose drop',
    description: 'Sculpted evening dress combining a rigid internal steel-boned corset bodice with a draped, floor-sweeping Italian viscose skirt. Cut on the bias to follow the contours of the body with fluid asymmetric motion.',
    details: [
      'Built-in internal corset with 12 spring-steel spiral bones',
      'Heavyweight 280gsm Italian viscose crepe',
      'Deep asymmetric thigh slit on the left side',
      'Concealed back riri zipper with hook-and-eye closure',
      'Raw cut hem finishing',
      'Handcrafted in Berlin Atelier'
    ],
    care: [
      'Specialist dry clean only',
      'Do not wash or tumble dry',
      'Iron low heat with pressing cloth',
      'Store flat or on wide padded hanger'
    ],
    shippingInfo: 'Complimentary express DHL shipping across the European Union. Worldwide delivery within 3-5 business days.',
    stock: 6,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-02',
    name: 'ASYMMETRIC SCULPTED TOP',
    slug: 'asymmetric-sculpted-top',
    price: 240,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Tops & Bodys',
    categorySlug: 'tops',
    collection: 'Berlin Vibes',
    collectionSlug: 'berlin-vibes',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' },
      { name: 'Chalk Bone', hex: '#E2E0D8' }
    ],
    badge: 'NEW DROP',
    tagline: 'High-twist organic rib knit with one-shoulder drapery',
    description: 'Minimalist long-sleeve top engineered from high-twist organic cotton rib. Features an exaggerated diagonal cutout across the clavicle and thumbhole cuffs for an elongated silhouette.',
    details: [
      '95% Organic High-Twist Cotton, 5% Elastane',
      'Single-sleeve deconstructed construction',
      'Bound asymmetric neckline with double topstitching',
      'Extended thumbhole cuffs',
      'Made in Portugal'
    ],
    care: ['Gentle hand wash cold', 'Lay flat to dry in shade', 'Cool iron if needed'],
    stock: 14,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-03',
    name: 'OVERSIZED RAW-WOOL COAT',
    slug: 'oversized-raw-wool-coat',
    price: 780,
    compareAtPrice: 890,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Jackets & Coats',
    categorySlug: 'jackets',
    collection: 'Life Force',
    collectionSlug: 'life-force',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Charcoal Melange', hex: '#1C1C1E' },
      { name: 'Deep Espresso', hex: '#14110F' }
    ],
    badge: 'RUNWAY',
    tagline: '750gsm virgin Austrian loden wool with padded shoulders',
    description: 'An architectural double-breasted overcoat featuring pronounced, razor-sharp shoulder construction and a severe, calf-length drape. Finished with horn buttons and raw unfinished hemline.',
    details: [
      '100% Virgin Austrian Loden Wool (750gsm)',
      '100% Cupro jacquard monogram lining',
      'Exaggerated peak lapels with raw edges',
      'Deep welt waist pockets & internal chest welt',
      'Heavy-duty horn button closure',
      'Tailored in Italy'
    ],
    care: ['Strictly dry clean only by specialist', 'Do not bleach', 'Do not steam raw edges'],
    stock: 4,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-04',
    name: 'CURVED-SEAM TAILORED TROUSERS',
    slug: 'curved-seam-tailored-trousers',
    price: 360,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Bottoms & Pants',
    categorySlug: 'bottoms',
    collection: 'Quarpa Capsule',
    collectionSlug: 'quarpa-capsule',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' }
    ],
    badge: 'BEST SELLER',
    tagline: 'Spiral leg cut creating dynamic stacked drape',
    description: 'High-waisted tailored trousers featuring spiral geometric side seams that twist around the leg to produce a distinctive sculptural stack at the ankle.',
    details: [
      '100% Fine Merino Wool Gabardine',
      'High-rise waist with extended tab closure',
      'Curved ergonomic outer and inner leg seams',
      'Deep slash front pockets, rear welt pocket',
      'Made in Italy'
    ],
    care: ['Dry clean only', 'Press with damp cloth'],
    stock: 9,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-05',
    name: 'STRUCTURAL LEATHER CORSET',
    slug: 'structural-leather-corset',
    price: 420,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Corsets',
    categorySlug: 'corsets',
    collection: 'Quarpa Capsule',
    collectionSlug: 'quarpa-capsule',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Waxed Noir', hex: '#050505' },
      { name: 'Brushed Oxblood', hex: '#2A0E12' }
    ],
    badge: 'SPECIAL EDITION',
    tagline: 'Vegetable-tanned calfskin with industrial steel hardware',
    description: 'A contemporary reinterpretation of orthopedic bodices. Crafted from thick vegetable-tanned full-grain leather that molds to the wearer over time.',
    details: [
      '1.6mm Full-grain vegetable-tanned calfskin',
      'Hand-burnished wax edges',
      'Industrial oxidized gunmetal buckles',
      'Reinforced structural cord lacing at spine',
      'Embossed studio serial number'
    ],
    care: ['Treat with natural beeswax balm', 'Avoid prolonged water exposure', 'Store away from direct light'],
    stock: 5,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-06',
    name: 'SECOND-SKIN SHEER BODYSUIT',
    slug: 'second-skin-sheer-bodysuit',
    price: 180,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Tops & Bodys',
    categorySlug: 'tops',
    collection: 'Berlin Vibes',
    collectionSlug: 'berlin-vibes',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Smoked Smoke', hex: '#1E1E1E' },
      { name: 'Onyx Black', hex: '#0B0B0B' }
    ],
    tagline: 'Ultra-fine Italian stretch mesh with flatlock seams',
    description: 'High-neck bodysuit cut from whisper-weight translucent Italian power-mesh. Designed to layer beneath heavy suiting or wear as a stark standalone statement.',
    details: [
      '82% Polyamide, 18% Elastane Italian sheer mesh',
      'High mock neck with laser-cut raw edge',
      'Snap button gusset closure',
      'Ergonomic flatlock tonal stitching',
      'Made in Germany'
    ],
    care: ['Hand wash in cool water with delicate detergent', 'Do not wring', 'Dry flat'],
    stock: 18,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-07',
    name: 'DECONSTRUCTED SLIT MAXI SKIRT',
    slug: 'deconstructed-slit-maxi-skirt',
    price: 320,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Bottoms & Pants',
    categorySlug: 'bottoms',
    collection: 'Life Force',
    collectionSlug: 'life-force',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' }
    ],
    badge: 'BEST SELLER',
    tagline: 'Floor-length heavy crepe with exposed bias seams',
    description: 'A severe, floor-length column skirt that parts sharply above the thigh. Engineered with raw diagonal seams that elongate the vertical silhouette.',
    details: [
      'Heavyweight 320gsm viscose-wool blend',
      'Deep side slit extending to mid-thigh',
      'Fitted waist with grosgrain interior band',
      'Concealed side zipper',
      'Made in Italy'
    ],
    care: ['Dry clean only', 'Steam lightly on reverse side'],
    stock: 8,
    isFeatured: false,
    isNewArrival: true
  },
  {
    id: 'prod-08',
    name: 'WAXED INDUSTRIAL BOMBER',
    slug: 'waxed-industrial-bomber',
    price: 540,
    compareAtPrice: 620,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Jackets & Coats',
    categorySlug: 'jackets',
    collection: 'Berlin Vibes',
    collectionSlug: 'berlin-vibes',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Treated Charcoal', hex: '#161616' },
      { name: 'Faded Concrete', hex: '#4A4A4A' }
    ],
    badge: 'RUNWAY',
    tagline: 'Heavy paraffin-waxed British cotton with gathered sleeves',
    description: 'Cropped, boxy bomber jacket constructed from heavyweight waxed cotton twill. Features voluminous gathered sleeves and oversized utility pocket detailing.',
    details: [
      '100% British Paraffin Waxed Cotton',
      'Heavy two-way antique silver zipper',
      'Storm flap with hidden snap fastenings',
      'Thermal quilted satin lining',
      'Ribbed wool collar, cuffs and waistband',
      'Made in UK'
    ],
    care: ['Do not wash or dry clean', 'Sponge clean with cold water only', 'Rewax periodically'],
    stock: 7,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-09',
    name: 'MONOLITHIC HARNESS BELT',
    slug: 'monolithic-harness-belt',
    price: 210,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Accessories',
    categorySlug: 'accessories',
    collection: 'Quarpa Capsule',
    collectionSlug: 'quarpa-capsule',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' }
    ],
    badge: 'ARCHIVE',
    tagline: 'Modular saddlery leather with raw-edge steel O-rings',
    description: 'Sculptural waist-cinching harness crafted from 3mm thick bridal leather. Designed to be worn over coats, dresses, or oversized shirts.',
    details: [
      'Vegetable-tanned bridle leather',
      'Cast solid steel O-ring connector',
      'Double prong roller buckle closures',
      'Adjustable torso and waist straps'
    ],
    care: ['Wipe clean with dry cloth', 'Apply leather wax once a year'],
    stock: 12,
    isFeatured: false,
    isNewArrival: false
  },
  {
    id: 'prod-10',
    name: 'HIGH-NECK SLEEVELESS GOWN',
    slug: 'high-neck-sleeveless-gown',
    price: 520,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Dresses',
    categorySlug: 'dresses',
    collection: 'Spatial Monochrome',
    collectionSlug: 'spatial-monochrome',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' }
    ],
    badge: 'BEST SELLER',
    tagline: 'Seamless architectural column with open back cascade',
    description: 'A monument to restraint. Minimalist mock-neck column gown in fluid matte crepe that plunges into an unexpected low-cut back with geometric strap detailing.',
    details: [
      'Heavy double-faced matte crepe',
      'High standing collar with magnetic concealed closure',
      'Plunging deep cowl open back',
      'Floor-sweeping train hem',
      'Fully lined in silk habotai'
    ],
    care: ['Professional dry clean only', 'Do not steam collar directly'],
    stock: 5,
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 'prod-11',
    name: 'PLEATED TULLE CORSET TOP',
    slug: 'pleated-tulle-corset-top',
    price: 380,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Corsets',
    categorySlug: 'corsets',
    collection: 'Life Force',
    collectionSlug: 'life-force',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Onyx Smoke', hex: '#181818' }
    ],
    badge: 'NEW DROP',
    tagline: 'Micro-pleated layered sheer tulle with visible internal ribs',
    description: 'Hyper-detailed corseted bodice featuring hand-draped micro-pleated tulle over a translucent mesh foundation with visible internal boning channels.',
    details: [
      'Hand-pleated Italian nylon tulle',
      'Reinforced mesh base with 10 boning channels',
      'Adjustable ribbon lace-up back',
      'Scalloped bottom edge'
    ],
    care: ['Gentle hand wash cold', 'Lay flat to dry'],
    stock: 10,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-12',
    name: 'VOLUMINOUS GABARDINE TRENCH',
    slug: 'voluminous-gabardine-trench',
    price: 820,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Jackets & Coats',
    categorySlug: 'jackets',
    collection: 'Spatial Monochrome',
    collectionSlug: 'spatial-monochrome',
    sizes: ['S', 'M', 'L'],
    colors: [
      { name: 'Deep Midnight Noir', hex: '#0A0B0E' },
      { name: 'Raw Dust', hex: '#3A3836' }
    ],
    badge: 'SPECIAL EDITION',
    tagline: 'Water-resistant high-density cotton gabardine with belt',
    description: 'An expansive modern trench coat designed with wide raglan sleeves, storm flaps, and a floor-skimming length. Cinch at the waist with the included extra-long fabric belt.',
    details: [
      '100% Water-repellent Egyptian Cotton Gabardine',
      'Storm shield at back and gun flap at chest',
      'Horn buckle cuff adjusters & belt',
      'Deep back vent for mobility',
      'Made in Italy'
    ],
    care: ['Specialist dry clean only'],
    stock: 3,
    isFeatured: true,
    isNewArrival: false
  },
  {
    id: 'prod-13',
    name: 'SCULPTURAL DRAPED MINI DRESS',
    slug: 'sculptural-draped-mini-dress',
    price: 340,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Dresses',
    categorySlug: 'dresses',
    collection: 'Berlin Vibes',
    collectionSlug: 'berlin-vibes',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Pitch Noir', hex: '#0B0B0B' },
      { name: 'Metallic Silver Shadow', hex: '#8B8D91' }
    ],
    tagline: 'Gathered side ruffles with architectural asymmetric neckline',
    description: 'Short statement dress engineered with intense side gathering that contours the body, creating sculptural ripples across the front torso.',
    details: [
      'Heavy stretch jersey (68% Viscose, 28% Polyamide, 4% Elastane)',
      'Asymmetric single strap with drape detail',
      'Fully lined in smoothing stretch fabric',
      'Side invisible zipper'
    ],
    care: ['Hand wash cold or gentle machine cycle in laundry bag'],
    stock: 11,
    isFeatured: false,
    isNewArrival: true
  },
  {
    id: 'prod-14',
    name: 'CARGO TAILORED BERLIN PANT',
    slug: 'cargo-tailored-berlin-pant',
    price: 380,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Bottoms & Pants',
    categorySlug: 'bottoms',
    collection: 'Berlin Vibes',
    collectionSlug: 'berlin-vibes',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Blackened Obsidian', hex: '#0E0E10' }
    ],
    badge: 'NEW DROP',
    tagline: 'Tactical bellows pockets on tailored wool architecture',
    description: 'Merging sartorial suiting standards with industrial Berlin utilitarianism. Features sharp pressed front pleats and 3D origami cargo pockets.',
    details: [
      'Fine virgin wool and technical nylon blend',
      'Two oversized geometric cargo pockets with magnetic closures',
      'Deep front double pleats',
      'Drawstring hem for adjustable silhouette taper',
      'Made in Berlin'
    ],
    care: ['Dry clean only'],
    stock: 8,
    isFeatured: true,
    isNewArrival: true
  },
  {
    id: 'prod-15',
    name: 'HEAVY SILVER CHOKER CHAIN',
    slug: 'heavy-silver-choker-chain',
    price: 190,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Accessories',
    categorySlug: 'accessories',
    collection: 'Spatial Monochrome',
    collectionSlug: 'spatial-monochrome',
    sizes: ['ONE SIZE'],
    colors: [
      { name: 'Brushed Silver', hex: '#C7C7C7' },
      { name: 'Black Ruthenium', hex: '#262626' }
    ],
    tagline: 'Hand-cast solid 925 sterling silver brutalist links',
    description: 'Substantial curb-link choker necklace featuring irregular hand-carved facets that catch light at sharp angles. Finished with a custom locking clasp.',
    details: [
      'Solid 925 Sterling Silver (110 grams)',
      'Subtle brushed satin anti-tarnish finish',
      'Custom industrial barrel push-clasp',
      'Length: 42cm (adjustable with extra link)'
    ],
    care: ['Polish with included silver cloth', 'Keep away from chlorinated water'],
    stock: 15,
    isFeatured: false,
    isNewArrival: false
  },
  {
    id: 'prod-16',
    name: 'TEXTURED RAW-EDGE BLAZER',
    slug: 'textured-raw-edge-blazer',
    price: 610,
    currency: 'EUR',
    images: [
      'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1000&q=85',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85'
    ],
    category: 'Jackets & Coats',
    categorySlug: 'jackets',
    collection: 'Quarpa Capsule',
    collectionSlug: 'quarpa-capsule',
    sizes: ['XS', 'S', 'M', 'L'],
    colors: [
      { name: 'Raw Black Weave', hex: '#111111' }
    ],
    badge: 'RUNWAY',
    tagline: 'Open-weave textured linen-wool with exposed internal canvas',
    description: 'An avant-garde tailored single-button jacket exposing the inner horsehair canvas along the lapel and hem. Structured yet tactile and visceral.',
    details: [
      '60% Linen, 40% Virgin Wool open weave',
      'Hand-basted exposed floating chest canvas',
      'Single horn button closure',
      'Working surgeon cuffs',
      'Made in Italy'
    ],
    care: ['Dry clean only by luxury garment specialist'],
    stock: 4,
    isFeatured: true,
    isNewArrival: true
  }
];
