const fs = require('fs');
let content = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace the inline ProductCard
content = content.replace(/const ProductCard = \(\{ product \}: \{ product: any \}\) => \([\s\S]*?\n  \);/g, '');
content = content.replace("import { ArrowRight", "import ProductCard from '../components/ProductCard';\nimport { ArrowRight");
fs.writeFileSync('src/pages/Home.tsx', content);
