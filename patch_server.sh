#!/bin/bash
cat << 'INNER_EOF' >> temp_server.ts

// CJ Dropshipping API Proxy
app.get('/api/dropshipping/products', async (req, res) => {
  try {
    const cjToken = process.env.CJ_ACCESS_TOKEN;
    if (!cjToken) {
      return res.status(500).json({ error: 'CJ Dropshipping access token not configured.' });
    }

    const { page = 1, size = 20, keyWord = '' } = req.query;

    const queryParams = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    
    if (keyWord) {
      queryParams.append('keyWord', String(keyWord));
    }

    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/list?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'CJ-Access-Token': cjToken
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('[CJ Dropshipping] Fetch Error:', error);
    res.status(500).json({ error: 'Failed to fetch dropshipping products' });
  }
});
INNER_EOF
sed -i '/app.post('"'"'\/api\/product-reviews'"'"'/i \
\n\/\/ CJ Dropshipping API Proxy\napp.get('"'"'\/api\/dropshipping\/products'"'"', async (req, res) => {\n  try {\n    const cjToken = process.env.CJ_ACCESS_TOKEN;\n    if (!cjToken) {\n      return res.status(500).json({ error: '"'"'CJ Dropshipping access token not configured.'"'"' });\n    }\n\n    const { page = 1, size = 20, keyWord = '"'"''"'"' } = req.query;\n    const queryParams = new URLSearchParams({\n      pageNum: String(page),\n      pageSize: String(size),\n    });\n    if (keyWord) {\n      queryParams.append('"'"'keyWord'"'"', String(keyWord));\n    }\n\n    const response = await fetch(`https:\/\/developers.cjdropshipping.com\/api2.0\/v1\/product\/list?${queryParams.toString()}`, {\n      method: '"'"'GET'"'"',\n      headers: {\n        '"'"'Content-Type'"'"': '"'"'application\/json'"'"',\n        '"'"'CJ-Access-Token'"'"': cjToken\n      }\n    });\n\n    const data = await response.json();\n    res.json(data);\n  } catch (error) {\n    console.error('"'"'[CJ Dropshipping] Fetch Error:'"'"', error);\n    res.status(500).json({ error: '"'"'Failed to fetch dropshipping products'"'"' });\n  }\n});\n' server.ts
