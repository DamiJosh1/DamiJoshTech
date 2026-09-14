import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'sajoda-aurora-earbuds',
    name: 'Sajoda Aurora Pro Wireless Earbuds',
    price: 129.99,
    originalPrice: 179.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Audio',
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
    ]
  },
  {
    id: 'sajoda-lumina-smart-lamp',
    name: 'Sajoda Lumina Adaptive Desk Lamp',
    price: 89.99,
    originalPrice: 119.99,
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Smart Living',
    badge: 'FEATURED',
    brand: 'Sajoda Home',
    shortDescription: 'Circadian rhythm smart desk lamp with touch slider and wireless device charging pad.',
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
    ]
  },
  {
    id: 'sajoda-quantum-smartwatch',
    name: 'Sajoda Horizon AMOLED Smartwatch',
    price: 199.99,
    originalPrice: 249.99,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Gadgets',
    badge: 'NEW',
    brand: 'Sajoda Tech',
    shortDescription: 'Always-On 1.43" AMOLED display with biometric tracking and 14-day battery life.',
    description: 'Engineered with premium titanium bezel and sapphire crystal glass. Tracks SpO2, heart rate, sleep cycles, and over 100 sports activities with dual-band GPS precision.',
    inStock: true,
    stockCount: 22,
    rating: 4.9,
    reviewCount: 96,
    features: [
      '1.43" High-Definition Sapphire AMOLED Always-On Display',
      'Dual-frequency GPS positioning with offline route maps',
      'Comprehensive 24/7 biometric health tracking',
      '14-day ultra-long endurance battery life'
    ]
  },
  {
    id: 'sajoda-pureair-purifier',
    name: 'Sajoda PureAir HEPA Smart Purifier',
    price: 159.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&q=80&w=800'
    ],
    category: 'Home Appliances',
    badge: 'ECO',
    brand: 'Sajoda Home',
    shortDescription: 'True HEPA H13 filtration with real-time PM2.5 air quality laser sensor.',
    description: 'Breathe cleaner air with our 3-stage H13 medical grade filtration system capable of purifying rooms up to 500 sq ft in just 12 minutes while running in whisper-quiet sleep mode.',
    inStock: true,
    stockCount: 18,
    rating: 4.7,
    reviewCount: 57,
    features: [
      'Medical Grade True H13 HEPA & Activated Carbon filter',
      'Laser PM2.5 particle detection and auto speed regulation',
      'Whisper-quiet sleep operation at only 22dB',
      'Smart mobile app control and filter replacement alert'
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
    category: 'Audio',
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
    ]
  },
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
    badge: 'POPULAR',
    brand: 'Sajoda Home',
    shortDescription: 'Laser LiDAR mapping with 5000Pa hyper-suction and auto-mop lifting.',
    description: 'Precision 3D obstacle avoidance and multi-floor LiDAR mapping ensure flawless automated cleaning across hardwood, tile, and high-pile carpets.',
    inStock: true,
    stockCount: 15,
    rating: 4.9,
    reviewCount: 73,
    features: [
      '5000Pa extreme suction motor with automatic carpet boost',
      'Precision LiDAR 360° laser navigation and room zoning',
      '2-in-1 simultaneous vacuuming and sonic vibration mopping',
      'Smart virtual boundary barriers and no-go zones'
    ]
  }
];
