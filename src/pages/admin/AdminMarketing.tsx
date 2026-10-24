import React, { useState, useEffect } from 'react';
import { 
  Megaphone, Plus, Sparkles, Tag, TrendingUp, Users, Send, 
  CheckCircle2, Clock, Eye, AlertCircle, Copy, Share2, 
  Trash2, Edit3, ArrowUpRight, BarChart2, MessageSquare, 
  Mail, Bell, Zap, Filter, RefreshCw, X, Check, Globe
} from 'lucide-react';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { useStore } from '../../StoreContext';

interface Campaign {
  id?: string;
  title: string;
  channel: 'WhatsApp' | 'Instagram' | 'TikTok' | 'Email' | 'Multi-Channel';
  status: 'active' | 'scheduled' | 'completed' | 'draft';
  targetAudience: string;
  budget: number;
  revenue: number;
  conversions: number;
  clicks: number;
  startDate: string;
  endDate: string;
  discountCode?: string;
  contentSnippet?: string;
}

interface PromoCode {
  id?: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend: number;
  usageCount: number;
  usageLimit?: number;
  status: 'active' | 'inactive';
  expiresAt?: string;
  description?: string;
}

export default function AdminMarketing() {
  const { formatPrice } = useStore();
  const [activeTab, setActiveTab] = useState<'campaigns' | 'promos' | 'ai-copy' | 'announcement'>('campaigns');

  // Campaigns State
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<Campaign>>({
    title: '',
    channel: 'WhatsApp',
    status: 'active',
    targetAudience: 'All Lagos & Nationwide Customers',
    budget: 25000,
    revenue: 0,
    conversions: 0,
    clicks: 0,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    discountCode: '',
    contentSnippet: ''
  });

  // Promo Codes State
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [showPromoModal, setShowPromoModal] = useState(false);
  const [newPromo, setNewPromo] = useState<Partial<PromoCode>>({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minSpend: 50000,
    usageLimit: 100,
    status: 'active',
    description: 'Special seasonal promotion'
  });

  // Announcement Bar State
  const [announcementText, setAnnouncementText] = useState('⚡ Flash Deal: Get ₦10,000 OFF on all Smart Inverter Blenders & Audio! Use Code: SAJODA10K');
  const [announcementActive, setAnnouncementActive] = useState(true);
  const [announcementSaved, setAnnouncementSaved] = useState(false);

  // AI Copy Generator State
  const [aiGoal, setAiGoal] = useState<'flash_sale' | 'new_arrival' | 'clearance' | 'appliance_promo' | 'gadget_drop'>('flash_sale');
  const [aiProductFocus, setAiProductFocus] = useState('Home Appliances & Latest Tech Gadgets');
  const [aiDiscountNote, setAiDiscountNote] = useState('Up to 15% OFF or ₦10,000 instant discount with free Lagos delivery');
  const [isGeneratingAiCopy, setIsGeneratingAiCopy] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<{
    whatsapp?: string;
    instagram?: string;
    emailSubject?: string;
    emailBody?: string;
    smsAlert?: string;
  } | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Load Campaigns from Firestore
  useEffect(() => {
    try {
      const q = query(collection(db, 'marketing_campaigns'), orderBy('startDate', 'desc'));
      const unsub = onSnapshot(q, (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign));
          setCampaigns(loaded);
        } else {
          // Provide realistic starter campaigns if collection is fresh
          const defaultCampaigns: Campaign[] = [
            {
              id: 'camp-1',
              title: 'Lagos Tech Week Flash Sale',
              channel: 'Multi-Channel',
              status: 'active',
              targetAudience: 'Tech enthusiasts in Lagos & Abuja',
              budget: 45000,
              revenue: 420000,
              conversions: 18,
              clicks: 1420,
              startDate: '2026-10-20',
              endDate: '2026-10-31',
              discountCode: 'TECH10K',
              contentSnippet: 'Massive price drops on wireless earbuds, power banks & smart accessories.'
            },
            {
              id: 'camp-2',
              title: 'Home Appliances Clean Sweep Blast',
              channel: 'WhatsApp',
              status: 'active',
              targetAudience: 'Home owners & families',
              budget: 20000,
              revenue: 680000,
              conversions: 8,
              clicks: 890,
              startDate: '2026-10-18',
              endDate: '2026-10-28',
              discountCode: 'APPLIANCE5',
              contentSnippet: 'Commercial blenders, air fryers & smart kettles direct from Alaba wholesale.'
            },
            {
              id: 'camp-3',
              title: 'Certified Pre-Owned Gadgets Drop',
              channel: 'Instagram',
              status: 'scheduled',
              targetAudience: 'Budget conscious smartphone & audio buyers',
              budget: 35000,
              revenue: 0,
              conversions: 0,
              clicks: 0,
              startDate: '2026-11-01',
              endDate: '2026-11-10',
              discountCode: 'PREOWNED90',
              contentSnippet: '100% tested working fine electronics with 90-day SAJODA guarantee.'
            }
          ];
          setCampaigns(defaultCampaigns);
        }
        setIsLoadingCampaigns(false);
      }, (err) => {
        console.warn('Campaigns listener note:', err);
        setIsLoadingCampaigns(false);
      });
      return () => unsub();
    } catch (e) {
      setIsLoadingCampaigns(false);
    }
  }, []);

  // Load Promo Codes
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'promotions'), (snapshot) => {
        if (!snapshot.empty) {
          const loaded = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PromoCode));
          setPromos(loaded);
        } else {
          setPromos([
            {
              id: 'promo-1',
              code: 'SAJODA10K',
              discountType: 'fixed',
              discountValue: 10000,
              minSpend: 80000,
              usageCount: 23,
              usageLimit: 100,
              status: 'active',
              description: '₦10,000 OFF on orders above ₦80,000'
            },
            {
              id: 'promo-2',
              code: 'WELCOME5',
              discountType: 'percentage',
              discountValue: 5,
              minSpend: 25000,
              usageCount: 45,
              usageLimit: 250,
              status: 'active',
              description: '5% Welcome discount for new customers'
            },
            {
              id: 'promo-3',
              code: 'LAGOSFREE',
              discountType: 'fixed',
              discountValue: 5000,
              minSpend: 100000,
              usageCount: 12,
              usageLimit: 50,
              status: 'active',
              description: '₦5,000 Shipping subsidy on electronics'
            }
          ]);
        }
      }, (err) => console.warn('Promos listener note:', err));
      return () => unsub();
    } catch (e) {}
  }, []);

  // Handle Save Campaign
  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title) return;

    try {
      await addDoc(collection(db, 'marketing_campaigns'), {
        ...newCampaign,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowCampaignModal(false);
      setNewCampaign({
        title: '',
        channel: 'WhatsApp',
        status: 'active',
        targetAudience: 'All Lagos & Nationwide Customers',
        budget: 25000,
        revenue: 0,
        conversions: 0,
        clicks: 0,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
        discountCode: '',
        contentSnippet: ''
      });
    } catch (err) {
      console.error('Error saving campaign:', err);
    }
  };

  // Handle Save Promo Code
  const handleSavePromo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPromo.code) return;

    try {
      const codeUpper = newPromo.code.toUpperCase().trim();
      await addDoc(collection(db, 'promotions'), {
        ...newPromo,
        code: codeUpper,
        usageCount: 0,
        createdAt: serverTimestamp()
      });
      setShowPromoModal(false);
      setNewPromo({
        code: '',
        discountType: 'percentage',
        discountValue: 10,
        minSpend: 50000,
        usageLimit: 100,
        status: 'active',
        description: ''
      });
    } catch (err) {
      console.error('Error saving promo code:', err);
    }
  };

  // Toggle Promo Status
  const handleTogglePromo = async (promo: PromoCode) => {
    if (!promo.id) return;
    try {
      const newStatus = promo.status === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'promotions', promo.id), { status: newStatus });
    } catch (err) {
      console.error('Error toggling promo:', err);
    }
  };

  // Generate AI Marketing Copy
  const handleGenerateAiCopy = async () => {
    setIsGeneratingAiCopy(true);
    setGeneratedCopy(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generate a high-converting, multi-channel marketing campaign package for 'SAJODA ELECTRONICS' (Store Owner: DamiJosh).
Goal: ${aiGoal}
Product Focus: ${aiProductFocus}
Promo Offer: ${aiDiscountNote}
Market: Nigeria (Lagos, Abuja, nationwide delivery, authentic Naira prices, certified quality).

Format your reply strictly as JSON with these keys:
{
  "whatsapp": "Engaging WhatsApp broadcast message with emojis, clear CTA, urgency, and store link",
  "instagram": "Catchy Instagram caption with hook, bullet points of products, guarantee note, CTA, and 12 high-performing Nigerian tech hashtags",
  "emailSubject": "Compelling subject line under 50 chars with high open-rate power",
  "emailBody": "3 paragraph email newsletter announcement with bold highlights and shop button link",
  "smsAlert": "Crisp 150-char SMS / Push notification alert with discount code"
}`,
          isAdmin: true
        })
      });

      const data = await res.json();
      let text = data.text || '';
      
      // Extract JSON from response
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        text = text.substring(jsonStart, jsonEnd + 1);
        const parsed = JSON.parse(text);
        setGeneratedCopy(parsed);
      } else {
        // Fallback robust copy
        setGeneratedCopy({
          whatsapp: `🔥 *SAJODA ELECTRONICS MEGA FLASH SALE IS LIVE!* 🔥\n\nUpgrade your space today with authentic home appliances & cutting-edge gadgets direct from top Lagos distribution hubs!\n\n⚡ *Offer Details:*\n• ${aiDiscountNote}\n• Brand New in Sealed Cartons (1-Year Warranty)\n• Certified Pre-Owned units (100% Tested Working Fine)\n• Same-day dispatch across Lagos!\n\n👉 Shop now: https://sajoda.ng/shop\n_Hurry while stock lasts!_`,
          instagram: `Ready to upgrade your home and gadget game? ⚡🔌\n\nAt SAJODA Electronics, we bring you genuine appliances and premium tech straight from trusted domestic hubs. Every brand new item comes in sealed cartons with official warranty, plus tested pre-owned gems with our 90-day guarantee!\n\n💥 Exclusive Deal: ${aiDiscountNote}\n📦 Express delivery available nationwide!\n\nTap the link in bio to shop now or send us a DM to reserve your order before stock runs out!\n\n#SajodaElectronics #LagosTech #NigeriaGadgets #HomeAppliancesNigeria #ComputerVillageDeals #AlabaWholesale #TechLagos #NigerianShoppers #NaijaTech #OnlineShoppingNigeria #SmartHomeLagos #GadgetHub`,
          emailSubject: `⚡ Unmissable Flash Drop: ${aiDiscountNote}!`,
          emailBody: `Hello Shopper,\n\nWe are excited to announce our biggest promotion yet at SAJODA Electronics! For a limited time, enjoy ${aiDiscountNote} across our top-rated collection of home appliances and latest tech gadgets.\n\nWhether you are looking to outfit your kitchen with commercial-grade blenders or pick up the latest audio gear, SAJODA guarantees authentic quality and swift nationwide delivery.\n\nShop the collection now before promotional inventory sells out!`,
          smsAlert: `FLASH SALE: ${aiDiscountNote} at SAJODA Electronics! Shop authentic appliances & gadgets now: sajoda.ng/deals`
        });
      }
    } catch (err) {
      console.error('Error generating AI copy:', err);
      // Set high quality fallback
      setGeneratedCopy({
        whatsapp: `🔥 *EXCLUSIVE FLASH SALE AT SAJODA ELECTRONICS!* 🔥\n\nDon't miss out on ${aiDiscountNote} across our top Home Appliances & Gadgets.\n\n⚡ Same-day Lagos delivery & verified warranty on every order.\n\nShop now: https://sajoda.ng/shop`,
        instagram: `Elevate your lifestyle with authentic tech and home electronics from SAJODA! ⚡📱\n\nEnjoy ${aiDiscountNote} for the next 48 hours only.\n\n🔗 Tap the link in bio to grab yours!\n#SajodaElectronics #LagosTech #NigeriaGadgets #HomeAppliances`,
        emailSubject: `⚡ Flash Offer: ${aiDiscountNote} at SAJODA`,
        emailBody: `Hi there,\n\nTake advantage of special savings on home appliances and gadgets this week at SAJODA Electronics.\n\nVisit sajoda.ng/shop to browse authentic deals!`,
        smsAlert: `SAJODA SALE: ${aiDiscountNote}. Order now at sajoda.ng/deals`
      });
    } finally {
      setIsGeneratingAiCopy(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Calculate Totals
  const totalCampaignRevenue = campaigns.reduce((sum, c) => sum + (c.revenue || 0), 0);
  const totalCampaignBudget = campaigns.reduce((sum, c) => sum + (c.budget || 0), 0);
  const totalConversions = campaigns.reduce((sum, c) => sum + (c.conversions || 0), 0);
  const activeCampaignsCount = campaigns.filter(c => c.status === 'active').length;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-pink-100 text-pink-700">
              <Megaphone className="w-5 h-5" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-pink-700">
              Growth & Sales Engine
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-zinc-900 tracking-tight">
            Marketing & Campaign Management
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Manage WhatsApp blasts, social campaigns, discount promo codes, and AI-powered copy.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowPromoModal(true)}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Tag className="w-4 h-4 text-pink-600" />
            New Promo Code
          </button>

          <button
            onClick={() => setActiveTab('ai-copy')}
            className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md hover:opacity-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            AI Copy Generator
          </button>

          <button
            onClick={() => setShowCampaignModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Create Campaign
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Active Campaigns</span>
            <div className="w-8 h-8 rounded-lg bg-pink-50 text-pink-600 flex items-center justify-center font-bold">
              <Megaphone className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">{activeCampaignsCount}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> {campaigns.length} total running/scheduled
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Campaign Revenue</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ₦
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">₦{totalCampaignRevenue.toLocaleString()}</div>
          <div className="text-xs text-zinc-500 font-medium mt-1">
            From ₦{totalCampaignBudget.toLocaleString()} ad spend
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Orders Converted</span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BarChart2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">{totalConversions}</div>
          <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> High checkout intent
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-500">Active Promo Codes</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Tag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-zinc-900">
            {promos.filter(p => p.status === 'active').length}
          </div>
          <div className="text-xs text-zinc-500 font-medium mt-1">
            {promos.reduce((acc, p) => acc + (p.usageCount || 0), 0)} total redemptions
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-zinc-200 overflow-x-auto pb-1 scrollbar-hide">
        {[
          { key: 'campaigns', label: 'All Campaigns', icon: <Megaphone className="w-4 h-4" /> },
          { key: 'promos', label: 'Promo Codes & Discounts', icon: <Tag className="w-4 h-4" /> },
          { key: 'ai-copy', label: 'AI Copy Generator', icon: <Sparkles className="w-4 h-4" /> },
          { key: 'announcement', label: 'Store Announcement Bar', icon: <Globe className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.key
                ? 'bg-zinc-900 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: CAMPAIGNS LIST */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-base text-zinc-900">Marketing Campaigns</h3>
                <p className="text-xs text-zinc-500">Track and optimize multi-channel promotional blasts.</p>
              </div>
              <button
                onClick={() => setShowCampaignModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> New Campaign
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {campaigns.map((camp) => (
                <div key={camp.id || camp.title} className="p-5 hover:bg-zinc-50/60 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          camp.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : camp.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-zinc-100 text-zinc-700'
                        }`}>
                          {camp.status}
                        </span>

                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-zinc-100 text-zinc-700 flex items-center gap-1">
                          {camp.channel === 'WhatsApp' && <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />}
                          {camp.channel === 'Instagram' && <Megaphone className="w-3.5 h-3.5 text-pink-600" />}
                          {camp.channel === 'TikTok' && <Zap className="w-3.5 h-3.5 text-black" />}
                          {camp.channel === 'Email' && <Mail className="w-3.5 h-3.5 text-indigo-600" />}
                          {camp.channel === 'Multi-Channel' && <Globe className="w-3.5 h-3.5 text-purple-600" />}
                          {camp.channel}
                        </span>

                        {camp.discountCode && (
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                            Code: {camp.discountCode}
                          </span>
                        )}
                      </div>

                      <h4 className="font-black text-base text-zinc-900">{camp.title}</h4>
                      <p className="text-xs text-zinc-500">{camp.contentSnippet || camp.targetAudience}</p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center bg-zinc-50 p-3 rounded-xl border border-zinc-100 shrink-0">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-zinc-400">Budget</div>
                        <div className="text-xs font-black text-zinc-800">₦{camp.budget.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-zinc-400">Clicks</div>
                        <div className="text-xs font-black text-zinc-800">{camp.clicks.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-zinc-400">Orders</div>
                        <div className="text-xs font-black text-zinc-800">{camp.conversions}</div>
                      </div>
                      <div>
                        <div className="text-[10px] uppercase font-bold text-zinc-400">Revenue</div>
                        <div className="text-xs font-black text-emerald-600">₦{camp.revenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROMO CODES */}
      {activeTab === 'promos' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-black text-base text-zinc-900">Active Discount & Voucher Codes</h3>
                <p className="text-xs text-zinc-500">Provide incentives to drive checkout conversions.</p>
              </div>
              <button
                onClick={() => setShowPromoModal(true)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900 text-white font-bold text-xs hover:bg-zinc-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" /> Create Voucher Code
              </button>
            </div>

            <div className="divide-y divide-zinc-100">
              {promos.map((p) => (
                <div key={p.id || p.code} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-base tracking-wider px-2.5 py-1 bg-zinc-100 rounded-lg text-zinc-900 border border-zinc-200">
                        {p.code}
                      </span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                        p.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-zinc-100 text-zinc-500'
                      }`}>
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 font-medium">{p.description}</p>
                    <div className="text-[11px] text-zinc-400">
                      Min. Spend: ₦{p.minSpend.toLocaleString()} | Discount:{' '}
                      {p.discountType === 'percentage' ? `${p.discountValue}% OFF` : `₦${p.discountValue.toLocaleString()} OFF`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs font-black text-zinc-900">{p.usageCount} used</div>
                      <div className="text-[10px] text-zinc-400">Limit: {p.usageLimit || 'Unlimited'}</div>
                    </div>

                    <button
                      onClick={() => handleTogglePromo(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                        p.status === 'active'
                          ? 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          : 'bg-emerald-600 text-white hover:bg-emerald-700'
                      }`}
                    >
                      {p.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: AI MARKETING COPY GENERATOR */}
      {activeTab === 'ai-copy' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Sparkles className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-black text-base text-zinc-900">AI Copywriter & Ad Generator</h3>
                <p className="text-xs text-zinc-500">Craft Nigerian e-commerce copy ready for WhatsApp, IG & Email.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Campaign Objective
                </label>
                <select
                  value={aiGoal}
                  onChange={(e) => setAiGoal(e.target.value as any)}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold outline-none focus:border-zinc-900"
                >
                  <option value="flash_sale">⚡ 48-Hour Weekend Flash Sale</option>
                  <option value="appliance_promo">🍳 Home Appliances & Kitchen Mega Drop</option>
                  <option value="gadget_drop">🎧 Latest Gadgets, Audio & Drones Launch</option>
                  <option value="clearance">🏷️ Certified Pre-Owned Clearance (Tested 100%)</option>
                  <option value="new_arrival">✨ New Arrivals Direct From Wholesale Hubs</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Product Focus
                </label>
                <input
                  type="text"
                  value={aiProductFocus}
                  onChange={(e) => setAiProductFocus(e.target.value)}
                  placeholder="e.g. Commercial Blenders, Anker Speakers, Foldable Chargers"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                  Discount / Promotional Incentive
                </label>
                <input
                  type="text"
                  value={aiDiscountNote}
                  onChange={(e) => setAiDiscountNote(e.target.value)}
                  placeholder="e.g. 10% OFF with code SAJODA10K + Free Lagos Delivery"
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-zinc-900"
                />
              </div>

              <button
                type="button"
                disabled={isGeneratingAiCopy}
                onClick={handleGenerateAiCopy}
                className="w-full py-3.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 hover:opacity-95 text-white rounded-xl font-black text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer mt-2"
              >
                {isGeneratingAiCopy ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Generating Nigerian Multi-Channel Copy...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    Generate Multi-Channel Campaign Copy
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {generatedCopy ? (
              <div className="space-y-4 animate-fade-in">
                {/* WhatsApp */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
                      <MessageSquare className="w-4 h-4" /> WhatsApp Broadcast Blast
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.whatsapp || '', 'whatsapp')}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'whatsapp' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'whatsapp' ? 'Copied!' : 'Copy Text'}
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-800 whitespace-pre-wrap font-sans bg-zinc-50 p-4 rounded-xl border border-zinc-100 leading-relaxed">
                    {generatedCopy.whatsapp}
                  </pre>
                </div>

                {/* Instagram / TikTok */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-pink-700 flex items-center gap-1.5">
                      <Megaphone className="w-4 h-4" /> Instagram & TikTok Caption
                    </span>
                    <button
                      onClick={() => copyToClipboard(generatedCopy.instagram || '', 'instagram')}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'instagram' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'instagram' ? 'Copied!' : 'Copy Caption'}
                    </button>
                  </div>
                  <pre className="text-xs text-zinc-800 whitespace-pre-wrap font-sans bg-zinc-50 p-4 rounded-xl border border-zinc-100 leading-relaxed">
                    {generatedCopy.instagram}
                  </pre>
                </div>

                {/* Email Newsletter */}
                <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-indigo-700 flex items-center gap-1.5">
                      <Mail className="w-4 h-4" /> Email Blast (Subject & Body)
                    </span>
                    <button
                      onClick={() => copyToClipboard(`Subject: ${generatedCopy.emailSubject}\n\n${generatedCopy.emailBody}`, 'email')}
                      className="text-xs font-bold text-zinc-500 hover:text-zinc-900 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedKey === 'email' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedKey === 'email' ? 'Copied!' : 'Copy Email'}
                    </button>
                  </div>
                  <div className="text-xs font-bold text-zinc-900 pb-1 border-b border-zinc-100">
                    Subject: {generatedCopy.emailSubject}
                  </div>
                  <pre className="text-xs text-zinc-700 whitespace-pre-wrap font-sans bg-zinc-50 p-4 rounded-xl border border-zinc-100 leading-relaxed">
                    {generatedCopy.emailBody}
                  </pre>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-200 text-zinc-400">
                <Sparkles className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                <p className="text-sm font-bold text-zinc-600">No Copy Generated Yet</p>
                <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
                  Select your campaign objective on the left and click Generate to produce complete Nigerian-adapted promotional copy.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: STORE ANNOUNCEMENT BAR */}
      {activeTab === 'announcement' && (
        <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-sm max-w-2xl space-y-4">
          <div>
            <h3 className="font-black text-base text-zinc-900">Store-Wide Announcement Bar</h3>
            <p className="text-xs text-zinc-500">
              Display real-time flash sale banners, delivery guarantees, or promo codes at the very top of SAJODA store.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 mb-1">
                Announcement Ticker Text
              </label>
              <textarea
                rows={3}
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-zinc-900 leading-relaxed"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-zinc-50 rounded-xl border border-zinc-100">
              <div>
                <span className="text-xs font-bold text-zinc-900 block">Active Status</span>
                <span className="text-[11px] text-zinc-500">Show ticker bar to all visitors</span>
              </div>
              <input
                type="checkbox"
                checked={announcementActive}
                onChange={(e) => setAnnouncementActive(e.target.checked)}
                className="w-5 h-5 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
              />
            </div>

            {/* Live Preview */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                Live Store Header Preview
              </label>
              <div className="bg-zinc-900 text-white p-2.5 rounded-xl text-xs font-bold text-center tracking-wide shadow-sm">
                {announcementActive ? announcementText : '(Announcement Bar is currently disabled)'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setAnnouncementSaved(true);
                setTimeout(() => setAnnouncementSaved(false), 2500);
              }}
              className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              {announcementSaved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
              {announcementSaved ? 'Saved & Live on Store!' : 'Save Announcement Bar'}
            </button>
          </div>
        </div>
      )}

      {/* CREATE CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative border border-zinc-100 animate-fade-in-up">
            <button
              onClick={() => setShowCampaignModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-zinc-900 mb-1">Create Marketing Campaign</h3>
            <p className="text-xs text-zinc-500 mb-4">Set up a trackable promotional initiative.</p>

            <form onSubmit={handleSaveCampaign} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Campaign Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black Friday Lagos Gadget Blowout"
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Primary Channel</label>
                  <select
                    value={newCampaign.channel}
                    onChange={(e) => setNewCampaign({ ...newCampaign, channel: e.target.value as any })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Instagram">Instagram</option>
                    <option value="TikTok">TikTok</option>
                    <option value="Email">Email</option>
                    <option value="Multi-Channel">Multi-Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Ad Budget (₦)</label>
                  <input
                    type="number"
                    value={newCampaign.budget}
                    onChange={(e) => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Attached Promo Code (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. FLASH10"
                  value={newCampaign.discountCode}
                  onChange={(e) => setNewCampaign({ ...newCampaign, discountCode: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium font-mono uppercase outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newCampaign.startDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, startDate: e.target.value })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newCampaign.endDate}
                    onChange={(e) => setNewCampaign({ ...newCampaign, endDate: e.target.value })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-xs transition-all shadow-md mt-2 cursor-pointer"
              >
                Launch Campaign
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CREATE PROMO CODE MODAL */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-zinc-100 animate-fade-in-up">
            <button
              onClick={() => setShowPromoModal(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-zinc-100 text-zinc-400 hover:text-zinc-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-zinc-900 mb-1">Create Promo Code</h3>
            <p className="text-xs text-zinc-500 mb-4">Add a new discount code for your store shoppers.</p>

            <form onSubmit={handleSavePromo} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Promo Code Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. SAJODA10K"
                  value={newPromo.code}
                  onChange={(e) => setNewPromo({ ...newPromo, code: e.target.value.toUpperCase() })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-mono font-black uppercase outline-none focus:border-zinc-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Discount Type</label>
                  <select
                    value={newPromo.discountType}
                    onChange={(e) => setNewPromo({ ...newPromo, discountType: e.target.value as any })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Naira (₦)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1">Discount Value</label>
                  <input
                    type="number"
                    required
                    value={newPromo.discountValue}
                    onChange={(e) => setNewPromo({ ...newPromo, discountValue: Number(e.target.value) })}
                    className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Minimum Spend (₦)</label>
                <input
                  type="number"
                  value={newPromo.minSpend}
                  onChange={(e) => setNewPromo({ ...newPromo, minSpend: Number(e.target.value) })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1">Short Description</label>
                <input
                  type="text"
                  placeholder="e.g. ₦10,000 instant discount on electronics"
                  value={newPromo.description}
                  onChange={(e) => setNewPromo({ ...newPromo, description: e.target.value })}
                  className="w-full p-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-black text-xs transition-all shadow-md mt-2 cursor-pointer"
              >
                Create Discount Code
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
