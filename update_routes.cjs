const fs = require('fs');
let content = fs.readFileSync('src/Store.tsx', 'utf8');

if (!content.includes('path="/search"')) {
  content = content.replace(
    '<Route path="/shop" element={<Shop />} />', 
    '<Route path="/shop" element={<Shop />} />\n          <Route path="/search" element={<Shop />} />\n          <Route path="/category/:slug" element={<Shop />} />'
  );
  fs.writeFileSync('src/Store.tsx', content);
}
