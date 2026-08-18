import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Magsafe Wireless Power Bank',
    price: 45.00,
    originalPrice: 75.00,
    image: 'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1605464315542-bda3e2f4e605?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1601524909162-ae8725290836?auto=format&fit=crop&q=80&w=800',
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-modern-smartwatch-with-a-blue-interface-4082-large.mp4',
    description: 'Compact and powerful magnetic wireless power bank that attaches perfectly to your phone. Never run out of battery during your long days.',
    features: ['10,000mAh Capacity', '15W Fast Wireless Charging', 'Strong Magnetic Hold', 'USB-C In/Out'],
    category: 'Accessories',
    badge: 'Trending',
    cjSku: 'CJ-MAG-101'
  },
  {
    id: '2',
    name: 'Active Noise Cancelling Earbuds',
    price: 59.99,
    originalPrice: 99.99,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1606220588913-b3aea9046b06?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Experience pure sound with industry-leading active noise cancellation. Crystal clear highs and deep bass.',
    features: ['Up to 30h battery life', 'IPX4 Water Resistant', 'Touch Controls', 'Bluetooth 5.3'],
    category: 'Audio',
    cjSku: 'CJ-BUDS-202'
  },
  {
    id: '3',
    name: 'Smart Fitness Watch Pro',
    price: 129.99,
    originalPrice: 199.99,
    image: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-modern-smartwatch-with-a-blue-interface-4082-large.mp4',
    description: 'Track your health and fitness goals with precision. Features heart rate, SpO2, sleep tracking, and built-in GPS.',
    features: ['AMOLED Display', 'Built-in GPS', 'Heart Rate Monitoring', '14-Day Battery'],
    category: 'Wearables',
    badge: 'Sale',
    cjSku: 'CJ-WATCH-303'
  },
  {
    id: '4',
    name: '4K Cinematic Drone',
    price: 299.99,
    image: 'https://images.unsplash.com/photo-1507580461121-4fd5dd41f1ca?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1507580461121-4fd5dd41f1ca?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1524143986875-3b098d78b363?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Capture stunning cinematic shots from the sky with our lightweight, portable 4K drone.',
    features: ['4K/60fps Video', '3-Axis Gimbal', '31-Min Flight Time', 'Obstacle Avoidance'],
    category: 'Gadgets',
    cjSku: 'CJ-DRONE-404'
  },
  {
    id: '5',
    name: 'RGB Mechanical Gaming Keyboard',
    price: 115.00,
    originalPrice: 150.00,
    image: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Tactile, clicky switches paired with per-key RGB lighting. Built for extreme gaming performance.',
    features: ['Mechanical Switches', 'Custom RGB Lighting', 'Aircraft-grade Aluminum', 'N-key Rollover'],
    category: 'Gaming',
    badge: 'Trending',
    cjSku: 'CJ-KEY-505'
  },
  {
    id: '6',
    name: 'Ergonomic Wireless Mouse',
    price: 35.00,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Designed for comfort and precision. Reduces wrist strain during long hours of work or play.',
    features: ['Vertical Ergonomic Design', '2.4GHz Wireless', 'Adjustable DPI', 'Silent Clicks'],
    category: 'Accessories',
    cjSku: 'CJ-MOUSE-606'
  },
  {
    id: '7',
    name: 'Smart Home Hub Display',
    price: 149.00,
    originalPrice: 179.00,
    image: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Control your entire smart home ecosystem from one beautiful 10-inch touchscreen display.',
    features: ['Voice Assistant Built-in', '10" HD Touchscreen', 'Smart Device Control', 'Video Calling'],
    category: 'Smart Home',
    badge: 'New',
    cjSku: 'CJ-HUB-707'
  },
  {
    id: '8',
    name: 'Ultra-Slim Portable SSD 1TB',
    price: 89.99,
    originalPrice: 120.00,
    image: 'https://images.unsplash.com/photo-1618424181497-157f25b6ce5e?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1618424181497-157f25b6ce5e?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Lightning-fast storage in a pocket-sized form factor. Ideal for creatives and professionals on the go.',
    features: ['1050MB/s Read Speed', 'USB 3.2 Gen 2', 'Shock Resistant', '256-bit AES Encryption'],
    category: 'Storage',
    cjSku: 'CJ-SSD-808'
  },
  {
    id: '9',
    name: 'Premium Wireless Over-Ear Headphones',
    price: 249.99,
    originalPrice: 299.99,
    image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800'
    ],
    video: 'https://assets.mixkit.co/videos/preview/mixkit-modern-smartwatch-with-a-blue-interface-4082-large.mp4',
    description: 'Studio-quality sound, premium materials, and class-leading noise cancellation.',
    features: ['High-Res Audio', '40h Battery', 'Multi-point Connection', 'Spatial Audio'],
    category: 'Audio',
    badge: 'Trending',
    cjSku: 'CJ-HEAD-909'
  },
  {
    id: '10',
    name: 'Smart LED Light Strip',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Transform your room with vibrant, customizable RGB lighting. Syncs with music and smart home assistants.',
    features: ['16 Million Colors', 'App Control', 'Music Sync', 'Cuttable Design'],
    category: 'Smart Home',
    cjSku: 'CJ-LED-1010'
  }
];
