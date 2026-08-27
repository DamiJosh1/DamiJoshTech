with open('server.ts', 'r') as f:
    content = f.read()

new_endpoints = """
// CJ Dropshipping Connection Status
app.get('/api/dropshipping/status', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.json({ status: 'DISCONNECTED', message: 'CJ_ACCESS_TOKEN not configured in environment.' });
    }
    // Ping categories as a health check
    const response = await fetch('https://developers.cjdropshipping.com/api2.0/v1/product/getCategory', {
      method: 'GET',
      headers: {
        'CJ-Access-Token': cjToken,
        'Content-Type': 'application/json'
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data.code === 200) {
        return res.json({ status: 'CONNECTED', lastCheck: new Date().toISOString() });
      } else {
        return res.json({ status: 'CONNECTION ERROR', message: data.message || 'API responded with error code' });
      }
    } else {
      return res.json({ status: 'CONNECTION ERROR', message: `HTTP ${response.status}` });
    }
  } catch (error: any) {
    console.error('CJ Dropshipping Status Error:', error);
    res.json({ status: 'CONNECTION ERROR', message: error.message || 'Failed to connect' });
  }
});
"""

# Insert before categories endpoint
content = content.replace("app.get('/api/dropshipping/categories', async (req, res) => {", new_endpoints + "\napp.get('/api/dropshipping/categories', async (req, res) => {")

with open('server.ts', 'w') as f:
    f.write(content)
print("Updated server.ts with dropshipping status")
