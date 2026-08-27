const fs = require('fs');

const files = [
  'src/pages/admin/security/AdminSecurityDashboard.tsx',
  'src/pages/admin/security/AdminSecurityLayout.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
    fs.writeFileSync(file, content);
  }
});

