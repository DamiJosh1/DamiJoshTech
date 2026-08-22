const fs = require('fs');
let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');

storeCode = storeCode.replace(
  /import Dropshipping from '\.\/pages\/Dropshipping';/,
  "import Dropshipping from './pages/Dropshipping';\nimport Cart from './pages/Cart';\nimport Wishlist from './pages/Wishlist';"
);

storeCode = storeCode.replace(
  /<Route path="\/product\/:id" element=\{<ProductDetail \/>\} \/>/,
  "<Route path=\"/product/:id\" element={<ProductDetail />} />\n          <Route path=\"/cart\" element={<Cart />} />\n          <Route path=\"/wishlist\" element={<Wishlist />} />"
);

// We need to update the bottom nav bar
storeCode = storeCode.replace(
  /<button onClick=\{handleOpenCart\} className="flex flex-col items-center gap-1 text-zinc-500 hover:text-primary-blue transition-colors relative">/g,
  "<button onClick={() => navigate('/cart')} className=\"flex flex-col items-center gap-1 text-zinc-500 hover:text-primary-blue transition-colors relative\">"
);

// Top nav cart
storeCode = storeCode.replace(
  /<button onClick=\{handleOpenCart\} className="hidden md:flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 transition-colors relative group">/g,
  "<button onClick={() => navigate('/cart')} className=\"hidden md:flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 transition-colors relative group\">"
);

fs.writeFileSync('src/Store.tsx', storeCode);
