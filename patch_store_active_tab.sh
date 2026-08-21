#!/bin/bash
sed -i 's/if (path.startsWith('"'"'\/profile'"'"') || path.startsWith('"'"'\/orders'"'"')) return '"'"'profile'"'"';/if (path.startsWith('"'"'\/profile'"'"')) return '"'"'profile'"'"';\n    if (path.startsWith('"'"'\/orders'"'"')) return '"'"'orders_tab'"'"';/g' src/Store.tsx
