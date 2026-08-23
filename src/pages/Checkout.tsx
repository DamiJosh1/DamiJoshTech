import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../StoreContext';
import Logo from '../Logo';
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, ChevronRight, Check, CreditCard } from 'lucide-react';
import { collection, addDoc, serverTimestamp, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from '../firebase';

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, cartDiscount, activeCoupon, user, clearCart, formatPrice, countries, shippingMethods, taxRules, activeCountry, activeCurrency } = useStore();
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [contactData, setContactData] = useState({ email: user?.email || '', phone: '' });
  const [shippingData, setShippingData] = useState({
    firstName: '', lastName: '', address: '', apartment: '',
    city: '', state: '', zip: '', country: activeCountry?.code || 'US'
  });
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [paymentData, setPaymentData] = useState({ cardNumber: '', expiry: '', cvc: '', name: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);


  // Filter shipping methods by selected country
  const availableShippingMethods = shippingMethods.filter(m => m.active && m.countryCodes.includes(shippingData.country));
  
  // Set default shipping method if current one is not available
  useEffect(() => {
    if (availableShippingMethods.length > 0 && !availableShippingMethods.find(m => m.id === shippingMethod)) {
      setShippingMethod(availableShippingMethods[0].id as string);
    }
  }, [shippingData.country, availableShippingMethods, shippingMethod]);

  const selectedShipping = availableShippingMethods.find(m => m.id === shippingMethod);
  const shippingCost = selectedShipping ? selectedShipping.price : 0;

  // Calculate tax
  const taxRule = taxRules.find(t => t.active && t.countryCode === shippingData.country);
  const taxRate = taxRule ? taxRule.ratePercentage / 100 : 0;
  const tax = cartTotal * taxRate;

  const finalTotal = cartTotal + tax + shippingCost;


  if (cartItems.length === 0) {
    return (
      <div className="w-full min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-bold text-zinc-900 mb-4">Your cart is empty</h2>
        <button onClick={() => navigate('/shop')} className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold">Return to Shop</button>
      </div>
    );
  }

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) setStep(step + 1);
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate secure payment processing & external verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const orderId = `SAJ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      
      const orderData = {
        orderNumber: orderId,
        customerId: user?.uid || "guest",
        contact: contactData,
        customerEmail: contactData.email,
        customerName: `${contactData.firstName} ${contactData.lastName}`.trim(),
        customerPhone: contactData.phone,
        shippingAddress: shippingData,
        shippingMethod,
        items: cartItems.map(i => ({
          id: i.productId,
          name: i.productSnapshot.name,
          price: i.unitPrice,
          quantity: i.quantity,
          variantId: i.variantId || null
        })),
        subtotal: cartTotal,
        discount: cartDiscount,
        couponCode: activeCoupon ? activeCoupon.code : null,
        tax,
        shippingCost,
        totalAmount: finalTotal,
        currency: activeCurrency?.code || "USD",
        status: "Processing",
        paymentStatus: "Paid",
        fulfillmentStatus: "Submitted to CJ",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'orders'), orderData);
      if (user) {
        try {
          await addDoc(collection(db, 'notifications'), {
            userId: user.uid,
            type: 'ORDER_CONFIRMED',
            title: 'Order Confirmed',
            message: `Your order #${orderId} has been confirmed.`,
            read: false,
            link: '/account/orders',
            createdAt: serverTimestamp()
          });
          await addDoc(collection(db, 'email_logs'), {
            recipient: contactData.email,
            type: 'ORDER_CONFIRMED',
            subject: `Order Confirmation - #${orderId}`,
            status: 'sent',
            sentAt: serverTimestamp()
          });
        } catch(e) { console.error(e) }
      }
      
      // Update coupon usage if applicable
      if (activeCoupon && activeCoupon.id) {
        await updateDoc(doc(db, 'promotions', activeCoupon.id), {
          currentUsage: increment(1)
        });
      }
      
      clearCart();
      navigate(`/order-confirmation/${orderId}`);
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An error occurred while processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="w-full border-b border-zinc-200 bg-white sticky top-0 z-40 hidden md:block">
        <div className="max-w-[1440px] mx-auto px-6 h-20 flex items-center justify-between">
          <h1 className="text-2xl font-black tracking-tighter text-zinc-900 cursor-pointer" onClick={() => navigate('/')}>SAJODA.</h1>
          <div className="flex items-center gap-2 text-sm font-semibold text-zinc-500">
            <Lock className="w-4 h-4 text-emerald-500" />
            Secure Checkout
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto flex flex-col-reverse md:flex-row min-h-[calc(100vh-80px)]">
        
        {/* Left Col - Form */}
        <div className="w-full md:w-[55%] lg:w-[60%] px-6 py-8 md:p-12 lg:p-16">
          {/* Progress Mobile */}
          <div className="md:hidden flex items-center gap-2 text-xs font-bold text-zinc-400 mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide pb-2">
            <span className={step >= 1 ? 'text-zinc-900' : ''}>CONTACT</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step >= 2 ? 'text-zinc-900' : ''}>SHIPPING</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step >= 3 ? 'text-zinc-900' : ''}>METHOD</span>
            <ChevronRight className="w-3 h-3" />
            <span className={step >= 4 ? 'text-zinc-900' : ''}>PAYMENT</span>
          </div>

          <form onSubmit={step === 4 ? handlePayment : handleNextStep} className="max-w-xl mx-auto md:mx-0">
            
            {/* Step 1: Contact */}
            {step === 1 && (
              <div className="animate-fade-in-up">
                <h2 className="text-2xl font-extrabold text-zinc-900 mb-6">Contact Information</h2>
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Email Address</label>
                    <input type="email" required value={contactData.email} onChange={e => setContactData({...contactData, email: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none transition-colors" placeholder="your@email.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Phone Number (For shipping updates)</label>
                    <input type="tel" required value={contactData.phone} onChange={e => setContactData({...contactData, phone: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none transition-colors" placeholder="+1 (555) 000-0000" />
                  </div>
                  <button type="submit" className="mt-4 w-full py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg active:scale-[0.98]">
                    Continue to Shipping <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping */}
            {step === 2 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-zinc-900">Shipping Address</h2>
                  <button type="button" onClick={() => setStep(1)} className="text-sm font-semibold text-primary-blue hover:underline">Edit Contact</button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">First Name</label>
                    <input required value={shippingData.firstName} onChange={e => setShippingData({...shippingData, firstName: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="Jane" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Last Name</label>
                    <input required value={shippingData.lastName} onChange={e => setShippingData({...shippingData, lastName: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="Doe" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Address</label>
                    <input required value={shippingData.address} onChange={e => setShippingData({...shippingData, address: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="123 Main St" />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Apartment, suite, etc. (optional)</label>
                    <input value={shippingData.apartment} onChange={e => setShippingData({...shippingData, apartment: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="Apt 4B" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">City</label>
                    <input required value={shippingData.city} onChange={e => setShippingData({...shippingData, city: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="New York" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">State/Province</label>
                    <input required value={shippingData.state} onChange={e => setShippingData({...shippingData, state: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="NY" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">ZIP Code</label>
                    <input required value={shippingData.zip} onChange={e => setShippingData({...shippingData, zip: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none" placeholder="10001" />
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-bold text-zinc-700 mb-1.5">Country</label>
                    <select required value={shippingData.country} onChange={e => setShippingData({...shippingData, country: e.target.value})} className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-xl focus:border-zinc-900 outline-none appearance-none">
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="mt-6 w-full py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg active:scale-[0.98]">
                  Continue to Delivery <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 3: Shipping Method */}
            {step === 3 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-zinc-900">Shipping Method</h2>
                  <button type="button" onClick={() => setStep(2)} className="text-sm font-semibold text-primary-blue hover:underline">Edit Address</button>
                </div>
                <div className="flex flex-col gap-3">
                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'standard' ? 'border-zinc-900 bg-zinc-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'standard' ? 'border-zinc-900' : 'border-zinc-300'}`}>
                        {shippingMethod === 'standard' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                      </div>
                      <div>
                        <span className="block font-bold text-zinc-900">Standard Delivery</span>
                        <span className="block text-sm text-zinc-500">Estimated 7-15 business days</span>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900">{cartTotal > 100 ? 'Free' : '$15.00'}</span>
                    <input type="radio" name="shipping" value="standard" checked={shippingMethod === 'standard'} onChange={() => setShippingMethod('standard')} className="hidden" />
                  </label>

                  <label className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${shippingMethod === 'express' ? 'border-zinc-900 bg-zinc-50/50' : 'border-zinc-200 hover:border-zinc-300'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${shippingMethod === 'express' ? 'border-zinc-900' : 'border-zinc-300'}`}>
                        {shippingMethod === 'express' && <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />}
                      </div>
                      <div>
                        <span className="block font-bold text-zinc-900">Express Delivery</span>
                        <span className="block text-sm text-zinc-500">Estimated 3-5 business days</span>
                      </div>
                    </div>
                    <span className="font-bold text-zinc-900">$25.00</span>
                    <input type="radio" name="shipping" value="express" checked={shippingMethod === 'express'} onChange={() => setShippingMethod('express')} className="hidden" />
                  </label>
                </div>
                <button type="submit" className="mt-6 w-full py-4 bg-zinc-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-800 transition-colors shadow-lg active:scale-[0.98]">
                  Continue to Payment <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Step 4: Payment */}
            {step === 4 && (
              <div className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-extrabold text-zinc-900">Payment</h2>
                  <button type="button" onClick={() => setStep(3)} className="text-sm font-semibold text-primary-blue hover:underline">Edit Method</button>
                </div>
                <p className="text-sm text-zinc-500 mb-6">All transactions are secure and encrypted.</p>
                
                <div className="border border-zinc-200 rounded-2xl overflow-hidden mb-6 bg-white">
                  {/* Credit Card Option */}
                  <div className="p-4 border-b border-zinc-200 bg-zinc-50/50 flex flex-col gap-4">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <div className="w-5 h-5 rounded-full border-2 border-zinc-900 flex items-center justify-center">
                        <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full" />
                      </div>
                      <span className="font-bold text-zinc-900">Credit or Debit Card</span>
                    </label>
                    <div className="pl-8 grid grid-cols-2 gap-4">
                      <div className="col-span-2 relative">
                        <input required placeholder="Card Number" className="w-full p-3.5 pl-12 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-900" />
                        <CreditCard className="w-5 h-5 text-zinc-400 absolute left-4 top-1/2 -translate-y-1/2" />
                      </div>
                      <input required placeholder="MM / YY" className="p-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-900" />
                      <input required placeholder="CVC" type="password" maxLength={4} className="p-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-900" />
                      <input required placeholder="Name on Card" className="col-span-2 p-3.5 bg-white border border-zinc-200 rounded-xl outline-none focus:border-zinc-900" />
                    </div>
                  </div>
                  {/* Fake Alternative Option */}
                  <label className="flex items-center gap-3 p-4 cursor-pointer hover:bg-zinc-50 transition-colors">
                    <div className="w-5 h-5 rounded-full border-2 border-zinc-300 flex items-center justify-center" />
                    <span className="font-bold text-zinc-900">PayPal</span>
                  </label>
                </div>

                <div className="bg-zinc-50 p-4 rounded-xl mb-6">
                  <h3 className="font-bold text-zinc-900 text-sm mb-2">Billing Address</h3>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="w-5 h-5 rounded border border-zinc-300 bg-zinc-900 flex items-center justify-center text-white"><Check className="w-3 h-3" /></div>
                    <span className="text-sm text-zinc-700">Same as shipping address</span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  disabled={isProcessing}
                  className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl active:scale-[0.98] ${isProcessing ? 'bg-zinc-400 text-white cursor-not-allowed' : 'bg-zinc-900 hover:bg-zinc-800 text-white shadow-zinc-900/20'}`}
                >
                  {isProcessing ? 'Processing Securely...' : `Pay ${formatPrice(finalTotal)}`}
                  {!isProcessing && <Lock className="w-4 h-4" />}
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Right Col - Summary */}
        <div className="w-full md:w-[45%] lg:w-[40%] bg-zinc-50/50 md:bg-zinc-50 border-l border-zinc-200 px-6 py-8 md:p-12 lg:p-16">
          <div className="sticky top-24 max-w-sm mx-auto md:mx-0">
            <h2 className="text-xl font-extrabold text-zinc-900 mb-6 md:mb-8">Order Summary</h2>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-xl bg-white border border-zinc-200 overflow-hidden shrink-0">
                    <img src={item.productSnapshot.image} alt="" className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-zinc-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border border-white z-10">{item.quantity}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-zinc-900 line-clamp-1">{item.productSnapshot.name}</h4>
                    {item.variantSnapshot && <span className="text-xs text-zinc-500">{item.variantSnapshot.name}</span>}
                  </div>
                  <span className="text-sm font-bold text-zinc-900 shrink-0">{formatPrice(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-col gap-3 py-6 border-y border-zinc-200 text-sm mb-6">
              <div className="flex justify-between text-zinc-600">
                <span>Subtotal</span>
                <span className="font-semibold text-zinc-900">{formatPrice(cartTotal)}</span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-error font-medium">
                  <span>Discount {activeCoupon ? `(${activeCoupon.code})` : ''}</span>
                  <span>-{formatPrice(cartDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-zinc-600">
                <span>Shipping</span>
                <span className="font-semibold text-zinc-900">{shippingCost === 0 ? 'Free' : `${formatPrice(shippingCost)}`}</span>
              </div>
              <div className="flex justify-between text-zinc-600">
                <span>Estimated Tax</span>
                <span className="font-semibold text-zinc-900">{formatPrice(tax)}</span>
              </div>
            </div>

            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-bold text-zinc-900">Total</span>
              <span className="text-2xl font-extrabold text-zinc-900">{formatPrice(finalTotal)}</span>
            </div>

            <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500 justify-center bg-white p-4 rounded-xl border border-zinc-200">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> SSL Encrypted Checkout
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
