const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

if (!content.includes("import SearchInput")) {
  content = content.replace("import MobileBottomNav", "import SearchInput from './components/SearchInput';\nimport MobileBottomNav");
}

const desktopSearchOld = `<div className="flex flex-1 max-w-sm items-center rounded-full px-4 py-2 bg-light-bg border border-zinc-200 transition-colors focus-within:border-primary-blue">
            <Search className="w-4 h-4 text-zinc-500" />
            <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={handleSearch} className="bg-transparent border-none outline-none w-full ml-3 text-sm text-dark-text placeholder:text-zinc-400" />
          </div>`;

const desktopSearchNew = `<SearchInput />`;

content = content.replace(desktopSearchOld, desktopSearchNew);

const mobileSearchOld = `<div className="flex items-center rounded-full px-4 py-2 bg-zinc-100 border border-transparent transition-colors focus-within:bg-white focus-within:border-primary-blue focus-within:shadow-sm">
            <Search className="w-4 h-4 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search premium electronics..." 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleSearch} 
              className="bg-transparent border-none outline-none w-full ml-2 text-sm text-dark-text placeholder:text-zinc-500" 
            />
          </div>`;

const mobileSearchNew = `<div className="w-full flex items-center justify-between">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-500 hover:bg-zinc-100 rounded-full transition-colors mr-2">
               <Search className="w-5 h-5" />
            </button>
            <div className="flex-1" onClick={() => navigate('/search')}>
               <div className="w-full py-2.5 px-4 bg-zinc-100 rounded-full flex items-center gap-2 text-zinc-500">
                 <Search className="w-4 h-4" />
                 <span className="text-sm">Search gadgets, appliances...</span>
               </div>
            </div>
          </div>`;

content = content.replace(mobileSearchOld, mobileSearchNew);

fs.writeFileSync('src/Store.tsx', content);
