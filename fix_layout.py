import re

with open('src/components/admin/AdminLayout.tsx', 'r') as f:
    content = f.read()

new_nav = """    { name: 'CJdropshipping', path: '/admin/cjdropshipping', icon: <Globe className="w-5 h-5" /> },
    { name: 'AI Worker', path: '/admin/ai', icon: <Bot className="w-5 h-5" /> },"""

content = content.replace("{ name: 'CJdropshipping', path: '/admin/cjdropshipping', icon: <Globe className=\"w-5 h-5\" /> },", new_nav)

if "import { Bot" not in content and "Bot" not in content:
    content = content.replace("Globe,", "Globe, Bot,")

with open('src/components/admin/AdminLayout.tsx', 'w') as f:
    f.write(content)
print("Updated AdminLayout.tsx")
