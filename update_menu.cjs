const fs = require('fs');

const storePath = '/app/applet/src/Store.tsx';
let content = fs.readFileSync(storePath, 'utf8');

const regex = /{user \? \([\s\S]*?<div className="flex flex-col items-start overflow-hidden">[\s\S]*?<\/div>\s*<\/button>\s*\) : \(/;

const replacement = `{user ? (
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
                  ) : (`;

if (regex.test(content)) {
  content = content.replace(regex, replacement);
  fs.writeFileSync(storePath, content);
  console.log("Updated Mobile Menu Log Out successfully.");
} else {
  console.error("Could not find the target codeblock!");
}
