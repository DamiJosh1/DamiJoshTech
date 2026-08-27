import re

with open('src/components/MobileBottomNav.tsx', 'r') as f:
    content = f.read()

# Replace the array to Home, Shop, Cart, Account
content = re.sub(
    r"const navItems = \[.*?\];",
    "const navItems = [\n    { id: 'home', icon: Home, label: 'Home', path: '/' },\n    { id: 'shop', icon: Grid, label: 'Shop', path: '/shop' },\n    { id: 'cart', icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },\n    { id: 'account', icon: User, label: 'Account', path: '/account' },\n  ];",
    content,
    flags=re.DOTALL
)

# ensure User is imported
if 'User' not in content:
    content = content.replace("import { Home, Search, Heart, ShoppingBag, Grid } from 'lucide-react';", "import { Home, Search, Heart, ShoppingBag, Grid, User } from 'lucide-react';")

with open('src/components/MobileBottomNav.tsx', 'w') as f:
    f.write(content)
print("Updated MobileBottomNav")
