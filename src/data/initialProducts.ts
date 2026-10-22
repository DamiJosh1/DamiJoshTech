import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // --- HOME APPLIANCES: BRAND NEW ---
  // ==========================================
  {
    id: 'sajoda-vortex-robot-vacuum',
    name: 'Sajoda Vortex LiDAR Robot Vacuum & Mop',
    price: 349.99,
    originalPrice: 449.99,
    newPrice: 349.99,
    usedPrice: 249.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'BESTSELLER',
    brand: 'Sajoda Home',
    shortDescription: 'Laser LiDAR 360° mapping with 5000Pa hyper-suction and auto-mop lifting.',
    description: 'Precision 3D obstacle avoidance and multi-floor LiDAR mapping ensure flawless automated cleaning across hardwood, tile, and high-pile carpets with app control and schedule automation.',
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewCount: 142,
    features: [
      '5000Pa extreme suction motor with automatic carpet boost',
      'Precision LiDAR 360° laser navigation and room zoning',
      '2-in-1 simultaneous vacuuming and sonic vibration mopping',
      'Smart mobile app control with virtual no-go zones'
    ],
    specifications: [
      { name: 'Suction Power', value: '5000 Pa' },
      { name: 'Dustbin / Water Tank', value: '450ml / 250ml' },
      { name: 'Battery Runtime', value: 'Up to 180 mins' }
    ]
  },
  {
    id: 'sajoda-airfry-touch-6l',
    name: 'Sajoda AirFry Touch 6L Smart Dual-Zone Air Fryer',
    price: 139.99,
    originalPrice: 179.99,
    newPrice: 139.99,
    usedPrice: 99.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'HOT',
    brand: 'Sajoda Home',
    shortDescription: '360° rapid cyclonic heat, crisping touch presets, and 85% less oil.',
    description: 'Cook mouth-watering family meals in minutes. Equipped with digital LED touch glass display, 12 pre-programmed chef recipes, and non-stick dishwasher-safe ceramic basket.',
    inStock: true,
    stockCount: 38,
    rating: 4.8,
    reviewCount: 94,
    features: [
      '6-Liter XL family capacity with non-stick ceramic coating',
      'Rapid 360° cyclonic air circulation heats up to 200°C',
      '12 one-touch smart cooking presets for meats, bakes & vegetables',
      'BPA-free, dishwasher-safe detachable basket'
    ],
    specifications: [
      { name: 'Capacity', value: '6.0 Liters' },
      { name: 'Power Rating', value: '1800W' },
      { name: 'Temperature Range', value: '80°C - 200°C' }
    ]
  },

  // ==========================================
  // --- HOME APPLIANCES: USED / CERTIFIED PRE-OWNED ---
  // ==========================================
  {
    id: 'sajoda-baristacraft-espresso-used',
    name: 'Sajoda BaristaCraft 20-Bar Espresso Machine (Refurbished)',
    price: 189.99,
    originalPrice: 319.99,
    newPrice: 249.99,
    usedPrice: 189.99,
    condition: 'used',
    conditionGrade: 'Certified Refurbished - Grade A (Pristine)',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'REFURBISHED',
    brand: 'Sajoda Home',
    shortDescription: 'Certified pre-owned Italian 20-bar pump espresso maker with microfoam steam wand.',
    description: '100% factory inspected and sanitized. Features genuine Italian 20-bar high pressure extraction, rapid thermo-block heating, and tested portafilter in flawless working condition.',
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 68,
    features: [
      'Passed 35-point comprehensive electrical & pressure inspection',
      'Ultrasonically deep-cleaned and descaled prior to repackaging',
      '20-Bar Italian ULKA high-pressure extraction pump',
      'Includes original portafilter, 2 filter baskets, and tamper'
    ],
    specifications: [
      { name: 'Condition', value: 'Grade A - Like New' },
      { name: 'Pump Pressure', value: '20 Bar' },
      { name: 'Warranty', value: '90-Day Full Replacement' }
    ]
  },
  {
    id: 'sajoda-pureair-purifier-used',
    name: 'Sajoda PureAir HEPA Smart Air Purifier (Open Box)',
    price: 119.99,
    originalPrice: 199.99,
    newPrice: 159.99,
    usedPrice: 119.99,
    condition: 'used',
    conditionGrade: 'Open Box - Like New',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'SAVE 40%',
    brand: 'Sajoda Home',
    shortDescription: 'Customer return in mint physical condition with brand new sealed H13 filter installed.',
    description: 'This unit was opened and returned in pristine cosmetic condition. We have installed a brand new sealed medical-grade H13 filter and certified the laser PM2.5 sensor.',
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 52,
    features: [
      'Brand new unused sealed True H13 HEPA filter installed',
      'Zero cosmetic scratches, verified 100% laser sensor accuracy',
      'Whisper-quiet sleep operation at only 22dB',
      'Original retail packaging and all power accessories'
    ],
    specifications: [
      { name: 'Condition', value: 'Open Box (Mint)' },
      { name: 'Coverage Area', value: 'Up to 500 sq ft' },
      { name: 'Filter Status', value: '100% Brand New Installed' }
    ]
  },

  // ==========================================
  // --- LATEST GADGETS: BRAND NEW ---
  // ==========================================
  {
    id: 'sajoda-quantum-smartwatch',
    name: 'Sajoda Horizon AMOLED Ultra Smartwatch',
    price: 189.99,
    originalPrice: 249.99,
    newPrice: 189.99,
    usedPrice: 129.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'TRENDING',
    brand: 'Sajoda Tech',
    shortDescription: 'Always-On 1.43" AMOLED display with biometric tracking and 14-day battery life.',
    description: 'Engineered with titanium bezel and sapphire crystal glass. Tracks SpO2, heart rate, sleep cycles, and over 100 sports activities with dual-band GPS precision.',
    inStock: true,
    stockCount: 42,
    rating: 4.9,
    reviewCount: 164,
    features: [
      '1.43" High-Definition Sapphire AMOLED Always-On Display (1000 nits)',
      'Dual-frequency GPS positioning with offline route tracking',
      '24/7 continuous heart rate, blood oxygen & sleep staging',
      '14-day battery endurance with magnetic fast charge'
    ],
    specifications: [
      { name: 'Display', value: '1.43" AMOLED 466x466' },
      { name: 'Water Resistance', value: '5ATM / IP68' },
      { name: 'Compatibility', value: 'iOS & Android' }
    ]
  },
  {
    id: 'sajoda-magpulse-charging-hub',
    name: 'Sajoda MagPulse 3-in-1 Foldable Fast Wireless Charging Hub',
    price: 69.99,
    originalPrice: 89.99,
    newPrice: 69.99,
    usedPrice: 44.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'NEW',
    brand: 'Sajoda Tech',
    shortDescription: 'Simultaneous fast wireless charging for phone, smartwatch, and earbuds.',
    description: 'Foldable magnetic travel station delivers up to 15W Qi fast charging for iPhones and Android devices, dedicated Apple/Galaxy watch puck, and wireless earbuds pad simultaneously.',
    inStock: true,
    stockCount: 55,
    rating: 4.8,
    reviewCount: 78,
    features: [
      '3-in-1 concurrent wireless charging pads (15W + 5W + 3W)',
      'Folds flat to pocket size for easy travel and nightstands',
      'Strong MagSafe-aligned magnetic hold in portrait or landscape',
      'Built-in intelligent thermal protection and foreign object detection'
    ],
    specifications: [
      { name: 'Max Total Output', value: '23W' },
      { name: 'Connector', value: 'USB-C PD Input' },
      { name: 'Weight', value: '185g' }
    ]
  },

  // ==========================================
  // --- LATEST GADGETS: USED / PRE-OWNED ---
  // ==========================================
  {
    id: 'sajoda-aerogimbal-drone-used',
    name: 'Sajoda AeroGimbal 4K Mini GPS Drone (Certified Pre-Owned)',
    price: 219.99,
    originalPrice: 389.99,
    newPrice: 299.99,
    usedPrice: 219.99,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - Grade A+ (Flight-Tested)',
    warrantyInfo: '90-Day Flight Guarantee & Free Battery Replacement',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'SAVE $170',
    brand: 'Sajoda Tech',
    shortDescription: 'Flight-tested 4K mini GPS drone with new propeller set and certified battery health.',
    description: 'Fully inspected and flight-bench tested by certified technicians. Camera gimbal calibrated with 0 error, battery holds 98%+ health capacity, and includes brand new replacement rotors.',
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewCount: 47,
    features: [
      'Flight-tested with zero drift; precision GPS return verified',
      'Battery tested to 98%+ original chemical capacity',
      'Includes new sealed spare propellers & controller joysticks',
      'Under 249g ultra-lightweight travel form factor'
    ],
    specifications: [
      { name: 'Condition', value: 'Pre-Owned Grade A+ (Certified)' },
      { name: 'Flight Logs', value: 'Under 10 Total Flight Hours' },
      { name: 'Camera', value: '4K Ultra HD (3-Axis Gimbal)' }
    ]
  },
  {
    id: 'sajoda-lumina-smart-lamp-used',
    name: 'Sajoda Lumina Adaptive Desk Lamp (Refurbished)',
    price: 59.99,
    originalPrice: 119.99,
    newPrice: 89.99,
    usedPrice: 59.99,
    condition: 'used',
    conditionGrade: 'Refurbished - Excellent Condition',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'BARGAIN',
    brand: 'Sajoda Home',
    shortDescription: 'Certified pre-owned circadian desk lamp with integrated 15W wireless charger.',
    description: 'Professionally refurbished with all LED diodes bench-tested for color accuracy and full 800-lumen output. Qi charging plate fully tested across iPhone and Android models.',
    inStock: true,
    stockCount: 20,
    rating: 4.7,
    reviewCount: 41,
    features: [
      'LED panel tested 100% flicker-free at all color temperatures',
      '15W Qi wireless charging base bench-verified',
      'Smooth aluminum finish sanitized and polished',
      'Includes brand-new high-efficiency power adapter'
    ],
    specifications: [
      { name: 'Condition', value: 'Refurbished Grade A' },
      { name: 'Color Temp', value: '2700K - 6500K' },
      { name: 'Output', value: '15W Fast Qi' }
    ]
  },

  // ==========================================
  // --- ELECTRONICS: BRAND NEW ---
  // ==========================================
  {
    id: 'sajoda-aurora-earbuds',
    name: 'Sajoda Aurora Pro Wireless ANC Earbuds',
    price: 129.99,
    originalPrice: 179.99,
    newPrice: 129.99,
    usedPrice: 84.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Electronics',
    badge: 'BESTSELLER',
    brand: 'Sajoda Audio',
    shortDescription: 'Active Noise Cancelling earbuds with high-resolution studio audio and 38-hour battery.',
    description: 'Experience pure acoustic clarity with custom hybrid active noise cancellation, studio-grade 11mm dynamic drivers, and intelligent ambient transparency mode.',
    inStock: true,
    stockCount: 45,
    rating: 4.9,
    reviewCount: 128,
    features: [
      'Hybrid Active Noise Cancellation (up to 42dB reduction)',
      'Custom tuned 11mm composite dynamic drivers',
      'Up to 38 hours total playback with USB-C quick charge',
      'IPX5 sweat and splash resistance'
    ],
    specifications: [
      { name: 'Driver Size', value: '11mm Dynamic' },
      { name: 'Bluetooth Version', value: 'Bluetooth 5.3' },
      { name: 'Battery', value: '8 hrs buds / 38 hrs with case' }
    ]
  },
  {
    id: 'sajoda-cinemabeam-projector',
    name: 'Sajoda CinemaBeam 4K Ultra-Portable Smart Projector',
    price: 389.99,
    originalPrice: 499.99,
    newPrice: 389.99,
    usedPrice: 279.99,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Electronics',
    badge: 'PREMIUM',
    brand: 'Sajoda Tech',
    shortDescription: '1080p Native / 4K decode with auto-keystone, Android TV & Dolby Sound.',
    description: 'Transform any room or backyard into an IMAX theater up to 200 inches. Includes auto-focus, automatic 4-point keystone correction, WiFi 6, and built-in streaming apps.',
    inStock: true,
    stockCount: 22,
    rating: 4.9,
    reviewCount: 110,
    features: [
      '1000 ANSI Lumens high-brightness LED projection',
      'Instant auto-focus and omnidirectional auto-keystone correction',
      'Integrated Android TV with Netflix, YouTube & Prime Video',
      'Dual 10W Hi-Fi stereo speakers with Dolby Audio'
    ],
    specifications: [
      { name: 'Screen Size', value: '40" - 200" Diagonal' },
      { name: 'Brightness', value: '1000 ANSI Lumens' },
      { name: 'Connectivity', value: 'HDMI, USB, WiFi 6, Bluetooth 5.2' }
    ]
  },

  // ==========================================
  // --- ELECTRONICS: USED / CERTIFIED PRE-OWNED ---
  // ==========================================
  {
    id: 'sajoda-pulse-speaker-used',
    name: 'Sajoda Pulse 360° Waterproof Speaker (Open Box)',
    price: 54.99,
    originalPrice: 99.99,
    newPrice: 79.99,
    usedPrice: 54.99,
    condition: 'used',
    conditionGrade: 'Open Box - Like New',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Electronics',
    badge: 'SAVE 45%',
    brand: 'Sajoda Audio',
    shortDescription: 'Certified pre-owned 360° floating waterproof speaker with punchy dual bass radiators.',
    description: 'Returned within 14-day window in flawless cosmetic and acoustic condition. Battery capacity bench-tested at 100%, IPX7 waterproof seals inspected, and repackaged with new braided charging cable.',
    inStock: true,
    stockCount: 28,
    rating: 4.8,
    reviewCount: 65,
    features: [
      'Acoustic resonance and passive bass radiators bench-verified',
      'IPX7 submersible waterproofing pressure-tested',
      'Cleaned, sanitized, and packaged with brand-new cable',
      '20 hours of continuous music battery performance'
    ],
    specifications: [
      { name: 'Condition', value: 'Open Box - Like New' },
      { name: 'Battery Health', value: '100% Tested' },
      { name: 'Audio Output', value: '24 Watts' }
    ]
  },
  {
    id: 'sajoda-studio-overear-used',
    name: 'Sajoda StudioPro Hi-Res Wireless Headphones (Refurbished)',
    price: 139.99,
    originalPrice: 229.99,
    newPrice: 199.99,
    usedPrice: 139.99,
    condition: 'used',
    conditionGrade: 'Certified Refurbished - Grade A (New Ear Cushions)',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Electronics',
    badge: 'REFURBISHED',
    brand: 'Sajoda Audio',
    shortDescription: 'Flagship 40mm beryllium driver headphones with brand new memory foam earcups.',
    description: 'High-end audiophile headphones restored to like-new condition with brand-new plush protein leather earcups, 45-hour battery testing, and pristine active noise cancellation.',
    inStock: true,
    stockCount: 16,
    rating: 4.9,
    reviewCount: 74,
    features: [
      'Fitted with 100% brand-new sanitary memory-foam ear cushions',
      'Beryllium driver balance and frequency response matched to 0.5dB',
      'Active Noise Cancellation microphones recalibrated',
      'Includes hard-shell travel case and gold-plated 3.5mm cable'
    ],
    specifications: [
      { name: 'Condition', value: 'Grade A Refurbished' },
      { name: 'Ear Cushions', value: 'Brand New Replacement' },
      { name: 'Battery Life', value: '45 Hours ANC On' }
    ]
  }
];
