import re

with open('src/components/MobileBottomNav.tsx', 'r') as f:
    content = f.read()

# Replace the array
content = re.sub(
    r"const navItems = \[.*?\];",
    "const navItems = [\n    { id: 'home', icon: Home, label: 'Home', path: '/' },\n    { id: 'shop', icon: Grid, label: 'Shop', path: '/shop' },\n    { id: 'wishlist', icon: Heart, label: 'Wishlist', path: '/account/wishlist', badge: wishlistCount },\n    { id: 'cart', icon: ShoppingBag, label: 'Cart', path: '/cart', badge: cartCount },\n  ];",
    content,
    flags=re.DOTALL
)

with open('src/components/MobileBottomNav.tsx', 'w') as f:
    f.write(content)
print("Updated MobileBottomNav")
