const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

// The second line is: import { Cpu, ShieldCheck, Package, Globe, Zap, MessageSquare, BarChart3 } from 'lucide-react';
// We will replace it with: import { Cpu, ShieldCheck } from 'lucide-react';
// Since the others are already imported later in the file.
content = content.replace("import { Cpu, ShieldCheck, Package, Globe, Zap, MessageSquare, BarChart3 } from 'lucide-react';", "import { Cpu, ShieldCheck } from 'lucide-react';");

fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);

