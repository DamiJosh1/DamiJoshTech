const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

const oldCart = `<div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform">`;
const newCart = `<div className="relative w-full md:max-w-md h-[90vh] md:h-full mt-auto md:mt-0 rounded-t-3xl md:rounded-none bg-white shadow-2xl flex flex-col transform transition-transform animate-slide-up md:animate-slide-left">`;

if (code.includes(oldCart)) {
  code = code.replace(oldCart, newCart);
  
  // also add animate-slide-up and slide-left to index.css
  fs.writeFileSync('src/Store.tsx', code);
  console.log('Cart patched');
} else {
  // Let's do a more robust replace
  const regex = /<div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col transform transition-transform">/g;
  code = code.replace(regex, newCart);
  fs.writeFileSync('src/Store.tsx', code);
  console.log('Cart patched robustly');
}
