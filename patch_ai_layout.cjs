const fs = require('fs');

let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

const newTabs = `  const tabs = [
    { name: 'Command Center', path: '/admin/ai', icon: <Bot className="w-4 h-4" />, end: true },
    { name: 'Tasks', path: '/admin/ai/tasks', icon: <Activity className="w-4 h-4" /> },
    { name: 'Approvals', path: '/admin/ai/approvals', icon: <ShieldCheck className="w-4 h-4" /> },
    { name: 'Products', path: '/admin/ai/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Trends', path: '/admin/ai/trends', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Markets', path: '/admin/ai/markets', icon: <Globe className="w-4 h-4" /> },
    { name: 'Marketing', path: '/admin/ai/marketing', icon: <Zap className="w-4 h-4" /> },
    { name: 'Support', path: '/admin/ai/support', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Business', path: '/admin/ai/business', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Workers', path: '/admin/ai/workers', icon: <Cpu className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/ai/settings', icon: <Settings className="w-4 h-4" /> },
  ];`;

content = content.replace(/const tabs = \[[\s\S]*?\];/, newTabs);
content = content.replace(/import \{ .* \} from 'lucide-react';/, "import { Bot, Settings, Cpu, Activity, ShieldCheck, Package, TrendingUp, Globe, Zap, MessageSquare, BarChart3, Search } from 'lucide-react';");

fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);

