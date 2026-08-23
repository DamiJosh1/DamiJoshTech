import sys

with open('src/components/Footer.tsx', 'r') as f:
    content = f.read()

content = content.replace("{ label: 'Help Center', path: '/support' }", "{ label: 'Help Center', path: '/help' }")
content = content.replace("{ label: 'Track Order', path: '/track' }", "{ label: 'Track Order', path: '/track-order' }")
content = content.replace("{ label: 'Refunds', path: '/refunds' }", "{ label: 'Refund Policy', path: '/returns' }")

with open('src/components/Footer.tsx', 'w') as f:
    f.write(content)
print("Footer links updated")
