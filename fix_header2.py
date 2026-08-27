with open('src/Store.tsx', 'r') as f:
    content = f.read()

old_header_right = """          <div className="flex items-center gap-1 z-10">
            <button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/account')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Profile">
              <User className="w-5 h-5" />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 relative transition-colors hover:bg-zinc-100 rounded-full text-zinc-800" aria-label="Cart">
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && <span className="absolute top-1 right-1 w-3.5 h-3.5 bg-primary-blue text-white text-[9px] font-bold flex items-center justify-center rounded-full ring-2 ring-white">{cartCount}</span>}
            </button>
          </div>"""

new_header_right = """          <div className="flex items-center gap-1 z-10">
            <button onClick={() => navigate('/search')} className="p-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
          </div>"""

content = content.replace(old_header_right, new_header_right)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx right header")
