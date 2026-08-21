const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

code = code.replace(
  /\className=\{\`min-h-screen font-sans flex flex-col text-dark-text bg-light-bg \$\{user \? 'pb-16 lg:pb-0' : ''\}\`\}/,
  'className="min-h-screen font-sans flex flex-col text-dark-text bg-light-bg pb-20 lg:pb-0"'
);

fs.writeFileSync('src/Store.tsx', code);
