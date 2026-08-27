import os

# Store.tsx Route Update
with open('src/Store.tsx', 'r') as f:
    content = f.read()

if 'import AdminOrderDetails from' not in content:
    content = content.replace("import AdminOrders from './pages/admin/AdminOrders';", "import AdminOrders from './pages/admin/AdminOrders';\nimport AdminOrderDetails from './pages/admin/AdminOrderDetails';")
    content = content.replace('<Route path="orders" element={<AdminOrders />} />', '<Route path="orders" element={<AdminOrders />} />\n            <Route path="orders/:id" element={<AdminOrderDetails />} />')
    with open('src/Store.tsx', 'w') as f:
        f.write(content)
        print("Updated Store.tsx routes")

