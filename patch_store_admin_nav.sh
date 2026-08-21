#!/bin/bash
sed -i 's/if (path.startsWith('"'"'\/orders'"'"')) return '"'"'orders_tab'"'"';/if (path.startsWith('"'"'\/orders'"'"')) return '"'"'orders_tab'"'"';\n    if (path.startsWith('"'"'\/admin'"'"')) return '"'"'admin'"'"';/g' src/Store.tsx

sed -i 's/useState<'"'"'home'"'"' | '"'"'shop'"'"' | '"'"'profile'"'"' | '"'"'ai'"'"' | '"'"'orders_tab'"'"' | '"'"''"'"'>/useState<'"'"'home'"'"' | '"'"'shop'"'"' | '"'"'profile'"'"' | '"'"'ai'"'"' | '"'"'orders_tab'"'"' | '"'"'admin'"'"' | '"'"''"'"'>/g' src/Store.tsx
