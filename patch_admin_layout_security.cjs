const fs = require('fs');

let content = fs.readFileSync('src/components/admin/AdminLayout.tsx', 'utf8');

const newNavItems = `  const navItems = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" />, end: true },
    { name: 'Orders', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'Products', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'Customers', path: '/admin/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'Support', path: '/admin/support', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Finance', path: '/admin/finance', icon: <Activity className="w-5 h-5" /> },
    { name: 'CJdropshipping', path: '/admin/cjdropshipping', icon: <Globe className="w-5 h-5" /> },
    { name: 'AI Worker', path: '/admin/ai', icon: <Bot className="w-5 h-5" /> },
    { name: 'Marketing', path: '/admin/marketing', icon: <Activity className="w-5 h-5" /> },
    { name: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { name: 'Security', path: '/admin/security', icon: <Shield className="w-5 h-5" /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
  ];`;

content = content.replace(/const navItems = \[[\s\S]*?\];/, newNavItems);

fs.writeFileSync('src/components/admin/AdminLayout.tsx', content);

