const fs = require('fs');

let content = fs.readFileSync('src/Store.tsx', 'utf8');

const missingImports = `
import AdminAutomations from './pages/admin/automations/AdminAutomations';
import AdminAiSupport from './pages/admin/ai/AdminAiSupport';
import AdminAiBusiness from './pages/admin/ai/AdminAiBusiness';
import AdminSupportLayout from './pages/admin/support/AdminSupportLayout';
import AdminSupportDashboard from './pages/admin/support/AdminSupportDashboard';
import AdminSupportInbox from './pages/admin/support/AdminSupportInbox';
import AdminSupportTickets from './pages/admin/support/AdminSupportTickets';
import AdminSupportTicketDetail from './pages/admin/support/AdminSupportTicketDetail';
import AdminSupportCustomers from './pages/admin/support/AdminSupportCustomers';
import AdminSupportCustomerDetail from './pages/admin/support/AdminSupportCustomerDetail';
import AdminSupportAi from './pages/admin/support/AdminSupportAi';
import AdminSupportMacros from './pages/admin/support/AdminSupportMacros';
import AdminSupportAutomation from './pages/admin/support/AdminSupportAutomation';
import AdminSupportAnalytics from './pages/admin/support/AdminSupportAnalytics';
import AdminFinanceLayout from './pages/admin/finance/AdminFinanceLayout';
import AdminFinanceDashboard from './pages/admin/finance/AdminFinanceDashboard';
import AdminFinanceRevenue from './pages/admin/finance/AdminFinanceRevenue';
import AdminFinanceProfit from './pages/admin/finance/AdminFinanceProfit';
import AdminFinanceExpenses from './pages/admin/finance/AdminFinanceExpenses';
import AdminFinanceCosts from './pages/admin/finance/AdminFinanceCosts';
import AdminFinanceRefunds from './pages/admin/finance/AdminFinanceRefunds';
import AdminFinancePayouts from './pages/admin/finance/AdminFinancePayouts';
import AdminFinanceReports from './pages/admin/finance/AdminFinanceReports';
import AdminFinanceAi from './pages/admin/finance/AdminFinanceAi';
`;

content = content.replace("import AdminLogin from './pages/admin/AdminLogin';", 
"import AdminLogin from './pages/admin/AdminLogin';\\n" + missingImports);

fs.writeFileSync('src/Store.tsx', content);

// Fix AdminAiLayout
let aiLayout = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');
aiLayout = aiLayout.replace(/import \{ Bot, Settings,/g, "import { Bot, Settings, Cpu, ShieldCheck,");
fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', aiLayout);

