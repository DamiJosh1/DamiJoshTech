const fs = require('fs');

const dataPath = '/app/applet/src/data.ts';

const newContent = `import { Product } from './types';

export const products: Product[] = [
  {
    id: '1',
    name: 'Magsafe Wireless Power Bank 10000mAh',
    price: 39.99,
    originalPrice: 59.99,
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
    name: 'Active Noise Cancelling Wireless Earbuds',
    price: 89.99,
    originalPrice: 129.99,
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
    name: 'Smart Fitness Watch Series 5',
    price: 199.99,
    originalPrice: 249.99,
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
    name: '4K Cinematic Drone Pro',
    price: 499.00,
    originalPrice: 549.00,
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
    name: 'Smart Robotic Vacuum Cleaner',
    price: 249.99,
    originalPrice: 329.99,
    image: 'https://images.unsplash.com/photo-1589802778393-272e259e88d0?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1589802778393-272e259e88d0?auto=format&fit=crop&q=80&w=800',
    ],
    description: 'Keep your floors spotless without lifting a finger. Features advanced LiDAR navigation and strong suction power.',
    features: ['LiDAR Navigation', '2000Pa Suction', 'App Control', 'Auto-Charge'],
    category: 'Home Appliances',
    badge: 'Trending',
    cjSku: 'CJ-VAC-505'
  },
  {
    id: '6',
    name: 'Smart Air Purifier Pro',
    price: 149.00,
    originalPrice: 199.00,
    image: 'https://images.unsplash.com/photo-1585501869818-47535560bbfd?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585501869818-47535560bbfd?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Breathe cleaner air with this smart HEPA air purifier. Removes 99.97% of allergens, dust, and odors.',
    features: ['True HEPA Filter', 'Real-time Air Quality', 'Ultra-Quiet', 'Smart App Integration'],
    category: 'Home Appliances',
    cjSku: 'CJ-AIR-606'
  },
  {
    id: '7',
    name: 'Smart Home Hub Display 10"',
    price: 129.99,
    originalPrice: 159.99,
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
    name: 'Professional Digital Blender 1200W',
    price: 99.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1585237833075-802554cbbf38?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1585237833075-802554cbbf38?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Crush ice and blend smoothies perfectly in seconds with this high-powered digital blender.',
    features: ['1200W Motor', '6-Blade Assembly', 'Auto-iQ Programs', 'BPA-Free Pitcher'],
    category: 'Home Appliances',
    cjSku: 'CJ-BLEND-808'
  },
  {
    id: '9',
    name: 'Premium Wireless Over-Ear Headphones',
    price: 299.99,
    originalPrice: 349.99,
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
    name: 'Smart Wi-Fi Coffee Maker',
    price: 119.99,
    originalPrice: 149.99,
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800'
    ],
    description: 'Wake up to the smell of fresh coffee. Program and control your brew from your smartphone anywhere.',
    features: ['Wi-Fi Enabled', '12-Cup Capacity', 'Voice Control Compatible', 'Custom Brew Strength'],
    category: 'Home Appliances',
    cjSku: 'CJ-COFFEE-1010'
  }
];
`;

fs.writeFileSync(dataPath, newContent);
console.log("Updated data.ts successfully.");
