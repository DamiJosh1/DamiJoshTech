const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

content = content.replace(/\\n/g, '\n');

fs.writeFileSync('src/Store.tsx', content);
