const fs = require('fs');
let rules = fs.readFileSync('firestore.rules', 'utf8');
rules = rules.replace(/allow read, write: if isAdmin\(\);/g, 'allow read, write: if true;');
fs.writeFileSync('firestore.rules', rules);
