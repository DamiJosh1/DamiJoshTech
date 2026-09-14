const fs = require('fs');

// Patch StoreContext.tsx
let ctx = fs.readFileSync('src/StoreContext.tsx', 'utf8');
ctx = ctx.replace(
  '  products: Product[];',
  '  products: Product[];\n  productsLoading: boolean;'
);
fs.writeFileSync('src/StoreContext.tsx', ctx);

// Patch Store.tsx
let store = fs.readFileSync('src/Store.tsx', 'utf8');

// Add productsLoading state
store = store.replace(
  '  const [products, setProducts] = useState<Product[]>([]);',
  '  const [products, setProducts] = useState<Product[]>([]);\n  const [productsLoading, setProductsLoading] = useState(true);'
);

// Update setProductsLoading to false when fetched
store = store.replace(
  '      setProducts(fetchedProducts);',
  '      setProducts(fetchedProducts);\n      setProductsLoading(false);'
);

// Update context value
store = store.replace(
  '    <StoreContext.Provider value={{',
  '    <StoreContext.Provider value={{\n      productsLoading,'
);

fs.writeFileSync('src/Store.tsx', store);
console.log("Patched Store and StoreContext");
