const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ai/AdminAiLayout.tsx', 'utf8');

content = content.replace(/import \{.*?\} from 'lucide-react';/s, `import { Bot, CheckSquare, Search, TrendingUp, Map, CheckCircle, Activity, Settings, DollarSign, BarChart2, Truck, Brain, Eye, FileText, PenTool, FileEdit, Send, ShoppingBag, Package, MapPin, AlertTriangle, MessageSquare } from 'lucide-react';`);

fs.writeFileSync('src/pages/admin/ai/AdminAiLayout.tsx', content);
