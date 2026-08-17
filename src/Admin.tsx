import React, { useEffect, useState, useRef } from 'react';
import { collection, query, orderBy, onSnapshot, updateDoc, doc, serverTimestamp, addDoc, deleteDoc } from 'firebase/firestore';
import { signInWithPopup, GoogleAuthProvider, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { db, auth } from './firebase';
import { Package, Truck, CheckCircle, LogOut, Box, MessageSquare, ShoppingCart, Plus, Trash2, Send } from 'lucide-react';

export default function Admin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'ai'>('orders');

  // Product form state
  const [newProduct, setNewProduct] = useState({ name: '', price: '', originalPrice: '', image: '', category: '', badge: '', cjSku: '' });

  // Chat state
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user || user.email !== 'damijosh12@gmail.com') return;

    // Fetch orders
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      setOrders(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Orders connection error:", error);
    });

    // Fetch products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => {
      console.error("Products connection error:", error);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, [user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, new GoogleAuthProvider());
    } catch (e) {
      console.error('Login failed', e);
    }
  };

  const handleLogout = () => signOut(auth);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status: newStatus, updatedAt: serverTimestamp() });
    } catch (e) {
      console.error('Failed to update status:', e);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'products'), {
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : null,
        image: newProduct.image,
        category: newProduct.category,
        badge: newProduct.badge,
        cjSku: newProduct.cjSku,
        createdAt: serverTimestamp()
      });
      setNewProduct({ name: '', price: '', originalPrice: '', image: '', category: '', badge: '', cjSku: '' });
      alert('Product added successfully!');
    } catch (e) {
      console.error('Error adding product', e);
      alert('Failed to add product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.error('Error deleting product', e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    
    const userMsg = chatInput;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'ai', text: data.text }]);
    } catch (e) {
      console.error('Chat error', e);
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I encountered an error. Please try again.' }]);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">Loading...</div>;

  if (!user || user.email !== 'damijosh12@gmail.com') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-950 text-white px-4">
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-zinc-400 mb-8 text-center max-w-sm">Please log in with your authorized admin email.</p>
        <button onClick={handleLogin} className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-500 transition-colors">
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-xl font-bold tracking-tight"><span className="text-blue-500">Vora</span>Tech</h1>
          <p className="text-xs text-zinc-400 mt-1">Admin Dashboard</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            <ShoppingCart className="w-4 h-4" /> Orders
          </button>
          <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'products' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            <Box className="w-4 h-4" /> Products
          </button>
          <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'ai' ? 'bg-blue-600 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
            <MessageSquare className="w-4 h-4" /> AI Assistant
          </button>
        </nav>
        <div className="p-4 border-t border-zinc-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-zinc-400 hover:text-white transition-colors">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold">Incoming Orders</h2>
                <div className="bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-md">
                  <span className="text-sm text-zinc-400">Total Revenue: </span>
                  <span className="font-semibold">${orders.reduce((sum, o) => sum + o.totalAmount, 0).toFixed(2)}</span>
                </div>
              </div>
              <div className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
                {orders.length === 0 ? (
                  <div className="p-8 text-center text-zinc-500">No orders received yet.</div>
                ) : (
                  <ul className="divide-y divide-zinc-800">
                    {orders.map(order => (
                      <li key={order.id} className="p-6 flex flex-col md:flex-row gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' : order.status === 'processing' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>{order.status.toUpperCase()}</span>
                            <span className="text-sm text-zinc-500">{order.createdAt?.toDate ? order.createdAt.toDate().toLocaleString() : 'Just now'}</span>
                          </div>
                          <h3 className="text-lg font-medium">{order.customerName}</h3>
                          <p className="text-sm text-zinc-400">{order.customerEmail} {order.customerPhone && `• ${order.customerPhone}`}</p>
                          <div className="mt-4 bg-zinc-950 p-3 rounded-md text-sm border border-zinc-800 text-zinc-300">{order.shippingAddress}</div>
                        </div>
                        <div className="flex-1 bg-zinc-950 p-4 rounded-md border border-zinc-800">
                          <ul className="space-y-2 mb-4">
                            {order.items?.map((item: any, i: number) => (
                              <li key={i} className="flex justify-between text-sm text-zinc-300">
                                <span>{item.quantity}x {item.name}</span>
                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                              </li>
                            ))}
                          </ul>
                          <div className="border-t border-zinc-800 pt-2 flex justify-between font-medium">
                            <span>Total</span>
                            <span>${order.totalAmount?.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2 w-48">
                          <button onClick={() => updateOrderStatus(order.id, 'pending')} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${order.status === 'pending' ? 'bg-zinc-800 text-white' : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}><Package className="w-4 h-4" /> Pending</button>
                          <button onClick={() => updateOrderStatus(order.id, 'processing')} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${order.status === 'processing' ? 'bg-blue-600 text-white' : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}><Truck className="w-4 h-4" /> Processing</button>
                          <button onClick={() => updateOrderStatus(order.id, 'fulfilled')} className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors ${order.status === 'fulfilled' ? 'bg-green-600 text-white' : 'bg-zinc-900 border border-zinc-700 text-zinc-400 hover:bg-zinc-800'}`}><CheckCircle className="w-4 h-4" /> Fulfilled</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold">Product Management</h2>
              
              <form onSubmit={handleAddProduct} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><h3 className="text-lg font-medium mb-2">Add New Product</h3></div>
                <input required placeholder="Product Name" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
                <input required placeholder="Selling Price (USD)" type="number" step="0.01" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
                <input placeholder="Original Price (Optional)" type="number" step="0.01" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.originalPrice} onChange={e => setNewProduct({...newProduct, originalPrice: e.target.value})} />
                <input required placeholder="Image URL" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
                <input required placeholder="Category (e.g. Gadgets)" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} />
                <input placeholder="Badge (e.g. Sale, Trending)" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.badge} onChange={e => setNewProduct({...newProduct, badge: e.target.value})} />
                <input required placeholder="CJ Dropshipping SKU" className="bg-zinc-950 border border-zinc-800 rounded p-2 text-sm" value={newProduct.cjSku} onChange={e => setNewProduct({...newProduct, cjSku: e.target.value})} />
                <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded text-sm font-medium flex justify-center items-center gap-2 mt-2"><Plus className="w-4 h-4"/> Add Product</button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map(p => (
                  <div key={p.id} className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 flex flex-col gap-3">
                    <img src={p.image} alt={p.name} className="w-full h-40 object-cover rounded bg-zinc-950" />
                    <div>
                      <h4 className="font-medium text-sm line-clamp-1">{p.name}</h4>
                      <p className="text-zinc-400 text-xs mt-1">SKU: {p.cjSku}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-blue-400">${p.price}</span>
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-400 hover:text-red-300 p-1"><Trash2 className="w-4 h-4"/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="h-[calc(100vh-4rem)] flex flex-col max-w-4xl mx-auto border border-zinc-800 rounded-lg bg-zinc-900 overflow-hidden">
              <div className="p-4 border-b border-zinc-800 bg-zinc-950">
                <h2 className="font-medium flex items-center gap-2"><MessageSquare className="w-5 h-5 text-blue-500"/> AI Business Assistant</h2>
                <p className="text-xs text-zinc-500 mt-1">Ask for SEO descriptions, pricing advice, or marketing ideas.</p>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                  <div className="h-full flex items-center justify-center text-zinc-500 text-sm">
                    Send a message to start chatting with your AI assistant.
                  </div>
                )}
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-zinc-800 text-zinc-300'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t border-zinc-800 bg-zinc-950 flex gap-2">
                <input
                  type="text"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask the AI Assistant..."
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-blue-500"
                />
                <button type="submit" disabled={!chatInput.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
