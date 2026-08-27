const fs = require('fs');

let content = fs.readFileSync('src/Store.tsx', 'utf8');

const imports = `
import AdminAiTasks from './pages/admin/ai/AdminAiTasks.tsx';
import AdminAiApprovals from './pages/admin/ai/AdminAiApprovals.tsx';
import AdminAiProducts from './pages/admin/ai/AdminAiProducts.tsx';
import AdminAiTrends from './pages/admin/ai/AdminAiTrends.tsx';
import AdminAiMarkets from './pages/admin/ai/AdminAiMarkets.tsx';
import AdminAiMarketing from './pages/admin/ai/AdminAiMarketing.tsx';
import AdminAiSupport from './pages/admin/ai/AdminAiSupport.tsx';
import AdminAiBusiness from './pages/admin/ai/AdminAiBusiness.tsx';
import AdminAutomations from './pages/admin/automations/AdminAutomations.tsx';
`;

const aiRoutes = `
              <Route path="tasks" element={<AdminAiTasks />} />
              <Route path="approvals" element={<AdminAiApprovals />} />
              <Route path="products" element={<AdminAiProducts />} />
              <Route path="trends" element={<AdminAiTrends />} />
              <Route path="markets" element={<AdminAiMarkets />} />
              <Route path="marketing" element={<AdminAiMarketing />} />
              <Route path="support" element={<AdminAiSupport />} />
              <Route path="business" element={<AdminAiBusiness />} />
`;

content = content.replace("import AdminAiSettings from './pages/admin/ai/AdminAiSettings.tsx';", 
"import AdminAiSettings from './pages/admin/ai/AdminAiSettings.tsx';\\n" + imports);

content = content.replace('<Route path="ai" element={<AdminAiLayout />}>',
'<Route path="automations" element={<AdminAutomations />} />\\n            <Route path="ai" element={<AdminAiLayout />}>\\n' + aiRoutes);

fs.writeFileSync('src/Store.tsx', content);

