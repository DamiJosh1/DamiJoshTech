const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

// just inject the missing ones into the first line of the imports
content = content.replace("import { ", "import { Cpu, ShieldCheck, Package, Globe, Zap, MessageSquare, BarChart3, ");
fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);

