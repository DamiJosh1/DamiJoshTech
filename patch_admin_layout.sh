#!/bin/bash
sed -i 's/<div className="w-full lg:w-64 space-y-2 shrink-0">/<div className="w-full lg:w-64 shrink-0 flex flex-col gap-2">/g' src/pages/AdminDashboard.tsx

sed -i 's/<div className="px-4 py-2 mb-4">/<div className="px-4 py-2 mb-2 lg:mb-4">/g' src/pages/AdminDashboard.tsx

# Replace the buttons block
sed -i '/<button /,/<\/button>/!b;//!d;/<\/button>/{x;s/^//;t a;b;:a;s/.*//;x;s/.*//;d};H;d' src/pages/AdminDashboard.tsx

