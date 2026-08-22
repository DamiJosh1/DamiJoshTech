const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

const oldWishlist = `  const handleWishlistToggle = (product: Product, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    setWishlistIds(prev => 
      prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id]
    );
  };`;

const newWishlist = `  const handleWishlistToggle = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setWishlistIds(prev => {
      const updated = prev.includes(product.id) ? prev.filter(id => id !== product.id) : [...prev, product.id];
      if (!user) {
        localStorage.setItem('sajoda_guest_wishlist', JSON.stringify(updated));
      } else {
        // We sync to firestore in a useEffect, but let's just let the state handle it 
        // if there's a listener. Wait, is there a firestore sync for wishlist?
      }
      return updated;
    });
  };`;

code = code.replace(oldWishlist, newWishlist);

// Let's also check if there is an auth state listener to merge wishlist
const onAuthStateChangedRegex = /onAuthStateChanged\(auth, \(user\) => \{([\s\S]*?)\}\);/g;
let match = onAuthStateChangedRegex.exec(code);
if (match) {
  const innerCode = match[1];
  if (!innerCode.includes('sajoda_guest_wishlist')) {
    const newInner = innerCode + `
      if (user) {
        const guestWishlist = JSON.parse(localStorage.getItem('sajoda_guest_wishlist') || '[]');
        if (guestWishlist.length > 0) {
          setWishlistIds(prev => {
            const merged = Array.from(new Set([...prev, ...guestWishlist]));
            return merged;
          });
          localStorage.removeItem('sajoda_guest_wishlist');
        }
      }
`;
    code = code.replace(match[0], `onAuthStateChanged(auth, (user) => {${newInner}});`);
  }
}

fs.writeFileSync('src/Store.tsx', code);
