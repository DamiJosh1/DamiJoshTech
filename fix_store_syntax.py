import re

with open('src/Store.tsx', 'r') as f:
    content = f.read()

content = content.replace("""import AdminAiSettings

import AdminAiResearch from './pages/admin/ai/AdminAiResearch';
import AdminAiWatchlist from './pages/admin/ai/AdminAiWatchlist';
import AdminAiProductDetails from './pages/admin/ai/AdminAiProductDetails';
import AdminAiPricing from './pages/admin/ai/AdminAiPricing';
import AdminAiProfit from './pages/admin/ai/AdminAiProfit';
import AdminAiSuppliers from './pages/admin/ai/AdminAiSuppliers';
import AdminAiDecisions from './pages/admin/ai/AdminAiDecisions';
 from './pages/admin/ai/AdminAiSettings';""", """import AdminAiSettings from './pages/admin/ai/AdminAiSettings';

import AdminAiResearch from './pages/admin/ai/AdminAiResearch';
import AdminAiWatchlist from './pages/admin/ai/AdminAiWatchlist';
import AdminAiProductDetails from './pages/admin/ai/AdminAiProductDetails';
import AdminAiPricing from './pages/admin/ai/AdminAiPricing';
import AdminAiProfit from './pages/admin/ai/AdminAiProfit';
import AdminAiSuppliers from './pages/admin/ai/AdminAiSuppliers';
import AdminAiDecisions from './pages/admin/ai/AdminAiDecisions';""")

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx")
