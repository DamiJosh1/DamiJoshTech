const fs = require('fs');
const path = require('path');

const supportPages = [
    'AdminSupportLayout',
    'AdminSupportDashboard',
    'AdminSupportInbox',
    'AdminSupportTickets',
    'AdminSupportTicketDetail',
    'AdminSupportCustomers',
    'AdminSupportCustomerDetail',
    'AdminSupportAi',
    'AdminSupportMacros',
    'AdminSupportAutomation',
    'AdminSupportAnalytics'
];

const financePages = [
    'AdminFinanceLayout',
    'AdminFinanceDashboard',
    'AdminFinanceRevenue',
    'AdminFinanceProfit',
    'AdminFinanceExpenses',
    'AdminFinanceCosts',
    'AdminFinanceRefunds',
    'AdminFinancePayouts',
    'AdminFinanceReports',
    'AdminFinanceAi'
];

supportPages.forEach(page => {
    fs.writeFileSync(`src/pages/admin/support/${page}.tsx`, `import React from 'react';

export default function ${page}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${page}</h1>
      <p>This is the ${page} view.</p>
    </div>
  );
}
`);
});

financePages.forEach(page => {
    fs.writeFileSync(`src/pages/admin/finance/${page}.tsx`, `import React from 'react';

export default function ${page}() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">${page}</h1>
      <p>This is the ${page} view.</p>
    </div>
  );
}
`);
});

