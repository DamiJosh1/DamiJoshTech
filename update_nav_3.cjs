const fs = require('fs');

const storePath = '/app/applet/src/Store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

const targetStart = "{/* Mobile Top Navbar */}";
const targetEnd = "</header>";

const startIndex = content.indexOf(targetStart);
if (startIndex !== -1) {
  // Find the first </header> after startIndex
  const endIndex = content.indexOf(targetEnd, startIndex);
  
  if (endIndex !== -1) {
    const toReplace = content.substring(startIndex, endIndex + targetEnd.length);
    
    const replaceStr = `{/* Mobile Top Navbar */}
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
          
          <div className="flex items-center gap-1 z-10">
            <button onClick={() => user ? navigate('/account') : navigate('/login')} className="p-1 hover:bg-zinc-100 rounded-full transition-colors flex items-center justify-center">
              {user ? (
                <div className="w-9 h-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-bold text-sm overflow-hidden shadow-sm border-2 border-white">
                  {user.photoURL ? <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover"/> : (user.displayName ? user.displayName.split(' ').map(n=>n[0]).join('').substring(0,2).toUpperCase() : 'U')}
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full bg-zinc-100 text-zinc-600 flex items-center justify-center border-2 border-white">
                  <User className="w-5 h-5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </header>`;
      
    content = content.replace(toReplace, replaceStr);
    fs.writeFileSync(storePath, content);
    console.log("Updated Mobile Top Navbar successfully.");
  } else {
    console.log("Could not find end of header");
  }
} else {
  console.log("Could not find start");
}
