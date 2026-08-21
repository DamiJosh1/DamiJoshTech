#!/bin/bash
sed -i '/export default function Home() {/a \  const navigate = useNavigate();\n  const { user: _storeUser } = useStore();\n  useEffect(() => {\n    if (_storeUser \&\& _storeUser.email === '"'"'damijosh12@gmail.com'"'"') {\n      navigate('"'"'\/admin'"'"');\n    }\n  }, [_storeUser, navigate]);' src/pages/Home.tsx
