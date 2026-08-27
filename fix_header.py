with open('src/Store.tsx', 'r') as f:
    content = f.read()

old_header = """        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <button onClick={() => navigate('/')} className="z-10" aria-label="Home">
            <Logo className="h-6" variant="full" />
          </button>"""

new_header = """        <div className="w-full h-[60px] px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 -ml-2 text-zinc-800 hover:bg-zinc-100 rounded-full transition-colors" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
            <button onClick={() => navigate('/')} className="z-10" aria-label="Home">
              <Logo className="h-6" variant="full" />
            </button>
          </div>"""

content = content.replace(old_header, new_header)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx")
