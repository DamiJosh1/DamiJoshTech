import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // --- HOME APPLIANCES ---
  {
    id: 'sajoda-vortex-robot-vacuum',
    name: 'Sajoda Vortex LiDAR Robot Vacuum & Mop',
    price: 349.99,
    originalPrice: 449.99,
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800'
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
  {
    id: 'sajoda-pureair-purifier',
    name: 'Sajoda PureAir HEPA Smart Air Purifier',
    price: 159.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'ECO',
    brand: 'Sajoda Home',
    shortDescription: 'True HEPA H13 medical-grade filtration with real-time PM2.5 laser sensor.',
    description: 'Breathe pure, allergen-free air with our 3-stage H13 filtration system capable of purifying rooms up to 500 sq ft in just 12 minutes while running in whisper-quiet 22dB sleep mode.',
    inStock: true,
    stockCount: 30,
    rating: 4.9,
    reviewCount: 118,
    features: [
      'Medical Grade True H13 HEPA & Activated Carbon honeycomb filter',
      'Laser PM2.5 particle detection and real-time color LED air index',
      'Whisper-quiet sleep operation at only 22dB',
      'Smart mobile app control with scheduled timers'
    ],
    specifications: [
      { name: 'Coverage Area', value: 'Up to 500 sq ft' },
      { name: 'CADR Rating', value: '260 m³/h' },
      { name: 'Noise Level', value: '22dB - 48dB' }
    ]
  },
  {
    id: 'sajoda-baristacraft-espresso',
    name: 'Sajoda BaristaCraft 20-Bar Smart Espresso Machine',
    price: 249.99,
    originalPrice: 319.99,
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'PREMIUM',
    brand: 'Sajoda Home',
    shortDescription: 'Italian 20-bar high pressure pump with precision microfoam steam wand.',
    description: 'Extract rich crema and authentic café-quality espresso at home. Features instant thermo-block heating in 30 seconds and stainless steel commercial-grade portafilter.',
    inStock: true,
    stockCount: 16,
    rating: 4.9,
    reviewCount: 86,
    features: [
      '20-Bar Italian ULKA high-pressure extraction pump',
      'Rapid Thermo-Block heating ready in under 30 seconds',
      'Professional stainless microfoam steam wand for lattes & cappuccinos',
      'Removable 1.5L transparent water reservoir'
    ],
    specifications: [
      { name: 'Pump Pressure', value: '20 Bar' },
      { name: 'Water Tank', value: '1.5 Liters' },
      { name: 'Material', value: 'Brushed Stainless Steel' }
    ]
  },

  // --- LATEST GADGETS ---
  {
    id: 'sajoda-quantum-smartwatch',
    name: 'Sajoda Horizon AMOLED Ultra Smartwatch',
    price: 189.99,
    originalPrice: 249.99,
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
  {
    id: 'sajoda-aerogimbal-drone',
    name: 'Sajoda AeroGimbal 4K Mini GPS Foldable Drone',
    price: 299.99,
    originalPrice: 389.99,
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'POPULAR',
    brand: 'Sajoda Tech',
    shortDescription: '3-Axis motorized gimbal with 4K UHD video, GPS auto-return, and 31-min flight.',
    description: 'Capture cinematic overhead footage with zero jitter. Includes level-5 wind resistance, intelligent follow-me subject tracking, and auto-return-to-home fail-safe.',
    inStock: true,
    stockCount: 19,
    rating: 4.9,
    reviewCount: 92,
    features: [
      '4K 30fps HDR video with mechanical 3-axis anti-shake gimbal',
      'Dual satellite GPS / GLONASS with smart auto return',
      '31-minute flight time per modular battery pack',
      'Under 249g ultra-lightweight foldable design'
    ],
    specifications: [
      { name: 'Camera Resolution', value: '4K Ultra HD (3840x2160)' },
      { name: 'Transmission Range', value: 'Up to 4 Kilometers' },
      { name: 'Flight Speed', value: 'Max 16 m/s' }
    ]
  },
  {
    id: 'sajoda-lumina-smart-lamp',
    name: 'Sajoda Lumina Adaptive Desk Lamp with Qi Charger',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Latest Gadgets',
    badge: 'FEATURED',
    brand: 'Sajoda Home',
    shortDescription: 'Circadian eye-protection lighting with touch slider and wireless charging base.',
    description: 'Protect your eyesight with flicker-free circadian rhythm lighting. Features adjustable color temperature (2700K - 6500K) and built-in 15W Qi wireless charging pad.',
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewCount: 84,
    features: [
      'Circadian eye-care auto dimming technology',
      'Integrated 15W Qi fast wireless phone charger',
      'Smooth touch dimmer with memory recall',
      'Precision aerospace-grade aluminum construction'
    ],
    specifications: [
      { name: 'Color Temperature', value: '2700K - 6500K' },
      { name: 'Max Lumens', value: '800 lm' },
      { name: 'Qi Output', value: '15W Fast Charge' }
    ]
  },

  // --- ELECTRONICS ---
  {
    id: 'sajoda-aurora-earbuds',
    name: 'Sajoda Aurora Pro Wireless ANC Earbuds',
    price: 129.99,
    originalPrice: 179.99,
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
  {
    id: 'sajoda-pulse-speaker',
    name: 'Sajoda Pulse 360° Waterproof Speaker',
    price: 79.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Electronics',
    badge: 'OUTDOOR',
    brand: 'Sajoda Audio',
    shortDescription: 'Omnidirectional 360-degree bass with IPX7 submersible waterproofing.',
    description: 'Take deep, rich bass anywhere. Built with dual passive radiators, 24W output, and full IPX7 waterproof rating that floats on water.',
    inStock: true,
    stockCount: 50,
    rating: 4.8,
    reviewCount: 112,
    features: [
      '360° spatial audio dispersion with punchy dual passive radiators',
      'IPX7 submersible waterproof and floatable casing',
      'PartySync technology to pair up to 100+ speakers',
      '20 hours of continuous music on a single charge'
    ],
    specifications: [
      { name: 'Audio Output', value: '24 Watts' },
      { name: 'Waterproof Rating', value: 'IPX7 Submersible' },
      { name: 'Battery Life', value: '20 Hours' }
    ]
  }
];
