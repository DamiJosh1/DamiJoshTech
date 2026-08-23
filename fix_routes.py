import sys

with open('src/Store.tsx', 'r') as f:
    content = f.read()

content_pages = """
          <Route path="/help" element={<ContentPage />} />
          <Route path="/faq" element={<ContentPage />} />
          <Route path="/contact" element={<ContentPage />} />
          <Route path="/shipping" element={<ContentPage />} />
          <Route path="/returns" element={<ContentPage />} />
          <Route path="/privacy" element={<ContentPage />} />
          <Route path="/terms" element={<ContentPage />} />
          <Route path="/about" element={<ContentPage />} />
          
          <Route path="/dropshipping" element={<Dropshipping />} />"""

content = content.replace('<Route path="/dropshipping" element={<Dropshipping />} />', content_pages)

admin_sys_health = """
            <Route path="analytics" element={<AdminComingSoon />} />
            <Route path="notifications" element={<AdminCommunications />} />
            <Route path="settings" element={<AdminComingSoon />} />
            <Route path="system-health" element={<AdminSystemHealth />} />
"""
content = content.replace("""            <Route path="analytics" element={<AdminComingSoon />} />
            <Route path="notifications" element={<AdminCommunications />} />
            <Route path="settings" element={<AdminComingSoon />} />""", admin_sys_health)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Routes updated")
