const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Replace footer
const footerStart = code.indexOf('<footer className');
const footerEnd = code.lastIndexOf('</footer>') + 9;
const newFooter = `<footer className="bg-white border-t border-zinc-200 pt-20 pb-10">
        <div className="max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 mb-16">
            <div className="lg:col-span-1">
              <Logo className="h-8 mb-6" variant="full" />
              <p className="text-sm text-body-text leading-relaxed mb-6">Technology That Fits Your Life. Premium consumer electronics, gadgets, and home appliances designed for the modern world.</p>
              <div className="flex items-center gap-4">
                 {/* Social Icons Placeholders */}
                 <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-charcoal hover:bg-light-bg cursor-pointer transition-colors">in</div>
                 <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-charcoal hover:bg-light-bg cursor-pointer transition-colors">x</div>
                 <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center text-charcoal hover:bg-light-bg cursor-pointer transition-colors">ig</div>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-dark-text mb-6">SHOP</h4>
              <ul className="space-y-4 text-sm text-body-text">
                <li><button onClick={() => navigate('/shop')} className="hover:text-primary-blue transition-colors">All Products</button></li>
                <li><button onClick={() => navigate('/categories')} className="hover:text-primary-blue transition-colors">Gadgets</button></li>
                <li><button onClick={() => navigate('/categories')} className="hover:text-primary-blue transition-colors">Home Appliances</button></li>
                <li><button onClick={() => navigate('/categories')} className="hover:text-primary-blue transition-colors">Smart Living</button></li>
                <li><button onClick={() => navigate('/shop?q=new')} className="hover:text-primary-blue transition-colors">New Arrivals</button></li>
                <li><button onClick={() => navigate('/shop?q=best')} className="hover:text-primary-blue transition-colors">Best Sellers</button></li>
                <li><button onClick={() => navigate('/shop?q=deals')} className="hover:text-primary-blue transition-colors">Deals</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-dark-text mb-6">CUSTOMER CARE</h4>
              <ul className="space-y-4 text-sm text-body-text">
                <li><button className="hover:text-primary-blue transition-colors">Contact Us</button></li>
                <li><button className="hover:text-primary-blue transition-colors">FAQ</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Shipping & Delivery</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Returns & Refunds</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Track Order</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Help Center</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-dark-text mb-6">COMPANY</h4>
              <ul className="space-y-4 text-sm text-body-text">
                <li><button className="hover:text-primary-blue transition-colors">About SAJODA</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Our Story</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Terms & Conditions</button></li>
                <li><button className="hover:text-primary-blue transition-colors">Cookie Policy</button></li>
              </ul>
            </div>
            
            <div className="lg:col-span-1">
              <h4 className="font-bold text-dark-text mb-6">NEWSLETTER</h4>
              <p className="text-sm text-body-text mb-4">Get the latest products, offers and smart-living updates.</p>
              <div className="flex flex-col gap-3">
                <input type="email" placeholder="Email address" className="w-full bg-light-bg border border-border px-4 py-3 text-sm focus:outline-none focus:border-primary-blue transition-colors rounded-lg" />
                <button className="w-full bg-primary-blue text-white font-semibold text-sm py-3 rounded-lg hover:bg-secondary-blue transition-colors">SUBSCRIBE</button>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-body-text">
            <p>© {new Date().getFullYear()} SAJODA ELECTRONICS</p>
            <div className="flex gap-6">
              <span>Secure Payments</span>
              <span>Customer Support</span>
              <span>Fast Delivery</span>
            </div>
          </div>
        </div>
      </footer>`;

if (footerStart !== -1 && footerEnd !== -1) {
  code = code.substring(0, footerStart) + newFooter + code.substring(footerEnd);
  fs.writeFileSync('src/pages/Home.tsx', code);
}
