const fs = require('fs');

let code = fs.readFileSync('src/pages/OrderDetails.tsx', 'utf-8');

code = code.replace(
  /Track Another Order[\s\S]*?<\/button>/,
  "Track Another Order\n                </button>\n\n                {(order.fulfillmentStatus === 'Processing' || order.fulfillmentStatus === 'Pending Payment') && (\n                  <button onClick={() => alert('Order cancellation requested.')} className=\"w-full py-3 bg-white border-2 border-zinc-200 hover:border-error hover:text-error text-zinc-900 rounded-xl font-bold transition-colors mt-2\">\n                    Cancel Order\n                  </button>\n                )}"
);

fs.writeFileSync('src/pages/OrderDetails.tsx', code);
