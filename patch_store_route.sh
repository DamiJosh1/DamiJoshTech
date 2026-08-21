#!/bin/bash
sed -i '/<Route path="\/dropshipping" element={<Dropshipping />} \/>/a \          <Route path="\/admin" element={<AdminDashboard />} />' src/Store.tsx
