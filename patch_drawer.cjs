const fs = require('fs');
let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');

storeCode = storeCode.replace(
  /<div className="fixed inset-y-0 right-0 max-w-md w-full flex">[\s]*<div className="w-full h-full bg-white shadow-2xl flex flex-col translate-x-0 transition-transform transform">/,
  "<div className=\"fixed inset-x-0 bottom-0 md:inset-x-auto md:inset-y-0 md:right-0 max-w-md w-full flex justify-end\">\n            <div className=\"w-full h-[90vh] md:h-full bg-white md:shadow-2xl flex flex-col rounded-t-[2rem] md:rounded-none translate-y-0 md:translate-x-0 transition-transform transform animate-slide-up md:animate-none border-t border-zinc-200 md:border-none shadow-[0_-10px_40px_rgba(0,0,0,0.1)]\">\n              <div className=\"md:hidden w-full flex justify-center pt-3 pb-1\">\n                <div className=\"w-12 h-1.5 rounded-full bg-zinc-200\" />\n              </div>"
);

fs.writeFileSync('src/Store.tsx', storeCode);
