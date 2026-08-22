const fs = require('fs');

const path = '/app/applet/src/components/MobileBottomNav.tsx';
let content = fs.readFileSync(path, 'utf8');

// Update imports
content = content.replace("import { Home, Search, Heart, ShoppingBag, Grid } from 'lucide-react';", "import { Home, Search, User, ShoppingBag, Grid } from 'lucide-react';");

// Update setActiveTab logic
content = content.replace("else if (path.startsWith('/account/wishlist') || path.startsWith('/account')) setActiveTab('wishlist');", "else if (path.startsWith('/account')) setActiveTab('account');");

// Update navItems array
content = content.replace("{ id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/account/wishlist' },", "{ id: 'account', icon: User, label: 'Profile', path: '/account' },");

fs.writeFileSync(path, content);
console.log("Updated MobileBottomNav successfully.");
