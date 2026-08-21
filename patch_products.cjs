const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

const productsStart = code.indexOf('{/* Featured Products */}');
const quickViewStart = code.indexOf('{/* Quick View Modal */}');

const newProducts = `{/* Featured Products */}
      <section className="relative w-full bg-white pt-16 lg:pt-24 pb-20 lg:pb-32">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col items-start text-left max-w-2xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-dark-text">
                Featured Products
              </h2>
            </div>
            <button onClick={() => navigate('/shop')} className="hidden md:flex items-center gap-2 text-sm font-bold transition-colors hover:text-primary-blue text-charcoal">
              View All Products
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex overflow-x-auto pb-4 mb-8 -mx-4 px-4 sm:mx-0 sm:px-0 gap-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {['All', 'Audio', 'Smart Devices', 'Mobile', 'Gaming', 'Power', 'Accessories'].map(cat => (
              <button
                key={cat}
                onClick={() => setActiveFeaturedCategory(cat)}
                className={\`px-5 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 \${
                  activeFeaturedCategory === cat
                    ? 'bg-primary-blue text-white'
                    : 'bg-light-bg text-charcoal hover:bg-zinc-200'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-lg font-medium mb-6 text-body-text">
                Featured products are coming soon.
              </p>
              <button onClick={() => navigate('/shop')} className="px-8 py-4 bg-primary-blue hover:bg-secondary-blue text-white rounded-lg font-bold transition-colors">
                Explore All Products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 gap-y-10">
              {(activeFeaturedCategory === 'All' ? products : products.filter(p => p.category?.toLowerCase().includes(activeFeaturedCategory.toLowerCase()))).slice(0, 8).map((product, i) => (
                <div 
                  key={product.id} 
                  className="group flex flex-col"
                >
                  <div 
                    className="relative aspect-square w-full rounded-xl overflow-hidden mb-4 bg-light-bg cursor-pointer"
                    onClick={() => navigate(\`/product/\${product.id}\`)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-center object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    
                    {/* Add to Cart Overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-4 group-hover:translate-y-0">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFeaturedAddToCart(product, e); }}
                        disabled={addingToCartId === product.id}
                        className={\`w-full py-3 rounded-lg text-sm font-bold transition-colors shadow-md \${
                          addingToCartId === product.id
                            ? 'bg-emerald-500 text-white'
                            : 'bg-white hover:bg-light-bg text-primary-blue'
                        }\`}
                      >
                        {addingToCartId === product.id ? 'Added' : 'Add to Cart'}
                      </button>
                    </div>

                    {/* Wishlist Button */}
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleWishlistToggle(product, e); }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-md text-charcoal hover:text-error transition-colors"
                    >
                      <Heart className={\`w-4 h-4 \${wishlistIds.includes(product.id) ? 'fill-error text-error' : ''}\`} />
                    </button>
                  </div>

                  <div className="flex flex-col flex-1">
                    <span className="text-xs tracking-wider text-body-text uppercase mb-1">{product.category}</span>
                    <h3 className="text-sm font-semibold text-dark-text mb-2 line-clamp-2 cursor-pointer hover:text-primary-blue transition-colors" onClick={() => navigate(\`/product/\${product.id}\`)}>
                      {product.name}
                    </h3>
                    <div className="mt-auto flex items-center">
                      <span className="text-sm font-bold text-dark-text">
                        ₦{(product.price).toLocaleString()}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-body-text line-through ml-2">
                          ₦{(product.originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile View All */}
          <button onClick={() => navigate('/shop')} className="mt-10 md:hidden w-full flex items-center justify-center gap-2 py-4 text-sm font-bold transition-colors border border-border rounded-lg text-charcoal">
            Explore All Products
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      `;

if (productsStart !== -1 && quickViewStart !== -1) {
  code = code.substring(0, productsStart) + newProducts + code.substring(quickViewStart);
  fs.writeFileSync('src/pages/Home.tsx', code);
} else {
  console.log("Could not find boundaries", {productsStart, quickViewStart});
}
