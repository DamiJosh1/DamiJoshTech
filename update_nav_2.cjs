const fs = require('fs');

const storePath = '/app/applet/src/Store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

// Use regex to replace the Mobile Top Navbar
const regex = /{[/\\*] Mobile Top Navbar [\\*\/]}[\\s\\S]*?<\/header>/;

const replaceStr = `{/* Mobile Top Navbar */}
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

if (regex.test(content)) {
  content = content.replace(regex, replaceStr);
  fs.writeFileSync(storePath, content);
  console.log("Updated Mobile Top Navbar via Regex");
} else {
  console.error("Target content not found in Store.tsx via regex!");
}
