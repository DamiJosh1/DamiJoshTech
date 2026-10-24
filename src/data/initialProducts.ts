import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==========================================
  // --- HOME APPLIANCES: BRAND NEW (SEALED CARTON BOX) ---
  // ==========================================
  {
    id: 'sajoda-vortex-robot-vacuum',
    name: 'Sajoda Vortex LiDAR Robot Vacuum & Mop (Brand New • Sealed Carton)',
    price: 420000,
    originalPrice: 480000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack & Carton with Serial Seal',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    relatedConditionId: 'sajoda-vortex-robot-vacuum-used',
    // Private Admin Sourcing Intelligence
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: 370000,
    ownerCommission: 50000,
    commissionNote: '₦50,000 commission built-in above wholesale acquisition cost',
    image: 'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?auto=format&fit=crop&q=80&w=800', // Front profile
      'https://images.unsplash.com/photo-1558317374-067fb5f30001?auto=format&fit=crop&q=80&w=800', // Side angle & sensors
      'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&q=80&w=800', // Auto-empty dock
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Factory retail carton box
    ],
    category: 'Home Appliances',
    badge: 'SEALED CARTON',
    brand: 'Sajoda Home',
    shortDescription: 'Laser LiDAR 360° mapping with 5000Pa hyper-suction and auto-mop lifting in unopened carton.',
    description: 'Arrives in pristine, unopened factory carton packaging with tamper-evident seal. Features precision 3D obstacle avoidance and multi-floor LiDAR mapping for automated cleaning across all floor surfaces.',
    inStock: true,
    stockCount: 25,
    rating: 4.9,
    reviewCount: 142,
    features: [
      'Unopened factory carton with original manufacturer holographic seal',
      '5000Pa extreme suction motor with automatic carpet boost',
      'Precision LiDAR 360° laser navigation and room zoning',
      'Full factory pack: Extra HEPA filters, side brushes, and mop pads'
    ],
    specifications: [
      { name: 'Packaging', value: 'Original Sealed Carton Box' },
      { name: 'Suction Power', value: '5000 Pa' },
      { name: 'Dustbin / Water Tank', value: '450ml / 250ml' },
      { name: 'Battery Runtime', value: 'Up to 180 mins' }
    ]
  },
  {
    id: 'sajoda-airfry-touch-6l',
    name: 'Sajoda AirFry Touch 6L Smart Air Fryer (Brand New • Sealed Carton)',
    price: 115000,
    originalPrice: 145000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack & Carton with Polyfoam Padding',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: 95000,
    ownerCommission: 20000,
    commissionNote: '₦20,000 commission on kitchen appliances',
    image: 'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800', // Front
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800', // Side angle
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800', // Basket open view
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed carton packaging
    ],
    category: 'Home Appliances',
    badge: 'FACTORY SEALED',
    brand: 'Sajoda Home',
    shortDescription: '360° rapid cyclonic heat, digital LED presets, and non-stick basket in original carton.',
    description: 'Factory sealed in heavy-duty protective carton. Cook delicious, oil-free crispy family meals in minutes with 12 pre-programmed chef recipes and non-stick ceramic basket.',
    inStock: true,
    stockCount: 38,
    rating: 4.8,
    reviewCount: 94,
    features: [
      'Factory sealed in reinforced retail box with recipe manual',
      '6-Liter XL family capacity with non-stick ceramic coating',
      'Rapid 360° cyclonic air circulation heats up to 200°C',
      '12 one-touch smart cooking presets for meats, bakes & fries'
    ],
    specifications: [
      { name: 'Packaging', value: 'Sealed Retail Carton Box' },
      { name: 'Capacity', value: '6.0 Liters' },
      { name: 'Power Rating', value: '1800W' }
    ]
  },

  // ==========================================
  // --- HOME APPLIANCES: PRE-OWNED (100% TESTED WORKING FINE) ---
  // ==========================================
  {
    id: 'sajoda-baristacraft-espresso-used',
    name: 'Sajoda BaristaCraft 20-Bar Espresso Machine (Pre-Owned • 100% Tested Working)',
    price: 195000,
    originalPrice: 285000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Unit with Padded Protective Box & Accessories',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    sourcingHub: 'Certified OEM Refurbisher Hub (Lagos)',
    baseCost: 165000,
    ownerCommission: 30000,
    commissionNote: '₦30,000 commission on certified refurbished espresso units',
    image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800', // Tested hardware front
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800', // Side profile
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800', // Pressure test & steam wand
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800'  // Inspected portafilter & tamper
    ],
    category: 'Home Appliances',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Home',
    shortDescription: 'Certified pre-owned 20-bar Italian pump espresso maker, inspected and operating at 100%.',
    description: 'Pre-owned unit thoroughly inspected, descaled, and verified 100% functional by certified appliance technicians. Italian 20-bar pump delivers rich crema and flawless microfoam steaming.',
    inStock: true,
    stockCount: 12,
    rating: 4.9,
    reviewCount: 68,
    features: [
      'Passed 35-point comprehensive electrical & pressure bar test',
      'Ultrasonically deep-cleaned and descaled prior to dispatch',
      'Authentic Italian 20-Bar ULKA pump delivers thick golden crema',
      'Backed by 90-day comprehensive Sajoda replacement warranty'
    ],
    specifications: [
      { name: 'Hardware Condition', value: '100% Tested Working Fine (Grade A)' },
      { name: 'Pump Pressure', value: '20 Bar Verified' },
      { name: 'Warranty', value: '90-Day Certified Guarantee' }
    ]
  },
  {
    id: 'sajoda-pureair-purifier-used',
    name: 'Sajoda PureAir HEPA Smart Air Purifier (Pre-Owned • 100% Tested Working)',
    price: 135000,
    originalPrice: 185000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Unit with New Sealed H13 Filter & Protective Box',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: 115000,
    ownerCommission: 20000,
    commissionNote: '₦20,000 commission on certified air purifier',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800', // Tested hardware front
      'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800', // Side air intake grille
      'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&q=80&w=800', // Laser PM2.5 sensor test
      'https://images.unsplash.com/photo-1585515320310-259814833e62?auto=format&fit=crop&q=80&w=800'  // Sealed new filter included
    ],
    category: 'Home Appliances',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Home',
    shortDescription: 'Fully tested smart air purifier with brand new sealed True H13 filter installed.',
    description: 'Verified 100% functional. Equipped with a brand-new medical grade H13 HEPA filter, tested digital air quality sensor, and whisper-quiet 22dB sleep motor.',
    inStock: true,
    stockCount: 15,
    rating: 4.8,
    reviewCount: 52,
    features: [
      'Brand new factory-sealed True H13 HEPA filter installed',
      'Laser PM2.5 particle sensor tested and 100% calibrated',
      'Whisper-quiet sleep operation at only 22dB',
      'Full 90-day Sajoda guarantee on motor and electronics'
    ],
    specifications: [
      { name: 'Condition', value: 'Pre-Owned (100% Functional)' },
      { name: 'Filter Status', value: 'Brand New Sealed H13 Included' },
      { name: 'Coverage Area', value: 'Up to 500 sq ft' }
    ]
  },

  // ==========================================
  // --- LATEST GADGETS: BRAND NEW (SEALED CARTON BOX) ---
  // ==========================================
  {
    id: 'sajoda-quantum-smartwatch',
    name: 'Sajoda Horizon AMOLED Ultra Smartwatch (Brand New • Sealed Carton)',
    price: 145000,
    originalPrice: 180000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack & Carton with Hologram Seal',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    relatedConditionId: 'sajoda-quantum-smartwatch-used',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 120000,
    ownerCommission: 25000,
    commissionNote: '₦25,000 markup over wholesale cost',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // Front AMOLED screen
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', // Side titanium crown
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800', // Rear bio-sensor array
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed factory retail pack
    ],
    category: 'Latest Gadgets',
    badge: 'SEALED CARTON',
    brand: 'Sajoda Tech',
    shortDescription: 'Always-On 1.43" AMOLED display with biometric tracking and 14-day battery in factory box.',
    description: 'Arrives factory sealed with original magnetic charging cable and silicone sport strap. Built with aerospace-grade titanium bezel, sapphire crystal screen, and dual-band GPS route tracking.',
    inStock: true,
    stockCount: 42,
    rating: 4.9,
    reviewCount: 164,
    features: [
      'Factory sealed box with intact manufacturer security tape',
      '1.43" Sapphire AMOLED Always-On Display (1000 nits daylight)',
      'Dual-frequency GPS positioning with offline route navigation',
      '14-day battery endurance with rapid wireless charging'
    ],
    specifications: [
      { name: 'Packaging', value: 'Sealed Retail Carton Box' },
      { name: 'Display', value: '1.43" AMOLED 466x466' },
      { name: 'Water Resistance', value: '5ATM / IP68' }
    ]
  },
  {
    id: 'sajoda-magpulse-charging-hub',
    name: 'Sajoda MagPulse 3-in-1 Foldable Fast Wireless Hub (Brand New • Sealed Box)',
    price: 48000,
    originalPrice: 60000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack with Braided USB-C Cable',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 36000,
    ownerCommission: 12000,
    commissionNote: '₦12,000 commission on charging accessories',
    image: 'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800', // Front charging pads
      'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800', // Side fold angle
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800', // USB-C PD input port
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed retail carton & box
    ],
    category: 'Latest Gadgets',
    badge: 'NEW IN PACK',
    brand: 'Sajoda Tech',
    shortDescription: 'Foldable magnetic wireless travel station for phone, watch, and earbuds in sealed carton.',
    description: 'Factory sealed package containing 3-in-1 folding station and braided fast-charge cable. Delivers 15W MagSafe magnetic phone charging, dedicated watch puck, and wireless earbuds pad simultaneously.',
    inStock: true,
    stockCount: 55,
    rating: 4.8,
    reviewCount: 78,
    features: [
      'Factory sealed in retail box with 1m braided USB-C cable',
      '3-in-1 concurrent wireless charging pads (15W + 5W + 3W)',
      'Folds flat to pocket size for sleek travel and nightstand use',
      'Strong MagSafe-aligned magnetic hold in portrait or landscape'
    ],
    specifications: [
      { name: 'Packaging', value: 'Sealed Retail Carton Box' },
      { name: 'Max Total Output', value: '23W Fast Wireless' },
      { name: 'Weight', value: '185g' }
    ]
  },

  // ==========================================
  // --- LATEST GADGETS: PRE-OWNED (100% TESTED WORKING FINE) ---
  // ==========================================
  {
    id: 'sajoda-aerogimbal-drone-used',
    name: 'Sajoda AeroGimbal 4K Mini GPS Drone (Pre-Owned • 100% Tested Working)',
    price: 280000,
    originalPrice: 390000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Flight Unit with Travel Case & New Propeller Pack',
    warrantyInfo: '90-Day Flight Guarantee & Battery Replacement',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 235000,
    ownerCommission: 45000,
    commissionNote: '₦45,000 commission on certified drone unit',
    image: 'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800', // Tested drone front
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // Side rotor arm fold
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', // 4K 3-axis gimbal camera test
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&q=80&w=800'  // Travel case & tested battery
    ],
    category: 'Latest Gadgets',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Tech',
    shortDescription: 'Flight-tested 4K mini GPS drone, 100% operational with new propeller set and certified battery.',
    description: 'Bench-tested and test-flown by our certified technicians with 0 errors. GPS return-to-home, 4K 3-axis stabilized camera, and intelligent flight modes operate at 100% factory specifications.',
    inStock: true,
    stockCount: 9,
    rating: 4.9,
    reviewCount: 47,
    features: [
      'Flight-tested with zero drift; precision GPS lock verified',
      'Battery tested to 98%+ original chemical capacity',
      'Includes brand new sealed spare propellers & padded travel case',
      'Under 249g ultra-lightweight travel form factor'
    ],
    specifications: [
      { name: 'Condition', value: '100% Tested Working Fine (Grade A+)' },
      { name: 'Camera', value: '4K Ultra HD (3-Axis Mechanical Gimbal)' },
      { name: 'Flight Range', value: 'Up to 5km Video Transmission' }
    ]
  },
  {
    id: 'sajoda-lumina-smart-lamp-used',
    name: 'Sajoda Lumina Adaptive Desk Lamp (Pre-Owned • 100% Tested Working)',
    price: 58000,
    originalPrice: 85000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Unit with Original Power Adapter & Secure Padded Box',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 45000,
    ownerCommission: 13000,
    commissionNote: '₦13,000 commission on certified smart lamp',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', // Front lamp
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', // Side arm swivel
      'https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800', // Touch slider panel
      'https://images.unsplash.com/photo-1609592424368-e4b2d1d0537d?auto=format&fit=crop&q=80&w=800'  // Tested power supply
    ],
    category: 'Latest Gadgets',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Tech',
    shortDescription: 'Certified pre-owned eye-care LED desk lamp with auto-dimming sensor and wireless charging base.',
    description: 'Fully inspected and verified working 100%. Dual-pivot aluminum arm adjusts smoothly, LED diodes produce flicker-free Ra95 natural lighting, and integrated Qi wireless base charges phones flawlessly.',
    inStock: true,
    stockCount: 18,
    rating: 4.8,
    reviewCount: 39,
    features: [
      '100% tested working fine: LEDs, touch slider, and wireless base',
      'Auto-dimming ambient light sensor adjusts brightness in real-time',
      'Dual-axis articulating arm for precise glare-free workstation lighting',
      '90-day comprehensive Sajoda certified guarantee'
    ],
    specifications: [
      { name: 'Condition', value: 'Pre-Owned (100% Functional)' },
      { name: 'Color Temp', value: '2700K - 6500K Continuous' },
      { name: 'Color Rendering', value: 'CRI Ra95 Eye-Care' }
    ]
  },

  // ==========================================
  // --- ELECTRONICS: BRAND NEW (SEALED CARTON BOX) ---
  // ==========================================
  {
    id: 'sajoda-cinebeam-projector',
    name: 'Sajoda CineBeam 4K Laser Cinema Projector (Brand New • Sealed Carton)',
    price: 360000,
    originalPrice: 420000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack & Carton with Shock-Absorbent Foam',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    relatedConditionId: 'sajoda-cinebeam-projector-used',
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: 310000,
    ownerCommission: 50000,
    commissionNote: '₦50,000 commission on premium 4K laser projector',
    image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', // Front lens & grille
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', // Side ventilation
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Rear HDMI eARC & optical ports
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Sealed factory carton
    ],
    category: 'Electronics',
    badge: 'SEALED CARTON',
    brand: 'Sajoda Cinema',
    shortDescription: 'True 4K UHD laser projection, 2200 ANSI lumens, Android TV, and Dolby Audio in sealed carton.',
    description: 'Factory sealed in heavy-duty retail carton box. Projects breathtaking 150-inch 4K imagery with laser clarity, intelligent autofocus, automatic keystone adjustment, and dual 10W Harman-tuned stereo speakers.',
    inStock: true,
    stockCount: 20,
    rating: 4.9,
    reviewCount: 110,
    features: [
      'Factory sealed carton with holographic security seal intact',
      'True 4K UHD (3840x2160) laser display engine with HDR10+',
      '2200 ANSI Lumens for vivid movie viewing even in ambient light',
      'Instant AI auto-focus and 4-point automatic trapezoid keystone'
    ],
    specifications: [
      { name: 'Packaging', value: 'Original Sealed Carton Box' },
      { name: 'Max Screen Size', value: '150 Inches Diagonal' },
      { name: 'Light Source', value: 'ALPD Laser (25,000+ Hours)' }
    ]
  },
  {
    id: 'sajoda-soundsphere-anc-headphones',
    name: 'Sajoda SoundSphere 360 Spatial ANC Headphones (Brand New • Sealed Box)',
    price: 95000,
    originalPrice: 120000,
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed Box',
    packaging: 'Factory Sealed Retail Pack with Hard Carry Case & Aux Cable',
    warrantyInfo: '1-Year Sajoda Official Warranty',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 75000,
    ownerCommission: 20000,
    commissionNote: '₦20,000 commission on premium ANC studio headphones',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', // Front earcups
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Side headband profile
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=800', // Touch control & USB-C jack
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800'  // Factory sealed carton & case
    ],
    category: 'Electronics',
    badge: 'SEALED BOX',
    brand: 'Sajoda Audio',
    shortDescription: 'Active Noise Cancellation (-45dB) with dynamic head-tracking spatial audio in sealed box.',
    description: 'Factory sealed retail box with hardshell travel case. 40mm custom beryllium drivers produce ultra-crisp highs and rumbling sub-bass with 50 hours of wireless playback.',
    inStock: true,
    stockCount: 30,
    rating: 4.8,
    reviewCount: 88,
    features: [
      'Factory sealed in retail box with hardshell travel case included',
      'Hybrid Active Noise Cancellation blocks up to 98% of ambient noise',
      '360° Spatial Audio with real-time gyroscopic head tracking',
      '50-hour continuous battery life with 10-minute fast charge'
    ],
    specifications: [
      { name: 'Packaging', value: 'Sealed Retail Carton Box' },
      { name: 'Driver Size', value: '40mm Custom Beryllium' },
      { name: 'Battery Life', value: '50 Hours (ANC On)' }
    ]
  },

  // ==========================================
  // --- ELECTRONICS: PRE-OWNED (100% TESTED WORKING FINE) ---
  // ==========================================
  {
    id: 'sajoda-studiobar-soundbar-used',
    name: 'Sajoda StudioBar 5.1 Dolby Atmos Soundbar (Pre-Owned • 100% Tested Working)',
    price: 210000,
    originalPrice: 320000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Unit with Wireless Subwoofer, Remote & HDMI eARC Cable',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: 175000,
    ownerCommission: 35000,
    commissionNote: '₦35,000 commission on certified Dolby Atmos soundbar',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Tested soundbar front
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', // Up-firing Atmos drivers
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', // Rear HDMI eARC & optical
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'  // Wireless subwoofer test
    ],
    category: 'Electronics',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Audio',
    shortDescription: 'Tested and verified 5.1 channel surround soundbar with dedicated wireless subwoofer.',
    description: '100% operational hardware certified by audio acoustic engineers. Up-firing Dolby Atmos elevation drivers and wireless 8-inch subwoofer fill any living room with cinema-grade acoustics.',
    inStock: true,
    stockCount: 11,
    rating: 4.9,
    reviewCount: 63,
    features: [
      'Acoustically tested at full volume with zero distortion or buzzing',
      'True Dolby Atmos & DTS:X 3D spatial surround decoding',
      'Wireless 8-inch downward-firing subwoofer syncs instantly',
      '90-day Sajoda guarantee covers all drivers and amplifiers'
    ],
    specifications: [
      { name: 'Condition', value: '100% Tested Working Fine (Grade A)' },
      { name: 'Total Power', value: '450W Peak Audio' },
      { name: 'Channels', value: '5.1 Physical Channels with Atmos' }
    ]
  },
  {
    id: 'sajoda-horizonview-monitor-used',
    name: 'Sajoda HorizonView 27" 4K HDR Studio Monitor (Pre-Owned • 100% Tested Working)',
    price: 185000,
    originalPrice: 260000,
    condition: 'used',
    conditionGrade: 'Certified Pre-Owned - 100% Tested Working Fine',
    packaging: 'Certified Tested Display with 0 Dead Pixels, Stand & DisplayPort/HDMI Cables',
    warrantyInfo: '90-Day Sajoda Certified Guarantee',
    sourcingHub: 'Computer Village Ikeja Tech Hub (Lagos)',
    baseCost: 155000,
    ownerCommission: 30000,
    commissionNote: '₦30,000 commission on certified 4K monitor',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=800', // Tested panel front
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=800', // Side ultra-thin bezel
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800', // Rear USB-C 65W charging & DP
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800'  // Zero dead pixel test screen
    ],
    category: 'Electronics',
    badge: '100% TESTED WORKING',
    brand: 'Sajoda Displays',
    shortDescription: 'Certified pre-owned 27" IPS 4K monitor tested with 0 dead pixels and 65W USB-C hub.',
    description: 'Passed full pixel-grid inspection with 0 dead pixels and 99% sRGB color gamut accuracy. Features 65W USB-C one-cable laptop connectivity, height-adjustable stand, and eye-care blue light filter.',
    inStock: true,
    stockCount: 14,
    rating: 4.8,
    reviewCount: 44,
    features: [
      '100% tested working fine: Zero dead pixels and zero backlight bleed',
      '4K UHD (3840x2160) IPS panel with 99% sRGB color accuracy',
      'USB-C 65W Power Delivery charges laptop while transmitting 4K video',
      'Backed by 90-day comprehensive Sajoda certified guarantee'
    ],
    specifications: [
      { name: 'Condition', value: 'Pre-Owned (100% Tested Working Fine)' },
      { name: 'Resolution', value: '3840 x 2160 @ 60Hz' },
      { name: 'Panel Type', value: 'IPS with Anti-Glare Coating' }
    ]
  }
];
