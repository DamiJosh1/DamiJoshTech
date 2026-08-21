const fs = require('fs');
let code = fs.readFileSync('src/pages/Categories.tsx', 'utf8');

code = code.replace('const handleSearch = (e) => {', 'const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {');
code = code.replace('const executeSearch = (term) => {', 'const executeSearch = (term: string) => {');

fs.writeFileSync('src/pages/Categories.tsx', code);
