const fs = require('fs');
let content = fs.readFileSync('src/pages/Search.tsx', 'utf8');

if (!content.includes('useParams')) {
  content = content.replace("import { useSearchParams, useNavigate } from 'react-router-dom';", "import { useSearchParams, useNavigate, useParams } from 'react-router-dom';");
  
  content = content.replace(
    "const categoryParam = searchParams.get('category') || 'All';",
    "const { slug } = useParams();\n  const categoryParam = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ') : (searchParams.get('category') || 'All');"
  );
  
  fs.writeFileSync('src/pages/Search.tsx', content);
}
