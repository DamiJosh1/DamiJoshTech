const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

const targetContent = `        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="z-10" aria-label="Home">
              <Logo className="h-6" variant="full" />
            </button>
          </div>
          <div className="flex items-center gap-1 z-10">
            <button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>`;

const replacementContent = `        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => navigate('/')} className="z-10 -ml-2" aria-label="Home">
              <Logo className="h-6" variant="full" />
            </button>
          </div>
          <div className="flex items-center gap-1 z-10">
            <button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>`;

if (content.includes(targetContent)) {
  content = content.replace(targetContent, replacementContent);
  fs.writeFileSync('src/Store.tsx', content);
  console.log("Successfully patched mobile nav");
} else {
  console.log("Target content not found. Let's do a more robust replace.");
  
  content = content.replace(
    /<button onClick=\{\(\) => setIsMobileMenuOpen\(true\)\} className="p-2 -ml-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Menu">\s*<Menu className="w-5 h-5" \/>\s*<\/button>/g,
    ''
  );
  
  content = content.replace(
    /<button onClick=\{\(\) => navigate\('\/search'\)\} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">\s*<Search className="w-5 h-5" \/>\s*<\/button>/g,
    `<button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -mr-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>`
  );
  
  fs.writeFileSync('src/Store.tsx', content);
  console.log("Patched using regex");
}
