export interface MonetizationConfig {
  enabled: boolean;
  googleAdSenseId: string; // e.g. "ca-pub-1234567890"
  googleAdSenseSlotHome: string;
  googleAdSenseSlotShop: string;
  showInFeedAds: boolean;
  inFeedFrequency: number; // e.g. every 6 products
  topBarAdEnabled: boolean;
  topBarAdText: string;
  topBarAdLink: string;
  topBarAdSponsor: string;
  customBannersEnabled: boolean;
  customBanners: {
    id: string;
    title: string;
    subtitle: string;
    imageUrl: string;
    linkUrl: string;
    sponsorName: string;
    badgeText: string;
    cpcRate: number; // e.g. in Naira ₦50 or ₦100 per click
  }[];
}

const DEFAULT_CONFIG: MonetizationConfig = {
  enabled: true,
  googleAdSenseId: '',
  googleAdSenseSlotHome: '',
  googleAdSenseSlotShop: '',
  showInFeedAds: true,
  inFeedFrequency: 6,
  topBarAdEnabled: true,
  topBarAdText: '⚡ Partner Deal: High-speed Starlink Kits & Solar Inverters Available in Lagos & Abuja — Inquire now',
  topBarAdLink: 'https://wa.me/2348000000000?text=Hello%20SAJODA%20I%20am%20inquiring%20about%20the%20Solar%20and%20Starlink%20Partner%20Deal',
  topBarAdSponsor: 'SolarTech Nigeria',
  customBannersEnabled: true,
  customBanners: [
    {
      id: 'banner-solar',
      title: 'Solar & Inverter Power Backup',
      subtitle: 'Never lose power during outages. 24/7 electricity for your home electronics & work setups.',
      imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&q=80&w=1200',
      linkUrl: 'https://wa.me/2348000000000?text=Hi%20SAJODA%20Solar%20Deal',
      sponsorName: 'PowerVolt Solars',
      badgeText: 'Sponsored Partner',
      cpcRate: 150,
    },
    {
      id: 'banner-starlink',
      title: 'Starlink Gen 3 Satellite Internet Kits',
      subtitle: 'Unlimited high-speed internet anywhere in Nigeria with 240+ Mbps speeds.',
      imageUrl: 'https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1200',
      linkUrl: 'https://wa.me/2348000000000?text=Hi%20SAJODA%20Starlink%20Internet',
      sponsorName: 'SatLink Direct',
      badgeText: 'Verified Partner',
      cpcRate: 200,
    }
  ]
};

const STORAGE_KEY = 'sajoda_monetization_config';
const STATS_KEY = 'sajoda_ad_stats';

export interface AdStats {
  totalClicks: number;
  totalImpressions: number;
  estimatedEarningsNgn: number;
  clickLog: {
    adId: string;
    sponsor: string;
    timestamp: string;
    earnings: number;
  }[];
}

export function getMonetizationConfig(): MonetizationConfig {
  if (typeof window === 'undefined') return DEFAULT_CONFIG;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_CONFIG;
    return { ...DEFAULT_CONFIG, ...JSON.parse(raw) };
  } catch (e) {
    return DEFAULT_CONFIG;
  }
}

export function saveMonetizationConfig(config: MonetizationConfig): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  window.dispatchEvent(new Event('sajoda_monetization_updated'));
}

export function getAdStats(): AdStats {
  if (typeof window === 'undefined') {
    return { totalClicks: 0, totalImpressions: 0, estimatedEarningsNgn: 0, clickLog: [] };
  }
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (!raw) {
      return { totalClicks: 0, totalImpressions: 0, estimatedEarningsNgn: 0, clickLog: [] };
    }
    return JSON.parse(raw);
  } catch (e) {
    return { totalClicks: 0, totalImpressions: 0, estimatedEarningsNgn: 0, clickLog: [] };
  }
}

export function recordAdClick(adId: string, sponsor: string, cpcRate: number = 100): void {
  if (typeof window === 'undefined') return;
  try {
    const stats = getAdStats();
    stats.totalClicks += 1;
    stats.estimatedEarningsNgn += cpcRate;
    stats.clickLog.unshift({
      adId,
      sponsor,
      timestamp: new Date().toISOString(),
      earnings: cpcRate,
    });
    // keep max 100 entries
    if (stats.clickLog.length > 100) stats.clickLog.pop();
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    window.dispatchEvent(new Event('sajoda_ad_stats_updated'));
  } catch (e) {
    console.error('Failed to log ad click', e);
  }
}

export function recordAdImpression(): void {
  if (typeof window === 'undefined') return;
  try {
    const stats = getAdStats();
    stats.totalImpressions += 1;
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    // ignore
  }
}
