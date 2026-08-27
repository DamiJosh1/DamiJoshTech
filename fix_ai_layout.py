import re

with open('src/pages/admin/ai/AdminAiLayout.tsx', 'r') as f:
    content = f.read()

new_imports = "import { Bot, CheckSquare, Search, TrendingUp, Map, CheckCircle, Activity, Settings, DollarSign, BarChart2, Truck, Brain, Eye, FileText } from 'lucide-react';"
content = content.replace("import { Bot, CheckSquare, Search, TrendingUp, Map, CheckCircle, Activity, Settings } from 'lucide-react';", new_imports)

tabs_code = """  const tabs = [
    { name: 'Dashboard', path: '/admin/ai', icon: <Bot className="w-4 h-4" />, end: true },
    { name: 'Products', path: '/admin/ai/products', icon: <Search className="w-4 h-4" /> },
    { name: 'Pricing', path: '/admin/ai/pricing', icon: <DollarSign className="w-4 h-4" /> },
    { name: 'Profit', path: '/admin/ai/profit', icon: <BarChart2 className="w-4 h-4" /> },
    { name: 'Suppliers', path: '/admin/ai/suppliers', icon: <Truck className="w-4 h-4" /> },
    { name: 'Decisions', path: '/admin/ai/decisions', icon: <Brain className="w-4 h-4" /> },
    { name: 'Trends', path: '/admin/ai/trends', icon: <TrendingUp className="w-4 h-4" /> },
    { name: 'Markets', path: '/admin/ai/markets', icon: <Map className="w-4 h-4" /> },
    { name: 'Watchlist', path: '/admin/ai/watchlist', icon: <Eye className="w-4 h-4" /> },
    { name: 'Research', path: '/admin/ai/research', icon: <FileText className="w-4 h-4" /> },
    { name: 'Approvals', path: '/admin/ai/approvals', icon: <CheckCircle className="w-4 h-4" /> },
    { name: 'Tasks', path: '/admin/ai/tasks', icon: <CheckSquare className="w-4 h-4" /> },
    { name: 'Activity', path: '/admin/ai/activity', icon: <Activity className="w-4 h-4" /> },
    { name: 'Settings', path: '/admin/ai/settings', icon: <Settings className="w-4 h-4" /> },
  ];"""

content = re.sub(r'const tabs = \[.*?\];', tabs_code, content, flags=re.DOTALL)

with open('src/pages/admin/ai/AdminAiLayout.tsx', 'w') as f:
    f.write(content)
print("Updated AdminAiLayout.tsx")
