#!/bin/bash
sed -i 's/if (auth.currentUser?.email === '"'"'damijosh12@gmail.com'"'"' || loginEmail === '"'"'damijosh12@gmail.com'"'"')/if (auth.currentUser?.email === '"'"'damijosh12@gmail.com'"'"')/g' src/Login.tsx
