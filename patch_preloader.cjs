const fs = require('fs');
let code = fs.readFileSync('src/Preloader.tsx', 'utf-8');
code = code.replace('<Logo size="lg" isDarkMode={isDarkMode} />', '<Logo variant="icon" className="h-10" />');
fs.writeFileSync('src/Preloader.tsx', code);

let storeCode = fs.readFileSync('src/Store.tsx', 'utf-8');
storeCode = storeCode.replace('<Logo size="sm" className="hidden lg:block" isDarkMode={isDarkMode} />', '<Logo variant="icon" className="h-6 hidden lg:block" />');
// The exact string in Store.tsx might be different. Let's find it with regex.
storeCode = storeCode.replace(/<Logo\s+size="sm"\s+className="hidden lg:block"\s+isDarkMode=\{isDarkMode\}\s*\/>/g, '<Logo variant="icon" className="h-6 hidden lg:block" />');
storeCode = storeCode.replace(/<Logo\s+size="[^"]*"\s+isDarkMode=\{isDarkMode\}\s*\/>/g, '<Logo variant="full" className="h-6" />');
storeCode = storeCode.replace(/<Logo[^>]*size=[^>]*isDarkMode=[^>]*\/>/g, '<Logo variant="full" className="h-6" />');
fs.writeFileSync('src/Store.tsx', storeCode);
