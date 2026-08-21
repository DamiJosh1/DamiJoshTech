const fs = require('fs');

// Read the corrupted file
let raw = fs.readFileSync('src/Store.tsx', 'utf-8');

// Find the start of the original file (line 311 starts with "import Preloader")
const originalStart = raw.indexOf("import Preloader from './Preloader';");
if (originalStart === -1) {
  console.log("Could not find original start");
  process.exit(1);
}

// Get the original content (it also has the new mobile header from patch2, but let's just use it)
let code = raw.substring(originalStart);

// We want to replace the Desktop Header in this recovered code.
const desktopHeaderStart = code.indexOf('{/* Desktop Header */}');
// The original mobile header is gone because patch2 replaced it, 
// so the next thing after Desktop Header is {/* Mobile Top Navbar */}
const desktopHeaderEnd = code.indexOf('{/* Mobile Top Navbar */}'); 

const newDesktopHeader = `      {/* Desktop Header */}
      <header className="hidden lg:block sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200 transition-all">
        <div className="max-w-[1440px] mx-auto px-8 h-[80px] flex items-center justify-between gap-6">
          <button onClick={() => navigate('/')} className="z-10 hover:opacity-80 transition-opacity">
            <Logo className="h-8" variant="full" />
          </button>

          <nav className="flex items-center gap-8 text-[15px] font-medium z-10">
            <button onClick={() => navigate('/shop')} className="transition-colors text-charcoal hover:text-primary-blue">Shop</button>
            <button onClick={() => navigate('/categories')} className="transition-colors text-charcoal hover:text-primary-blue">Categories</button>
            <button onClick={() => navigate('/shop?q=new')} className="transition-colors text-charcoal hover:text-primary-blue">New Arrivals</button>
            <button onClick={() => navigate('/shop?q=best')} className="transition-colors text-charcoal hover:text-primary-blue">Best Sellers</button>
            <button onClick={() => navigate('/shop?q=deals')} className="transition-colors text-charcoal hover:text-primary-blue text-error">Deals</button>
          </nav>

          <div className="flex flex-1 max-w-sm items-center rounded-full px-4 py-2 bg-light-bg border border-zinc-200 transition-colors focus-within:border-primary-blue">
            <Search className="w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} className="bg-transparent border-none outline-none w-full ml-3 text-sm text-dark-text placeholder:text-zinc-400" />
          </div>

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

if (desktopHeaderStart !== -1 && desktopHeaderEnd !== -1) {
  code = code.substring(0, desktopHeaderStart) + newDesktopHeader + code.substring(desktopHeaderEnd);
}

// Remove the `isDarkMode` checks from the root div
// from: <div className={\`min-h-screen font-sans flex flex-col transition-colors duration-300 \${isDarkMode ? 'bg-zinc-900 text-zinc-50' : 'bg-[#f4f6fc] text-slate-800'} \${user ? 'pb-16 lg:pb-0' : ''}\`}>
// to: <div className={\`min-h-screen font-sans flex flex-col text-dark-text bg-light-bg \${user ? 'pb-16 lg:pb-0' : ''}\`}>
code = code.replace(/<div className=\{\`min-h-screen font-sans flex flex-col transition-colors duration-300 \$\{isDarkMode \? 'bg-zinc-900 text-zinc-50' : 'bg-\[#f4f6fc\] text-slate-800'\} \$\{user \? 'pb-16 lg:pb-0' : ''\}\`\}>/, 
  "<div className={`min-h-screen font-sans flex flex-col text-dark-text bg-light-bg ${user ? 'pb-16 lg:pb-0' : ''}`}>");

fs.writeFileSync('src/Store.tsx', code);
console.log("Rebuilt Store.tsx successfully.");
