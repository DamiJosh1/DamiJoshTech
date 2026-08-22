const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

// Add imports
const importsToAdd = `
import AccountLayout from './components/AccountLayout';
import AccountDashboard from './pages/AccountDashboard';
import AccountProfile from './pages/AccountProfile';
import AccountAddresses from './pages/AccountAddresses';
import AccountSecurity from './pages/AccountSecurity';
import AccountNotifications from './pages/AccountNotifications';
import AccountWishlist from './pages/AccountWishlist';
`;
code = code.replace(/import AdminDashboard from '\.\/pages\/AdminDashboard';/, "import AdminDashboard from './pages/AdminDashboard';\n" + importsToAdd);

// Replace routes
const oldRoutesRegex = /<Route path="\/account\/orders" element={<AccountOrders \/>} \/>\s*<Route path="\/account\/orders\/:orderId" element={<OrderDetails \/>} \/>/;
const newRoutes = `
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountDashboard />} />
            <Route path="orders" element={<AccountOrders />} />
            <Route path="orders/:orderId" element={<OrderDetails />} />
            <Route path="wishlist" element={<AccountWishlist />} />
            <Route path="addresses" element={<AccountAddresses />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="security" element={<AccountSecurity />} />
            <Route path="notifications" element={<AccountNotifications />} />
          </Route>
`;
code = code.replace(oldRoutesRegex, newRoutes);

// Remove the old <Route path="/profile" element={<Profile />} /> to avoid conflicts
code = code.replace(/<Route path="\/profile" element={<Profile \/>} \/>/, '');

fs.writeFileSync('src/Store.tsx', code);
