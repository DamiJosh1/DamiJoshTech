const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

// replace icons import
content = content.replace(
  /import { NavLink, Outlet } from 'react-router-dom';import { .* } from 'lucide-react';/,
  `import { NavLink, Outlet } from 'react-router-dom';
import { Bot, CheckSquare, Search, TrendingUp, Map, CheckCircle, Activity, Settings, DollarSign, BarChart2, Truck, Brain, Eye, FileText, PenTool, FileEdit, Send, ShoppingBag, Package, MapPin, AlertTriangle, MessageSquare } from 'lucide-react';`
);

// update tabs array
const tabsString = `
  const tabs = [
    { name: 'Dashboard', path: '/admin/ai', icon: <Bot className="w-4 h-4" />, end: true },
    
    // Discovery & Decisions (Phases 6-7)
    { name: 'Products', path: '/admin/ai/products', icon: <Search className="w-4 h-4" /> },
    { name: 'Pricing', path: '/admin/ai/pricing', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Profit', path: '/admin/ai/profit', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Suppliers', path: '/admin/ai/suppliers', icon: <Truck className="w-4 h-4" /> },
    { name: 'Decisions', path: '/admin/ai/decisions', icon: <Brain className="w-4 h-4" /> },
    { name: 'Trends', path: '/admin/ai/trends', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Markets', path: '/admin/ai/markets', icon: <Map className="w-4 h-4" /> },

    // Builder & Publishing (Phase 8)
    { name: 'Builder', path: '/admin/ai/builder', icon: <PenTool className="w-4 h-4" /> },
    { name: 'Content', path: '/admin/ai/content', icon: <FileText className="w-4 h-4" /> },
    { name: 'SEO', path: '/admin/ai/seo', icon: <Search className="w-4 h-4" /> },
    { name: 'Drafts', path: '/admin/ai/drafts', icon: <FileEdit className="w-4 h-4" /> },
    { name: 'Publishing', path: '/admin/ai/publishing', icon: <Send className="w-4 h-4" /> },

    // Operations (Phase 9)
    { name: 'Orders', path: '/admin/ai/orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { name: 'Fulfillment', path: '/admin/ai/fulfillment', icon: <Package className="w-4 h-4" /> },
    { name: 'Shipping', path: '/admin/ai/shipping', icon: <Truck className="w-4 h-4" /> },
    { name: 'Delivery', path: '/admin/ai/delivery', icon: <MapPin className="w-4 h-4" /> },
    { name: 'Issues', path: '/admin/ai/issues', icon: <AlertTriangle className="w-4 h-4" /> },
    { name: 'Customer Ops', path: '/admin/ai/customer-operations', icon: <MessageSquare className="w-4 h-4" /> },

    // Base capabilities
    { name: 'Watchlist', path: '/admin/ai/watchlist', icon: <Eye className="w-4 h-4" /> },
    { name: 'Approvals', path: '/admin/ai/approvals', icon: <CheckCircle className="w-4 h-4" /> },
    { name: 'Tasks', path: '/admin/ai/tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { name: 'Activity', path: '/admin/ai/activity', icon: <Activity className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/ai/settings', icon: <Settings className="w-4 h-4" /> },
  ];
`;

content = content.replace(/const tabs = \[.*?\];/s, tabsString);

fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);
