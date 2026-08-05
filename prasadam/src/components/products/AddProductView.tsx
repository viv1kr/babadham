import React, { useState, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ProductCategory } from '../../types/ecommerce';
import { 
  Package, 
  Upload, 
  ImageIcon, 
  Plus, 
  Trash2, 
  Globe, 
  Pencil, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Code, 
  Tag,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { CategoryManagerModal } from './CategoryManagerModal';

interface AddProductViewProps {
  productId?: string | null;
  onSuccess?: () => void;
}

export const AddProductView: React.FC<AddProductViewProps> = ({ productId, onSuccess }) => {
  const { products, collections, categories, vendors, addProduct, updateProduct, saveCollection, showToast } = useAdmin();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Basic Details
  const [name, setName] = useState('');
  const [hindiName, setHindiName] = useState('');
  const [category, setCategory] = useState<ProductCategory>('prasad');
  const [fullDesc, setFullDesc] = useState('');
  const templeBlessing = 'Directly offered at Baba Baidyanath Sanctum Sanctorum, Deoghar.';

  // Pricing & Stock
  const [price, setPrice] = useState<number>(499);
  const [originalPrice, setOriginalPrice] = useState<number>(699);
  const [costPerItem, setCostPerItem] = useState<number>(250);
  const [stockCount, setStockCount] = useState<number>(100);
  const [inStock, setInStock] = useState<boolean>(true);
  const [weight, setWeight] = useState<string>('500g');
  const [badge, setBadge] = useState<string>('Sacred & Fresh');
  const [purityGrade, setPurityGrade] = useState<string>('Grade A+ Organic');
  const [origin, setOrigin] = useState<string>('Deoghar Sanctum, Jharkhand');
  const [vendor, setVendor] = useState<string>('');

  // Media
  const [imageUrl, setImageUrl] = useState<string>('https://images.unsplash.com/photo-1601058268499-e52658b8bb88?auto=format&fit=crop&w=800&q=80');
  const [gallery, setGallery] = useState<string[]>([]);
  const [inputGalleryUrl, setInputGalleryUrl] = useState('');
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // SEO & Search Engine Listing
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [seoSlug, setSeoSlug] = useState('');

  // Selected Collections
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);

  // Load existing product if editing
  React.useEffect(() => {
    if (productId) {
      const p = products.find(prod => prod.id === productId);
      if (p) {
        setName(p.name || '');
        setHindiName(p.hindiName || '');
        setCategory(p.category || 'prasad');
        setFullDesc(p.fullDesc || p.shortDesc || '');
        setPrice(p.price || 499);
        setOriginalPrice(p.originalPrice || 699);
        setInStock(p.inStock ?? true);
        setStockCount(p.stockCount ?? 100);
        setWeight(p.weight || '500g');
        setBadge(p.badge || '');
        setPurityGrade(p.purityGrade || '');
        setOrigin(p.origin || '');
        setVendor(p.vendor || '');
        setImageUrl(p.image || '');
        if (p.gallery) setGallery(p.gallery);
        
        const pCollections = collections.filter(c => c.productIds?.includes(productId)).map(c => c.id);
        setSelectedCollectionIds(pCollections);
      }
    }
  }, [productId, products, collections]);

  // Calculate Auto Values
  const discountPercentage = originalPrice > price 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const margin = price > costPerItem 
    ? Math.round(((price - costPerItem) / price) * 100) 
    : 0;

  const profit = price - costPerItem;

  const autoSlug = (name || 'new-sacred-product')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const liveUrlSlug = seoSlug.trim() ? seoSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : autoSlug;
  const liveUrl = `https://babadham.org/products/${liveUrlSlug}`;

  // Handle File Upload from Local Device
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showToast('Image size should be less than 10MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              setImageUrl(compressedDataUrl);
              showToast('Product main image uploaded and optimized successfully!');
            };
            img.onerror = () => {
              setImageUrl(result);
              showToast('Product main image updated successfully!');
            };
            img.src = result;
          } else {
            setImageUrl(result);
            showToast('File updated successfully!');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddGalleryUrl = () => {
    if (!inputGalleryUrl.trim()) return;
    setGallery(prev => [...prev, inputGalleryUrl.trim()]);
    setInputGalleryUrl('');
    showToast('Gallery image link added');
  };

  const handleGalleryFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      Array.from(files).forEach(file => {
        if (file.size > 5 * 1024 * 1024) {
          showToast('Image must be less than 5MB', 'warning');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 800;
              const MAX_HEIGHT = 800;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              setGallery(prev => [...prev, compressedDataUrl]);
              showToast('Gallery photo uploaded successfully!');
            };
            img.onerror = () => {
              setGallery(prev => [...prev, result]);
            };
            img.src = result;
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const moveGalleryItem = (idx: number, direction: 'left' | 'right') => {
    setGallery(prev => {
      const newGallery = [...prev];
      const targetIdx = direction === 'left' ? idx - 1 : idx + 1;
      
      if (targetIdx >= 0 && targetIdx < newGallery.length) {
        const temp = newGallery[idx];
        newGallery[idx] = newGallery[targetIdx];
        newGallery[targetIdx] = temp;
      }
      return newGallery;
    });
  };

  const handleDrop = (targetIdx: number) => {
    if (draggedIdx === null || draggedIdx === targetIdx) return;
    
    setGallery(prev => {
      const newGallery = [...prev];
      const itemToMove = newGallery.splice(draggedIdx, 1)[0];
      newGallery.splice(targetIdx, 0, itemToMove);
      return newGallery;
    });
    setDraggedIdx(null);
  };

  const handleRemoveGalleryItem = (idx: number) => {
    setGallery(prev => prev.filter((_, i) => i !== idx));
  };

  // Submit Handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter a product title', 'warning');
      return;
    }

    const categoryNames: Record<ProductCategory, string> = {
      prasad: 'Baidyanath Prasad',
      peda: 'Deoghar Kesar Peda',
      rudraksh: 'Sacred Rudraksha Mala',
      kada: 'Holy Copper Kada',
      gangajal: 'Sultanganj Ganga Jal',
      combos: 'Mahadev Puja Combos',
      kits: 'Complete Festival Kits'
    };

    const payload = {
      name: name.trim(),
      hindiName: hindiName.trim() || name.trim(),
      category: category,
      categoryName: categoryNames[category] || 'Temple Prasad',
      price: Number(price),
      originalPrice: Number(originalPrice),
      discountPercentage: discountPercentage,
      rating: 4.9,
      reviewCount: 12,
      image: imageUrl,
      gallery: gallery,
      badge: badge.trim() || undefined,
      shortDesc: fullDesc.trim() || name.trim(),
      fullDesc: fullDesc.trim() || name.trim(),
      templeBlessing: templeBlessing.trim(),
      weight: weight.trim() || '500g',
      inStock: inStock,
      stockCount: Number(stockCount),
      isBestSeller: true,
      isFeatured: true,
      purityGrade: purityGrade.trim() || '100% Pure Sanctum Grade',
      origin: origin.trim() || 'Deoghar, Jharkhand',
      vendor: vendor.trim() || undefined
    };

    let finalProductId = productId;
    if (productId) {
      updateProduct(productId, payload);
      showToast(`Product "${name}" updated successfully!`);
    } else {
      const addedProduct = addProduct(payload);
      if (addedProduct) {
        finalProductId = addedProduct.id;
      }
      showToast(`Product "${name}" added to live store!`);
    }

    if (finalProductId) {
      collections.forEach(col => {
        const hasProduct = col.productIds?.includes(finalProductId as string);
        const shouldHaveProduct = selectedCollectionIds.includes(col.id);

        if (shouldHaveProduct && !hasProduct) {
          saveCollection({ ...col, productIds: [...(col.productIds || []), finalProductId as string] });
        } else if (!shouldHaveProduct && hasProduct) {
          saveCollection({ ...col, productIds: (col.productIds || []).filter(id => id !== finalProductId) });
        }
      });
    }

    if (onSuccess) onSuccess();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16 animate-in fade-in duration-200">
      
      {/* Top Action & Title Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[#1C080C] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#500A18] border border-[#F4A62A]/40 flex items-center justify-center text-[#F4A62A] shadow-md">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-temple font-bold text-lg sm:text-xl text-[#F4A62A]">
              {productId ? 'Edit Product' : 'Add new product'}
            </h2>
            <p className="text-[11px] text-[#FFF8F0]/60">
              {productId ? 'Modify the product details in your catalog.' : 'Create a fresh catalog entry for temple offerings.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-[#FFF8F0]/80 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" /> Cancel
            </button>
          )}

          <button
            onClick={handleSubmit}
            className="flex-1 sm:flex-none px-6 py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-lg cursor-pointer flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> {productId ? 'Update Product' : 'Save & Publish Product'}
          </button>
        </div>
        
        {/* Fixed Save Bar (Mobile) */}
        <div className="fixed bottom-0 left-0 right-0 bg-[#2B1217] border-t border-[#F4A62A]/30 p-4 flex justify-between gap-3 sm:hidden z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
          {onSuccess && (
            <button
              type="button"
              onClick={onSuccess}
              className="flex-1 py-3 rounded-xl bg-[#1A0B0E] text-[#FFF8F0] font-bold text-sm border border-[#F4A62A]/20 active:scale-95"
            >
              Cancel
            </button>
          )}
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-sm active:scale-95 flex justify-center items-center gap-2"
          >
            {productId ? 'Update Product' : 'Save Product'}
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT & CENTER COLUMN: Product Core Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Title & Description Box */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#F4A62A] uppercase tracking-wider mb-1.5">
                Product Title (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Baba Baidyanath Special Kesar Peda Box (500g)"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full text-sm p-3.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#F4A62A] uppercase tracking-wider mb-1.5">
                Hindi Title (हिन्दी नाम - For Devotee Cards)
              </label>
              <input
                type="text"
                placeholder="उदा. बाबा बैद्यनाथ विशेष केसर पेड़ा डिब्बा"
                value={hindiName}
                onChange={e => setHindiName(e.target.value)}
                className="w-full text-sm p-3.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            {/* Description Section with Classic Editor Toolbar */}
            <div>
              <label className="block text-xs font-bold text-[#F4A62A] uppercase tracking-wider mb-1.5">
                Full Description (Classic Editor)
              </label>

              {/* Editor Formatting Toolbar */}
              <div className="border border-[#F4A62A]/30 rounded-t-xl bg-[#1C080C] p-2 flex flex-wrap items-center gap-1">
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Underline"><Underline className="w-3.5 h-3.5" /></button>
                <div className="w-[1px] h-4 bg-[#F4A62A]/20 mx-1" />
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Bullet List"><List className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
                <div className="w-[1px] h-4 bg-[#F4A62A]/20 mx-1" />
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Add Link"><Link className="w-3.5 h-3.5" /></button>
                <button type="button" className="p-1.5 rounded hover:bg-[#500A18] text-[#FFF8F0]/70 hover:text-[#F4A62A]" title="Insert Code"><Code className="w-3.5 h-3.5" /></button>
              </div>

              <textarea
                rows={6}
                placeholder="Describe sacred ingredients, temple offering rituals, storage guidelines..."
                value={fullDesc}
                onChange={e => setFullDesc(e.target.value)}
                className="w-full text-xs p-3.5 rounded-b-xl bg-[#120508] border border-t-0 border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#F4A62A]"
              />
            </div>
          </div>

          {/* Media / Photo Upload Card */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4" /> Product Media & Photos
            </h3>

            {/* Main Image Dropzone / Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="w-full h-44 rounded-xl bg-[#120508] border-2 border-dashed border-[#F4A62A]/40 overflow-hidden flex items-center justify-center relative group">
                {imageUrl ? (
                  <img src={imageUrl} alt="Product Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-3 text-xs text-[#FFF8F0]/50 space-y-1">
                    <Upload className="w-6 h-6 text-[#F4A62A] mx-auto" />
                    <p>Click below to upload photo</p>
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2.5 rounded-xl bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 font-bold text-xs hover:bg-[#9E1632] flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Upload className="w-4 h-4" /> Upload Main Product Photo
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                <div>
                  <label className="block text-[11px] font-bold text-[#FFF8F0]/70 mb-1">
                    Or Enter Direct Image URL Link:
                  </label>
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>
            </div>

            {/* Additional Gallery Photos */}
            <div className="pt-3 border-t border-[#F4A62A]/15 space-y-2">
              <label className="block text-xs font-bold text-[#FFF8F0]/80">
                Gallery Images (Optional):
              </label>
              <div className="flex flex-col gap-2">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={galleryInputRef}
                  onChange={handleGalleryFileUpload}
                  className="hidden"
                />
                
                <div className="flex gap-2 w-full">
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#500A18] text-[#F4A62A] border border-[#F4A62A]/40 text-xs font-bold hover:bg-[#7A1126] cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Upload className="w-4 h-4" /> Upload Local Photos
                  </button>
                  <div className="flex-1 flex gap-2">
                    <input
                      type="url"
                      placeholder="Or enter image URL link..."
                      value={inputGalleryUrl}
                      onChange={e => setInputGalleryUrl(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="px-4 py-2.5 rounded-xl bg-[#1C080C] text-[#F4A62A] border border-[#F4A62A]/30 text-xs font-bold hover:bg-[#2B1217] cursor-pointer shrink-0"
                    >
                      Add URL
                    </button>
                  </div>
                </div>
              </div>

              {gallery.length > 0 && (
                <div className="flex flex-wrap gap-3 pt-2">
                  {gallery.map((gUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`w-20 h-20 rounded-xl bg-[#120508] border ${draggedIdx === idx ? 'border-emerald-500 opacity-50' : 'border-[#F4A62A]/30'} overflow-hidden relative group cursor-grab active:cursor-grabbing`}
                      draggable
                      onDragStart={() => setDraggedIdx(idx)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(idx);
                      }}
                    >
                      <img src={gUrl} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      
                      {/* Controls Overlay */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1">
                        <div className="flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryItem(idx)}
                            className="p-1 bg-red-500/80 hover:bg-red-500 text-white rounded cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <div className="flex justify-between items-center bg-black/40 rounded px-1 pb-0.5">
                          <button
                            type="button"
                            onClick={() => moveGalleryItem(idx, 'left')}
                            disabled={idx === 0}
                            className={`p-0.5 rounded cursor-pointer ${idx === 0 ? 'text-white/20' : 'text-white hover:bg-white/20'}`}
                            title="Move Left"
                          >
                            <ChevronLeft className="w-3 h-3" />
                          </button>
                          <span className="text-[9px] font-bold text-white/80 select-none">
                            {idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => moveGalleryItem(idx, 'right')}
                            disabled={idx === gallery.length - 1}
                            className={`p-0.5 rounded cursor-pointer ${idx === gallery.length - 1 ? 'text-white/20' : 'text-white hover:bg-white/20'}`}
                            title="Move Right"
                          >
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Pricing & Profit Calculator Card */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider">
              Pricing & Profitability
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                  Sale Price (₹) *
                </label>
                <input
                  type="number"
                  required
                  min={0}
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/70 mb-1">
                  Original Price (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={originalPrice}
                  onChange={e => setOriginalPrice(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/70 mb-1">
                  Cost per item (₹)
                </label>
                <input
                  type="number"
                  min={0}
                  value={costPerItem}
                  onChange={e => setCostPerItem(Number(e.target.value))}
                  className="w-full text-sm p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>
            </div>

            {/* Profit Margin Display Bar */}
            <div className="bg-[#1C080C] p-3.5 rounded-xl border border-[#F4A62A]/20 flex items-center justify-between text-xs font-bold">
              <span className="text-[#FFF8F0]/70">Calculated Profit: <span className="text-[#F4A62A] font-mono">₹{profit}</span></span>
              <span className="text-[#FFF8F0]/70">Margin: <span className="text-emerald-400 font-mono">{margin}%</span></span>
              <span className="text-[#FFF8F0]/70">Devotee Discount: <span className="text-[#F4A62A] font-mono">{discountPercentage}% OFF</span></span>
            </div>
          </div>

          {/* Search Engine Listing Section (Exact URL & Live Website Preview) */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#F4A62A]" /> Search engine listing
                </h3>
                <p className="text-[11px] text-[#FFF8F0]/60 mt-0.5">
                  Add a title and description to see how this product will show up in search results.
                </p>
              </div>

              {!isEditingSeo && (
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingSeo(true);
                    setSeoTitle(name);
                    setSeoDescription(fullDesc);
                    setSeoSlug(autoSlug);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#500A18] text-[#F4A62A] border border-[#F4A62A]/30 text-xs font-bold hover:bg-[#7A1126] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Pencil className="w-3.5 h-3.5" /> Edit SEO
                </button>
              )}
            </div>

            {/* Search Engine Result Live Preview Box */}
            <div className="bg-[#120508] p-4 rounded-xl border border-[#F4A62A]/20 space-y-1 font-sans">
              <div className="text-xs text-[#FFF8F0]/60 font-mono flex items-center gap-1">
                <span>https://babadham.org</span>
                <span>›</span>
                <span>products</span>
                <span>›</span>
                <span className="text-[#F4A62A] font-bold">{liveUrlSlug}</span>
              </div>

              <h4 className="text-base font-bold text-[#60A5FA] hover:underline cursor-pointer line-clamp-1">
                {seoTitle || name || 'New Sacred Product Title'} - BABA BAIDYANATH PRASADAM
              </h4>

              <p className="text-xs text-[#FFF8F0]/80 line-clamp-2 leading-relaxed">
                {seoDescription || fullDesc || 'Authentic sanctum offered prasad delivered pan-India with pure devotion.'}
              </p>
            </div>

            {/* SEO Editable Form Fields */}
            {isEditingSeo && (
              <div className="pt-3 border-t border-[#F4A62A]/15 space-y-3 animate-in fade-in">
                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">Page Title</label>
                  <input
                    type="text"
                    value={seoTitle}
                    onChange={e => setSeoTitle(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">Meta Description</label>
                  <textarea
                    rows={3}
                    value={seoDescription}
                    onChange={e => setSeoDescription(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#F4A62A] mb-1">
                    URL handle (Strictly live website URL: <span className="text-emerald-400 font-mono">{liveUrl}</span>)
                  </label>
                  <input
                    type="text"
                    value={seoSlug}
                    onChange={e => setSeoSlug(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white font-mono focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: Inventory, Organization & Collections */}
        <div className="space-y-6">
          
          {/* Status & Category Card */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider">
              Product Organization
            </h3>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#FFF8F0]/80">
                  Category *
                </label>
                <button
                  type="button"
                  onClick={() => setIsCategoryModalOpen(true)}
                  className="text-[11px] text-[#F4A62A] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                >
                  + Add / Manage Custom Categories
                </button>
              </div>

              <select
                value={category}
                onChange={e => setCategory(e.target.value as ProductCategory)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} {cat.hindiName ? `(${cat.hindiName})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Badge / Tag (e.g. Temple Blessed)
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Purity Grade
              </label>
              <input
                type="text"
                value={purityGrade}
                onChange={e => setPurityGrade(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Origin / Sanctum Gate
              </label>
              <input
                type="text"
                value={origin}
                onChange={e => setOrigin(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Vendor / Supplier
              </label>
              <select
                value={vendor}
                onChange={e => setVendor(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              >
                <option value="">Select Temple Vendor / Supplier (Optional)</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.name}>
                    {v.name} ({v.category || 'Supplier'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Stock & Quantity Card */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider">
              Inventory & Weight
            </h3>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Stock Quantity Available
              </label>
              <input
                type="number"
                min={0}
                value={stockCount}
                onChange={e => setStockCount(Number(e.target.value))}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">
                Package Weight
              </label>
              <input
                type="text"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="inStockCheck"
                checked={inStock}
                onChange={e => setInStock(e.target.checked)}
                className="w-4 h-4 rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
              />
              <label htmlFor="inStockCheck" className="text-xs font-bold text-white cursor-pointer">
                In Stock & Ready for Dispatch
              </label>
            </div>
          </div>

          {/* Collections Selector Card */}
          <div className="bg-[#2B1217] p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
            <h3 className="font-bold text-sm text-[#F4A62A] uppercase tracking-wider flex items-center gap-2">
              <Tag className="w-4 h-4" /> Add to Collections
            </h3>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {collections.map(col => {
                const isChecked = selectedCollectionIds.includes(col.id);
                return (
                  <label key={col.id} className="flex items-center gap-2.5 p-2 rounded-xl bg-[#120508] border border-[#F4A62A]/20 hover:border-[#F4A62A]/50 transition-colors cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {
                        setSelectedCollectionIds(prev => 
                          prev.includes(col.id) ? prev.filter(id => id !== col.id) : [...prev, col.id]
                        );
                      }}
                      className="w-4 h-4 rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
                    />
                    <span className="font-bold text-white">{col.title}</span>
                  </label>
                );
              })}
            </div>
          </div>

        </div>

      </form>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />
    </div>
  );
};
