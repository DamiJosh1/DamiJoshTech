import re

with open('src/pages/admin/AdminProducts.tsx', 'r') as f:
    content = f.read()

content = content.replace("const productsData = snapshot.docs.map(doc => ({\n        id: doc.id,\n        ...doc.data()\n      }));", "const productsData = snapshot.docs.map(doc => ({\n        id: doc.id,\n        ...doc.data()\n      })) as any[];")

with open('src/pages/admin/AdminProducts.tsx', 'w') as f:
    f.write(content)
print("Fixed ts")
