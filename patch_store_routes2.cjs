const fs = require('fs');

let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');
storeCode = storeCode.replace(
  /import Wishlist from '\.\/pages\/Wishlist';/,
  "import Wishlist from './pages/Wishlist';\nimport Checkout from './pages/Checkout';\nimport OrderConfirmation from './pages/OrderConfirmation';\nimport TrackOrder from './pages/TrackOrder';\nimport AccountOrders from './pages/AccountOrders';\nimport OrderDetails from './pages/OrderDetails';"
);

storeCode = storeCode.replace(
  /<Route path="\/wishlist" element=\{<Wishlist \/>\} \/>/,
  "<Route path=\"/wishlist\" element={<Wishlist />} />\n          <Route path=\"/checkout\" element={<Checkout />} />\n          <Route path=\"/order-confirmation/:orderNumber\" element={<OrderConfirmation />} />\n          <Route path=\"/track-order\" element={<TrackOrder />} />\n          <Route path=\"/account/orders\" element={<AccountOrders />} />\n          <Route path=\"/account/orders/:orderId\" element={<OrderDetails />} />"
);

fs.writeFileSync('src/Store.tsx', storeCode);
