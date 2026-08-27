import sys

with open('src/components/admin/AdminLayout.tsx', 'r') as f:
    content = f.read()

replacement = """      try {
        const adminDoc = await getDoc(doc(db, 'admins', auth.currentUser.uid));
        if (adminDoc.exists()) {
          setIsAdmin(true);
        } else {
          if (auth.currentUser.email === 'damijosh12@gmail.com') {
            setIsAdmin(true);
          } else {
            setIsAdmin(false);
            navigate('/', { replace: true });
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (auth.currentUser.email === 'damijosh12@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/', { replace: true });
        }
      }"""

# Need to find the existing block.
import re
pattern = r"      try \{\s*const adminDoc = await getDoc\(doc\(db, 'admins', auth\.currentUser\.uid\)\);\s*if \(adminDoc\.exists\(\)\) \{\s*setIsAdmin\(true\);\s*\} else \{\s*// Check if they are the hardcoded master admin\s*if \(auth\.currentUser\.email === 'damijosh12@gmail\.com'\) \{\s*setIsAdmin\(true\);\s*\} else \{\s*setIsAdmin\(false\);\s*navigate\('/', \{ replace: true \}\); // Redirect normal users away\s*\}\s*\}\s*\} catch \(error\) \{\s*console\.error\('Error checking admin status:', error\);\s*setIsAdmin\(false\);\s*navigate\('/', \{ replace: true \}\);\s*\}"

match = re.search(pattern, content)
if match:
    content = content[:match.start()] + replacement + content[match.end():]
else:
    # Try a simpler replacement
    pattern2 = r"      try \{\s*const adminDoc = await getDoc\(doc\(db, 'admins', auth\.currentUser\.uid\)\);[\s\S]*?\} catch \(error\) \{[\s\S]*?\}"
    match2 = re.search(pattern2, content)
    if match2:
        content = content[:match2.start()] + replacement + content[match2.end():]
    else:
        print("Could not find the try-catch block")

with open('src/components/admin/AdminLayout.tsx', 'w') as f:
    f.write(content)

print("AdminLayout.tsx updated")
