import sys

with open('src/Store.tsx', 'r') as f:
    content = f.read()

content = content.replace("import ContentPage from './pages/ContentPage';", "import ContentPage from './pages/ContentPage';\nimport NotFound from './pages/NotFound';")
content = content.replace("          </Route>\n        </Routes>", "          </Route>\n          <Route path=\"*\" element={<NotFound />} />\n        </Routes>")

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Added NotFound route")
