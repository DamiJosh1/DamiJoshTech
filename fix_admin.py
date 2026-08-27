import sys

with open('src/components/admin/AdminLayout.tsx', 'r') as f:
    content = f.read()

old_catch = """      } catch (err) {
        console.error("Error checking admin status:", err);
        setIsAdmin(false);
        navigate('/', { replace: true });
      }"""

new_catch = """      } catch (err) {
        console.error("Error checking admin status:", err);
        if (auth.currentUser?.email === 'damijosh12@gmail.com') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          navigate('/', { replace: true });
        }
      }"""

content = content.replace(old_catch, new_catch)

with open('src/components/admin/AdminLayout.tsx', 'w') as f:
    f.write(content)
print("AdminLayout updated.")
