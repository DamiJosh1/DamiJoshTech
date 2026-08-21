const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf-8');

// Replace Hero Section
const heroStart = code.indexOf('<section className={`relative w-full min-h-[100dvh]');
const heroEnd = code.indexOf('</section>') + 10;
const newHero = `      {/* Premium Hero Section */}
      <section className="relative w-full min-h-[85vh] lg:min-h-[90vh] flex items-center bg-light-bg overflow-hidden pt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-light-bg via-light-bg/95 to-transparent z-10 hidden lg:block" />
          <img src="https://images.unsplash.com/photo-1600607686527-6fb886090705?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" alt="Premium Smart Home" className="w-full h-full object-cover object-right" />
        </div>
        <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 md:px-8">
          <div className="max-w-2xl flex flex-col items-start">
            <h1 className="text-[2.5rem] leading-[1.1] sm:text-5xl lg:text-7xl font-extrabold tracking-tight text-dark-text mb-6">
              Technology That Fits Your Life.
            </h1>
            <p className="text-base sm:text-lg lg:text-xl leading-relaxed text-body-text mb-10 max-w-xl">
              Premium consumer electronics, gadgets, and smart-living products designed for the modern world.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button onClick={() => navigate('/shop')} className="w-full sm:w-auto px-8 py-4 bg-primary-blue hover:bg-secondary-blue text-white rounded-lg font-semibold transition-colors flex items-center justify-center">
                SHOP NOW
              </button>
              <button onClick={() => navigate('/categories')} className="w-full sm:w-auto px-8 py-4 bg-white border border-border text-dark-text rounded-lg font-semibold hover:bg-light-bg transition-colors flex items-center justify-center">
                EXPLORE PRODUCTS
              </button>
            </div>
          </div>
        </div>
      </section>
`;

code = code.substring(0, heroStart) + newHero + code.substring(heroEnd);
fs.writeFileSync('src/pages/Home.tsx', code);
