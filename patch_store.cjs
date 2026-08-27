const fs = require('fs');

let content = fs.readFileSync('src/Store.tsx', 'utf8');

const supportImports = `
import AdminSupportLayout from './pages/admin/support/AdminSupportLayout.tsx';
import AdminSupportDashboard from './pages/admin/support/AdminSupportDashboard.tsx';
import AdminSupportInbox from './pages/admin/support/AdminSupportInbox.tsx';
import AdminSupportTickets from './pages/admin/support/AdminSupportTickets.tsx';
import AdminSupportTicketDetail from './pages/admin/support/AdminSupportTicketDetail.tsx';
import AdminSupportCustomers from './pages/admin/support/AdminSupportCustomers.tsx';
import AdminSupportCustomerDetail from './pages/admin/support/AdminSupportCustomerDetail.tsx';
import AdminSupportAi from './pages/admin/support/AdminSupportAi.tsx';
import AdminSupportMacros from './pages/admin/support/AdminSupportMacros.tsx';
import AdminSupportAutomation from './pages/admin/support/AdminSupportAutomation.tsx';
import AdminSupportAnalytics from './pages/admin/support/AdminSupportAnalytics.tsx';
`;

const financeImports = `
import AdminFinanceLayout from './pages/admin/finance/AdminFinanceLayout.tsx';
import AdminFinanceDashboard from './pages/admin/finance/AdminFinanceDashboard.tsx';
import AdminFinanceRevenue from './pages/admin/finance/AdminFinanceRevenue.tsx';
import AdminFinanceProfit from './pages/admin/finance/AdminFinanceProfit.tsx';
import AdminFinanceExpenses from './pages/admin/finance/AdminFinanceExpenses.tsx';
import AdminFinanceCosts from './pages/admin/finance/AdminFinanceCosts.tsx';
import AdminFinanceRefunds from './pages/admin/finance/AdminFinanceRefunds.tsx';
import AdminFinancePayouts from './pages/admin/finance/AdminFinancePayouts.tsx';
import AdminFinanceReports from './pages/admin/finance/AdminFinanceReports.tsx';
import AdminFinanceAi from './pages/admin/finance/AdminFinanceAi.tsx';
`;

const supportRoutes = `
            <Route path="support" element={<AdminSupportLayout />}>
              <Route index element={<AdminSupportDashboard />} />
              <Route path="inbox" element={<AdminSupportInbox />} />
              <Route path="tickets" element={<AdminSupportTickets />} />
              <Route path="tickets/:id" element={<AdminSupportTicketDetail />} />
              <Route path="customers" element={<AdminSupportCustomers />} />
              <Route path="customers/:id" element={<AdminSupportCustomerDetail />} />
              <Route path="ai" element={<AdminSupportAi />} />
              <Route path="macros" element={<AdminSupportMacros />} />
              <Route path="automation" element={<AdminSupportAutomation />} />
              <Route path="analytics" element={<AdminSupportAnalytics />} />
            </Route>
`;

const financeRoutes = `
            <Route path="finance" element={<AdminFinanceLayout />}>
              <Route index element={<AdminFinanceDashboard />} />
              <Route path="revenue" element={<AdminFinanceRevenue />} />
              <Route path="profit" element={<AdminFinanceProfit />} />
              <Route path="expenses" element={<AdminFinanceExpenses />} />
              <Route path="costs" element={<AdminFinanceCosts />} />
              <Route path="refunds" element={<AdminFinanceRefunds />} />
              <Route path="payouts" element={<AdminFinancePayouts />} />
              <Route path="reports" element={<AdminFinanceReports />} />
              <Route path="ai" element={<AdminFinanceAi />} />
            </Route>
`;

// Insert imports
content = content.replace("import AdminAiSettings from './pages/admin/ai/AdminAiSettings.tsx';", 
"import AdminAiSettings from './pages/admin/ai/AdminAiSettings.tsx';\\n" + supportImports + financeImports);

// Insert routes
content = content.replace('<Route path="system-health" element={<AdminSystemHealth />} />',
'<Route path="system-health" element={<AdminSystemHealth />} />\\n' + supportRoutes + financeRoutes);

fs.writeFileSync('src/Store.tsx', content);

