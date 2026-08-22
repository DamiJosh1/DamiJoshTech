const fs = require('fs');

let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');

storeCode = storeCode.replace(
  /const updateQuantity = \([^)]*\) => {[\s\S]*?}\);[\s]*};/,
  `const updateQuantity = (id: string, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };
  
  const removeFromCart = (id: string) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleAddToCart = (product: Product, quantity = 1, variant?: any) => {
    setAddingToCartId(product.id);
    const cartItemId = variant ? \`\${product.id}-\${variant.id}\` : product.id;
    setCartItems(prev => {
      const existing = prev.find(p => p.id === cartItemId);
      if (existing) {
        return prev.map(p => p.id === cartItemId ? { ...p, quantity: p.quantity + quantity } : p);
      }
      return [...prev, { 
        ...product, 
        id: cartItemId, 
        productId: product.id, 
        quantity, 
        unitPrice: variant?.price || product.price, 
        price: variant?.price || product.price, 
        variantId: variant?.id,
        variantSnapshot: variant,
        productSnapshot: product,
        createdAt: new Date().toISOString()
      }];
    });
    setTimeout(() => {
      setAddingToCartId(null);
      setIsCartOpen(true);
    }, 600);
  };
`
);

storeCode = storeCode.replace(
  /const storeState = \{[\s\S]*?setQuickViewProduct[\s]*\};/,
  `const storeState = {
    products,
    isDarkMode,
    user,
    wishlistIds,
    addingToCartId,
    prefersReducedMotion,
    handleFeaturedAddToCart,
    handleAddToCart,
    handleWishlistToggle,
    setQuickViewProduct,
    cartItems,
    cartTotal,
    cartCount,
    updateQuantity,
    removeFromCart,
    isCartOpen,
    setIsCartOpen
  };`
);

fs.writeFileSync('src/Store.tsx', storeCode);
