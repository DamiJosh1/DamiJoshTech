import sys

with open('src/pages/ProductDetail.tsx', 'r') as f:
    content = f.read()

import_helmet = "import { Helmet } from 'react-helmet';"

json_ld = """
      <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org/",
            "@type": "Product",
            "name": "${product.name}",
            "image": "${galleryImages[0]}",
            "description": "${product.description}",
            "sku": "${product.cjSku || product.id}",
            "offers": {
              "@type": "Offer",
              "url": "https://sajodaelectronics.com/product/${product.id}",
              "priceCurrency": "USD",
              "price": "${product.price}",
              "itemCondition": "https://schema.org/NewCondition",
              "availability": "https://schema.org/InStock"
            }
          }
        `}
      </script>
"""

# Wait, we might not have react-helmet installed. Let's just render the script tag normally.
# Actually, rendering a script tag with dangerouslySetInnerHTML is safer in React.
json_ld_react = """
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Product",
            name: product.name,
            image: galleryImages[0],
            description: product.description,
            sku: product.cjSku || product.id,
            offers: {
              "@type": "Offer",
              url: `https://sajodaelectronics.com/product/${product.id}`,
              priceCurrency: activeCurrency?.code || "USD",
              price: product.price,
              itemCondition: "https://schema.org/NewCondition",
              availability: "https://schema.org/InStock"
            }
          })
        }}
      />
"""

content = content.replace("<Lightbox />", f"<Lightbox />\n{json_ld_react}")

with open('src/pages/ProductDetail.tsx', 'w') as f:
    f.write(content)
print("Product SEO added")
