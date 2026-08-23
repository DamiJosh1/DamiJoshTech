import sys

with open('src/Store.tsx', 'r') as f:
    content = f.read()

new_routes = """          <Route path="/about" element={<ContentPage />} />
          <Route path="/why-sajoda" element={<ContentPage />} />
          <Route path="/careers" element={<ContentPage />} />
          <Route path="/cookies" element={<ContentPage />} />
          <Route path="/warranty" element={<ContentPage />} />"""

content = content.replace('<Route path="/about" element={<ContentPage />} />', new_routes)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Routes 2 updated")
