const fs = require('fs');

let cartCode = fs.readFileSync('src/pages/Cart.tsx', 'utf-8');

cartCode = cartCode.replace(
  /<button className="w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-zinc-900\/10 transition-all active:scale-\[0\.98\]">[\s\S]*?<\/button>/,
  "<button onClick={() => navigate('/checkout')} className=\"w-full py-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-xl shadow-zinc-900/10 transition-all active:scale-[0.98]\">\n                Checkout Securely <ArrowRight className=\"w-5 h-5\" />\n              </button>"
);

fs.writeFileSync('src/pages/Cart.tsx', cartCode);
