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
      <div><h3 className="font-bold text-lg mb-2">How long does shipping take?</h3><p className="text-zinc-600">Standard orders are delivered in 2–4 business days. Express courier delivery takes 1–2 business days.</p></div>
      <div><h3 className="font-bold text-lg mb-2">How can I track my shipment?</h3><p className="text-zinc-600">Enter your order number on our Track Order page to see real-time updates and live delivery status.</p></div>
      <div><h3 className="font-bold text-lg mb-2">What is your return policy?</h3><p className="text-zinc-600">We offer a 30-day hassle-free return policy for unused items in original packaging.</p></div>
    </div>
  },
  'contact': {
    title: 'Contact Us',
    content: <div className="space-y-4"><p>We would love to hear from you. Reach out to our customer care team at support@sajodaelectronics.com or use our live AI Assistant.</p></div>
  },
  'shipping': {
    title: 'Shipping Policy',
    content: <div className="space-y-4"><p>We strive to deliver your SAJODA appliances and gadgets as quickly and safely as possible.</p><p>Orders are dispatched within 24 hours from our local logistics hub with doorstep tracking.</p></div>
  },
  'returns': {
    title: 'Returns & Refunds',
    content: <div className="space-y-4"><p>We accept returns within 30 days of delivery. Items must be in original, unused condition.</p><p>Once your return is received and inspected, we will initiate an immediate refund to your original payment method.</p></div>
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
    content: <div className="space-y-4"><p>SAJODA ELECTRONICS brings you the very best of home appliances, smart gadgets, and modern electronics with genuine warranties and dedicated support.</p></div>
  },
  'careers': {
    title: 'Careers',
    content: <div className="space-y-4"><p>Join our mission to power homes with smart technology. Inquire at careers@sajodaelectronics.com.</p></div>
  },
  'cookies': {
    title: 'Cookie Policy',
    content: <div className="space-y-4"><p>We use essential cookies to make our store work and improve your shopping experience.</p></div>
  },
  'warranty': {
    title: 'Warranty Policy',
    content: <div className="space-y-4"><p>All SAJODA purchases are backed by an official 1-year replacement warranty on all electronics and home appliances.</p></div>
  },
  'about': {
    title: 'About SAJODA',
    content: <div className="space-y-4"><p>SAJODA ELECTRONICS is your dedicated online destination for smart home appliances, latest gadgets, and everyday electronics.</p><p>We bring high quality, certified smart devices directly to your doorstep with fast shipping and responsive customer care.</p></div>
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
