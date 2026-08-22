const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

// Replace desktop user block
const desktopOld = `{user ? (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 hover:border-primary-blue transition-colors bg-light-bg flex items-center justify-center">
                   {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : <User className="w-4 h-4 text-zinc-500" />}
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white border border-zinc-100">
                      <div className="px-5 py-3 border-b border-zinc-100 mb-2">
                        <p className="text-sm font-semibold truncate text-dark-text">{user.email}</p>
                      </div>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">My Account</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">Orders</button>
                      <button onClick={() => { setIsProfileMenuOpen(false); navigate('/account'); }} className="w-full text-left px-5 py-2.5 text-sm transition-colors hover:bg-light-bg text-charcoal">Wishlist</button>
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
             )}`;

const desktopNew = `{user ? (
               <div className="relative ml-2">
                 <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="w-9 h-9 rounded-full overflow-hidden border border-zinc-200 hover:border-zinc-900 transition-colors flex items-center justify-center font-bold text-sm bg-zinc-900 text-white cursor-pointer shadow-sm">
                   {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                 </button>
                 {isProfileMenuOpen && (
                   <div className="absolute right-0 mt-3 w-56 rounded-xl shadow-xl py-2 bg-white border border-zinc-100 animate-fade-in-up origin-top-right">
                      <div className="px-5 py-3 border-b border-zinc-100 mb-2">
                        <p className="text-sm font-semibold truncate text-zinc-900">{user.displayName || 'Customer'}</p>
                        <p className="text-xs truncate text-zinc-500">{user.email}</p>
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
                   <div className="absolute right-0 mt-3 w-64 rounded-xl shadow-xl p-5 bg-white border border-zinc-100 animate-fade-in-up origin-top-right">
                      <h3 className="text-sm font-black text-zinc-900 mb-1 tracking-tight">WELCOME TO SAJODA</h3>
                      <p className="text-xs text-zinc-500 mb-4">Sign in to your account or create a new account.</p>
                      <div className="space-y-2">
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/login'); }} className="w-full py-2.5 bg-zinc-900 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors shadow-sm">LOGIN</button>
                        <button onClick={() => { setIsProfileMenuOpen(false); navigate('/register'); }} className="w-full py-2.5 bg-zinc-100 text-zinc-900 text-sm font-bold rounded-xl hover:bg-zinc-200 transition-colors">CREATE ACCOUNT</button>
                      </div>
                   </div>
                 )}
               </div>
             )}`;

content = content.replace(desktopOld, desktopNew);

const mobileIconOld = `<button onClick={() => navigate('/account')} className="p-2 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Heart className="w-5 h-5" />
            </button>`;

const mobileIconNew = `<button onClick={() => user ? navigate('/account') : navigate('/login')} className="p-2 text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors relative overflow-hidden flex items-center justify-center">
              {user ? (
                <div className="w-6 h-6 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-[10px] overflow-hidden">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                </div>
              ) : (
                <User className="w-5 h-5" />
              )}
            </button>`;

content = content.replace(mobileIconOld, mobileIconNew);

const mobileMenuOld = `{user ? (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="text-left flex items-center gap-3">
                        <User className="w-5 h-5 text-zinc-400" /> My Account
                     </button>
                  ) : (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left flex items-center gap-3">
                        <User className="w-5 h-5 text-zinc-400" /> Login / Sign Up
                     </button>
                  )}`;

const mobileMenuNew = `{user ? (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/account'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors w-full">
                        <div className="w-10 h-10 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm shrink-0">
                          {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                        </div>
                        <div className="flex flex-col items-start overflow-hidden">
                          <span className="font-bold text-sm text-zinc-900 truncate w-full text-left">{user.displayName || 'My Account'}</span>
                          <span className="text-xs text-zinc-500 truncate w-full text-left">{user.email}</span>
                        </div>
                     </button>
                  ) : (
                     <button onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }} className="text-left flex items-center gap-3 hover:bg-zinc-50 p-2 -ml-2 rounded-xl transition-colors">
                        <div className="w-10 h-10 rounded-full bg-zinc-100 text-zinc-500 flex items-center justify-center shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm">Login / Sign Up</span>
                     </button>
                  )}`;

content = content.replace(mobileMenuOld, mobileMenuNew);

fs.writeFileSync('src/Store.tsx', content);
