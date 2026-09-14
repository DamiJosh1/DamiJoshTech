const fs = require('fs');
let content = fs.readFileSync('src/components/ProductCardSkeleton.tsx', 'utf8');

content = content.replace(
  'className="group bg-white rounded-3xl overflow-hidden border border-zinc-100 hover:shadow-xl transition-all duration-300 animate-pulse"',
  'className="group flex flex-col h-full bg-white rounded-2xl md:rounded-[32px] overflow-hidden border border-zinc-100 hover:border-zinc-200 transition-all duration-500 animate-pulse"'
);

content = content.replace(
  'className="relative aspect-[4/5] bg-zinc-200"',
  'className="relative aspect-[4/5] bg-zinc-100"'
);

fs.writeFileSync('src/components/ProductCardSkeleton.tsx', content);
console.log("Successfully patched ProductCardSkeleton.tsx");
