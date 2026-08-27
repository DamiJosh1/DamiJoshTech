const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

content = content.replace("import AdminLogin from './pages/admin/AdminLogin';\\n", "import AdminLogin from './pages/admin/AdminLogin';\n");

fs.writeFileSync('src/Store.tsx', content);

