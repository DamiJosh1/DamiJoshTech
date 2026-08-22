const fs = require('fs');
let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');

storeCode = storeCode.replace(
  /onClick=\{.*?navigate\('\/profile'\).*?\>[\s\S]*?<Heart className="w-5 h-5/m,
  "onClick={() => navigate('/wishlist')} className=\"hidden md:flex items-center justify-center p-2 rounded-full hover:bg-zinc-100 transition-colors relative group\">\n                <Heart className=\"w-5 h-5"
);

storeCode = storeCode.replace(
  /onClick=\{.*?navigate\('\/profile'\).*?\>[\s\S]*?<Heart className="w-6 h-6/m,
  "onClick={() => navigate('/wishlist')} className=\"flex flex-col items-center gap-1 text-zinc-500 hover:text-primary-blue transition-colors relative\">\n            <Heart className=\"w-6 h-6"
);

fs.writeFileSync('src/Store.tsx', storeCode);
