const fs = require('fs');

let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');

storeCode = storeCode.replace(
  /<button[\s\S]*?onClick=\{.*?setCheckoutStep\('details'\).*?\}[\s\S]*?>[\s\S]*?Checkout Securely[\s\S]*?<\/button>/g,
  "<button onClick={() => { setIsCartOpen(false); navigate('/checkout'); }} className=\"w-full py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg shadow-zinc-900/20 active:scale-[0.98]\">\n                    Checkout Securely <ArrowRight className=\"w-5 h-5\" />\n                  </button>"
);

fs.writeFileSync('src/Store.tsx', storeCode);
