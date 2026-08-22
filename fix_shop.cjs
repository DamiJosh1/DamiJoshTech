const fs = require('fs');
let content = fs.readFileSync('src/pages/Shop.tsx', 'utf8');

if (!content.includes('import SearchPage')) {
  // Wait I already changed Shop to export SearchPage.
}
