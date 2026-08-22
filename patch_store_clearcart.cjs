const fs = require('fs');

let contextCode = fs.readFileSync('src/StoreContext.tsx', 'utf-8');
contextCode = contextCode.replace(
  /setIsCartOpen: \(open: boolean\) => void;/,
  "setIsCartOpen: (open: boolean) => void;\n  clearCart: () => void;"
);
fs.writeFileSync('src/StoreContext.tsx', contextCode);

let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');
storeCode = storeCode.replace(
  /const removeFromCart = \(id: string\) => {[\s\S]*?};/,
  "const removeFromCart = (id: string) => {\n    setCartItems(prev => prev.filter(item => item.id !== id));\n  };\n\n  const clearCart = () => {\n    setCartItems([]);\n  };"
);

storeCode = storeCode.replace(
  /setIsCartOpen[\s]*\};/,
  "setIsCartOpen,\n    clearCart\n  };"
);

fs.writeFileSync('src/Store.tsx', storeCode);
