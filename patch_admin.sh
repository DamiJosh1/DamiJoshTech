#!/bin/bash
cat << 'INNER_EOF' > src/pages/AdminDashboard.tsx
import React, { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../StoreContext';
import { db } from '../firebase';
import { Edit2, Trash2, Package, DollarSign, Users, ArrowRight, PieChart as PieChartIcon, ChevronDown, Filter } from 'lucide-react';
import { Product } from '../types';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

export default function AdminDashboard() {
  const { user, isDarkMode, products } = useContext(StoreContext)!;
  
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products'>('dashboard');
  const [isEditing, setIsEditing] = useState<Product | null>(null);
  
  // Basic Form State
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    description: ''
  });

  if (!user || user.email !== 'damijosh12@gmail.com') {
    return <Navigate to="/" replace />;
  }

  const handleEditClick = (p: Product) => {
    setIsEditing(p);
    setFormData({
      name: p.name,
      price: String(p.price),
      originalPrice: p.originalPrice ? String(p.originalPrice) : '',
      image: p.image,
      category: p.category,
      description: p.description || ''
    });
    setActiveTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if(window.confirm('Are you sure you want to delete this product?')) {
      const { deleteDoc, doc } = await import('firebase/firestore');
      await deleteDoc(doc(db, 'products', id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { addDoc, updateDoc, collection, doc } = await import('firebase/firestore');
    
    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
      image: formData.image,
      category: formData.category,
      description: formData.description
    };

    if (isEditing) {
      if (isEditing.id) {
        await updateDoc(doc(db, 'products', isEditing.id), productData);
      }
      setIsEditing(null);
    } else {
      await addDoc(collection(db, 'products'), productData);
    }
    
    setFormData({ name: '', price: '', originalPrice: '', image: '', category: '', description: '' });
  };

  // Mock Data for Charts
  const revenueData = [
    { name: 'Jan', revenue: 0, previous: 20 },
    { name: 'Feb', revenue: 15, previous: 30 },
    { name: 'Mar', revenue: 40, previous: 25 },
    { name: 'Apr', revenue: 30, previous: 45 },
    { name: 'May', revenue: 35, previous: 35 },
    { name: 'Jun', revenue: 45, previous: 25 },
    { name: 'Jul', revenue: 45, previous: 30 },
  ];

  const pieData = [
    { name: 'Q1', value: 13.1 },
    { name: 'Q2', value: 28.6 },
    { name: 'Q3', value: 28.0 },
    { name: 'Q4', value: 30.3 },
  ];
  
  const PIE_COLORS = ['#93c5fd', '#60a5fa', '#3b82f6', '#1d4ed8']; // Various shades of blue to match image

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className={`p-3 rounded-lg shadow-lg border ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-white border-slate-200'}`}>
          <p className="font-semibold mb-1">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name === 'revenue' || entry.name === 'previous' ? '$' : ''}{entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8 ${isDarkMode ? 'bg-zinc-950 text-white' : 'bg-slate-50 text-slate-900'} font-sans`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Custom Admin Top Nav (Pill style matching image) */}
        <div className={`flex items-center gap-2 p-1.5 rounded-full w-max mx-auto ${isDarkMode ? 'bg-zinc-900' : 'bg-white shadow-sm'}`}>
           <button 
             onClick={() => setActiveTab('dashboard')}
             className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
           >
             Dashboard
           </button>
           <button 
             onClick={() => setActiveTab('products')}
             className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'products' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
           >
             Products
           </button>
        </div>

        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2">Dashboard Overview</h1>
                <p className={`text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Monitor your business performance in real-time</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium ${isDarkMode ? 'bg-zinc-900 text-white' : 'bg-white text-slate-700 shadow-sm'}`}>
                  This Month <ChevronDown className="w-4 h-4" />
                </button>
                <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            {/* 4 Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Card 1: Total Revenue (Blue) */}
              <div className="p-6 rounded-[2rem] bg-blue-600 text-white flex flex-col justify-between h-[180px] shadow-lg shadow-blue-600/20">
                <div className="flex justify-between items-start">
                  <span className="text-blue-100/90 font-medium text-sm">Total Revenue</span>
                  <div className="w-10 h-10 rounded-full bg-white text-blue-600 flex items-center justify-center shadow-sm">
                     <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 tracking-tight">$24,580</div>
                  <div className="text-blue-100/90 text-xs">+12% from last month</div>
                </div>
              </div>

              {/* Card 2: Active Users */}
              <div className={`p-6 rounded-[2rem] flex flex-col justify-between h-[180px] ${isDarkMode ? 'bg-zinc-900/80 text-white' : 'bg-slate-50 text-slate-900'}`}>
                <div className="flex justify-between items-start">
                  <span className={`font-medium text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Active Users</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white text-zinc-900' : 'bg-slate-900 text-white'}`}>
                     <Users className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 tracking-tight">1,245</div>
                  <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>+8% growth</div>
                </div>
              </div>

              {/* Card 3: New Signups */}
              <div className={`p-6 rounded-[2rem] flex flex-col justify-between h-[180px] ${isDarkMode ? 'bg-zinc-900/80 text-white' : 'bg-slate-50 text-slate-900'}`}>
                 <div className="flex justify-between items-start">
                  <span className={`font-medium text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>New Signups</span>
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-600/20">
                     <ArrowRight className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 tracking-tight text-blue-600 dark:text-blue-500">320</div>
                  <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>+5% this week</div>
                </div>
              </div>

              {/* Card 4: Conversion Rate */}
              <div className={`p-6 rounded-[2rem] flex flex-col justify-between h-[180px] ${isDarkMode ? 'bg-zinc-900/80 text-white' : 'bg-slate-50 text-slate-900'}`}>
                 <div className="flex justify-between items-start">
                  <span className={`font-medium text-sm ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>Conversion Rate</span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-white text-zinc-900' : 'bg-slate-900 text-white'}`}>
                     <PieChartIcon className="w-5 h-5" />
                  </div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2 tracking-tight">4.8%</div>
                  <div className={`text-xs ${isDarkMode ? 'text-zinc-400' : 'text-slate-500'}`}>+1.2% increase</div>
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
               
               {/* Area/Line Chart */}
               <div className={`lg:col-span-2 p-6 rounded-[2rem] ${isDarkMode ? 'bg-zinc-900/80' : 'bg-slate-50'}`}>
                   <div className="h-[300px] w-full pt-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDarkMode ? '#3f3f46' : '#e2e8f0'} />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#a1a1aa' : '#94a3b8', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: isDarkMode ? '#a1a1aa' : '#94a3b8', fontSize: 12 }} />
                          <RechartsTooltip content={<CustomTooltip />} />
                          <Area type="monotone" dataKey="previous" stroke="#bfdbfe" strokeWidth={2} fill="none" />
                          <Area type="linear" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fill="none" />
                        </AreaChart>
                      </ResponsiveContainer>
                   </div>
               </div>

               {/* Donut Chart */}
               <div className={`p-8 rounded-[2rem] flex flex-col ${isDarkMode ? 'bg-zinc-900/80' : 'bg-slate-50'}`}>
                   <h3 className={`text-sm mb-4 ${isDarkMode ? 'text-zinc-400' : 'text-slate-600'}`}>Revenue Analytics</h3>
                   <div className="text-[2.5rem] font-bold mb-4 tracking-tight leading-none">$120</div>
                   <div>
                     <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full text-sm font-medium mb-6 transition-colors shadow-sm shadow-blue-600/20">
                       Payment
                     </button>
                   </div>
                   <div className="h-[200px] w-full mt-auto relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            stroke="none"
                          >
                            {pieData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                      {/* Fake legend overlay */}
                      <div className="absolute inset-0 pointer-events-none">
                         <div className="absolute top-2 right-4 text-[10px] text-slate-500 text-center leading-tight">Q1<br/>13.1%</div>
                         <div className="absolute top-1/2 -right-2 text-[10px] text-slate-500 text-center leading-tight">Q2<br/>28.6%</div>
                         <div className="absolute bottom-0 right-1/2 translate-x-1/2 text-[10px] text-slate-500 text-center leading-tight">Q3<br/>28.0%</div>
                         <div className="absolute top-1/2 -left-2 text-[10px] text-slate-500 text-center leading-tight">Q4<br/>30.3%</div>
                      </div>
                   </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className={`p-8 rounded-[2rem] border ${isDarkMode ? 'bg-zinc-900/50 border-white/10' : 'bg-white border-slate-200'}`}>
              <h2 className="text-xl font-bold mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Product Name</label>
                    <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Category</label>
                    <input required type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Price ($)</label>
                    <input required type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                  </div>
                  <div>
                    <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Original Price ($)</label>
                    <input type="number" step="0.01" value={formData.originalPrice} onChange={e => setFormData({...formData, originalPrice: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                  </div>
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Image URL</label>
                  <input required type="url" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                </div>
                <div>
                  <label className={`block text-sm font-medium mb-1.5 ${isDarkMode ? 'text-zinc-300' : 'text-slate-700'}`}>Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={`w-full px-4 py-2.5 rounded-xl border outline-none transition-colors focus:border-blue-500 ${isDarkMode ? 'bg-zinc-800 border-zinc-700' : 'bg-slate-50 border-slate-200 focus:bg-white'}`} />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button type="submit" className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-medium transition-colors shadow-sm">
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={() => { setIsEditing(null); setFormData({ name: '', price: '', originalPrice: '', image: '', category: '', description: '' }); }} className="px-8 py-3 bg-zinc-200 hover:bg-zinc-300 text-zinc-900 rounded-full font-medium transition-colors">
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Product List */}
            <div className="space-y-6">
              <h2 className="text-xl font-bold">Manage Products</h2>
              <div className={`rounded-3xl border overflow-hidden ${isDarkMode ? 'border-white/10' : 'border-slate-200'}`}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className={`${isDarkMode ? 'bg-zinc-900' : 'bg-slate-50'}`}>
                      <tr>
                        <th className="px-6 py-5 font-medium">Product</th>
                        <th className="px-6 py-5 font-medium">Price</th>
                        <th className="px-6 py-5 font-medium">Category</th>
                        <th className="px-6 py-5 font-medium text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {products.length === 0 ? (
                         <tr>
                           <td colSpan={4} className="px-6 py-12 text-center text-slate-500">No products found. Add one above.</td>
                         </tr>
                      ) : products.map(product => (
                        <tr key={product.id || product.name} className={`transition-colors ${isDarkMode ? 'hover:bg-zinc-900/50' : 'hover:bg-slate-50/50'}`}>
                          <td className="px-6 py-4 flex items-center gap-4 min-w-[250px]">
                            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover bg-zinc-100 shrink-0" />
                            <span className="font-medium truncate">{product.name}</span>
                          </td>
                          <td className="px-6 py-4 font-semibold text-blue-600">${product.price}</td>
                          <td className="px-6 py-4"><span className={`px-3 py-1.5 rounded-full text-xs font-medium ${isDarkMode ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-600'}`}>{product.category}</span></td>
                          <td className="px-6 py-4 text-right">
                            <button onClick={() => handleEditClick(product)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors mr-2">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
INNER_EOF
chmod +x patch_admin.sh
./patch_admin.sh