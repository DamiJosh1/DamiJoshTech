const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

// Force Light Mode
code = code.replace(/useState\(true\);/g, (match, offset) => {
    // Only replace the first one which is isDarkMode (hopefully)
    return code.substring(offset - 25, offset).includes('isDarkMode') ? 'useState(false);' : match;
});

// Mobile Header
const mobileHeaderStart = code.indexOf('{/* Mobile Top Navbar */}');
const mobileDrawerStart = code.indexOf('{/* Mobile Drawer (Non-Logged In) */}');
const mobileBottomNavStart = code.indexOf('{/* Mobile Bottom Navigation (Logged In) */}');
const mainContentStart = code.indexOf('<main className="flex-1 flex flex-col w-full min-h-screen">');

const newMobileHeader = `      {/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
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
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col transform transition-transform">
             <div className="p-5 flex items-center justify-between border-b border-zinc-100">
               <Logo className="h-6" variant="full" />
               <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-charcoal hover:bg-light-bg rounded-full"><X className="w-6 h-6"/></button>
             </div>
             <div className="p-6 flex-1 overflow-y-auto flex flex-col gap-6">
                <nav className="flex flex-col gap-6 text-[15px] font-medium text-dark-text">
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/'); }} className="text-left hover:text-primary-blue">Home</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop'); }} className="text-left hover:text-primary-blue">Shop</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/categories'); }} className="text-left hover:text-primary-blue">Categories</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=new'); }} className="text-left hover:text-primary-blue">New Arrivals</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=best'); }} className="text-left hover:text-primary-blue">Best Sellers</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/shop?q=deals'); }} className="text-left text-error hover:text-primary-blue">Deals</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/orders'); }} className="text-left hover:text-primary-blue">Track Order</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/about'); }} className="text-left hover:text-primary-blue">About</button>
                  <button onClick={() => { setIsMobileMenuOpen(false); navigate('/contact'); }} className="text-left hover:text-primary-blue">Contact</button>
                  
                  <div className="h-px bg-zinc-100 my-2" />
                  
                  {user ? (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/profile'); }} className="text-left flex items-center gap-3">
                        <User className="w-5 h-5 text-zinc-400" /> My Account
                     </button>
                  ) : (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left flex items-center gap-3">
                        <User className="w-5 h-5 text-zinc-400" /> Login / Sign Up
                     </button>
                  )}
                </nav>
             </div>
          </div>
        </div>
      )}
`;

code = code.substring(0, mobileHeaderStart) + newMobileHeader + code.substring(mainContentStart);
fs.writeFileSync('src/Store.tsx', code);
