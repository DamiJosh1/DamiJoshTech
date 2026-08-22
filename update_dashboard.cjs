const fs = require('fs');

const path = '/app/applet/src/pages/account/AccountDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

const regexImports = /import \{ Package, Heart, MapPin, Shield, Bell, ArrowRight, User as UserIcon \} from 'lucide-react';/;
content = content.replace(regexImports, "import { Package, Heart, MapPin, Shield, Bell, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';\nimport { signOut } from 'firebase/auth';\nimport { auth } from '../../firebase';");

const regexGrid = /(<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">[\s\S]*?<\/div>)/;

const match = content.match(regexGrid);
if (match) {
  const replacement = match[1] + `
      <div className="lg:hidden mt-8">
        <button
          onClick={() => { signOut(auth); navigate('/'); }}
          className="w-full flex items-center justify-center gap-3 bg-white p-4 rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>`;
  content = content.replace(match[1], replacement);
  fs.writeFileSync(path, content);
  console.log("Updated AccountDashboard Log Out successfully.");
} else {
  console.error("Could not find the target codeblock!");
}
