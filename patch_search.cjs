const fs = require('fs');
let code = fs.readFileSync('src/Store.tsx', 'utf8');

const oldSearch = '<div className="px-4 pb-3">';
const newSearch = '<div className={`px-4 transition-all duration-300 overflow-hidden ${scrollY > 50 ? \'h-0 opacity-0 pb-0\' : \'h-[52px] pb-3 opacity-100\'}`}>';

code = code.replace(oldSearch, newSearch);

// Make sure the mobile menu also animates properly like a slide up/left
const oldMenu = '<div className="relative w-4/5 max-w-sm h-full bg-white shadow-2xl flex flex-col transform transition-transform">';
const newMenu = '<div className="relative w-full md:w-4/5 max-w-sm h-[90vh] md:h-full mt-auto md:mt-0 bg-white rounded-t-3xl md:rounded-none shadow-2xl flex flex-col transform transition-transform animate-slide-up md:animate-slide-left">';

code = code.replace(oldMenu, newMenu);

fs.writeFileSync('src/Store.tsx', code);
console.log('Search & Menu patched');
