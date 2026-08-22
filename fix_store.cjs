const fs = require('fs');
const storePath = '/app/applet/src/Store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

const brokenRegex = /\{user \? \([\s\S]*?<div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">[\s\S]*?<User className="w-5 h-5" \/>[\s\S]*?<\/div>[\s\S]*?<span className="font-bold text-sm">Login \/ Sign Up<\/span>[\s\S]*?<\/button>[\s\S]*?}\)[\s\S]*?<\/nav>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?<\/div>[\s\S]*?}\)/;

const fixedContent = `{user ? (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-colors flex items-center justify-center font-bold text-sm bg-zinc-900 text-white cursor-pointer shadow-sm">
                   {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white border border-zinc-100 animate-fade-in-up origin-top-right">
                      <div className="px-5 py-3 border-b border-zinc-100 mb-1">
                        <p className="text-sm font-bold text-zinc-900 truncate">{user.displayName || 'Customer'}</p>
                        <p className="text-xs text-zinc-500 truncate">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Account</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/orders'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">My Orders</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/wishlist'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Wishlist</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/addresses'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Addresses</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account/security'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-zinc-700">Settings</button>
                      {user.email === 'damijosh12@gmail.com' && <button onClick={() => { setIsProfileMenuOpen(false); navigate('/admin'); }} className="w-full text-left px-5 py-2 text-sm transition-colors hover:bg-zinc-50 text-primary-blue font-medium">Admin Dashboard</button>}
                      <div className="h-px my-1 bg-zinc-100" />
                      <button onClick={() => { setIsProfileMenuOpen(false); handleLogout(); }} className="w-full text-left px-5 py-2 text-sm text-error hover:bg-red-50 transition-colors">Log Out</button>
                   </div>
                 )}
               </div>
             ) : (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 p-2 hover:text-zinc-900 transition-colors text-zinc-600">
                   <User className="w-5 h-5" />
                   <span className="text-sm font-medium">Account</span>
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-5 bg-white border border-zinc-100 animate-fade-in-up origin-top-right z-50">
                      <h3 className="text-sm font-black text-zinc-900 mb-1 tracking-tight">WELCOME TO SAJODA</h3>
                      <p className="text-xs text-zinc-500 mb-4">Sign in to your account or create a new account.</p>
                      <div className="space-y-2">
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/login'); }} className="w-full py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">LOGIN</button>
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/register'); }} className="w-full py-2.5 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">CREATE ACCOUNT</button>
                      </div>
                   </div>
                 )}
               </div>
             )}
          </div>
        </div>
      </header>

      {/* Mobile Top Navbar */}
      <header className="lg:hidden sticky top-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-zinc-200">
        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 z-10">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/')}>
              <Logo className="h-5" variant="full" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] flex lg:hidden">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-full md:w-4/5 max-w-sm h-[90vh] md:h-full mt-auto md:mt-0 bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col transform transition-transform animate-slide-up md:animate-slide-left">
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
                     <>
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors w-full">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm shrink-0">
                          {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="font-bold text-sm text-zinc-900 truncate w-full text-left">{user.displayName || 'My Account'}</span>
                          <span className="text-xs text-zinc-500 truncate w-full text-left">{user.email}</span>
                        </div>
                     </button>
                     <button onClick={() => { setIsMobileMenuOpen(false); handleLogout(); }} className="text-left text-error hover:text-red-600 font-bold transition-colors mt-2 p-2 -ml-2">Log Out</button>
                     </>
                  ) : (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Login / Sign Up</span>
                     </button>
                  )}
                </nav>
             </div>
          </div>
        </div>
      )}`;

if (brokenRegex.test(content)) {
  content = content.replace(brokenRegex, fixedContent);
  fs.writeFileSync(storePath, content);
  console.log("Successfully restored missing JSX!");
} else {
  console.log("Regex didn't match.");
}
