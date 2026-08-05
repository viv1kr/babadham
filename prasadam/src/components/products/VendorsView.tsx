import React, { useState, useRef, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Store, Plus, Search, Trash2, Phone, Mail, MapPin, X, ShieldCheck, Pencil, Eye, EyeOff, Upload } from 'lucide-react';
import { Vendor } from '../../types/ecommerce';

const VendorCard = ({ 
  vendor, 
  suppliedCount, 
  handleToggleVendorStatus, 
  handleEditVendor, 
  handleDeleteVendor 
}: { 
  vendor: Vendor; 
  suppliedCount: number;
  handleToggleVendorStatus: (v: Vendor) => void;
  handleEditVendor: (v: Vendor) => void;
  handleDeleteVendor: (id: string, name: string) => void;
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!vendor.photos || vendor.photos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % vendor.photos!.length);
    }, 3000); // 3 seconds
    return () => clearInterval(interval);
  }, [vendor.photos]);

  return (
    <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 shadow-[0_8px_30px_rgb(0,0,0,0.4)] hover:border-[#F4A62A]/60 hover:-translate-y-1 hover:shadow-[0_8px_40px_rgba(244,166,42,0.15)] transition-all duration-300 overflow-hidden flex flex-col relative group">
      
      {/* Top Section: Photo Carousel or Fallback Header */}
      {vendor.photos && vendor.photos.length > 0 ? (
        <div className="w-full h-48 sm:h-56 relative bg-[#120508] border-b border-[#F4A62A]/20">
          <img 
            src={vendor.photos[currentImageIndex]} 
            alt={vendor.name} 
            className="w-full h-full object-cover transition-opacity duration-500" 
          />
          {/* Gradient overlay for seamless blend into content */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2B1217] via-[#2B1217]/20 to-black/40"></div>
          
          {/* Status Badge floating top left */}
          <div className="absolute top-3 left-3 z-10">
            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold shadow-lg backdrop-blur-md ${
              vendor.status === 'Active' 
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30' 
                : 'bg-zinc-900/80 text-zinc-400 border border-zinc-700/50'
            }`}>
              {vendor.status}
            </span>
          </div>

          {/* Dots for carousel */}
          {vendor.photos.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
               {vendor.photos.map((_, i) => (
                  <div key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === currentImageIndex ? 'bg-[#F4A62A]' : 'bg-white/40'}`}></div>
               ))}
            </div>
          )}

          {/* Floating Actions on Hover */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <button
              onClick={() => handleToggleVendorStatus(vendor)}
              className={`p-2 rounded-lg transition-colors cursor-pointer shadow-lg backdrop-blur-md border ${
                vendor.status === 'Active' 
                  ? 'text-emerald-300 hover:text-white bg-emerald-950/80 hover:bg-emerald-900 border-emerald-500/40' 
                  : 'text-amber-300 hover:text-white bg-amber-950/80 hover:bg-amber-900 border-amber-500/40'
              }`}
              title={vendor.status === 'Active' ? "Disable vendor" : "Enable vendor"}
            >
              {vendor.status === 'Active' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => handleEditVendor(vendor)}
              className="p-2 text-[#F4A62A] hover:text-white bg-[#500A18]/80 hover:bg-[#7A1126] border border-[#F4A62A]/30 rounded-lg transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              title="Edit Vendor"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
              className="p-2 text-red-400 hover:text-red-200 bg-red-950/60 hover:bg-red-900 border border-red-500/30 rounded-lg transition-colors cursor-pointer shadow-lg backdrop-blur-md"
              title="Delete Vendor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Fallback Header if no photos */
        <div className="p-4 flex items-center justify-between border-b border-[#F4A62A]/10 bg-[#1C080C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#500A18] border border-[#F4A62A]/40 flex items-center justify-center text-[#F4A62A]">
              <Store className="w-5 h-5" />
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              vendor.status === 'Active' 
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30' 
                : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
            }`}>
              {vendor.status}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => handleToggleVendorStatus(vendor)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer shadow-md border ${
                vendor.status === 'Active' 
                  ? 'text-emerald-300 hover:text-white bg-emerald-950 hover:bg-emerald-900 border-emerald-500/40' 
                  : 'text-amber-300 hover:text-white bg-amber-950 hover:bg-amber-900 border-amber-500/40'
              }`}
              title={vendor.status === 'Active' ? "Disable vendor" : "Enable vendor"}
            >
              {vendor.status === 'Active' ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => handleEditVendor(vendor)}
              className="p-1.5 text-[#F4A62A] hover:text-white bg-[#500A18] hover:bg-[#7A1126] border border-[#F4A62A]/30 rounded-lg transition-colors cursor-pointer shadow-md"
              title="Edit Vendor"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleDeleteVendor(vendor.id, vendor.name)}
              className="p-1.5 text-red-400 hover:text-red-200 bg-red-950/60 hover:bg-red-900 border border-red-500/30 rounded-lg transition-colors cursor-pointer shadow-md"
              title="Delete Vendor"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Content Section below photo */}
      <div className="p-5 pt-3 flex-1 flex flex-col relative z-10">
        
        {/* Name and Title area */}
        <div className="mb-4">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-bold text-lg text-white leading-tight">{vendor.name}</h4>
          </div>
          {vendor.shopName && (
            <div className="text-[#FFF8F0]/90 flex items-center gap-1.5 mt-1">
              <Store className="w-4 h-4 text-[#F4A62A] shrink-0" />
              <span className="truncate font-bold text-sm text-[#F4A62A]">{vendor.shopName}</span>
            </div>
          )}
          <div className="mt-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1C080C] text-[#F4A62A] border border-[#F4A62A]/30">
              {vendor.category || 'General Supplier'}
            </span>
          </div>
        </div>

        {/* Famous For Highlight */}
        {vendor.famousFor && (
          <div className="mb-4 bg-gradient-to-r from-[#1C080C] to-transparent p-2.5 rounded-lg border-l-2 border-[#F4A62A] shadow-inner text-xs">
            <span className="font-bold text-[#F4A62A] block mb-0.5 uppercase tracking-wider text-[10px]">Famous For</span>
            <span className="text-[#FFF8F0]/90 font-medium">{vendor.famousFor}</span>
          </div>
        )}

        {/* Contact Details Grid */}
        <div className="grid grid-cols-1 gap-2.5 text-xs text-[#FFF8F0]/70 mb-4">
          {vendor.contactPerson && (
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#F4A62A]/70 shrink-0" />
              <span className="truncate">{vendor.contactPerson}</span>
            </div>
          )}
          {vendor.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#F4A62A]/70 shrink-0" />
              <span className="font-mono text-[11px] truncate">{vendor.phone}</span>
            </div>
          )}
          {vendor.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-[#F4A62A]/70 shrink-0" />
              <span className="truncate text-[#60A5FA]">{vendor.email}</span>
            </div>
          )}
          {vendor.shopLocation && (
            <div className="flex items-start gap-2 pt-1 border-t border-[#F4A62A]/10 mt-1">
              <MapPin className="w-4 h-4 text-[#F4A62A] shrink-0 mt-0.5" />
              <span className="text-[11px] font-bold text-[#F4A62A] leading-snug">{vendor.shopLocation}</span>
            </div>
          )}
          {vendor.address && (
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-[#FFF8F0]/30 shrink-0 mt-0.5" />
              <span className="text-[11px] leading-snug">{vendor.address}</span>
            </div>
          )}
        </div>

        <div className="mt-auto"></div>
        {/* Products Count Footer */}
        <div className="pt-3 border-t border-[#F4A62A]/15 flex items-center justify-between text-xs">
          <span className="text-[#FFF8F0]/50 text-[11px]">Supplied Items Catalog:</span>
          <span className="px-2.5 py-1 rounded-full bg-[#500A18] text-[#F4A62A] font-bold text-[11px] border border-[#F4A62A]/30 flex items-center gap-1">
            {suppliedCount} Products
          </span>
        </div>
      </div>
    </div>
  );
};

export const VendorsView: React.FC = () => {
  const { vendors, products, addVendor, updateVendor, deleteVendor, showToast } = useAdmin();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);

  // New Vendor Form State
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [shopLocation, setShopLocation] = useState('');
  const [address, setAddress] = useState('');
  const [category, setCategory] = useState('');
  const [famousFor, setFamousFor] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredVendors = vendors.filter(v => 
    v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.contactPerson && v.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (v.category && v.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAddVendorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('Please enter vendor name', 'warning');
      return;
    }

    const payload = {
      name: name.trim(),
      shopName: shopName.trim(),
      contactPerson: contactPerson.trim(),
      phone: phone.trim(),
      email: email.trim(),
      shopLocation: shopLocation.trim(),
      address: address.trim(),
      category: category.trim() || 'General Supplier',
      famousFor: famousFor.trim(),
      photos: photos,
    };

    if (editingVendorId) {
      updateVendor(editingVendorId, payload);
    } else {
      addVendor({
        ...payload,
        status: 'Active'
      });
    }

    resetForm();
    setIsAddModalOpen(false);
  };

  const resetForm = () => {
    setEditingVendorId(null);
    setName('');
    setShopName('');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setShopLocation('');
    setAddress('');
    setCategory('');
    setFamousFor('');
    setPhotos([]);
  };

  const handleEditVendor = (vendor: any) => {
    setEditingVendorId(vendor.id);
    setName(vendor.name || '');
    setShopName(vendor.shopName || '');
    setContactPerson(vendor.contactPerson || '');
    setPhone(vendor.phone || '');
    setEmail(vendor.email || '');
    setShopLocation(vendor.shopLocation || '');
    setAddress(vendor.address || '');
    setCategory(vendor.category || '');
    setFamousFor(vendor.famousFor || '');
    setPhotos(vendor.photos || []);
    setIsAddModalOpen(true);
  };

  const handleDeleteVendor = (id: string, vendorName: string) => {
    if (window.confirm(`Are you sure you want to delete vendor "${vendorName}"?`)) {
      deleteVendor(id);
    }
  };

  const handleToggleVendorStatus = (vendor: any) => {
    const newStatus = vendor.status === 'Active' ? 'Inactive' : 'Active';
    updateVendor(vendor.id, { status: newStatus });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
              setPhotos(prev => [...prev, compressedDataUrl]);
              showToast('Shop photo uploaded successfully!');
            };
            img.onerror = () => {
              setPhotos(prev => [...prev, result]);
            };
            img.src = result;
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
            <Store className="w-5 h-5" /> Sacred Suppliers & Vendor Registry
          </h3>
          <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
            Manage authenticated temple suppliers, gaushala cooperatives, and artisan guilds.
          </p>
        </div>
        <button
          onClick={() => { resetForm(); setIsAddModalOpen(true); }}
          className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" /> Add New Vendor
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-[#2B1217] p-4 rounded-2xl border border-[#F4A62A]/30 flex items-center justify-between gap-3 shadow-md">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F4A62A]" />
          <input
            type="text"
            placeholder="Search vendor name, contact person, or category..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
          />
        </div>
        <div className="text-xs text-[#FFF8F0]/60 font-medium">
          Showing <span className="text-[#F4A62A] font-bold">{filteredVendors.length}</span> Vendors
        </div>
      </div>

      {/* Vendors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-[#2B1217] p-8 rounded-2xl border border-[#F4A62A]/20 text-center text-xs text-[#FFF8F0]/60">
            No vendors matching your search.
          </div>
        ) : (
          filteredVendors.map(vendor => {
            // Count products supplied by this vendor
            const suppliedCount = products.filter(p => p.vendor === vendor.name || p.vendorId === vendor.id).length;

            return (
              <VendorCard
                key={vendor.id}
                vendor={vendor}
                suppliedCount={suppliedCount}
                handleToggleVendorStatus={handleToggleVendorStatus}
                handleEditVendor={handleEditVendor}
                handleDeleteVendor={handleDeleteVendor}
              />
            );
          })
        )}
      </div>

      {/* Add Vendor Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#2B1217] border border-[#F4A62A]/50 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#1C080C] border-b border-[#F4A62A]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-[#F4A62A]" />
                <h3 className="font-bold text-sm text-white">Add New Temple Vendor / Supplier</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-[#FFF8F0]/60 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAddVendorSubmit} className="p-5 space-y-4 bg-[#120508]">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Vendor / Supplier Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Deoghar Baidyanath Central Store..."
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Shop Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Baidyanath Prasadam Center"
                    value={shopName}
                    onChange={e => setShopName(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Contact Person
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pandit Rameshwar Jha"
                    value={contactPerson}
                    onChange={e => setContactPerson(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Phone / Mobile
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98351 22910"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="supplier@babadham.org"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Pure Prasad, Holy Water, Clothes..."
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Shop Location
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Gate #2 Sanctum Complex"
                    value={shopLocation}
                    onChange={e => setShopLocation(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                    Famous For
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Organic Peda, Gangajal"
                    value={famousFor}
                    onChange={e => setFamousFor(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1">
                  Full Address
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop 12, Main Road, Deoghar"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#1C080C] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-2">
                  Shop Photos (Optional)
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-3">
                  {photos.map((photo, index) => (
                    <div key={index} className="relative w-16 h-16 rounded-xl border border-[#F4A62A]/30 overflow-hidden group">
                      <img src={photo} alt="Shop" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setPhotos(prev => prev.filter((_, i) => i !== index))}
                        className="absolute top-1 right-1 p-0.5 bg-red-500/80 hover:bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-16 h-16 rounded-xl border border-dashed border-[#F4A62A]/40 flex flex-col items-center justify-center text-[#F4A62A]/60 hover:text-[#F4A62A] hover:border-[#F4A62A] hover:bg-[#F4A62A]/5 transition-all cursor-pointer"
                  >
                    <Upload className="w-5 h-5 mb-1" />
                    <span className="text-[9px] font-bold">Upload</span>
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1C080C] text-[#FFF8F0]/70 font-bold text-xs hover:bg-[#2B1217] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
