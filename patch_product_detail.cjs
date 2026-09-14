const fs = require('fs');
let content = fs.readFileSync('src/pages/ProductDetail.tsx', 'utf8');

// Add productsLoading to destructuring
content = content.replace(
  '    products, ',
  '    products, \n    productsLoading, '
);

// Modify the !product check
content = content.replace(
  '  if (!product) {\n    return (',
  `  if (!product) {
    if (productsLoading) {
      return (
        <div className="w-full min-h-[70vh] flex flex-col items-center justify-center bg-white text-zinc-900 px-6">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-blue mb-4"></div>
           <p className="text-zinc-500 font-medium">Loading product details...</p>
        </div>
      );
    }
    return (`
);

fs.writeFileSync('src/pages/ProductDetail.tsx', content);
console.log("Successfully patched ProductDetail.tsx");
