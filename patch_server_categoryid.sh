#!/bin/bash
sed -i 's/const { page = 1, size = 20, keyWord = '"'"''"'"' } = req.query;/const { page = 1, size = 20, keyWord = '"'"''"'"', categoryId = '"'"''"'"' } = req.query;/g' server.ts
sed -i '/queryParams.append('"'"'keyWord'"'"', String(keyWord));/a \
    }\n    if (categoryId) {\n      queryParams.append('"'"'categoryId'"'"', String(categoryId));' server.ts
