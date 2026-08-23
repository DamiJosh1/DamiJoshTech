import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';

const pagesData: Record<string, { title: string; content: React.ReactNode }> = {
  'help': {
    title: 'Help Center',
    content: <div className="space-y-4"><p>Welcome to the SAJODA Help Center. We are here to assist you.</p><p>If you have any questions about your order, shipping, or returns, please contact our support team.</p></div>
  },
  'faq': {
    title: 'Frequently Asked Questions',
    content: <div className="space-y-6">
      <div><h3 className="font-bold text-lg mb-2">How long does shipping take?</h3><p className="text-zinc-600">Shipping typically takes 5-10 business days for international orders.</p></div>
      <div><h3 className="font-bold text-lg mb-2">Do you ship worldwide?</h3><p className="text-zinc-600">Yes, we ship to over 100 countries globally.</p></div>
      <div><h3 className="font-bold text-lg mb-2">What is your return policy?</h3><p className="text-zinc-600">We offer a 30-day return policy for unused items in original packaging.</p></div>
    </div>
  },
  'contact': {
    title: 'Contact Us',
    content: <div className="space-y-4"><p>We would love to hear from you. Please reach out to us at support@sajodaelectronics.com or call us at 1-800-555-0198.</p></div>
  },
  'shipping': {
    title: 'Shipping Policy',
    content: <div className="space-y-4"><p>We strive to deliver your SAJODA products as quickly and safely as possible.</p><p>Orders are processed within 1-3 business days. International shipping times vary by destination.</p></div>
  },
  'returns': {
    title: 'Returns & Refunds',
    content: <div className="space-y-4"><p>We accept returns within 30 days of delivery. Items must be in original, unused condition.</p><p>Once your return is received and inspected, we will initiate a refund to your original payment method.</p></div>
  },
  'privacy': {
    title: 'Privacy Policy',
    content: <div className="space-y-4"><p>Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your personal information.</p><p>We use your data strictly to process orders and improve your shopping experience.</p></div>
  },
  'terms': {
    title: 'Terms of Service',
    content: <div className="space-y-4"><p>By using SAJODA ELECTRONICS, you agree to these terms of service. Please read them carefully.</p><p>We reserve the right to update these terms at any time.</p></div>
  },
  'why-sajoda': {
    title: 'Why SAJODA',
    content: <div className="space-y-4"><p>SAJODA ELECTRONICS brings you the very best of technology with an unwavering commitment to quality and service.</p></div>
  },
  'careers': {
    title: 'Careers',
    content: <div className="space-y-4"><p>Join our mission to power the world with technology. Check our open positions on LinkedIn.</p></div>
  },
  'cookies': {
    title: 'Cookie Policy',
    content: <div className="space-y-4"><p>We use essential cookies to make our store work and analytics cookies to improve your experience.</p></div>
  },
  'warranty': {
    title: 'Warranty Policy',
    content: <div className="space-y-4"><p>All SAJODA purchases are backed by a minimum 1-year manufacturer warranty.</p></div>
  },
  'about': {
    title: 'About SAJODA',
    content: <div className="space-y-4"><p>SAJODA ELECTRONICS is a premium international technology retailer.</p><p>We partner with the world's best manufacturers to bring cutting-edge appliances and gadgets directly to your home.</p></div>
  },
};

export default function ContentPage() {
  const location = useLocation();
  const path = location.pathname.split('/')[1] || 'help';
  const page = pagesData[path];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);

  if (!page) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 md:px-8 py-12 md:py-20 min-h-[calc(100vh-80px)]">
      <h1 className="text-3xl md:text-5xl font-black text-zinc-900 mb-8">{page.title}</h1>
      <div className="prose prose-zinc prose-lg max-w-none text-zinc-700">
        {page.content}
      </div>
    </div>
  );
}
