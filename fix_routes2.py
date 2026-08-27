import re

with open('src/Store.tsx', 'r') as f:
    content = f.read()

routes = """
            <Route path="cjdropshipping" element={<AdminCJDropshippingLayout />}>
              <Route index element={<AdminCJDropshippingDashboard />} />
              <Route path="products" element={<AdminCJProducts />} />
              <Route path="orders" element={<AdminCJOrders />} />
              <Route path="sync" element={<AdminCJSync />} />
              <Route path="logs" element={<AdminCJLogs />} />
            </Route>

            <Route path="ai" element={<AdminAiLayout />}>
              <Route index element={<AdminAiDashboard />} />
              <Route path="tasks" element={<AdminAiTasks />} />
              <Route path="products" element={<AdminAiProducts />} />
              <Route path="trends" element={<AdminAiTrends />} />
              <Route path="markets" element={<AdminAiMarkets />} />
              <Route path="approvals" element={<AdminAiApprovals />} />
              <Route path="activity" element={<AdminAiActivity />} />
              <Route path="settings" element={<AdminAiSettings />} />
            </Route>
"""

content = content.replace('<Route path="cjdropshipping" element={<AdminComingSoon />} />', routes)

with open('src/Store.tsx', 'w') as f:
    f.write(content)
print("Updated Store.tsx")
