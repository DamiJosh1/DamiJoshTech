import React, { useState, useEffect } from 'react';
import { 
  Folder, Image as ImageIcon, Sparkles, Check, AlertCircle, RefreshCw, 
  ArrowRight, CheckSquare, Square, Layers, Search, DollarSign, Tag,
  ExternalLink, Eye, ChevronRight, CheckCircle2, Loader2, ArrowLeft,
  Sliders, Wand2, Send, Save, Trash2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getGoogleDriveAccessToken, 
  fetchDriveFiles, 
  fetchDriveImageBase64, 
  DriveFileItem, 
  clearDriveToken 
} from '../../services/googleDrive';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useStore } from '../../StoreContext';

interface DraftProduct {
  driveFileId: string;
  driveFileName: string;
  thumbnailUrl: string;
  selected: boolean;
  status: 'pending' | 'analyzing' | 'ready' | 'saving' | 'saved' | 'error';
  errorMessage?: string;
  name: string;
  price: number;
  originalPrice: number;
  category: string;
  brand: string;
  shortDescription: string;
  description: string;
  features: string[];
  specifications: { name: string; value: string }[];
  tags: string[];
}

export default function AdminDriveProducts() {
  const navigate = useNavigate();
  const { currentCurrency, formatPrice } = useStore();
  
  // Google Auth State
  const [token, setToken] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive Navigation & Files
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState<string>('root');
  const [folderHistory, setFolderHistory] = useState<{ id: string; name: string }[]>([
    { id: 'root', name: 'My Drive' }
  ]);
  const [searchDriveQuery, setSearchDriveQuery] = useState('');

  // Selected files for batch processing
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  
  // AI Prompt and Instructions
  const [userInstructions, setUserInstructions] = useState(
    'Analyze this product photo. Create a modern commercial title, set a competitive price in Nigerian Naira (NGN), write an engaging description, extract key specs, and assign the best product category.'
  );
  
  // AI Generation State
  const [step, setStep] = useState<'browse' | 'review' | 'completed'>('browse');
  const [draftProducts, setDraftProducts] = useState<DraftProduct[]>([]);
  const [isAnalyzingAll, setIsAnalyzingAll] = useState(false);
  const [isPublishingAll, setIsPublishingAll] = useState(false);
  const [analyzedCount, setAnalyzedCount] = useState(0);
  const [activePreviewIndex, setActivePreviewIndex] = useState<number>(0);

  // Existing store categories to help guide AI
  const [storeCategories, setStoreCategories] = useState<string[]>([
    'Smartphones & Tablets',
    'Audio & Headphones',
    'Smart Home & IoT',
    'Wearables & Watches',
    'Gaming Gear',
    'Computers & Accessories',
    'Cameras & Photography',
    'Power & Charging',
    'Kitchen & Appliances',
    'Home Gadgets'
  ]);

  // Try to load existing categories from Firestore
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const snap = await getDocs(collection(db, 'categories'));
        const cats = snap.docs.map(d => d.data().name).filter(Boolean);
        if (cats.length > 0) {
          setStoreCategories(Array.from(new Set([...storeCategories, ...cats])));
        }
      } catch (err) {
        console.warn('Could not fetch custom categories', err);
      }
    };
    fetchCats();
  }, []);

  // Connect Google Drive
  const handleConnectDrive = async (force: boolean = false) => {
    setIsConnecting(true);
    setAuthError(null);
    try {
      const accessToken = await getGoogleDriveAccessToken(force);
      setToken(accessToken);
      await loadFiles(accessToken, 'root');
    } catch (err: any) {
      console.error('Drive connection error:', err);
      setAuthError(err.message || 'Failed to authenticate with Google Drive.');
    } finally {
      setIsConnecting(false);
    }
  };

  const loadFiles = async (authToken: string, folderId: string, search?: string) => {
    setIsLoadingFiles(true);
    try {
      const driveFiles = await fetchDriveFiles(authToken, folderId, search);
      setFiles(driveFiles);
    } catch (err: any) {
      console.error('Error listing files:', err);
      if (err.message?.includes('expired') || err.message?.includes('401')) {
        setToken(null);
        setAuthError('Google Drive session expired. Please connect again.');
      } else {
        setAuthError(err.message || 'Could not load files from Google Drive.');
      }
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleOpenFolder = (folder: DriveFileItem) => {
    if (!token) return;
    const newHistory = [...folderHistory, { id: folder.id, name: folder.name }];
    setFolderHistory(newHistory);
    setCurrentFolderId(folder.id);
    loadFiles(token, folder.id);
  };

  const handleNavigateHistory = (index: number) => {
    if (!token) return;
    const target = folderHistory[index];
    const newHistory = folderHistory.slice(0, index + 1);
    setFolderHistory(newHistory);
    setCurrentFolderId(target.id);
    loadFiles(token, target.id);
  };

  const toggleSelectFile = (fileId: string) => {
    setSelectedFileIds(prev => 
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const selectAllImages = () => {
    const imageIds = files
      .filter(f => f.mimeType.startsWith('image/'))
      .map(f => f.id);
    setSelectedFileIds(imageIds);
  };

  const clearSelection = () => {
    setSelectedFileIds([]);
  };

  // Switch to review & AI generation stage
  const handleProceedToAI = () => {
    if (selectedFileIds.length === 0) return;
    
    const selectedFiles = files.filter(f => selectedFileIds.includes(f.id));
    const initialDrafts: DraftProduct[] = selectedFiles.map(f => ({
      driveFileId: f.id,
      driveFileName: f.name,
      thumbnailUrl: f.thumbnailLink ? f.thumbnailLink.replace(/=s\d+/, '=s800') : '',
      selected: true,
      status: 'pending',
      name: f.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
      price: 15000,
      originalPrice: 20000,
      category: 'Electronics',
      brand: 'Sajoda',
      shortDescription: 'High quality and durable.',
      description: 'Full product details will be generated by AI from the image.',
      features: [],
      specifications: [],
      tags: []
    }));

    setDraftProducts(initialDrafts);
    setStep('review');
    setActivePreviewIndex(0);
  };

  // Analyze an individual product with Gemini
  const analyzeSingleProduct = async (index: number, draftsArray?: DraftProduct[]) => {
    const list = draftsArray || draftProducts;
    const item = list[index];
    if (!item || !token) return;

    // Update status to analyzing
    setDraftProducts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], status: 'analyzing', errorMessage: undefined };
      return copy;
    });

    try {
      // 1. Download base64 image data from Drive using user's access token
      const { base64, mimeType } = await fetchDriveImageBase64(token, item.driveFileId);

      // 2. Call server-side Gemini endpoint
      const response = await fetch('/api/ai/analyze-drive-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64,
          mimeType: mimeType,
          instructions: userInstructions,
          currency: currentCurrency?.code || 'NGN',
          existingCategories: storeCategories
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `AI analysis failed with status ${response.status}`);
      }

      const { product: aiProduct } = await response.json();

      setDraftProducts(prev => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          status: 'ready',
          name: aiProduct.name || copy[index].name,
          price: Number(aiProduct.price) || copy[index].price,
          originalPrice: Number(aiProduct.originalPrice) || Number(aiProduct.price * 1.3) || copy[index].originalPrice,
          category: aiProduct.category || copy[index].category,
          brand: aiProduct.brand || 'Sajoda',
          shortDescription: aiProduct.shortDescription || copy[index].shortDescription,
          description: aiProduct.description || copy[index].description,
          features: Array.isArray(aiProduct.features) ? aiProduct.features : [],
          specifications: Array.isArray(aiProduct.specifications) ? aiProduct.specifications : [],
          tags: Array.isArray(aiProduct.tags) ? aiProduct.tags : []
        };
        return copy;
      });

    } catch (err: any) {
      console.error('Failed to analyze item:', err);
      setDraftProducts(prev => {
        const copy = [...prev];
        copy[index] = {
          ...copy[index],
          status: 'error',
          errorMessage: err.message || 'Analysis error'
        };
        return copy;
      });
    }
  };

  // Run AI analysis on all pending products sequentially or in small parallel batches
  const handleAnalyzeAllWithAI = async () => {
    if (!token || draftProducts.length === 0) return;
    setIsAnalyzingAll(true);
    setAnalyzedCount(0);

    for (let i = 0; i < draftProducts.length; i++) {
      if (draftProducts[i].selected) {
        await analyzeSingleProduct(i);
        setAnalyzedCount(prev => prev + 1);
      }
    }

    setIsAnalyzingAll(false);
  };

  // Update a single draft field manually
  const handleUpdateDraft = (index: number, field: keyof DraftProduct, value: any) => {
    setDraftProducts(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Publish all ready products to Firestore
  const handlePublishAllToStore = async () => {
    const toSave = draftProducts.filter(d => d.selected && d.status !== 'saved');
    if (toSave.length === 0) return;

    setIsPublishingAll(true);

    for (let i = 0; i < draftProducts.length; i++) {
      const draft = draftProducts[i];
      if (!draft.selected || draft.status === 'saved') continue;

      setDraftProducts(prev => {
        const copy = [...prev];
        copy[i].status = 'saving';
        return copy;
      });

      try {
        const slug = draft.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const newProductData = {
          name: draft.name,
          slug: `${slug}-${Date.now()}`,
          price: Number(draft.price) || 0,
          originalPrice: Number(draft.originalPrice) || 0,
          category: draft.category,
          brand: draft.brand || 'Sajoda',
          image: draft.thumbnailUrl,
          images: [draft.thumbnailUrl],
          shortDescription: draft.shortDescription,
          description: draft.description,
          features: draft.features,
          specifications: draft.specifications,
          tags: draft.tags,
          inStock: true,
          stockCount: 50,
          status: 'active',
          source: 'google_drive_ai',
          driveFileId: draft.driveFileId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        await addDoc(collection(db, 'products'), newProductData);

        setDraftProducts(prev => {
          const copy = [...prev];
          copy[i].status = 'saved';
          return copy;
        });
      } catch (err: any) {
        console.error('Error saving product:', err);
        setDraftProducts(prev => {
          const copy = [...prev];
          copy[i].status = 'error';
          copy[i].errorMessage = 'Failed to save to database';
          return copy;
        });
      }
    }

    setIsPublishingAll(false);
  };

  return (
    <div className="w-full pb-20 animate-fade-in-up font-sans">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">
            <Sparkles className="w-4 h-4" /> Google Drive & Multimodal AI Studio
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tight">
            Bulk Drive Image Importer
          </h1>
          <p className="text-zinc-500 font-medium text-sm md:text-base mt-1">
            Select high-res photos from your Google Drive, talk to Gemini AI to generate compelling product titles, prices, specs, and categories, and post them directly to your store catalog.
          </p>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-2 bg-white px-4 py-2 border border-zinc-200 rounded-2xl shadow-sm text-sm">
          <button 
            onClick={() => setStep('browse')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              step === 'browse' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900'
            }`}
          >
            1. Select Images
          </button>
          <ChevronRight className="w-4 h-4 text-zinc-400" />
          <button 
            onClick={() => {
              if (draftProducts.length > 0) setStep('review');
            }}
            disabled={draftProducts.length === 0}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              step === 'review' ? 'bg-zinc-900 text-white' : 'text-zinc-500 hover:text-zinc-900 disabled:opacity-40'
            }`}
          >
            2. AI Review & Edit
          </button>
        </div>
      </div>

      {/* STEP 1: DRIVE BROWSER & SELECTOR */}
      {step === 'browse' && (
        <div className="space-y-6">
          
          {/* Connection Banner */}
          {!token ? (
            <div className="bg-gradient-to-br from-emerald-500/10 via-zinc-50 to-white border border-emerald-200/80 rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm">
              <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600 shadow-inner">
                <Folder className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black text-zinc-900 mb-2">Connect Your Google Drive</h2>
              <p className="text-zinc-600 text-sm max-w-md mx-auto mb-6 leading-relaxed">
                Connect your Google account to browse image folders and select product pictures directly from your Drive.
              </p>

              {authError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2 max-w-md mx-auto text-left">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                onClick={() => handleConnectDrive(false)}
                disabled={isConnecting}
                className="inline-flex items-center gap-3 px-6 py-3.5 bg-zinc-900 hover:bg-zinc-800 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 text-sm"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting Google Drive...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                    Authorize Google Drive Access
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              
              {/* Drive Toolbar */}
              <div className="p-4 md:p-6 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-50/50">
                
                {/* Breadcrumbs Navigation */}
                <div className="flex items-center gap-2 overflow-x-auto py-1 text-sm font-semibold text-zinc-600">
                  <Folder className="w-4 h-4 text-emerald-600 shrink-0" />
                  {folderHistory.map((f, i) => (
                    <React.Fragment key={f.id}>
                      <button
                        onClick={() => handleNavigateHistory(i)}
                        className={`hover:text-zinc-900 transition-colors whitespace-nowrap ${
                          i === folderHistory.length - 1 ? 'text-zinc-900 font-black' : ''
                        }`}
                      >
                        {f.name}
                      </button>
                      {i < folderHistory.length - 1 && (
                        <ChevronRight className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {/* Actions & Refresh */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search Drive files..."
                      value={searchDriveQuery}
                      onChange={(e) => setSearchDriveQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && token) {
                          loadFiles(token, currentFolderId, searchDriveQuery);
                        }
                      }}
                      className="pl-9 pr-3 py-1.5 bg-white border border-zinc-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-zinc-900/10 w-44 md:w-56"
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (token) loadFiles(token, currentFolderId, searchDriveQuery);
                    }}
                    title="Refresh folder"
                    className="p-2 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-zinc-600 transition-colors"
                  >
                    <RefreshCw className={`w-4 h-4 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                  </button>

                  <button
                    onClick={() => handleConnectDrive(true)}
                    className="text-xs font-bold text-zinc-500 hover:text-zinc-900 underline ml-2"
                  >
                    Switch Account
                  </button>
                </div>
              </div>

              {/* Selection Bar */}
              <div className="px-6 py-3 bg-emerald-50/50 border-b border-emerald-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-zinc-800">
                    {selectedFileIds.length} item{selectedFileIds.length === 1 ? '' : 's'} selected
                  </span>
                  <button 
                    onClick={selectAllImages}
                    className="text-emerald-700 font-bold hover:underline"
                  >
                    Select all images in this folder
                  </button>
                  {selectedFileIds.length > 0 && (
                    <button 
                      onClick={clearSelection}
                      className="text-zinc-500 font-bold hover:text-zinc-900"
                    >
                      Clear selection
                    </button>
                  )}
                </div>

                <button
                  onClick={handleProceedToAI}
                  disabled={selectedFileIds.length === 0}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white font-bold rounded-xl shadow-sm transition-all text-xs"
                >
                  Configure AI Prompt ({selectedFileIds.length})
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Drive File Grid */}
              <div className="p-6">
                {isLoadingFiles ? (
                  <div className="py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-zinc-400 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm font-medium">Reading files from Google Drive...</p>
                  </div>
                ) : files.length === 0 ? (
                  <div className="py-16 text-center text-zinc-400">
                    <ImageIcon className="w-12 h-12 stroke-[1.5] mx-auto mb-2 text-zinc-300" />
                    <p className="text-sm font-bold text-zinc-600">No images or subfolders found here.</p>
                    <p className="text-xs text-zinc-400 mt-1">Make sure you have uploaded images to this folder in Google Drive.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {files.map(file => {
                      const isFolder = file.mimeType === 'application/vnd.google-apps.folder';
                      const isSelected = selectedFileIds.includes(file.id);

                      if (isFolder) {
                        return (
                          <div
                            key={file.id}
                            onClick={() => handleOpenFolder(file)}
                            className="group p-4 bg-zinc-50 hover:bg-emerald-50/50 border border-zinc-200 hover:border-emerald-300 rounded-2xl cursor-pointer transition-all flex flex-col items-center text-center shadow-sm"
                          >
                            <div className="w-12 h-12 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                              <Folder className="w-6 h-6 fill-amber-500/20" />
                            </div>
                            <span className="text-xs font-bold text-zinc-800 truncate w-full group-hover:text-emerald-700">
                              {file.name}
                            </span>
                            <span className="text-[10px] text-zinc-400 font-medium mt-1">Folder</span>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={file.id}
                          onClick={() => toggleSelectFile(file.id)}
                          className={`group relative rounded-2xl border transition-all cursor-pointer overflow-hidden p-2 flex flex-col justify-between ${
                            isSelected 
                              ? 'border-emerald-600 bg-emerald-50/40 ring-2 ring-emerald-500 shadow-md' 
                              : 'border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm'
                          }`}
                        >
                          {/* Image Box */}
                          <div className="w-full aspect-square bg-zinc-100 rounded-xl overflow-hidden relative mb-2 flex items-center justify-center">
                            {file.thumbnailLink ? (
                              <img 
                                src={file.thumbnailLink.replace(/=s\d+/, '=s400')} 
                                alt={file.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <ImageIcon className="w-8 h-8 text-zinc-300" />
                            )}

                            {/* Checkbox indicator */}
                            <div className="absolute top-2 right-2">
                              <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition-colors shadow-sm ${
                                isSelected ? 'bg-emerald-600 text-white' : 'bg-white/90 text-zinc-400'
                              }`}>
                                <Check className={`w-3.5 h-3.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                              </div>
                            </div>
                          </div>

                          {/* File info */}
                          <div className="px-1">
                            <p className="text-xs font-bold text-zinc-800 truncate" title={file.name}>
                              {file.name}
                            </p>
                            <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-wider mt-0.5">
                              Image
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      )}

      {/* STEP 2: AI REVIEW, PROMPT & BATCH PRODUCT GENERATION */}
      {step === 'review' && (
        <div className="space-y-6">
          
          {/* AI Instructions Prompt Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-900">Talk to Gemini Multimodal AI</h3>
                  <p className="text-xs text-zinc-500 font-medium">
                    Provide instructions for pricing, branding, and tone. Gemini will inspect every image and generate listings accordingly.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep('browse')}
                  className="px-3 py-2 text-xs font-bold text-zinc-600 hover:text-zinc-900 bg-zinc-100 hover:bg-zinc-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Files
                </button>
                <button
                  onClick={handleAnalyzeAllWithAI}
                  disabled={isAnalyzingAll}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isAnalyzingAll ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Analyzing with AI ({analyzedCount}/{draftProducts.length})...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      Run AI Vision on All ({draftProducts.length})
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                value={userInstructions}
                onChange={(e) => setUserInstructions(e.target.value)}
                placeholder="Give instructions to your AI (e.g., Price these for Nigerian dropshipping in Naira with a 40% margin, highlight specs and features, write attractive marketing descriptions)..."
                className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 h-24 resize-none"
              />
            </div>
          </div>

          {/* Main Drafts Work Area: Left Table, Right Live Preview */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Products List & Quick Edit Table (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-zinc-100 flex items-center justify-between">
                <div>
                  <h4 className="font-black text-sm text-zinc-900">
                    Selected Drive Items ({draftProducts.length})
                  </h4>
                  <span className="text-[11px] text-zinc-400 font-medium">
                    Click any item to inspect and preview
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePublishAllToStore}
                    disabled={isPublishingAll || draftProducts.every(d => d.status === 'saved')}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-2 transition-all"
                  >
                    {isPublishingAll ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Publishing to Store...
                      </>
                    ) : (
                      <>
                        <Save className="w-3.5 h-3.5" />
                        Publish All to Store
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="divide-y divide-zinc-100 max-h-[600px] overflow-y-auto">
                {draftProducts.map((draft, idx) => {
                  const isActive = idx === activePreviewIndex;

                  return (
                    <div
                      key={draft.driveFileId}
                      onClick={() => setActivePreviewIndex(idx)}
                      className={`p-4 transition-colors cursor-pointer flex items-center gap-4 ${
                        isActive ? 'bg-emerald-50/40' : 'hover:bg-zinc-50'
                      }`}
                    >
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 rounded-xl bg-zinc-100 shrink-0 overflow-hidden border border-zinc-200 relative">
                        {draft.thumbnailUrl ? (
                          <img 
                            src={draft.thumbnailUrl} 
                            alt={draft.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <ImageIcon className="w-6 h-6 text-zinc-300 m-auto mt-4" />
                        )}

                        {draft.status === 'analyzing' && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <Loader2 className="w-4 h-4 text-white animate-spin" />
                          </div>
                        )}
                        {draft.status === 'saved' && (
                          <div className="absolute inset-0 bg-emerald-600/80 flex items-center justify-center text-white">
                            <Check className="w-4 h-4 stroke-[3]" />
                          </div>
                        )}
                      </div>

                      {/* Content Fields */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            value={draft.name}
                            onChange={(e) => handleUpdateDraft(idx, 'name', e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            className="font-bold text-xs text-zinc-900 bg-transparent hover:bg-white focus:bg-white px-1.5 py-0.5 rounded border border-transparent hover:border-zinc-200 focus:border-zinc-300 w-full truncate focus:outline-none"
                          />
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-[11px] text-zinc-500">
                          <div className="flex items-center gap-1 font-semibold text-zinc-800">
                            <span>Price:</span>
                            <input
                              type="number"
                              value={draft.price}
                              onChange={(e) => handleUpdateDraft(idx, 'price', Number(e.target.value))}
                              onClick={(e) => e.stopPropagation()}
                              className="w-20 px-1.5 py-0.5 rounded border border-zinc-200 text-xs font-bold text-zinc-900"
                            />
                          </div>

                          <div className="flex items-center gap-1">
                            <Tag className="w-3 h-3 text-zinc-400" />
                            <input
                              type="text"
                              value={draft.category}
                              onChange={(e) => handleUpdateDraft(idx, 'category', e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              placeholder="Category"
                              className="w-28 px-1.5 py-0.5 rounded border border-zinc-200 text-xs text-zinc-700"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Status / Single AI Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {draft.status === 'saved' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-[10px] font-black">
                            <CheckCircle2 className="w-3 h-3" /> Published
                          </span>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              analyzeSingleProduct(idx);
                            }}
                            disabled={draft.status === 'analyzing'}
                            title="Regenerate this item with AI"
                            className="p-2 bg-zinc-100 hover:bg-emerald-100 hover:text-emerald-700 text-zinc-600 rounded-xl transition-colors text-xs font-bold"
                          >
                            {draft.status === 'analyzing' ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Sparkles className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Live Product Card & Detailed Inspector (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm sticky top-6">
              {draftProducts[activePreviewIndex] ? (
                (() => {
                  const item = draftProducts[activePreviewIndex];
                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                        <span className="text-xs font-black uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                          <Eye className="w-4 h-4" /> Store Preview
                        </span>
                        <span className="text-xs text-zinc-400 font-medium">
                          Item {activePreviewIndex + 1} of {draftProducts.length}
                        </span>
                      </div>

                      {/* Product Preview Mockup */}
                      <div className="rounded-2xl border border-zinc-200 p-4 bg-zinc-50/50 space-y-3">
                        <div className="w-full aspect-video rounded-xl bg-white overflow-hidden border border-zinc-200 flex items-center justify-center">
                          {item.thumbnailUrl ? (
                            <img 
                              src={item.thumbnailUrl} 
                              alt={item.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-contain" 
                            />
                          ) : (
                            <ImageIcon className="w-10 h-10 text-zinc-300" />
                          )}
                        </div>

                        <div>
                          <span className="text-[10px] font-black uppercase text-emerald-600 tracking-wider bg-emerald-50 px-2 py-0.5 rounded-md">
                            {item.category || 'General'}
                          </span>
                          <h3 className="font-black text-sm text-zinc-900 mt-1">
                            {item.name || 'Untitled Product'}
                          </h3>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-base font-black text-zinc-900">
                              {formatPrice(item.price)}
                            </span>
                            {item.originalPrice > item.price && (
                              <span className="text-xs text-zinc-400 line-through">
                                {formatPrice(item.originalPrice)}
                              </span>
                            )}
                          </div>
                        </div>

                        <p className="text-xs text-zinc-600 leading-relaxed font-medium">
                          {item.shortDescription || item.description?.slice(0, 120)}
                        </p>

                        {/* Extracted Features / Specs */}
                        {item.features && item.features.length > 0 && (
                          <div className="pt-2 border-t border-zinc-200">
                            <span className="text-[11px] font-bold text-zinc-900 block mb-1">
                              Key Highlights:
                            </span>
                            <ul className="space-y-1">
                              {item.features.slice(0, 3).map((f, fi) => (
                                <li key={fi} className="text-[11px] text-zinc-600 flex items-start gap-1.5">
                                  <Check className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                                  <span>{f}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Action buttons for selected item */}
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          onClick={() => analyzeSingleProduct(activePreviewIndex)}
                          disabled={item.status === 'analyzing'}
                          className="flex-1 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          Re-Analyze with AI
                        </button>
                      </div>

                    </div>
                  );
                })()
              ) : (
                <div className="text-center py-12 text-zinc-400 text-xs">
                  Select an item to view preview.
                </div>
              )}
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
