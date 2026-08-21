const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

if (!code.includes('import MobileBottomNav')) {
  code = code.replace(
    "import AdminDashboard from './pages/AdminDashboard';",
    "import AdminDashboard from './pages/AdminDashboard';\nimport MobileBottomNav from './components/MobileBottomNav';"
  );
}

// Add MobileBottomNav before closing provider
if (!code.includes('<MobileBottomNav cartCount={cartCount} />')) {
  code = code.replace(
    "    </StoreContext.Provider>",
    "      <MobileBottomNav cartCount={cartCount} />\n    </StoreContext.Provider>"
  );
}

// Ensure event listener for open-cart in Store.tsx inside useEffect
if (!code.includes("window.addEventListener('open-cart'")) {
  code = code.replace(
    "window.addEventListener('mousemove', handleMouseMove, { passive: true });",
    "window.addEventListener('mousemove', handleMouseMove, { passive: true });\n    const handleOpenCart = () => setIsCartOpen(true);\n    window.addEventListener('open-cart', handleOpenCart);"
  );
  code = code.replace(
    "window.removeEventListener('mousemove', handleMouseMove);",
    "window.removeEventListener('mousemove', handleMouseMove);\n      window.removeEventListener('open-cart', handleOpenCart);"
  );
}

// Update the mobile top header to better match prompt:
// Top row: SAJODA logo, Wishlist, Cart
// Below or integrated into the header: Large search bar.
const oldMobileHeader = `<header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-charcoal hover:bg-light-bg rounded-full">
             <Menu className="w-6 h-6" />
          </button>
          
          <button onClick={() => navigate('/')} className="absolute left-1/2 -translate-x-1/2">
            <Logo className="h-6" variant="full" />
          </button>
          
          <div className="flex items-center gap-1 -mr-2">
            <button className="p-2 text-charcoal hover:bg-light-bg rounded-full">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative text-charcoal hover:bg-light-bg rounded-full">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
      </header>`;

const newMobileHeader = `<header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="z-10">
            <Logo className="h-5" variant="full" />
          </button>
          
          <div className="flex items-center gap-1 -mr-2">
            <button onClick={() => navigate('/profile')} className="p-2 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className="px-4 pb-3">
          <div className="flex items-center rounded-full px-4 py-2 bg-zinc-100 border border-transparent transition-colors focus-within:bg-white focus-within:border-primary-blue focus-within:shadow-sm">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search premium electronics..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleSearch} 
              className="bg-transparent border-none outline-none w-full ml-2 text-sm text-dark-text placeholder:text-zinc-500" 
            />
          </div>
        </div>
      </header>`;

if (code.includes('className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200"')) {
  // Regex replacement for the mobile header
  const regex = /<header className="lg:hidden sticky top-0 w-full z-40 bg-white\/95 backdrop-blur-md border-b border-zinc-200">[\s\S]*?<\/header>/;
  code = code.replace(regex, newMobileHeader);
}

fs.writeFileSync('src/Store.tsx', code);
console.log('Store patched');
