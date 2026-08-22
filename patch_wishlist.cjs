const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

// Replace the handleWishlistToggle implementation
const oldWishlistRegex = /const handleWishlistToggle = \(product: Product, e\?: React.MouseEvent\) => \{[\s\S]*?setWishlistIds\(prev =>[\s\S]*?prev\.includes\(product\.id\) \? prev\.filter\(id => id !== product\.id\) : \[\.\.\.prev, product\.id\][\s\S]*?\);\s*\};/;
// Wait, looking at grep, the signature might not have `?` for `e`.
