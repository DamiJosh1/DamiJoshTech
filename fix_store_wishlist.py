import sys

with open('src/Store.tsx', 'r') as f:
    content = f.read()

import re
content = re.sub(r"getDoc\(doc\(db, 'wishlists', user\.uid\)\)\.then\(snap => \{\s*if \(snap\.exists\(\) && snap\.data\(\)\.products\) \{\s*setWishlistIds\(prev => Array\.from\(new Set\(\[\.\.\.prev, \.\.\.snap\.data\(\)\.products\]\)\)\);\s*\}\s*\}\);", 
                 r"getDoc(doc(db, 'wishlists', user.uid)).then(snap => {\n        if (snap.exists() && snap.data().products) {\n          setWishlistIds(prev => Array.from(new Set([...prev, ...snap.data().products])));\n        }\n      }).catch(e => console.warn('Wishlist offline', e));", content)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Store updated")
