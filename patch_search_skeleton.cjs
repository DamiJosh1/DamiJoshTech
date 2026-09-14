const fs = require('fs');
let content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

// Add productsLoading to destructuring
content = content.replace(
  'const { products } = useStore();',
  'const { products, productsLoading } = useStore();'
);

// Add ProductCardSkeleton import
if (!content.includes('ProductCardSkeleton')) {
  content = content.replace(
    "import ProductCard from '../components/ProductCard';",
    "import ProductCard from '../components/ProductCard';\nimport ProductCardSkeleton from '../components/ProductCardSkeleton';"
  );
}

// Modify the loading state effect to include productsLoading
content = content.replace(
  '  useEffect(() => {\n    // Simulate loading for better UX\n    setLoading(true);\n    const timer = setTimeout(() => setLoading(false), 400);',
  '  useEffect(() => {\n    // Simulate loading for better UX\n    setLoading(true);\n    const timer = setTimeout(() => setLoading(false), 400);'
);
content = content.replace(
  'const [loading, setLoading] = useState(true);',
  'const [loading, setLoading] = useState(true);\n  const isSearching = loading || productsLoading;'
);


// Replace the loading display in JSX
content = content.replace(
  /\{\s*loading \? \(\s*<div className="flex flex-col items-center justify-center py-20 text-center">\s*<Loader2 className="w-8 h-8 text-primary-blue animate-spin mb-4" \/>\s*<p className="text-zinc-500 font-medium">Searching\.\.\.<\/p>\s*<\/div>\s*\) : filteredProducts\.length === 0 \? \(/s,
  `{isSearching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (`
);

fs.writeFileSync('src/pages/Search.tsx', content);
console.log("Successfully patched Search.tsx");
