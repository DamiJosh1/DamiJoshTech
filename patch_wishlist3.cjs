const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf-8');

if (!code.includes('doc, setDoc, getDoc')) {
  code = code.replace(/import { collection, addDoc, serverTimestamp, onSnapshot } from 'firebase\/firestore';/, "import { collection, addDoc, serverTimestamp, onSnapshot, doc, setDoc, getDoc } from 'firebase/firestore';");
}

const useEffectHook = `
  useEffect(() => {
    if (user && wishlistIds.length > 0) {
      setDoc(doc(db, 'wishlists', user.uid), { products: wishlistIds });
    }
  }, [wishlistIds, user]);
  
  useEffect(() => {
    if (user) {
      getDoc(doc(db, 'wishlists', user.uid)).then(snap => {
        if (snap.exists() && snap.data().products) {
          setWishlistIds(prev => Array.from(new Set([...prev, ...snap.data().products])));
        }
      });
    }
  }, [user]);
`;

// Insert the hooks right after `const [wishlistIds, setWishlistIds] = useState<string[]>([]);`
if (code.includes('const [wishlistIds, setWishlistIds] = useState<string[]>([]);') && !code.includes("doc(db, 'wishlists'")) {
  code = code.replace('const [wishlistIds, setWishlistIds] = useState<string[]>([]);', 'const [wishlistIds, setWishlistIds] = useState<string[]>(() => { const saved = localStorage.getItem("sajoda_guest_wishlist"); return saved ? JSON.parse(saved) : []; });\n' + useEffectHook);
}

fs.writeFileSync('src/Store.tsx', code);
