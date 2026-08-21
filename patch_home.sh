#!/bin/bash
sed -i '/export default function Home() {/a \  const { user } = useStore();\n  useEffect(() => {\n    if (user \&\& user.email === '"'"'damijosh12@gmail.com'"'"') {\n      navigate('"'"'\/admin'"'"');\n    }\n  }, [user, navigate]);' src/pages/Home.tsx
