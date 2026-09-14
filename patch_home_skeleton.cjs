const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Add productsLoading to destructuring
content = content.replace(
  'const { products, handleFeaturedAddToCart, addingToCartId, wishlistIds, handleWishlistToggle } = useStore();',
  'const { products, productsLoading, handleFeaturedAddToCart, addingToCartId, wishlistIds, handleWishlistToggle } = useStore();'
);

// Add ProductCardSkeleton import
if (!content.includes('ProductCardSkeleton')) {
  content = content.replace(
    "import ProductCard from '../components/ProductCard';",
    "import ProductCard from '../components/ProductCard';\nimport ProductCardSkeleton from '../components/ProductCardSkeleton';"
  );
}

// Fix featured products section (around line 114)
content = content.replace(
  /\{\s*products\.length === 0 \? \(\s*<div className="py-12 text-center text-zinc-500">Loading products\.\.\.<\/div>\s*\) : \(\s*<div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">\s*\{products\.slice\(0, 6\)\.map\(product => \(\s*<div key=\{product\.id\}><ProductCard product=\{product\} \/><\/div>\s*\)\)\}\s*<\/div>\s*\)\}/s,
  `{productsLoading ? (
            <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center">
                  <ProductCardSkeleton />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-12 text-center text-zinc-500">No products available at this time.</div>
          ) : (
            <div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
              {products.slice(0, 6).map(product => (
                <div key={product.id} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center">
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}`
);

// Fix next-gen gadgets section (around line 161)
content = content.replace(
  /\{\s*products\.length > 0 && \(\s*<div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">\s*\{products\.filter.*?\}\s*<\/div>\s*\)\s*\}/s,
  `{productsLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i}><ProductCardSkeleton /></div>
            ))}
          </div>
        ) : products.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.filter(p => !p.category || p.category.includes('Gadget') || p.category.includes('Audio')).slice(0, 4).map(product => (
              <div key={product.id}><ProductCard product={product} /></div>
            ))}
          </div>
        )}`
);

// Fix deals section (around line 183)
content = content.replace(
  /<\div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">\s*\{products\.filter.*?\}\s*\{products\.filter.*?\}\s*<\/div>/s,
  `<div className="flex overflow-x-auto gap-6 pb-8 -mx-6 px-6 sm:mx-0 sm:px-0 snap-x snap-mandatory scrollbar-hide">
             {productsLoading ? (
               [1, 2, 3, 4].map(i => (
                 <div key={i} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center">
                   <ProductCardSkeleton />
                 </div>
               ))
             ) : (
               <>
                 {products.filter(p => p.originalPrice && p.originalPrice > p.price).slice(0, 4).map(product => (
                    <div key={product.id} className="min-w-[280px] w-[280px] md:min-w-[320px] md:w-[320px] snap-center">
                      <ProductCard product={product} />
                    </div>
                 ))}
                 {products.filter(p => p.originalPrice && p.originalPrice > p.price).length === 0 && (
                   <p className="text-zinc-500 w-full text-center">No active deals right now. Check back later!</p>
                 )}
               </>
             )}
          </div>`
);

fs.writeFileSync('src/pages/Home.tsx', content);
console.log("Successfully patched Home.tsx");
