import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc, updateDoc, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase';
import { useStore } from '../../StoreContext';
import { 
  ArrowLeft, Save, Image as ImageIcon, X, Plus, 
  Trash2, GripVertical, CheckCircle2, AlertTriangle, ExternalLink, 
  Sparkles, RefreshCw, Box, Tag, Globe, Settings, Eye, Copy, Archive, ShieldCheck
} from 'lucide-react';

export default function AdminProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatPrice } = useStore();
  
  const isNew = !id || id === 'new';
  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showError, setShowError] = useState('');
  const [showSuccess, setShowSuccess] = useState('');
  
  const [formData, setFormData] = useState<any>({
    name: '',
    shortDescription: '',
    description: '',
    brand: '',
    tags: [],
    tagInput: '',
    
    image: '',
    images: [],
    
    price: '',
    originalPrice: '',
    costPrice: '',
    
    inventory: '',
    lowStockThreshold: '5',
    
    category: '',
    subCategory: '',
    
    sku: '',
    barcode: '',
    
    weight: '',
    dimensions: { length: '', width: '', height: '' },
    
    seoTitle: '',
    seoDescription: '',
    slug: '',
    
    condition: 'new',
    conditionGrade: 'Brand New - Factory Sealed',
    newPrice: '',
    usedPrice: '',
    warrantyInfo: '1-Year Sajoda Official Warranty',

    // Private Admin Sourcing Intelligence
    sourcingHub: 'Alaba International Market Electronics Distribution Hub (Lagos)',
    baseCost: '',
    ownerCommission: '15000',
    commissionNote: '',
    
    status: 'draft',
    
    cjSku: '',
    cjProductId: '',
    source: 'manual',
    
    variants: [],
    options: []
  });

  useEffect(() => {
    if (!isNew) {
      const fetchProduct = async () => {
        try {
          const docSnap = await getDoc(doc(db, 'products', id as string));
          if (docSnap.exists()) {
            const data = docSnap.data();
            setFormData({
              ...data,
              price: data.price?.toString() || '',
              originalPrice: data.originalPrice?.toString() || '',
              costPrice: data.costPrice?.toString() || '',
              newPrice: data.newPrice?.toString() || '',
              usedPrice: data.usedPrice?.toString() || '',
              condition: data.condition || 'new',
              conditionGrade: data.conditionGrade || (data.condition === 'used' ? 'Certified Pre-Owned - Grade A' : 'Brand New - Factory Sealed'),
              warrantyInfo: data.warrantyInfo || (data.condition === 'used' ? '90-Day Sajoda Certified Guarantee' : '1-Year Sajoda Official Warranty'),
              sourcingHub: data.sourcingHub || (data.category === 'Home Appliances' ? 'Alaba International Market Electronics Distribution Hub (Lagos)' : 'Computer Village Ikeja Tech Hub (Lagos)'),
              baseCost: data.baseCost?.toString() || data.costPrice?.toString() || '',
              ownerCommission: data.ownerCommission?.toString() || '15000',
              commissionNote: data.commissionNote || '',
              inventory: data.inventory?.toString() || '',
              lowStockThreshold: data.lowStockThreshold?.toString() || '5',
              weight: data.weight?.toString() || '',
              dimensions: data.dimensions || { length: '', width: '', height: '' },
              tags: data.tags || [],
              tagInput: '',
              images: data.images || (data.image ? [data.image] : []),
              image: data.image || (data.images && data.images.length > 0 ? data.images[0] : ''),
              status: data.status || (data.active === false ? 'archived' : 'active'),
              variants: data.variants || [],
              options: data.options || []
            });
          } else {
            navigate('/admin/products');
          }
        } catch (error) {
          console.error("Error fetching product:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProduct();
    }
  }, [id, isNew, navigate]);

  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const handleAiAutoFill = async () => {
    let queryPrompt = formData.name?.trim();
    if (!queryPrompt) {
      const userPrompt = window.prompt('Enter product name or concept (e.g. "Smart Air Fryer 6L with Digital Touch"):');
      if (!userPrompt) return;
      queryPrompt = userPrompt;
    }

    setIsAiGenerating(true);
    setShowError('');
    setShowSuccess('');

    try {
      const res = await fetch('/api/ai/generate-single-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: queryPrompt, category: formData.category })
      });
      const data = await res.json();
      if (data.success && data.product) {
        const p = data.product;
        setFormData((prev: any) => ({
          ...prev,
          name: p.name || prev.name || queryPrompt,
          slug: generateSlug(p.name || prev.name || queryPrompt),
          shortDescription: p.shortDescription || prev.shortDescription,
          description: p.description || prev.description,
          price: p.price?.toString() || prev.price || '99.99',
          originalPrice: p.originalPrice?.toString() || prev.originalPrice || '129.99',
          category: p.category || prev.category || 'Home Appliances',
          brand: p.brand || prev.brand || 'Sajoda',
          tags: p.tags || prev.tags || [],
          image: p.image || prev.image,
          images: p.images || (p.image ? [p.image] : prev.images),
          inventory: p.stockCount?.toString() || prev.inventory || '35'
        }));
        setShowSuccess('✨ Product successfully auto-generated by AI!');
      } else {
        throw new Error(data.error || 'Failed to generate');
      }
    } catch (err: any) {
      console.error(err);
      setShowError('Failed to generate product with AI: ' + (err.message || 'Error'));
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      dimensions: { ...prev.dimensions, [name]: value }
    }));
  };

  const generateSlug = (name?: string) => {
    return (name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev: any) => ({
      ...prev,
      name,
      slug: prev.slug && !isNew ? prev.slug : generateSlug(name)
    }));
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && formData.tagInput.trim()) {
      e.preventDefault();
      if (!formData.tags.includes(formData.tagInput.trim())) {
        setFormData((prev: any) => ({
          ...prev,
          tags: [...prev.tags, prev.tagInput.trim()],
          tagInput: ''
        }));
      } else {
        setFormData((prev: any) => ({ ...prev, tagInput: '' }));
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      tags: prev.tags.filter((t: string) => t !== tagToRemove)
    }));
  };

  const addImageUrl = () => {
    const url = prompt('Enter image URL:');
    if (url && url.startsWith('http')) {
      setFormData((prev: any) => ({
        ...prev,
        images: [...prev.images, url],
        image: prev.images.length === 0 ? url : prev.image
      }));
    }
  };

  const removeImage = (index: number) => {
    setFormData((prev: any) => {
      const newImages = [...prev.images];
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages,
        image: prev.image === prev.images[index] ? (newImages[0] || '') : prev.image
      };
    });
  };

  const setPrimaryImage = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      image: prev.images[index]
    }));
  };

  // Calculations
  const sellPrice = parseFloat(formData.price) || 0;
  const costPrice = parseFloat(formData.costPrice) || 0;
  const profit = sellPrice - costPrice;
  const margin = sellPrice > 0 ? (profit / sellPrice) * 100 : 0;

  const validateForm = () => {
    if (!formData.name.trim()) return "Product name is required.";
    if (!formData.price || parseFloat(formData.price) <= 0) return "Valid price is required.";
    return null;
  };

  const handleSave = async (publishStatus?: string) => {
    setShowError('');
    setShowSuccess('');
    
    const error = validateForm();
    if (error) {
      setShowError(error);
      window.scrollTo(0, 0);
      return;
    }

    const targetStatus = publishStatus || formData.status;
    
    if (publishStatus) setIsPublishing(true);
    else setIsSaving(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        shortDescription: formData.shortDescription,
        price: parseFloat(formData.price) || 0,
        originalPrice: parseFloat(formData.originalPrice) || null,
        costPrice: parseFloat(formData.costPrice) || null,
        // Private Admin Sourcing & Commission Data
        sourcingHub: formData.sourcingHub || 'Alaba International Market Electronics Distribution Hub (Lagos)',
        baseCost: parseFloat(formData.baseCost) || parseFloat(formData.costPrice) || null,
        ownerCommission: parseFloat(formData.ownerCommission) || 15000,
        commissionNote: formData.commissionNote || '',
        condition: formData.condition || 'new',
        conditionGrade: formData.conditionGrade || (formData.condition === 'used' ? 'Certified Pre-Owned - Grade A' : 'Brand New - Factory Sealed'),
        newPrice: parseFloat(formData.newPrice) || (formData.condition === 'new' ? parseFloat(formData.price) : null),
        usedPrice: parseFloat(formData.usedPrice) || (formData.condition === 'used' ? parseFloat(formData.price) : null),
        warrantyInfo: formData.warrantyInfo || (formData.condition === 'used' ? '90-Day Sajoda Certified Guarantee' : '1-Year Sajoda Official Warranty'),
        image: formData.image || (formData.images.length > 0 ? formData.images[0] : ''),
        images: formData.images,
        category: formData.category,
        subCategory: formData.subCategory,
        brand: formData.brand,
        tags: formData.tags,
        inventory: formData.inventory !== '' ? parseInt(formData.inventory) : null,
        lowStockThreshold: parseInt(formData.lowStockThreshold) || 5,
        sku: formData.sku,
        barcode: formData.barcode,
        weight: parseFloat(formData.weight) || null,
        dimensions: formData.dimensions,
        seoTitle: formData.seoTitle,
        seoDescription: formData.seoDescription,
        slug: formData.slug || generateSlug(formData.name),
        status: targetStatus,
        cjSku: formData.cjSku,
        cjProductId: formData.cjProductId,
        source: formData.source || 'manual',
        updatedAt: serverTimestamp(),
      };

      if (isNew) {
        const docRef = await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        navigate(`/admin/products/${docRef.id}`, { replace: true });
        setShowSuccess('Product created successfully.');
      } else {
        await updateDoc(doc(db, 'products', id as string), productData);
        setFormData((prev: any) => ({ ...prev, status: targetStatus }));
        setShowSuccess('Product saved successfully.');
      }
    } catch (err: any) {
      console.error("Save error:", err);
      setShowError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
      setIsPublishing(false);
      setTimeout(() => setShowSuccess(''), 3000);
    }
  };

  const handleArchive = async () => {
    if (window.confirm("Are you sure you want to archive this product? It will be hidden from the storefront.")) {
      await handleSave('archived');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-zinc-300 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full pb-24 lg:pb-12 animate-fade-in-up">
      
      {/* Notifications */}
      {showError && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex flex-col">
            <span className="font-bold text-sm">Cannot save product</span>
            <span className="text-sm mt-1">{showError}</span>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-bold text-sm">{showSuccess}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex flex-col gap-2">
          <Link to="/admin/products" className="flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-zinc-900 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Back to Products
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-zinc-900 tracking-tight">{isNew ? 'Add Product' : formData.name || 'Unnamed Product'}</h1>
            {!isNew && (
              <span className={`px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-lg border ${
                formData.status === 'active' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' :
                formData.status === 'draft' ? 'bg-zinc-100 text-zinc-800 border-zinc-200' :
                formData.status === 'archived' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {formData.status}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {!isNew && formData.status !== 'archived' && (
             <button onClick={handleArchive} className="p-2 text-zinc-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200" title="Archive">
               <Archive className="w-5 h-5" />
             </button>
          )}
          {!isNew && formData.status === 'active' && (
            <Link to={`/shop/${formData.slug || id}`} target="_blank" className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm hover:bg-zinc-50">
              <Eye className="w-4 h-4" /> Preview
            </Link>
          )}
          <button 
            onClick={() => handleSave('draft')}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-zinc-200 text-zinc-700 rounded-xl text-sm font-bold transition-all shadow-sm hover:bg-zinc-50 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} 
            Save Draft
          </button>
          <button 
            onClick={() => handleSave('active')}
            disabled={isSaving || isPublishing}
            className="flex items-center gap-2 px-6 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-bold transition-all shadow-sm hover:bg-zinc-800 disabled:opacity-50"
          >
            {isPublishing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />} 
            Publish Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Main Content */}
        <div className="xl:col-span-2 flex flex-col gap-8">
          
          {/* Basic Info */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">BASIC INFORMATION</h2>
              <button
                type="button"
                onClick={handleAiAutoFill}
                disabled={isAiGenerating}
                className="flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white rounded-xl text-xs font-bold transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isAiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
                {isAiGenerating ? 'Generating...' : 'Auto-Fill with AI'}
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Product Name <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Premium Wireless Headphones"
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Short Description</label>
                <input 
                  type="text" 
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="A brief summary for product cards"
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Full Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Detailed product description..."
                  className="w-full p-4 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all min-h-[200px] resize-y leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">MEDIA</h2>
              <button onClick={addImageUrl} className="text-sm font-bold text-primary-blue hover:underline">Add URL</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {formData.images.map((img: string, idx: number) => (
                  <div key={idx} className={`relative aspect-square rounded-2xl overflow-hidden border-2 group ${formData.image === img ? 'border-primary-blue shadow-sm' : 'border-zinc-200'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button onClick={() => setPrimaryImage(idx)} className="p-2 bg-white rounded-lg hover:bg-zinc-100 transition-colors" title="Set as primary">
                        <CheckCircle2 className={`w-4 h-4 ${formData.image === img ? 'text-primary-blue' : 'text-zinc-400'}`} />
                      </button>
                      <button onClick={() => removeImage(idx)} className="p-2 bg-white rounded-lg hover:bg-rose-50 transition-colors" title="Remove">
                        <Trash2 className="w-4 h-4 text-rose-500" />
                      </button>
                    </div>
                    {formData.image === img && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-primary-blue text-white text-[10px] font-bold tracking-wider rounded">PRIMARY</div>
                    )}
                  </div>
                ))}
                
                <button onClick={addImageUrl} className="aspect-square rounded-2xl border-2 border-dashed border-zinc-200 bg-zinc-50 flex flex-col items-center justify-center gap-2 hover:bg-zinc-100 hover:border-zinc-300 transition-all group">
                  <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Plus className="w-5 h-5 text-zinc-500" />
                  </div>
                  <span className="text-xs font-bold text-zinc-500">Add Image</span>
                </button>
              </div>
            </div>
          </div>

          {/* Private Wholesale Sourcing & Commission Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-zinc-900" />
                <h2 className="text-lg font-black text-zinc-900 tracking-tight">PRIVATE WHOLESALE SOURCING & PROFIT COMMISSION</h2>
              </div>
              <span className="text-[11px] font-bold text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full uppercase tracking-wider">
                Store Owner Only
              </span>
            </div>
            
            <div className="p-6 flex flex-col gap-6">
              <div className="p-3.5 bg-zinc-50 rounded-2xl border border-zinc-200 text-xs text-zinc-600 flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-zinc-900 shrink-0 mt-0.5" />
                <span>
                  <strong>Strictly Hidden From Customers:</strong> Wholesale channels, base costs, and profit commissions are only visible here in Admin. Customers on the public website only see the final retail price and believe SAJODA ELECTRONICS directly owns and stocks the product.
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Verified Wholesale Sourcing Hub</label>
                  <select
                    name="sourcingHub"
                    value={formData.sourcingHub || 'Alaba International Market Electronics Distribution Hub (Lagos)'}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-semibold outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer"
                  >
                    <option value="Alaba International Market Electronics Distribution Hub (Lagos)">
                      Alaba International Market Hub (Lagos) - Appliances & TVs
                    </option>
                    <option value="Computer Village Ikeja Tech Hub (Lagos)">
                      Computer Village Ikeja Tech Hub (Lagos) - Gadgets & Tech
                    </option>
                    <option value="Certified OEM Refurbisher Hub (Nigeria)">
                      Certified OEM Refurbisher Hub (Nigeria) - Pre-Owned & Tested
                    </option>
                    <option value="Authorized Regional Tier-1 Distributor (Nigeria)">
                      Authorized Regional Tier-1 Distributor (Nigeria)
                    </option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Wholesale Acquisition Base Cost (₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₦</span>
                    <input 
                      type="number" 
                      name="baseCost"
                      value={formData.baseCost || ''}
                      onChange={(e) => {
                        const newBase = parseFloat(e.target.value) || 0;
                        const comm = parseFloat(formData.ownerCommission) || 15000;
                        setFormData((prev: any) => ({
                          ...prev,
                          baseCost: e.target.value,
                          price: newBase > 0 ? (newBase + comm).toString() : prev.price
                        }));
                      }}
                      placeholder="e.g. 120000"
                      min="0"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* Owner Commission */}
              <div className="flex flex-col gap-3 p-4 bg-zinc-50/70 rounded-2xl border border-zinc-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-sm font-bold text-zinc-900">Your Store Commission Markup (₦)</label>
                    <p className="text-xs text-zinc-500">Minimum ₦10,000 upward profit added per unit sold.</p>
                  </div>
                  <div className="relative w-full sm:w-48">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-900 font-bold text-sm">₦</span>
                    <input 
                      type="number" 
                      name="ownerCommission"
                      value={formData.ownerCommission || ''}
                      onChange={(e) => {
                        const newComm = Math.max(parseFloat(e.target.value) || 0, 0);
                        const base = parseFloat(formData.baseCost) || 0;
                        setFormData((prev: any) => ({
                          ...prev,
                          ownerCommission: e.target.value,
                          price: base > 0 ? (base + newComm).toString() : prev.price
                        }));
                      }}
                      min="10000"
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-zinc-300 rounded-xl text-sm font-bold text-zinc-900 outline-none focus:border-zinc-900"
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-200/60">
                  <span className="text-xs font-semibold text-zinc-500">Quick Commission Presets:</span>
                  {[10000, 20000, 35000, 50000, 100000].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => {
                        const base = parseFloat(formData.baseCost) || 0;
                        setFormData((prev: any) => ({
                          ...prev,
                          ownerCommission: amt.toString(),
                          price: base > 0 ? (base + amt).toString() : prev.price
                        }));
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 transition-colors shadow-2xs"
                    >
                      +₦{amt.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">CUSTOMER LISTING PRICING (NIGERIA ₦)</h2>
              <span className="text-xs font-bold text-zinc-500">Visible on Storefront</span>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Selling Price (₦) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₦</span>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 145000"
                      min="0"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-900 outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Compare-at Price (Crossed Out ₦)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 font-bold">₦</span>
                    <input 
                      type="number" 
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={handleChange}
                      placeholder="e.g. 175000"
                      min="0"
                      className="w-full pl-9 pr-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Condition & Dual Options */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">CONDITION & DUAL PRICING (BRAND NEW VS USED)</h2>
              <span className="text-xs font-bold text-zinc-500">Customer Choice</span>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Primary Listing Condition</label>
                  <select
                    name="condition"
                    value={formData.condition || 'new'}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all cursor-pointer"
                  >
                    <option value="new">Brand New (Factory Sealed)</option>
                    <option value="used">Pre-Owned / Refurbished / Open Box</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Condition Grade Label</label>
                  <input 
                    type="text" 
                    name="conditionGrade"
                    value={formData.conditionGrade || ''}
                    onChange={handleChange}
                    placeholder="e.g. Brand New - Factory Sealed OR Certified Refurbished - Grade A"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-zinc-100">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Brand New Price (₦)</label>
                  <input 
                    type="number" 
                    name="newPrice"
                    value={formData.newPrice || ''}
                    onChange={handleChange}
                    placeholder="e.g. 145000"
                    min="0"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                  <span className="text-[11px] text-zinc-500">Allows shoppers to buy brand new</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Pre-Owned / Used Price (₦)</label>
                  <input 
                    type="number" 
                    name="usedPrice"
                    value={formData.usedPrice || ''}
                    onChange={handleChange}
                    placeholder="e.g. 105000"
                    min="0"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                  <span className="text-[11px] text-zinc-500">Discounted price for certified pre-owned</span>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Warranty / Guarantee Terms</label>
                  <input 
                    type="text" 
                    name="warrantyInfo"
                    value={formData.warrantyInfo || ''}
                    onChange={handleChange}
                    placeholder="e.g. 1-Year Official Warranty or 90-Day Guarantee"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                  <span className="text-[11px] text-zinc-500">Displayed on product page & badge</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">INVENTORY</h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">SKU (Stock Keeping Unit)</label>
                  <input 
                    type="text" 
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Barcode (ISBN, UPC, GTIN, etc.)</label>
                  <input 
                    type="text" 
                    name="barcode"
                    value={formData.barcode}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-zinc-100">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Quantity Available</label>
                  <input 
                    type="number" 
                    name="inventory"
                    value={formData.inventory}
                    onChange={handleChange}
                    placeholder="Leave blank for untracked"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Low Stock Threshold</label>
                  <input 
                    type="number" 
                    name="lowStockThreshold"
                    value={formData.lowStockThreshold}
                    onChange={handleChange}
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">SHIPPING</h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
               <div className="flex flex-col gap-2 max-w-sm">
                  <label className="text-sm font-bold text-zinc-700">Weight (kg)</label>
                  <input 
                    type="number" 
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="0.0" step="0.1" min="0"
                    className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-zinc-700">Dimensions (cm) <span className="text-zinc-400 font-normal ml-1">L × W × H</span></label>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number" 
                      name="length"
                      value={formData.dimensions?.length || ''}
                      onChange={handleDimensionChange}
                      placeholder="Length" min="0"
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                    />
                    <span className="text-zinc-400 font-medium">×</span>
                    <input 
                      type="number" 
                      name="width"
                      value={formData.dimensions?.width || ''}
                      onChange={handleDimensionChange}
                      placeholder="Width" min="0"
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                    />
                    <span className="text-zinc-400 font-medium">×</span>
                    <input 
                      type="number" 
                      name="height"
                      value={formData.dimensions?.height || ''}
                      onChange={handleDimensionChange}
                      placeholder="Height" min="0"
                      className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                    />
                  </div>
                </div>
            </div>
          </div>

          {/* Variants */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">VARIANTS</h2>
              <button className="text-sm font-bold text-primary-blue hover:underline">+ Add Options</button>
            </div>
            <div className="p-6">
              {formData.variants && formData.variants.length > 0 ? (
                <div className="text-sm text-zinc-500 italic">Variant management to be extended.</div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-center border-2 border-dashed border-zinc-200 rounded-2xl bg-zinc-50">
                  <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mb-3">
                    <Box className="w-5 h-5 text-zinc-400" />
                  </div>
                  <span className="text-sm font-bold text-zinc-700 mb-1">No variants yet</span>
                  <span className="text-xs text-zinc-500 max-w-[250px]">Add options like size or color to create variants for this product.</span>
                </div>
              )}
            </div>
          </div>

          {/* SEO */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-lg font-black text-zinc-900 tracking-tight">SEARCH ENGINE LISTING</h2>
            </div>
            <div className="p-6 flex flex-col gap-6">
              <div className="p-4 bg-zinc-50 rounded-xl border border-zinc-200 mb-2">
                <span className="text-lg text-[#1a0dab] font-medium hover:underline cursor-pointer line-clamp-1">{formData.seoTitle || formData.name || 'Page Title'}</span>
                <span className="text-sm text-[#006621] block mt-0.5 mb-1 line-clamp-1">https://sajoda.com/shop/{formData.slug || 'product-url'}</span>
                <span className="text-sm text-[#545454] line-clamp-2">{formData.seoDescription || formData.shortDescription || 'Page description will appear here...'}</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 flex justify-between">
                  <span>Page Title</span>
                  <span className="text-zinc-400 font-normal">{formData.seoTitle.length} of 70 characters</span>
                </label>
                <input 
                  type="text" 
                  name="seoTitle"
                  value={formData.seoTitle}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700 flex justify-between">
                  <span>Meta Description</span>
                  <span className="text-zinc-400 font-normal">{formData.seoDescription.length} of 320 characters</span>
                </label>
                <textarea 
                  name="seoDescription"
                  value={formData.seoDescription}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all min-h-[100px] resize-y"
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">URL Slug</label>
                <div className="flex">
                  <span className="px-4 py-3 bg-zinc-100 border border-r-0 border-zinc-200 rounded-l-xl text-sm text-zinc-500 font-medium">/shop/</span>
                  <input 
                    type="text" 
                    name="slug"
                    value={formData.slug}
                    onChange={handleChange}
                    className="flex-1 p-3 bg-white border border-zinc-200 rounded-r-xl text-sm font-medium outline-none focus:border-zinc-400 focus:ring-4 focus:ring-zinc-100 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Organization, Supplier, AI */}
        <div className="flex flex-col gap-8">
          
          {/* Organization */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-base font-black text-zinc-900 tracking-tight">ORGANIZATION</h2>
            </div>
            <div className="p-5 flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Category</label>
                <input 
                  type="text" 
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Electronics, Audio"
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Sub-category</label>
                <input 
                  type="text" 
                  name="subCategory"
                  value={formData.subCategory}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Brand</label>
                <input 
                  type="text" 
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 pt-2 border-t border-zinc-100">
                <label className="text-sm font-bold text-zinc-700">Tags</label>
                <input 
                  type="text" 
                  name="tagInput"
                  value={formData.tagInput}
                  onChange={handleChange}
                  onKeyDown={handleAddTag}
                  placeholder="Type and press Enter..."
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-medium outline-none focus:border-zinc-400 transition-all mb-2"
                />
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag: string, index: number) => (
                      <span key={index} className="flex items-center gap-1 px-2.5 py-1 bg-zinc-100 text-zinc-700 text-xs font-bold rounded-lg border border-zinc-200">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="hover:text-rose-500 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Inventory Origin */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
              <h2 className="text-base font-black text-zinc-900 tracking-tight">INVENTORY ORIGIN</h2>
              <span className="text-xs font-bold text-zinc-400">Domestic</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-zinc-700">Inventory Sourcing Channel</label>
                <select 
                  name="source"
                  value={formData.source || 'domestic_hub'}
                  onChange={handleChange}
                  className="w-full p-3 bg-white border border-zinc-200 rounded-xl text-sm font-bold text-zinc-700 outline-none focus:border-zinc-400 cursor-pointer"
                >
                  <option value="domestic_hub">Domestic Nigerian Wholesale Hub (Alaba / Computer Village)</option>
                  <option value="direct_oem">Direct OEM Authorized Stock</option>
                  <option value="social_viral">TikTok / Instagram Viral Product Scout</option>
                </select>
              </div>
            </div>
          </div>

          {/* SAJODA AI (Future Ready) */}
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 shadow-xl overflow-hidden text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-blue rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50 relative z-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary-blue" />
                <h2 className="text-base font-black text-white tracking-tight">SAJODA AI</h2>
              </div>
            </div>
            <div className="p-5 flex flex-col gap-3 relative z-10">
              <p className="text-sm text-zinc-400 mb-2">Use SAJODA Intelligence to automate product management tasks.</p>
              
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors text-left px-4 flex items-center justify-between group/btn border border-transparent hover:border-zinc-600">
                <span>Enhance Description</span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-white transition-colors" />
              </button>
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors text-left px-4 flex items-center justify-between group/btn border border-transparent hover:border-zinc-600">
                <span>Generate SEO Meta</span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-white transition-colors" />
              </button>
              <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-bold rounded-xl transition-colors text-left px-4 flex items-center justify-between group/btn border border-transparent hover:border-zinc-600">
                <span>Analyze Profit Margin</span>
                <ChevronRight className="w-4 h-4 text-zinc-500 group-hover/btn:text-white transition-colors" />
              </button>
              
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

const ChevronRight = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);
