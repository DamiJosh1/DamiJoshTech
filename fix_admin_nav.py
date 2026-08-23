import sys

with open('src/components/admin/AdminLayout.tsx', 'r') as f:
    content = f.read()

content = content.replace("    { name: 'Settings', path: '/admin/settings', icon: <Settings className=\"w-5 h-5\" /> },", "    { name: 'Settings', path: '/admin/settings', icon: <Settings className=\"w-5 h-5\" /> },\n    { name: 'System Health', path: '/admin/system-health', icon: <Shield className=\"w-5 h-5\" /> },")

with open('src/components/admin/AdminLayout.tsx', 'w') as f:
    f.write(content)
print("Admin nav updated")
