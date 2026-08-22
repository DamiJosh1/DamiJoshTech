const fs = require('fs');

let profileCode = fs.readFileSync('src/pages/Profile.tsx', 'utf-8');

profileCode = profileCode.replace(
  /<button\s+onClick=\{.*?navigate\('\/'\).*?\}\s+className="w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors">/g,
  "<button onClick={() => navigate('/account/orders')} className=\"w-full flex items-center justify-between p-4 hover:bg-zinc-50 transition-colors\">"
);

fs.writeFileSync('src/pages/Profile.tsx', profileCode);
