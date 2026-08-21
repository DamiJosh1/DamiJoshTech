const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

const regex = /<button onClick=\{\(\) => navigate\('\/'\)\} className="z-10">/;
code = code.replace(regex, `<div className="flex items-center gap-3 z-10">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 text-charcoal hover:bg-light-bg rounded-full transition-colors">
              <Menu className="w-6 h-6" />
            </button>
            <button onClick={() => navigate('/')}>
              <Logo className="h-5" variant="full" />
            </button>
          </div>`);

fs.writeFileSync('src/Store.tsx', code);
console.log('Header menu patched');
