const fs = require('fs');

const path = '/app/applet/src/pages/account/AccountDashboard.tsx';
let content = fs.readFileSync(path, 'utf8');

// The incorrect insertion string to remove
const badString = `
      <div className="lg:hidden mt-8">
        <button
          onClick={() => { signOut(auth); navigate('/'); }}
          className="w-full flex items-center justify-center gap-3 bg-white p-4 rounded-2xl border border-red-100 text-red-600 font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>`;

content = content.replace(badString, "");

// Now properly insert it after the entire grid.
// Find the exact end of the grid:
// The grid has 6 links. We can just place the logout button right before <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
const insertTarget = `<div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-zinc-900 mb-4 flex items-center gap-2">`;

const goodString = `
      <div className="lg:hidden">
        <button
          onClick={() => { signOut(auth); navigate('/'); }}
          className="w-full flex items-center justify-center gap-3 bg-white p-4 rounded-2xl border border-red-200 text-red-600 font-bold hover:bg-red-50 transition-colors shadow-sm"
        >
          <LogOut className="w-5 h-5" />
          Log Out
        </button>
      </div>
      
      `;

content = content.replace(insertTarget, goodString + insertTarget);
fs.writeFileSync(path, content);
console.log("Fixed dashboard log out button");
