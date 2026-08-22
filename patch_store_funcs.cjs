const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

code = code.replace(
  /const updateQuantity = \(id: string, delta: number\) => \{[\s\S]*?\}\)\.filter\(item => item.quantity > 0\)\);\n  \};/,
  "const updateQuantity = (id: string, delta: number) => {\n    setCartItems(prev => prev.map(item => {\n      if (item.id === id) {\n        const newQuantity = Math.max(0, item.quantity + delta);\n        return { ...item, quantity: newQuantity };\n      }\n      return item;\n    }).filter(item => item.quantity > 0));\n  };\n\n  const handleAddToCart = addToCart;\n  const removeFromCart = (id: string) => {\n    setCartItems(prev => prev.filter(item => item.id !== id));\n  };\n  const clearCart = () => setCartItems([]);"
);

fs.writeFileSync('src/Store.tsx', code);
