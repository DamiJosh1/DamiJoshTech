#!/bin/bash
sed -i '7,13d' src/pages/Home.tsx
sed -i '/const navigate = useNavigate();/a \  useEffect(() => {\n    if (user \&\& user.email === '"'"'damijosh12@gmail.com'"'"') {\n      navigate('"'"'\/admin'"'"');\n    }\n  }, [user, navigate]);' src/pages/Home.tsx
