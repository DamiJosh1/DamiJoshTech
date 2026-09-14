const fs = require('fs');
let content = fs.readFileSync('src/pages/Categories.tsx', 'utf8');

// Add productsLoading to destructuring
content = content.replace(
  'const { products } = useStore();',
  'const { products, productsLoading } = useStore();'
);

// Replace the categories rendering with a loading check
content = content.replace(
  /<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\s*\{categories\.map\(\(cat, i\) => \{/s,
  `<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {productsLoading ? (
            [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="group relative h-48 sm:h-64 rounded-2xl overflow-hidden bg-zinc-200 animate-pulse">
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="h-6 w-32 bg-zinc-300 rounded-full mb-2" />
                  <div className="h-4 w-24 bg-zinc-300 rounded-full" />
                </div>
              </div>
            ))
          ) : categories.map((cat, i) => {`
);

// Add the closing brace for the ternary operator
content = content.replace(
  /\};\s*\}\)\}\s*<\/div>/,
  `};\n          })}\n        </div>`
);


fs.writeFileSync('src/pages/Categories.tsx', content);
console.log("Successfully patched Categories.tsx");
