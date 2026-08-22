import React, { useEffect, useState } from 'react';
import { collection, doc, getDoc, setDoc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { Save, X, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id || id === 'new';

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    originalPrice: '',
    image: '',
    category: '',
    badge: '',
    cjSku: '',
    description: ''
  });

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'products', id as string));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              name: data.name || '',
              price: data.price?.toString() || '',
              originalPrice: data.originalPrice?.toString() || '',
              image: data.image || '',
              category: data.category || '',
              badge: data.badge || '',
              cjSku: data.cjSku || '',
              description: data.description || ''
            });
          } else {
            alert('Product not found');
            navigate('/admin/products');
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          alert('Failed to load product');
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      const productData = {
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : null,
        image: formData.image,
        category: formData.category.toLowerCase(),
        badge: formData.badge,
        cjSku: formData.cjSku,
        description: formData.description,
      };

      // Remove undefined/null properties if any (though we used null above which firestore allows if configured, otherwise we delete)
      if (productData.originalPrice === null) delete (productData as any).originalPrice;
      if (!productData.badge) delete (productData as any).badge;
      if (!productData.cjSku) delete (productData as any).cjSku;

      if (isNew) {
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp()
        });
      } else {
        await updateDoc(doc(db, 'products', id as string), productData);
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      alert('Failed to save product. Check permissions and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            to="/admin/products"
            className="p-2 -ml-2 text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              {isNew ? 'Add New Product' : 'Edit Product'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {isNew ? 'Create a new product listing in your store.' : 'Update product details and pricing.'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to="/admin/products"
            className="px-4 py-2 bg-white border border-zinc-300 text-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-50 transition-colors shadow-sm"
          >
            Cancel
          </Link>
          <button 
            type="submit"
            form="product-form"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isNew ? 'Save Product' : 'Update Product'}
          </button>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Basic Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Product Name *</label>
              <input 
                type="text" 
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. Premium Wireless Headphones"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-y"
                placeholder="Detailed product description..."
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Pricing</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Current Price ($) *</label>
                <input 
                  type="number" 
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">Original Price ($) (Optional)</label>
                <input 
                  type="number" 
                  name="originalPrice"
                  value={formData.originalPrice}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  placeholder="0.00"
                />
                <p className="text-xs text-zinc-500 mt-1">Leave blank if not on sale.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Media</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Image URL *</label>
              <input 
                type="url" 
                name="image"
                value={formData.image}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all mb-3"
                placeholder="https://example.com/image.jpg"
              />
              
              {/* Image Preview */}
              <div className="w-full aspect-square bg-zinc-100 rounded-lg border border-zinc-200 border-dashed flex items-center justify-center overflow-hidden relative">
                {formData.image ? (
                  <img src={formData.image} alt="Preview" className="w-full h-full object-cover" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <ImageIcon className="w-8 h-8 mb-2" />
                    <span className="text-xs font-medium">Image Preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Organization</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Category *</label>
              <input 
                type="text" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                placeholder="e.g. audio, accessories"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Badge (Optional)</label>
              <select
                name="badge"
                value={formData.badge}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                <option value="">None</option>
                <option value="New">New</option>
                <option value="Sale">Sale</option>
                <option value="Best Seller">Best Seller</option>
              </select>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-zinc-900 mb-4">Dropshipping (Optional)</h2>
            
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">CJ Dropshipping SKU</label>
              <input 
                type="text" 
                name="cjSku"
                value={formData.cjSku}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-white border border-zinc-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-mono"
                placeholder="e.g. CJABCDEF12345"
              />
              <p className="text-xs text-zinc-500 mt-1">Used for syncing inventory and fulfilling orders automatically.</p>
            </div>
          </div>

        </div>
      </form>
      
    </div>
  );
}
