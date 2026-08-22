const fs = require('fs');

const storePath = '/app/applet/src/Store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

const targetStr = `      {/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
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
            <button onClick={() => user ? navigate('/account') : navigate('/login')} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative overflow-hidden flex items-center justify-center">
              {user ? (
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full">{cartCount}</span>}
            </button>
          </div>
        </div>
        <div className={\`px-4 transition-all duration-300 overflow-hidden \${scrollY > 50 ? 'h-0 opacity-0 pb-0' : 'h-[52px] pb-3 opacity-100'}\`}>
          <div className="w-full flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors mr-2">
               <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1" onClick={() => navigate('/search')}>
               <div className="w-full py-2.5 px-4 bg-zinc-100 rounded-full flex items-center gap-2 text-zinc-500">
                 <Search className="w-4 h-4" />
                 <span className="text-sm">Search gadgets, appliances...</span>
               </div>
            </div>
          </div>
        </div>
      </header>`;

const replaceStr = `      {/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
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
            <button onClick={() => user ? navigate('/account') : navigate('/login')} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative flex items-center justify-center">
              {user ? (
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-xs overflow-hidden shadow-sm">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                </div>
              ) : (
                <User className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </header>`;

if (content.includes(targetStr)) {
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(storePath, content);
  console.log("Updated Mobile Top Navbar");
} else {
  console.error("Target content not found in Store.tsx!");
}
