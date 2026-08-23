import sys

with open('src/pages/ContentPage.tsx', 'r') as f:
    content = f.read()

content = content.replace("'about': {", """'why-sajoda': {
    title: 'Why SAJODA',
    content: <div className="space-y-4"><p>SAJODA ELECTRONICS brings you the very best of technology with an unwavering commitment to quality and service.</p></div>
  },
  'careers': {
    title: 'Careers',
    content: <div className="space-y-4"><p>Join our mission to power the world with technology. Check our open positions on LinkedIn.</p></div>
  },
  'cookies': {
    title: 'Cookie Policy',
    content: <div className="space-y-4"><p>We use essential cookies to make our store work and analytics cookies to improve your experience.</p></div>
  },
  'warranty': {
    title: 'Warranty Policy',
    content: <div className="space-y-4"><p>All SAJODA purchases are backed by a minimum 1-year manufacturer warranty.</p></div>
  },
  'about': {""")

with open('src/pages/ContentPage.tsx', 'w') as f:
    f.write(content)
print("ContentPage updated")
