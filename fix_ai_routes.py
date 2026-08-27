import re

with open('src/Store.tsx', 'r') as f:
    content = f.read()

imports = """
import AdminAiResearch from './pages/admin/ai/AdminAiResearch';
import AdminAiWatchlist from './pages/admin/ai/AdminAiWatchlist';
import AdminAiProductDetails from './pages/admin/ai/AdminAiProductDetails';
import AdminAiPricing from './pages/admin/ai/AdminAiPricing';
import AdminAiProfit from './pages/admin/ai/AdminAiProfit';
import AdminAiSuppliers from './pages/admin/ai/AdminAiSuppliers';
import AdminAiDecisions from './pages/admin/ai/AdminAiDecisions';
"""

content = content.replace("import AdminAiSettings", "import AdminAiSettings\n" + imports)

routes_to_add = """
              <Route path="products/:id" element={<AdminAiProductDetails />} />
              <Route path="research" element={<AdminAiResearch />} />
              <Route path="watchlist" element={<AdminAiWatchlist />} />
              <Route path="pricing" element={<AdminAiPricing />} />
              <Route path="profit" element={<AdminAiProfit />} />
              <Route path="suppliers" element={<AdminAiSuppliers />} />
              <Route path="decisions" element={<AdminAiDecisions />} />
"""

content = content.replace('<Route path="products" element={<AdminAiProducts />} />', '<Route path="products" element={<AdminAiProducts />} />\n' + routes_to_add)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx")
