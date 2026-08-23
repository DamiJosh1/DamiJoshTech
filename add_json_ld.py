import sys

with open('index.html', 'r') as f:
    content = f.read()

json_ld = """
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SAJODA ELECTRONICS",
      "url": "https://sajodaelectronics.com",
      "logo": "https://sajodaelectronics.com/favicon.svg"
    }
    </script>
"""

content = content.replace("  </head>", f"{json_ld}  </head>")

with open('index.html', 'w') as f:
    f.write(content)
