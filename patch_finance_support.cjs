const fs = require('fs');

const files = [
  'src/pages/admin/finance/AdminFinanceDashboard.tsx',
  'src/pages/admin/finance/AdminFinanceLayout.tsx',
  'src/pages/admin/support/AdminSupportLayout.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
  }
});

