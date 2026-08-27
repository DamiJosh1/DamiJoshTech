import re

with open('src/Store.tsx', 'r') as f:
    content = f.read()

imports = """
import AdminCJDropshippingLayout from './pages/admin/cjdropshipping/AdminCJDropshippingLayout';
import AdminCJDropshippingDashboard from './pages/admin/cjdropshipping/AdminCJDropshippingDashboard';
import AdminCJProducts from './pages/admin/cjdropshipping/AdminCJProducts';
import AdminCJOrders from './pages/admin/cjdropshipping/AdminCJOrders';
import AdminCJSync from './pages/admin/cjdropshipping/AdminCJSync';
import AdminCJLogs from './pages/admin/cjdropshipping/AdminCJLogs';

import AdminAiLayout from './pages/admin/ai/AdminAiLayout';
import AdminAiDashboard from './pages/admin/ai/AdminAiDashboard';
import AdminAiTasks from './pages/admin/ai/AdminAiTasks';
import AdminAiProducts from './pages/admin/ai/AdminAiProducts';
import AdminAiTrends from './pages/admin/ai/AdminAiTrends';
import AdminAiMarkets from './pages/admin/ai/AdminAiMarkets';
import AdminAiApprovals from './pages/admin/ai/AdminAiApprovals';
import AdminAiActivity from './pages/admin/ai/AdminAiActivity';
import AdminAiSettings from './pages/admin/ai/AdminAiSettings';
"""

# add imports near the top
content = content.replace("import AdminComingSoon", imports + "\nimport AdminComingSoon")


routes = """
            <Route path="cjdropshipping" element={<AdminCJDropshippingLayout />}>
              <Route index element={<AdminCJDropshippingDashboard />} />
              <Route path="products" element={<AdminCJProducts />} />
              <Route path="orders" element={<AdminCJOrders />} />
              <Route path="sync" element={<AdminCJSync />} />
              <Route path="logs" element={<AdminCJLogs />} />
            </Route>

            <Route path="ai" element={<AdminAiLayout />}>
              <Route index element={<AdminAiDashboard />} />
              <Route path="tasks" element={<AdminAiTasks />} />
              <Route path="products" element={<AdminAiProducts />} />
              <Route path="trends" element={<AdminAiTrends />} />
              <Route path="markets" element={<AdminAiMarkets />} />
              <Route path="approvals" element={<AdminAiApprovals />} />
              <Route path="activity" element={<AdminAiActivity />} />
              <Route path="settings" element={<AdminAiSettings />} />
            </Route>
"""

# find <Route path="categories" element={<AdminCategories />} /> 
# and insert new routes after it
content = content.replace('<Route path="categories" element={<AdminCategories />} />', '<Route path="categories" element={<AdminCategories />} />\n' + routes)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx")
