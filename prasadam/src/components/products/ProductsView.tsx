import React, { useState } from 'react';
import { InventoryView } from './InventoryView';
import { AddProductView } from './AddProductView';
import { VendorsView } from './VendorsView';
import { useAdmin } from '../../context/AdminContext';
import type { Collection } from '../../types/ecommerce';
import { 
  Package, 
  Layers, 
  ShoppingCart, 
  Store,
  Gift, 
  Plus, 
  Tag,
  Search,
  ChevronsUpDown,
  ChevronDown,
  Columns3,
  Image as ImageIcon,
  HelpCircle,
  X,
  ArrowLeft,
  Upload,
  LayoutGrid,
  List,
  Columns4,
  Pencil,
  Trash2,
  Check,
  AlignLeft,
  MoreHorizontal,
  Code,
  Eye,
  EyeOff
} from 'lucide-react';

export type ProductSubTab = 'collections' | 'products' | 'purchase-orders' | 'vendors' | 'gift-cards';

interface ProductsViewProps {
  initialSubTab?: ProductSubTab;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ initialSubTab = 'products' }) => {
  const { collections, products, saveCollection, deleteCollection, showToast } = useAdmin();
  const [activeSubTab, setActiveSubTab] = useState<ProductSubTab>(initialSubTab as any === 'inventory' || initialSubTab as any === 'add-product' ? 'products' : initialSubTab);
  const [productMode, setProductMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const handleDeleteCurrentCollection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      deleteCollection(id);
      setViewState('list');
    }
  };

  // Collections List & Edit View State
  const [viewState, setViewState] = useState<'list' | 'add'>('list');
  const [editingCollectionId, setEditingCollectionId] = useState<string | null>(null);

  // Form Fields for Add / Edit Collection Page
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [salesChannels, setSalesChannels] = useState<number>(2);
  const [themeTemplate, setThemeTemplate] = useState('Default collection');
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [conditionRules, setConditionRules] = useState<string[]>(['Manual']);

  // Modals & Controls State
  const [collectionSearch, setCollectionSearch] = useState('');
  const [selectedCollectionIds, setSelectedCollectionIds] = useState<string[]>([]);
  const [isProductPickerOpen, setIsProductPickerOpen] = useState(false);
  const [productSearch, setProductSearch] = useState('');

  // Image File Upload Reference & Handler
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file size must be less than 8MB', 'warning');
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
              showToast('Collection image uploaded and optimized successfully!');
            };
            img.onerror = () => {
              setImageUrl(result);
              showToast('Collection image uploaded successfully!');
            };
            img.src = result;
          } else {
            setImageUrl(result);
            showToast('File uploaded successfully!');
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // SEO Custom Edit Fields State
  const [isEditingSeo, setIsEditingSeo] = useState(false);
  const [customSeoTitle, setCustomSeoTitle] = useState('');
  const [customSeoDescription, setCustomSeoDescription] = useState('');
  const [customSeoSlug, setCustomSeoSlug] = useState('');

  // Start "Add Collection" Mode
  const handleOpenAddCollection = () => {
    setEditingCollectionId(null);
    setTitle('');
    setDescription('');
    setImageUrl(null);
    setSalesChannels(2);
    setThemeTemplate('Default collection');
    setSelectedProductIds([]);
    setConditionRules(['Manual']);
    setIsEditingSeo(false);
    setCustomSeoTitle('');
    setCustomSeoDescription('');
    setCustomSeoSlug('');
    setViewState('add');
  };

  // Edit Existing Collection
  const handleEditCollection = (col: Collection) => {
    setEditingCollectionId(col.id);
    setTitle(col.title);
    setDescription(col.description || '');
    setImageUrl(col.image);
    setSalesChannels(col.salesChannels || 2);
    setThemeTemplate(col.themeTemplate || 'Default collection');
    setSelectedProductIds(col.productIds || []);
    setConditionRules(col.conditions ? [col.conditions] : ['Manual']);
    setIsEditingSeo(false);
    setCustomSeoTitle(col.title);
    setCustomSeoDescription(col.description || '');
    setCustomSeoSlug(col.slug || col.title.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
    setViewState('add');
  };

  // Save Collection to Database
  const handleSaveCollectionSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!title.trim()) {
      showToast('Please enter a title for the collection', 'warning');
      return;
    }

    const autoSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalSlug = customSeoSlug.trim() ? customSeoSlug.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') : autoSlug;
    
    const existingCol = collections.find(c => c.id === editingCollectionId);

    const newCol: Collection = {
      id: editingCollectionId || Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      image: imageUrl,
      productsCount: selectedProductIds.length,
      conditions: conditionRules.join(', '),
      salesChannels,
      themeTemplate,
      productIds: selectedProductIds,
      slug: finalSlug,
      status: existingCol?.status || 'Active'
    };

    saveCollection(newCol);
    setViewState('list');
  };

  // Toggle Selection in List
  const toggleSelectAll = () => {
    if (selectedCollectionIds.length === collections.length) {
      setSelectedCollectionIds([]);
    } else {
      setSelectedCollectionIds(collections.map(c => c.id));
    }
  };

  const toggleSelectCollection = (id: string) => {
    setSelectedCollectionIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Bulk Delete Selected Collections
  const handleBulkDeleteCollections = () => {
    if (selectedCollectionIds.length === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedCollectionIds.length} collection(s)?`)) {
      selectedCollectionIds.forEach(id => deleteCollection(id));
      setSelectedCollectionIds([]);
      showToast(`Deleted ${selectedCollectionIds.length} collection(s) cleanly`, 'info');
    }
  };

  // Delete Individual Collection
  const handleSingleDeleteCollection = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete collection "${title}"?`)) {
      deleteCollection(id);
      setSelectedCollectionIds(prev => prev.filter(item => item !== id));
      showToast(`Collection "${title}" deleted successfully`, 'info');
    }
  };

  // Toggle Product Picker Selection
  const toggleProductSelection = (id: string) => {
    setSelectedProductIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const filteredCollections = collections.filter(c =>
    c.title.toLowerCase().includes(collectionSearch.toLowerCase())
  );

  const filteredPickerProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProductsList = products.filter(p => selectedProductIds.includes(p.id));

  // Demo Purchase Orders State
  const [purchaseOrders] = useState([
    { id: 'PO-2026-001', supplier: 'Deoghar Goshala Cooperative', items: 'Pure Cow Milk (500L)', amount: '₹35,000', status: 'Received', date: '2026-08-01' },
    { id: 'PO-2026-002', supplier: 'Sultanganj Ganga Trust', items: 'Sealed Copper Kalash (200 Pcs)', amount: '₹18,500', status: 'In Transit', date: '2026-08-03' },
    { id: 'PO-2026-003', supplier: 'Varanasi Silk Weaver Union', items: 'Pavitra Angavastram (100 Sets)', amount: '₹24,000', status: 'Ordered', date: '2026-08-04' }
  ]);

  // Demo Gift Cards State
  const [giftCards] = useState([
    { code: 'BHAKTI500', value: 500, balance: 500, recipient: 'Devotee Gift Card', status: 'Active' },
    { code: 'MAHADEV1000', value: 1000, balance: 1000, recipient: 'Festival Puja Voucher', status: 'Active' },
    { code: 'SHIVBHOG2500', value: 2500, balance: 2500, recipient: 'VVIP Bhog Card', status: 'Active' }
  ]);

  const subNavItems: { id: ProductSubTab; label: string; icon: any }[] = [
    { id: 'collections', label: 'Collections', icon: Layers },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'purchase-orders', label: 'Purchase orders', icon: ShoppingCart },
    { id: 'vendors', label: 'Vendors', icon: Store },
    { id: 'gift-cards', label: 'Gift cards', icon: Gift },
  ];

  return (
    <div className="min-h-full bg-[#120508] text-[#FFF8F0] flex flex-col">
      
      {/* Top Sub-Tab Navigation Header (Matching Policy Bar Style) */}
      <div className="bg-[#1C080C] border-b border-[#F4A62A]/25 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#500A18] border border-[#F4A62A]/40 flex items-center justify-center text-[#F4A62A]">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif-temple font-bold text-base sm:text-lg text-[#F4A62A]">
              Products Management Portal
            </h2>
            <p className="text-[11px] text-[#FFF8F0]/60">
              Catalog, Stock, Suppliers, Stock Transfers & Vouchers
            </p>
          </div>
        </div>

        {/* Horizontal Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          {subNavItems.map((item) => {
            const IconComp = item.icon;
            const isActive = activeSubTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveSubTab(item.id);
                  setViewState('list');
                }}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/50 shadow-[0_0_12px_rgba(244,166,42,0.3)]'
                    : 'bg-[#120508] text-[#FFF8F0]/70 hover:text-[#F4A62A] hover:bg-[#2B1217] border border-[#F4A62A]/15'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main SubTab Workplace Body */}
      <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
        
        {/* 1. COLLECTIONS VIEW */}
        {activeSubTab === 'collections' && (
          <>
            {/* VIEW MODE A: LIST COLLECTIONS TABLE */}
            {viewState === 'list' && (
              <div className="space-y-5">
                
                {/* Collections Page Top Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Tag className="w-5 h-5 text-[#F4A62A]" />
                    <h1 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
                      Collections
                    </h1>
                  </div>
                  
                  <button
                    onClick={handleOpenAddCollection}
                    className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Add collection
                  </button>
                </div>

                {/* Main Content Table Card (Matching Screenshot Structure & Dark/Gold Theme) */}
                <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 shadow-xl overflow-hidden">
                  
                  {/* Search & Filter Top Bar */}
                  <div className="p-3 bg-[#1C080C] border-b border-[#F4A62A]/20 flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 flex-1 min-w-[240px]">
                      
                      {/* "All" Dropdown Filter Pill */}
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#2B1217] border border-[#F4A62A]/30 text-[#F4A62A] font-bold hover:bg-[#3D1A21] transition-all cursor-pointer shrink-0">
                        <span>All</span>
                        <ChevronsUpDown className="w-3.5 h-3.5 opacity-80" />
                      </button>

                      {/* Search and Filter Input Field */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F4A62A]" />
                        <input
                          type="text"
                          placeholder="Search and filter"
                          value={collectionSearch}
                          onChange={e => setCollectionSearch(e.target.value)}
                          className="w-full h-[36px] pl-9 pr-4 rounded-xl bg-[#120508] border border-[#F4A62A]/25 text-white placeholder-[#FFF8F0]/40 text-xs focus:outline-none focus:border-[#F4A62A]"
                        />
                      </div>
                    </div>

                    {/* Right Action Icons & Bulk Delete Button */}
                    <div className="flex items-center gap-2">
                      {selectedCollectionIds.length > 0 && (
                        <button
                          onClick={handleBulkDeleteCollections}
                          className="px-3 py-1.5 rounded-lg bg-red-950 text-red-300 border border-red-500/40 font-bold text-xs hover:bg-red-900 flex items-center gap-1.5 transition-all cursor-pointer shadow-md"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete ({selectedCollectionIds.length})
                        </button>
                      )}

                      <button className="p-2 rounded-lg bg-[#2B1217] border border-[#F4A62A]/20 text-[#FFF8F0]/70 hover:text-[#F4A62A] hover:border-[#F4A62A]/40 transition-all cursor-pointer">
                        <Columns3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Collections Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20 select-none">
                        <tr>
                          <th className="p-3.5 w-10 text-center">
                            <input
                              type="checkbox"
                              checked={selectedCollectionIds.length === collections.length && collections.length > 0}
                              onChange={toggleSelectAll}
                              className="rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
                            />
                          </th>
                          <th className="p-3.5">Title</th>
                          <th className="p-3.5">Status</th>
                          <th className="p-3.5 text-center">Products</th>
                          <th className="p-3.5">Conditions</th>
                          <th className="p-3.5 text-right">Actions</th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-[#F4A62A]/10">
                        {filteredCollections.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-xs text-[#FFF8F0]/50 space-y-2">
                              <Tag className="w-8 h-8 text-[#F4A62A]/40 mx-auto" />
                              <p className="font-bold text-white text-sm">No collections found in database.</p>
                              <p className="text-[11px] text-[#FFF8F0]/60">Click "Add collection" above to create a fresh new collection.</p>
                            </td>
                          </tr>
                        ) : (
                          filteredCollections.map(col => {
                            const isSelected = selectedCollectionIds.includes(col.id);
                            const isActive = col.status !== 'Draft';

                            return (
                              <tr 
                                key={col.id}
                                onClick={() => handleEditCollection(col)}
                                className={`transition-colors cursor-pointer ${
                                  isSelected ? 'bg-[#3D1A21]/70' : 'hover:bg-[#1A0B0E]/60'
                                }`}
                              >
                                {/* Checkbox Cell */}
                                <td className="p-3.5 text-center" onClick={(e) => e.stopPropagation()}>
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => toggleSelectCollection(col.id)}
                                    className="rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
                                  />
                                </td>

                                {/* Title with Thumbnail Frame */}
                                <td className="p-3.5">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#120508] border border-[#F4A62A]/30 overflow-hidden shrink-0 flex items-center justify-center text-[#F4A62A]/60">
                                      {col.image ? (
                                        <img src={col.image} alt={col.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <ImageIcon className="w-4 h-4 text-[#F4A62A]/50" />
                                      )}
                                    </div>
                                    <div>
                                      <span className="font-bold text-white hover:text-[#F4A62A] transition-colors block">
                                        {col.title}
                                      </span>
                                      {col.description && (
                                        <span className="text-[11px] text-[#FFF8F0]/50 line-clamp-1">
                                          {col.description}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>

                                {/* Status */}
                                <td className="p-3.5">
                                  {isActive ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                      Active
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#1A0B0E] text-[#FFF8F0]/70 border border-[#F4A62A]/30">
                                      Draft
                                    </span>
                                  )}
                                </td>

                                {/* Products Count */}
                                <td className="p-3.5 text-center font-bold text-[#F4A62A]">
                                  {col.productIds?.length || 0}
                                </td>

                                {/* Conditions */}
                                <td className="p-3.5 text-[#FFF8F0]/70 font-medium">
                                  {col.conditions || 'Manual'}
                                </td>

                                {/* Actions Cell */}
                                <td className="p-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleEditCollection(col); }}
                                      className="p-1.5 text-[#F4A62A] hover:text-white bg-[#500A18] hover:bg-[#7A1126] border border-[#F4A62A]/30 rounded-lg transition-colors cursor-pointer shadow-md"
                                      title="Edit collection"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        saveCollection({ ...col, status: isActive ? 'Draft' : 'Active' });
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer shadow-md border ${
                                        isActive 
                                          ? 'text-emerald-300 hover:text-white bg-emerald-950 hover:bg-emerald-900 border-emerald-500/40' 
                                          : 'text-amber-300 hover:text-white bg-amber-950 hover:bg-amber-900 border-amber-500/40'
                                      }`}
                                      title={isActive ? "Disable collection" : "Enable collection"}
                                    >
                                      {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                                    </button>
                                    <button
                                      onClick={(e) => handleSingleDeleteCollection(e, col.id, col.title)}
                                      className="p-1.5 text-red-400 hover:text-red-200 bg-red-950/60 hover:bg-red-900 border border-red-500/30 rounded-lg transition-colors cursor-pointer shadow-md"
                                      title="Delete collection"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>

                </div>

                {/* Bottom Help Link (Matching Screenshot) */}
                <div className="text-center pt-2">
                  <a 
                    href="#learn-collections" 
                    onClick={(e) => {
                      e.preventDefault();
                      showToast('Collections group products dynamically by tags, categories, or manual selection.');
                    }}
                    className="text-xs text-[#FFF8F0]/70 hover:text-[#F4A62A] transition-colors inline-flex items-center gap-1.5 font-medium underline underline-offset-4"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-[#F4A62A]" /> Learn more about collections
                  </a>
                </div>

              </div>
            )}

            {/* VIEW MODE B: ADD / EDIT COLLECTION FORM PAGE (Matching User's Screenshot Layout Exactly) */}
            {viewState === 'add' && (
              <div className="space-y-6 max-w-7xl mx-auto pb-10 animate-in fade-in duration-200">
                
                {/* Top Header Breadcrumb & Actions Bar */}
                <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setViewState('list')}
                      className="p-2 rounded-xl bg-[#2B1217] border border-[#F4A62A]/30 text-[#F4A62A] hover:bg-[#3D1A21] transition-all cursor-pointer"
                      title="Back to Collections"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>

                    <div className="flex items-center gap-2 text-xs sm:text-sm">
                      <Tag className="w-4 h-4 text-[#F4A62A]" />
                      <span className="text-[#FFF8F0]/60">›</span>
                      <h1 className="font-bold text-lg sm:text-xl text-white">
                        {editingCollectionId ? 'Edit collection' : 'Add collection'}
                      </h1>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {editingCollectionId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCurrentCollection(editingCollectionId)}
                        className="px-3.5 py-2 rounded-xl bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setViewState('list')}
                      className="px-4 py-2 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 text-[#FFF8F0]/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSaveCollectionSubmit()}
                      className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Save Collection
                    </button>
                  </div>
                </div>

                {/* 2-COLUMN MAIN EDITING GRID (Matching Screenshot Layout) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  {/* LEFT COLUMN (2-Span): Main Details & Live Product Grid */}
                  <div className="lg:col-span-2 space-y-6">
                    
                    {/* Card 1: Main Title, Description & Image Upload */}
                    <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
                      
                      <div className="flex flex-col sm:flex-row gap-5 items-start">
                        
                        {/* Image Upload Box (Left Box in Screenshot) */}
                        <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl border-2 border-dashed border-[#F4A62A]/40 bg-[#1A0B0E] flex flex-col items-center justify-center relative group hover:border-[#F4A62A] transition-all shrink-0 overflow-hidden">
                          {imageUrl ? (
                            <>
                              <img src={imageUrl} alt="Collection" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/65 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => fileInputRef.current?.click()}
                                  className="p-2 rounded-xl bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 hover:bg-[#9E1632] shadow-md"
                                  title="Change Image File"
                                >
                                  <Upload className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setImageUrl(null)}
                                  className="p-2 rounded-xl bg-red-950 text-red-300 border border-red-500/40 hover:bg-red-900 shadow-md"
                                  title="Remove Image"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </>
                          ) : (
                            <div className="text-center p-3 space-y-2 w-full">
                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="w-10 h-10 rounded-full bg-[#500A18] border border-[#F4A62A]/40 text-[#F4A62A] flex items-center justify-center mx-auto hover:scale-110 hover:bg-[#7A1126] transition-all cursor-pointer shadow-md"
                                title="Click to choose image file"
                              >
                                <Upload className="w-5 h-5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="text-[11px] font-bold text-[#F4A62A] hover:underline block mx-auto cursor-pointer"
                              >
                                Upload image
                              </button>

                              <div className="pt-1 px-1">
                                <input
                                  type="url"
                                  placeholder="Or paste URL..."
                                  value={imageUrl || ''}
                                  onChange={(e) => setImageUrl(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full text-[10px] p-1.5 rounded-lg bg-[#120508] border border-[#F4A62A]/20 text-white focus:outline-none focus:border-[#F4A62A] text-center"
                                />
                              </div>
                            </div>
                          )}

                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </div>

                        {/* Right: Title, Description & Channels */}
                        <div className="flex-1 space-y-3 w-full">
                          
                          {/* Title Input ("Add title") */}
                          <div>
                            <input
                              type="text"
                              required
                              placeholder="Add title"
                              value={title}
                              onChange={e => setTitle(e.target.value)}
                              className="w-full text-xl sm:text-2xl font-extrabold text-white bg-transparent border-b border-[#F4A62A]/30 focus:border-[#F4A62A] pb-2 focus:outline-none placeholder-[#FFF8F0]/40"
                            />
                          </div>

                          {/* Classic WYSIWYG Rich Text Editor for Description (Matching User Screenshot) */}
                          <div className="border border-[#F4A62A]/30 rounded-xl overflow-hidden bg-[#1A0B0E] shadow-inner">
                            {/* Toolbar Header (Matching Screenshot: Paragraph v | B I U A v | Align v | ... </> ) */}
                            <div className="bg-[#2B1217] border-b border-[#F4A62A]/20 px-3 py-1.5 flex flex-wrap items-center gap-2 text-xs select-none text-[#FFF8F0]/90">
                              
                              {/* Paragraph Selector */}
                              <button type="button" className="flex items-center gap-1 font-semibold text-xs text-[#FFF8F0]/80 hover:text-white px-2 py-0.5 rounded bg-[#120508] border border-[#F4A62A]/20">
                                <span>Paragraph</span>
                                <ChevronDown className="w-3 h-3 text-[#F4A62A]" />
                              </button>

                              <span className="text-[#F4A62A]/30 font-light">|</span>

                              {/* Formatting: Bold, Italic, Underline, Color */}
                              <div className="flex items-center gap-1">
                                <button 
                                  type="button" 
                                  onClick={() => setDescription(prev => prev + ' **bold**')}
                                  className="font-extrabold px-1.5 py-0.5 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] text-xs cursor-pointer"
                                  title="Bold"
                                >
                                  B
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setDescription(prev => prev + ' *italic*')}
                                  className="italic font-serif px-1.5 py-0.5 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] text-xs cursor-pointer"
                                  title="Italic"
                                >
                                  I
                                </button>
                                <button 
                                  type="button" 
                                  onClick={() => setDescription(prev => prev + ' <u>underline</u>')}
                                  className="underline px-1.5 py-0.5 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] text-xs cursor-pointer"
                                  title="Underline"
                                >
                                  U
                                </button>
                                <button 
                                  type="button" 
                                  className="flex items-center gap-0.5 px-1.5 py-0.5 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] text-xs cursor-pointer"
                                  title="Text Color"
                                >
                                  <span className="underline decoration-[#F4A62A] font-bold">A</span>
                                  <ChevronDown className="w-2.5 h-2.5 text-[#F4A62A]" />
                                </button>
                              </div>

                              <span className="text-[#F4A62A]/30 font-light">|</span>

                              {/* Alignment Dropdown */}
                              <button type="button" className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] text-xs cursor-pointer">
                                <AlignLeft className="w-3.5 h-3.5" />
                                <ChevronDown className="w-2.5 h-2.5 text-[#F4A62A]" />
                              </button>

                              <span className="text-[#F4A62A]/30 font-light">|</span>

                              {/* More Options (...) */}
                              <button type="button" className="p-1 rounded hover:bg-[#3D1A21] text-white hover:text-[#F4A62A] cursor-pointer">
                                <MoreHorizontal className="w-4 h-4" />
                              </button>

                              {/* Code View (</>) Right End */}
                              <button type="button" className="p-1 rounded hover:bg-[#3D1A21] text-[#F4A62A] hover:text-white ml-auto cursor-pointer" title="HTML Code View">
                                <Code className="w-4 h-4" />
                              </button>

                            </div>

                            {/* Description Textarea Content Area */}
                            <textarea
                              placeholder="Add description"
                              value={description}
                              onChange={e => setDescription(e.target.value)}
                              className="w-full h-32 p-3.5 bg-[#1A0B0E] text-xs text-white placeholder-[#FFF8F0]/40 focus:outline-none resize-none font-sans"
                            />
                          </div>

                        </div>

                      </div>

                    </div>

                    {/* Card 2: Collection Items & Live Product Preview Grid (Matching Screenshot) */}
                    <div className="bg-[#2B1217] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
                      
                      {/* Top Bar with Header & View Mode Toggles */}
                      <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-sm text-white">
                              Collection items
                            </h3>
                            <span className="px-2 py-0.5 rounded-full bg-[#500A18] text-[#F4A62A] text-[11px] font-bold border border-[#F4A62A]/30">
                              {selectedProductIds.length}
                            </span>
                          </div>
                          <p className="text-[11px] text-[#FFF8F0]/60 mt-0.5">
                            Add conditions or products to populate your collection
                          </p>
                        </div>

                        {/* View Mode Controls */}
                        <div className="flex items-center gap-1 bg-[#1A0B0E] p-1 rounded-xl border border-[#F4A62A]/20">
                          <button type="button" className="p-1.5 rounded-lg bg-[#7A1126] text-[#F4A62A]">
                            <LayoutGrid className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg text-[#FFF8F0]/50 hover:text-white">
                            <List className="w-4 h-4" />
                          </button>
                          <button type="button" className="p-1.5 rounded-lg text-[#FFF8F0]/50 hover:text-white flex items-center gap-0.5 text-[10px] font-bold px-2">
                            <Columns4 className="w-3.5 h-3.5" /> 4
                          </button>
                        </div>
                      </div>

                      {/* LIVE PRODUCT PREVIEW GRID */}
                      {selectedProductIds.length === 0 ? (
                        /* Skeleton / Empty Cards Placeholder Grid (Matching User Screenshot Layout Exactly) */
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-2">
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                            <div 
                              key={n} 
                              onClick={() => setIsProductPickerOpen(true)}
                              className="bg-[#1A0B0E]/80 border border-[#F4A62A]/20 rounded-2xl p-3 h-40 flex flex-col justify-between cursor-pointer hover:border-[#F4A62A] transition-all group"
                            >
                              <div className="w-full h-24 rounded-xl bg-[#2B1217] border border-[#F4A62A]/10 flex items-center justify-center text-[#F4A62A]/30 group-hover:text-[#F4A62A]/70 transition-colors">
                                <Plus className="w-6 h-6" />
                              </div>
                              <div className="space-y-1.5">
                                <div className="h-2.5 bg-[#2B1217] rounded-full w-3/4 animate-pulse"></div>
                                <div className="h-2 bg-[#2B1217] rounded-full w-1/2 animate-pulse"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Render Selected Products Live Preview Cards */
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 py-2">
                          {selectedProductsList.map((prod) => (
                            <div 
                              key={prod.id} 
                              className="bg-[#1A0B0E] border border-[#F4A62A]/30 rounded-2xl p-2.5 space-y-2 relative group hover:border-[#F4A62A] transition-all"
                            >
                              <button
                                type="button"
                                onClick={() => toggleProductSelection(prod.id)}
                                className="absolute top-3 right-3 p-1 rounded-lg bg-red-950 text-red-400 border border-red-500/40 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                title="Remove from Collection"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>

                              <div className="w-full h-24 rounded-xl overflow-hidden bg-[#120508] border border-[#F4A62A]/20">
                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                              </div>

                              <div>
                                <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-[#F4A62A]">
                                  {prod.name}
                                </h4>
                                <div className="flex items-center justify-between mt-1 text-[11px]">
                                  <span className="font-bold text-[#F4A62A]">₹{prod.price}</span>
                                  <span className="text-[9px] uppercase px-1.5 py-0.5 rounded bg-[#500A18] text-[#F4A62A]">
                                    {prod.category}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                    </div>

                    {/* Search Engine Listing (SEO Preview & Live Edit) */}
                    <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
                      <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-3">
                        <div>
                          <h3 className="font-bold text-xs text-[#FFF8F0]/90 uppercase tracking-wider">
                            Search engine listing
                          </h3>
                          <p className="text-[11px] text-[#FFF8F0]/50 mt-0.5">
                            Add a title and description to see how this collection will appear in search engine listings
                          </p>
                        </div>
                        <button 
                          type="button" 
                          onClick={() => {
                            if (!isEditingSeo) {
                              if (!customSeoTitle) setCustomSeoTitle(title);
                              if (!customSeoDescription) setCustomSeoDescription(description);
                              if (!customSeoSlug) setCustomSeoSlug(title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : '');
                            }
                            setIsEditingSeo(!isEditingSeo);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-[#F4A62A] hover:bg-[#3D1A21] text-xs flex items-center gap-1.5 font-bold transition-all cursor-pointer shrink-0"
                        >
                          <Pencil className="w-3.5 h-3.5" /> {isEditingSeo ? 'Close Edit' : 'Edit SEO'}
                        </button>
                      </div>

                      {/* Display Mode: Live Search Result Preview */}
                      <div className="space-y-1 bg-[#1A0B0E] p-4 rounded-xl border border-[#F4A62A]/15">
                        <div className="text-xs font-bold text-[#F4A62A]">
                          {customSeoTitle || title || 'My Store'}
                        </div>
                        <div className="text-[11px] text-emerald-400 font-mono break-all">
                          {(typeof window !== 'undefined' ? window.location.origin : 'http://localhost')} / collections / {customSeoSlug || (title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'collection')}
                        </div>
                        <div className="text-[11px] text-[#FFF8F0]/60 line-clamp-2">
                          {customSeoDescription || description || 'Authentic offered temple Prasad & sacred items from Baba Baidyanath Dham.'}
                        </div>
                      </div>

                      {/* Editing Mode: Interactive Input Fields */}
                      {isEditingSeo && (
                        <div className="space-y-3 pt-2 animate-in fade-in duration-150">
                          <div>
                            <label className="block text-[11px] font-bold text-[#F4A62A] mb-1">
                              Page title
                            </label>
                            <input
                              type="text"
                              value={customSeoTitle}
                              onChange={e => setCustomSeoTitle(e.target.value)}
                              placeholder="Collection page title..."
                              className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white font-medium focus:outline-none focus:border-[#F4A62A]"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#F4A62A] mb-1">
                              Meta description
                            </label>
                            <textarea
                              value={customSeoDescription}
                              onChange={e => setCustomSeoDescription(e.target.value)}
                              placeholder="Collection meta description for search engines..."
                              className="w-full h-20 text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A] resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-[#F4A62A] mb-1">
                              URL handle / slug
                            </label>
                            <div className="flex items-center rounded-xl bg-[#120508] border border-[#F4A62A]/30 overflow-hidden">
                              <span className="px-3 text-[11px] text-[#FFF8F0]/50 bg-[#1A0B0E] border-r border-[#F4A62A]/20 py-2.5 shrink-0 font-mono">
                                {(typeof window !== 'undefined' ? window.location.origin : 'http://localhost')}/collections/
                              </span>
                              <input
                                type="text"
                                value={customSeoSlug}
                                onChange={e => setCustomSeoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}
                                placeholder="collection-slug"
                                className="flex-1 text-xs p-2.5 bg-transparent text-white font-mono focus:outline-none"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>

                  {/* RIGHT COLUMN (1-Span): Products Section */}
                  <div className="lg:col-span-1 space-y-6">
                    
                    {/* Card 1: Products Section (Only Add Products Button) */}
                    <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-xl space-y-4">
                      
                      {/* Products Selector Header */}
                      <button 
                        type="button"
                        className="w-full flex items-center justify-between p-3 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white font-bold text-xs cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-[#F4A62A]">
                          <Tag className="w-4 h-4" />
                          <span>Products</span>
                        </div>
                        <ChevronsUpDown className="w-4 h-4 text-[#F4A62A]" />
                      </button>

                      {/* ONLY KEEP ADD PRODUCTS BUTTON */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => setIsProductPickerOpen(true)}
                          className="w-full py-2.5 px-4 rounded-xl bg-[#7A1126] border border-[#F4A62A]/50 text-xs font-bold text-[#F4A62A] hover:bg-[#9E1632] flex items-center justify-center gap-2 cursor-pointer shadow-md"
                        >
                          <Plus className="w-4 h-4 text-[#F4A62A]" /> Add products
                        </button>
                      </div>

                    </div>

                    {/* Card 2: Extra Dashed Add Box */}
                    <div 
                      onClick={() => setIsProductPickerOpen(true)}
                      className="border-2 border-dashed border-[#F4A62A]/40 hover:border-[#F4A62A] rounded-2xl p-6 bg-[#1A0B0E]/60 flex items-center justify-center text-[#F4A62A] cursor-pointer transition-all hover:bg-[#1A0B0E]"
                    >
                      <div className="w-10 h-10 rounded-full bg-[#500A18] border border-[#F4A62A]/40 flex items-center justify-center">
                        <Plus className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Bar */}
                <div className="flex items-center justify-between bg-[#2B1217] p-4 rounded-2xl border border-[#F4A62A]/30 shadow-xl">
                  <div className="text-xs text-[#FFF8F0]/70">
                    {editingCollectionId ? 'Modifying existing collection' : 'Creating fresh new collection'}
                  </div>
                  <div className="flex items-center gap-2">
                    {editingCollectionId && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCurrentCollection(editingCollectionId)}
                        className="px-3.5 py-2 rounded-xl bg-red-950/60 text-red-300 border border-red-500/40 hover:bg-red-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete Collection
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setViewState('list')}
                      className="px-4 py-2 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 text-[#FFF8F0]/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveCollectionSubmit()}
                      className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-lg flex items-center gap-1.5 cursor-pointer"
                    >
                      <Check className="w-4 h-4" /> Save Collection
                    </button>
                  </div>
                </div>

              </div>
            )}

            {/* PRODUCT SELECTION MODAL (Opens when clicking "+ Add products") */}
            {isProductPickerOpen && (
              <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-[#2B1217] border border-[#F4A62A]/50 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
                  
                  {/* Modal Header */}
                  <div className="p-4 bg-[#1C080C] border-b border-[#F4A62A]/20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#F4A62A]" />
                      <h3 className="font-bold text-base text-white">
                        Add Products to Collection
                      </h3>
                    </div>
                    <button 
                      onClick={() => setIsProductPickerOpen(false)}
                      className="text-[#FFF8F0]/60 hover:text-white p-1 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="p-3 bg-[#1A0B0E] border-b border-[#F4A62A]/15">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F4A62A]" />
                      <input
                        type="text"
                        placeholder="Search products in inventory..."
                        value={productSearch}
                        onChange={e => setProductSearch(e.target.value)}
                        className="w-full h-[38px] pl-9 pr-4 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white text-xs focus:outline-none focus:border-[#F4A62A]"
                      />
                    </div>
                  </div>

                  {/* Products List */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {filteredPickerProducts.length === 0 ? (
                      <div className="text-center py-8 text-xs text-[#FFF8F0]/50">
                        No matching products found.
                      </div>
                    ) : (
                      filteredPickerProducts.map(prod => {
                        const isChecked = selectedProductIds.includes(prod.id);

                        return (
                          <div
                            key={prod.id}
                            onClick={() => toggleProductSelection(prod.id)}
                            className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isChecked 
                                ? 'bg-[#7A1126]/60 border-[#F4A62A]' 
                                : 'bg-[#1A0B0E] border-[#F4A62A]/20 hover:border-[#F4A62A]/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleProductSelection(prod.id)}
                                className="rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
                              />
                              <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover border border-[#F4A62A]/30" />
                              <div>
                                <h4 className="font-bold text-xs text-white">{prod.name}</h4>
                                <span className="text-[10px] text-[#F4A62A] font-semibold">₹{prod.price}</span>
                              </div>
                            </div>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#500A18] text-[#F4A62A]">
                              {prod.category}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Modal Footer */}
                  <div className="p-3.5 bg-[#1C080C] border-t border-[#F4A62A]/20 flex items-center justify-between text-xs">
                    <span className="text-[#FFF8F0]/70 font-semibold">
                      {selectedProductIds.length} products selected
                    </span>
                    <button
                      onClick={() => setIsProductPickerOpen(false)}
                      className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold hover:bg-white transition-all shadow-md"
                    >
                      Done
                    </button>
                  </div>

                </div>
              </div>
            )}
          </>
        )}

        {/* 3. PURCHASE ORDERS VIEW */}
        {activeSubTab === 'purchase-orders' && (
          <div className="space-y-6">
            <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">
                  Supplier Purchase Orders & Raw Bhog Supply
                </h3>
                <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
                  Track bulk milk, ingredients, packaging, and sacred items procurement.
                </p>
              </div>
              <button
                onClick={() => showToast('New Purchase Order issued')}
                className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Issue Purchase Order
              </button>
            </div>

            <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20">
                  <tr>
                    <th className="p-3">PO Number</th>
                    <th className="p-3">Supplier Name</th>
                    <th className="p-3">Procurement Items</th>
                    <th className="p-3">PO Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Order Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F4A62A]/10">
                  {purchaseOrders.map(po => (
                    <tr key={po.id} className="hover:bg-[#1A0B0E]/50">
                      <td className="p-3 font-mono font-bold text-[#F4A62A]">{po.id}</td>
                      <td className="p-3 font-medium text-white">{po.supplier}</td>
                      <td className="p-3 text-[#FFF8F0]/80">{po.items}</td>
                      <td className="p-3 font-bold text-[#F4A62A]">{po.amount}</td>
                      <td className="p-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          po.status === 'Received' 
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                            : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="p-3 text-[#FFF8F0]/60">{po.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 2. PRODUCTS VIEW (Catalog list + Add Product view) */}
        {activeSubTab === 'products' && (
          <div>
            {productMode === 'list' ? (
              <InventoryView 
                onAddProductClick={() => { setEditingProductId(null); setProductMode('add'); }} 
                onEditProductClick={(id) => { setEditingProductId(id); setProductMode('edit'); }}
              />
            ) : (
              <div className="space-y-4">
                <button
                  onClick={() => setProductMode('list')}
                  className="px-3.5 py-2 rounded-xl bg-[#2B1217] text-[#F4A62A] border border-[#F4A62A]/40 text-xs font-bold hover:bg-[#500A18] transition-all cursor-pointer flex items-center gap-2 shadow-md"
                >
                  <ArrowLeft className="w-4 h-4" /> Back to Products List
                </button>
                <AddProductView 
                  productId={editingProductId}
                  onSuccess={() => { setEditingProductId(null); setProductMode('list'); }} 
                />
              </div>
            )}
          </div>
        )}

        {/* 4. VENDORS VIEW */}
        {activeSubTab === 'vendors' && (
          <VendorsView />
        )}

        {/* 5. GIFT CARDS VIEW */}
        {activeSubTab === 'gift-cards' && (
          <div className="space-y-6">
            <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
              <div>
                <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">
                  Devotional Gift Cards & Sacred Vouchers
                </h3>
                <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
                  Issue and manage prepaid bhog and seva gift vouchers for devotees.
                </p>
              </div>
              <button
                onClick={() => showToast('New Gift Voucher generated')}
                className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Issue Gift Card
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {giftCards.map(gc => (
                <div key={gc.code} className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/40 space-y-3 shadow-lg">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-lg bg-[#500A18] text-[#F4A62A]"><Gift className="w-5 h-5" /></span>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-300 text-[10px] font-bold rounded border border-emerald-500/30">{gc.status}</span>
                  </div>
                  <div>
                    <div className="font-mono font-extrabold text-base text-[#F4A62A] tracking-wider">{gc.code}</div>
                    <div className="text-xs text-[#FFF8F0]/80 mt-0.5">{gc.recipient}</div>
                  </div>
                  <div className="pt-2 border-t border-[#F4A62A]/20 flex items-center justify-between text-xs">
                    <span className="text-[#FFF8F0]/70">Initial Value: ₹{gc.value}</span>
                    <span className="font-bold text-[#F4A62A]">Balance: ₹{gc.balance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
