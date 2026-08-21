const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

// I'll grab the whole header and fix it.
const regex = /<header className="lg:hidden sticky top-0 w-full z-40 bg-white\/95 backdrop-blur-md border-b border-zinc-200">[\s\S]*?<\/header>/;

const fixedHeader = `<header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 z-10">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/')}>
              <Logo className="h-5" variant="full" />
            </button>
          </div>
          
          <div className="flex items-center gap-1 -mr-2 z-10">
            <button onClick={() => navigate('/profile')} className="p-2 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className={\`px-4 transition-all duration-300 overflow-hidden \${scrollY > 50 ? 'h-0 opacity-0 pb-0' : 'h-[52px] pb-3 opacity-100'}\`}>
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

code = code.replace(regex, fixedHeader);
fs.writeFileSync('src/Store.tsx', code);
console.log('Fixed Header syntax');
