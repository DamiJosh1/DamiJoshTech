import { useStore } from '../StoreContext';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Plus, Minus, Instagram, Facebook, Twitter, Youtube, Linkedin } from 'lucide-react';
import Logo from '../Logo';

export default function Footer() {
  const { countries, currencies, activeCountry, setActiveCountry, activeCurrency, setActiveCurrency } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || isSubscribed) return;
    
    setIsSubscribing(true);
    setTimeout(() => {
      setIsSubscribing(false);
      setIsSubscribed(true);
      setEmail('');
    }, 1500);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleAccordion = (section: string) => {
    setActiveAccordion(activeAccordion === section ? null : section);
  };

  const navigationGroups = [
    {
      title: 'SHOP',
      links: [
        { label: 'Shop All', path: '/shop' },
        { label: 'Gadgets', path: '/categories/gadgets' },
        { label: 'Home Appliances', path: '/categories/appliances' },
        { label: 'Audio', path: '/categories/audio' },
        { label: 'Smart Living', path: '/categories/smart-living' },
        { label: 'Mobile Accessories', path: '/categories/accessories' },
        { label: 'New Arrivals', path: '/shop?q=new' },
        { label: 'Deals', path: '/shop?q=deals' },
      ]
    },
    {
      title: 'CUSTOMER CARE',
      links: [
        { label: 'Help Center', path: '/help' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Shipping', path: '/shipping' },
        { label: 'Returns', path: '/returns' },
        { label: 'Refund Policy', path: '/returns' },
        { label: 'Track Order', path: '/track-order' },
        { label: 'Contact Us', path: '/contact' },
      ]
    },
    {
      title: 'ACCOUNT',
      links: [
        { label: 'My Account', path: '/account' },
        { label: 'My Orders', path: '/account/orders' },
        { label: 'Wishlist', path: '/account/wishlist' },
        { label: 'Addresses', path: '/account/addresses' },
      ]
    },
    {
      title: 'SAJODA',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Why SAJODA', path: '/why-sajoda' },
        { label: 'Contact', path: '/contact' },
        { label: 'Careers', path: '/careers' },
      ]
    },
    {
      title: 'LEGAL',
      links: [
        { label: 'Terms', path: '/terms' },
        { label: 'Privacy', path: '/privacy' },
        { label: 'Cookies', path: '/cookies' },
        { label: 'Warranty', path: '/warranty' },
      ]
    }
  ];

  return (
    <footer className={`bg-zinc-950 text-zinc-300 w-full overflow-hidden transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'} pb-24 lg:pb-0`}>
      {/* Top Divider */}
      <div className="w-full h-px bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900"></div>

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pt-20 lg:pt-32">
        
        {/* Layer 1: Brand Statement & Layer 2: Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-24 mb-24">
          
          {/* Brand Statement */}
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight mb-6">
              SMARTER LIVING.<br />
              <span className="text-zinc-500">BETTER TECHNOLOGY.</span>
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-lg font-medium">
              Discover thoughtfully selected gadgets, electronics and home appliances designed to make everyday life smarter, easier and better.
            </p>
          </div>

          {/* Newsletter */}
          <div className="w-full lg:w-[480px] shrink-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-3">Stay in the Sajoda Loop</h3>
            <p className="text-zinc-400 mb-8 font-medium">Get product drops, smart finds and selected offers delivered to your inbox.</p>
            
            <form onSubmit={handleSubscribe} className="relative group flex flex-col sm:flex-row sm:items-center">
              <div className="relative w-full">
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ENTER YOUR EMAIL"
                  required
                  disabled={isSubscribing || isSubscribed}
                  className="w-full bg-transparent border-b border-zinc-700 py-4 text-white placeholder-zinc-600 outline-none focus:border-white transition-colors disabled:opacity-50 sm:pr-32"
                />
                {/* Focus indicator line */}
                <div className="absolute bottom-0 left-0 h-[1px] bg-white w-0 group-focus-within:w-full transition-all duration-500 ease-out"></div>
              </div>
              <button 
                type="submit"
                disabled={isSubscribing || isSubscribed}
                className="mt-4 sm:mt-0 sm:absolute sm:right-0 sm:top-1/2 sm:-translate-y-1/2 text-sm font-bold tracking-widest uppercase transition-all duration-300 disabled:opacity-50 text-white hover:text-zinc-300 flex justify-start sm:justify-end"
              >
                {isSubscribing ? 'SUBSCRIBING...' : isSubscribed ? "YOU'RE IN." : 'SUBSCRIBE'}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-zinc-900 mb-20"></div>

        {/* Layer 3: Navigation Grid */}
        <div className="hidden lg:grid grid-cols-5 gap-8 mb-24">
          {navigationGroups.map((group) => (
            <div key={group.title}>
              <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-8">{group.title}</h4>
              <ul className="space-y-4">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <button 
                      onClick={() => navigate(link.path)}
                      className="text-zinc-400 hover:text-white transition-colors duration-300 font-medium group flex items-center gap-2"
                    >
                      <span>{link.label}</span>
                      <span className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 text-xs">→</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Layer 3: Mobile Navigation Accordions */}
        <div className="lg:hidden mb-20 border-t border-zinc-900">
          {navigationGroups.map((group) => (
            <div key={group.title} className="border-b border-zinc-900">
              <button 
                onClick={() => toggleAccordion(group.title)}
                className="w-full flex items-center justify-between py-6 text-left"
                aria-expanded={activeAccordion === group.title}
              >
                <span className="text-sm font-bold text-white tracking-widest uppercase">{group.title}</span>
                <div className="relative w-4 h-4 text-zinc-500">
                  <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${activeAccordion === group.title ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'}`}>
                    <Plus className="w-4 h-4" />
                  </span>
                  <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${activeAccordion === group.title ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'}`}>
                    <Minus className="w-4 h-4" />
                  </span>
                </div>
              </button>
              
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${activeAccordion === group.title ? 'max-h-96 opacity-100 mb-6' : 'max-h-0 opacity-0'}`}
              >
                <ul className="space-y-4 pt-2">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <button 
                        onClick={() => navigate(link.path)}
                        className="text-zinc-400 hover:text-white font-medium text-left w-full block py-1"
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Layer 4: Trust / Social / Region */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-24">
          {/* Trust Strip */}
          <div className="flex flex-wrap items-center gap-6 md:gap-10 text-xs font-bold text-zinc-500 tracking-wider uppercase">
            <span>SECURE CHECKOUT</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800"></span>
            <span>ORDER TRACKING</span>
            <span className="hidden sm:inline w-1 h-1 rounded-full bg-zinc-800"></span>
            <span>CUSTOMER SUPPORT</span>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a href="#" aria-label="Instagram" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="#" aria-label="YouTube" className="text-zinc-500 hover:text-white hover:-translate-y-1 transition-all duration-300">
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>

        {/* Large Signature Wordmark */}
        <div className="w-full flex justify-center items-center overflow-hidden mb-16 select-none opacity-20 pointer-events-none">
          <span className="text-[12vw] font-black leading-none tracking-tighter text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>
            SAJODA
          </span>
        </div>

        {/* Layer 5: Legal + Copyright + Back to Top */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-900 pb-12">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8 text-xs font-medium text-zinc-500">
            <p>© {new Date().getFullYear()} SAJODA ELECTRONICS. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/privacy')} className="hover:text-white transition-colors">Privacy</button>
              <button onClick={() => navigate('/terms')} className="hover:text-white transition-colors">Terms</button>
              <button onClick={() => navigate('/cookies')} className="hover:text-white transition-colors">Cookies</button>
            </div>
          </div>
          
          <button 
            onClick={scrollToTop}
            className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-400 hover:text-white group transition-colors"
          >
            <span>BACK TO TOP</span>
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
}
