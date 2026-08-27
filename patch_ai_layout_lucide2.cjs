const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

content = content.replace("import { Cpu, ShieldCheck, Package, Globe, Zap, MessageSquare, BarChart3, NavLink, Outlet } from 'react-router-dom';", "import { NavLink, Outlet } from 'react-router-dom';\nimport { Cpu, ShieldCheck, Package, Globe, Zap, MessageSquare, BarChart3 } from 'lucide-react';");

fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);

