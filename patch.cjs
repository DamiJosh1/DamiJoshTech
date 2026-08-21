const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

// 1. Desktop Header
const desktopHeaderStart = code.indexOf('{/* Desktop Header */}');
const desktopHeaderEnd = code.indexOf('{/* Mobile Header */}');
const newDesktopHeader = `      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-[1440px] mx-auto px-8 h-[80px] flex items-center justify-between gap-6">
          {/* Logo */}
          <button onClick={() => navigate('/')} className="z-10 hover:opacity-80 transition-opacity">
            <Logo className="h-8" variant="full" />
          </button>

          {/* Links */}
          <nav className="flex items-center gap-8 text-[15px] font-medium z-10">
            <button onClick={() => navigate('/shop')} className="transition-colors text-charcoal hover:text-primary-blue">Shop</button>
            <button onClick={() => navigate('/categories')} className="transition-colors text-charcoal hover:text-primary-blue">Categories</button>
            <button onClick={() => navigate('/shop?q=new')} className="transition-colors text-charcoal hover:text-primary-blue">New Arrivals</button>
            <button onClick={() => navigate('/shop?q=best')} className="transition-colors text-charcoal hover:text-primary-blue">Best Sellers</button>
            <button onClick={() => navigate('/shop?q=deals')} className="transition-colors text-charcoal hover:text-primary-blue text-error">Deals</button>
          </nav>

          {/* Search */}
          <div className="flex flex-1 max-w-sm items-center rounded-full px-4 py-2 bg-light-bg border border-zinc-200 transition-colors focus-within:border-primary-blue">
            <Search className="w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} className="bg-transparent border-none outline-none w-full ml-3 text-sm text-dark-text placeholder:text-zinc-400" />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-4 z-10">
             <button onClick={() => navigate('/profile')} className="p-2 transition-colors hover:text-primary-blue text-charcoal">
                <Heart className="w-5 h-5" />
             </button>
             <button onClick={() => setIsCartOpen(true)} className="p-2 relative transition-colors hover:text-primary-blue text-charcoal">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 bg-primary-blue text-white text-[10px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
             </button>
             {user ? (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 hover:border-primary-blue transition-colors bg-light-bg flex items-center justify-center">
                   {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : <User className="w-4 h-4 text-zinc-500" />}
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white border border-zinc-100">
                      <div className="px-5 py-3 border-b border-zinc-100 mb-2">
                        <p className="text-sm font-semibold truncate text-dark-text">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">My Account</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">Orders</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/profile'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">Wishlist</button>
                      {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-primary-blue font-medium">Admin Dashboard</button>}
                      <div className="h-px my-1 bg-zinc-100" />
                      <button onClick={handleLogout} className="w-full text-left px-5 py-2.5 text-sm text-error hover:bg-red-50 transition-colors">Logout</button>
                   </div>
                 )}
               </div>
             ) : (
               <button onClick={handleLogin} className="flex items-center gap-2 p-2 hover:text-primary-blue transition-colors text-charcoal">
                 <User className="w-5 h-5" />
                 <span className="text-sm font-medium">Account</span>
               </button>
             )}
          </div>
        </div>
      </header>
`;

code = code.substring(0, desktopHeaderStart) + newDesktopHeader + code.substring(desktopHeaderEnd);
fs.writeFileSync('src/Store.tsx', code);
