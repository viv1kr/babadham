import React, { useState, useEffect, useRef } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  FolderOpen, 
  Image as ImageIcon, 
  FileText, 
  Upload, 
  Download, 
  Trash2, 
  Search, 
  Eye,
  HardDrive,
  Grid,
  List,
  X,
  Link,
  Plus
} from 'lucide-react';

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document';
  format: string;
  size: string;
  source: string;
  createdAt: string;
}

const STORAGE_MEDIA_KEY = 'babadham_content_media_v1';

// Compress uploaded image to lightweight web-optimized JPEG data URL
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = () => resolve(URL.createObjectURL(file));
    reader.readAsDataURL(file);
  });
};

export const ContentView: React.FC = () => {
  const { products, collections, brandSettings, showToast } = useAdmin();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'document'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewStyle, setViewStyle] = useState<'grid' | 'table'>('grid');
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  // URL Link Upload Modal State
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState('');
  const [inputFileName, setInputFileName] = useState('');

  // Persistent Deleted Media IDs & URLs Blacklist State
  const [deletedMediaIds, setDeletedMediaIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('babadham_deleted_media_ids_v1');
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('babadham_deleted_media_ids_v1', JSON.stringify(deletedMediaIds));
      } catch (err) {
        console.warn('localStorage error for deleted media:', err);
      }
    }
  }, [deletedMediaIds]);

  // Custom User Uploaded Media Items State
  const [customMedia, setCustomMedia] = useState<MediaItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_MEDIA_KEY);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return [
      {
        id: 'doc-pdf-1',
        name: 'Baba Baidyanath Temple Sacred Bhog Catalogue 2026.pdf',
        url: brandSettings?.cataloguePdfUrl || 'https://babadham.org/catalogue.pdf',
        type: 'document',
        format: 'PDF',
        size: '2.4 MB',
        source: 'Official Catalogue',
        createdAt: '2026-08-01'
      },
      {
        id: 'doc-pdf-2',
        name: 'Devotee Seva Guidelines & Darshan Protocol.pdf',
        url: 'https://babadham.org/docs/darshan-guidelines.pdf',
        type: 'document',
        format: 'PDF',
        size: '1.1 MB',
        source: 'Temple Board Document',
        createdAt: '2026-07-28'
      }
    ];
  });

  // Save Custom Media to localStorage safely (catch quota errors so page never blanks out)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(customMedia));
      } catch (err) {
        console.warn('localStorage quota reached. Storing media in session memory.', err);
        try {
          // Fallback trim if quota exceeded
          const trimmed = customMedia.slice(0, 10);
          localStorage.setItem(STORAGE_MEDIA_KEY, JSON.stringify(trimmed));
        } catch (e) {}
      }
    }
  }, [customMedia]);

  // Extract all System Media Items (Product photos, Collection covers, Brand logos)
  const systemMedia: MediaItem[] = [];

  // 1. Add Brand Logo & Favicon
  if (brandSettings?.logoImageUrl) {
    systemMedia.push({
      id: 'brand-logo',
      name: 'Main Website Header Logo.png',
      url: brandSettings.logoImageUrl,
      type: 'image',
      format: 'PNG',
      size: '180 KB',
      source: 'Brand Header',
      createdAt: '2026-08-01'
    });
  }

  if (brandSettings?.faviconUrl) {
    systemMedia.push({
      id: 'brand-favicon',
      name: 'Website Browser Favicon.ico',
      url: brandSettings.faviconUrl,
      type: 'image',
      format: 'ICO',
      size: '32 KB',
      source: 'Brand Favicon',
      createdAt: '2026-08-01'
    });
  }

  // 2. Add Product Photos
  products.forEach((prod) => {
    if (prod.image) {
      systemMedia.push({
        id: `prod-img-${prod.id}`,
        name: `${prod.name.replace(/[^a-zA-Z0-9]/g, '_')}_Thumbnail.jpg`,
        url: prod.image,
        type: 'image',
        format: 'JPG',
        size: '420 KB',
        source: `Product: ${prod.name}`,
        createdAt: '2026-08-02'
      });
    }

    if (prod.gallery && prod.gallery.length > 0) {
      prod.gallery.forEach((gUrl, gIdx) => {
        systemMedia.push({
          id: `prod-gal-${prod.id}-${gIdx}`,
          name: `${prod.name.replace(/[^a-zA-Z0-9]/g, '_')}_Gallery_${gIdx + 1}.jpg`,
          url: gUrl,
          type: 'image',
          format: 'JPG',
          size: '510 KB',
          source: `Product Gallery: ${prod.name}`,
          createdAt: '2026-08-02'
        });
      });
    }
  });

  // 3. Add Collection Photos
  collections.forEach((col) => {
    if (col.image) {
      systemMedia.push({
        id: `col-img-${col.id}`,
        name: `${col.title.replace(/[^a-zA-Z0-9]/g, '_')}_Cover.jpg`,
        url: col.image,
        type: 'image',
        format: 'JPG',
        size: '640 KB',
        source: `Collection: ${col.title}`,
        createdAt: '2026-08-03'
      });
    }
  });

  // Combine system media + user uploaded media (Filter out deleted IDs and URLs)
  const rawMediaItems = [...customMedia, ...systemMedia];
  const allMediaItems = rawMediaItems.filter(
    item => !deletedMediaIds.includes(item.id) && !deletedMediaIds.includes(item.url)
  );

  // Filter Media Items
  const filteredMedia = allMediaItems.filter(item => {
    const matchesFilter = activeFilter === 'all' || item.type === activeFilter;
    const matchesQuery = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.format.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const photoCount = allMediaItems.filter(m => m.type === 'image').length;
  const docCount = allMediaItems.filter(m => m.type === 'document').length;

  // Handle File Upload from Local Device (Photos / Documents)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    e.target.value = '';

    for (const file of fileList) {
      if (file.size > 25 * 1024 * 1024) {
        showToast(`File ${file.name} exceeds maximum limit of 25MB`, 'warning');
        continue;
      }

      try {
        const isImg = file.type.startsWith('image/');
        let mediaUrl = '';

        if (isImg) {
          mediaUrl = await compressImage(file);
        } else {
          mediaUrl = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = (event) => resolve((event.target?.result as string) || URL.createObjectURL(file));
            reader.onerror = () => resolve(URL.createObjectURL(file));
            reader.readAsDataURL(file);
          });
        }

        const ext = file.name.split('.').pop()?.toUpperCase() || (isImg ? 'JPG' : 'PDF');

        const newItem: MediaItem = {
          id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          name: file.name,
          url: mediaUrl,
          type: isImg ? 'image' : 'document',
          format: ext,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          source: 'Content Media Upload',
          createdAt: new Date().toISOString().split('T')[0]
        };

        setCustomMedia(prev => [newItem, ...prev]);
        setActiveFilter('all');
        setSearchQuery('');
        showToast(`Uploaded ${file.name} to Content Library!`);
      } catch (err) {
        console.error('File upload error:', err);
        showToast(`Error uploading ${file.name}`, 'warning');
      }
    }
  };

  // Add Photo or Document from URL Link
  const handleAddMediaFromUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) {
      showToast('Please enter a valid photo or document URL', 'warning');
      return;
    }

    const isImg = inputUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|ico)$/i) !== null || !inputUrl.toLowerCase().endsWith('.pdf');
    const name = inputFileName.trim() || `Uploaded_Media_${Date.now()}.${isImg ? 'jpg' : 'pdf'}`;
    const ext = name.split('.').pop()?.toUpperCase() || (isImg ? 'JPG' : 'PDF');

    const newItem: MediaItem = {
      id: `media-url-${Date.now()}`,
      name: name,
      url: inputUrl.trim(),
      type: isImg ? 'image' : 'document',
      format: ext,
      size: 'Remote Link',
      source: 'URL Link Upload',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setCustomMedia(prev => [newItem, ...prev]);
    setActiveFilter('all');
    setSearchQuery('');
    setInputUrl('');
    setInputFileName('');
    setIsUrlModalOpen(false);
    showToast(`Added ${name} to Content Library!`);
  };

  // Download Media File Function
  const handleDownload = (item: MediaItem) => {
    try {
      const link = document.createElement('a');
      link.href = item.url;
      link.download = item.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast(`Downloading ${item.name}...`);
    } catch (err) {
      window.open(item.url, '_blank');
      showToast(`Opened ${item.name} in new tab`);
    }
  };

  // Delete Media File Function (Deletes photos/documents permanently including link URLs)
  const handleDelete = (item: MediaItem) => {
    if (window.confirm(`Are you sure you want to delete "${item.name}"?`)) {
      setDeletedMediaIds(prev => [...prev, item.id, item.url]);
      setCustomMedia(prev => prev.filter(m => m.id !== item.id && m.url !== item.url));
      if (selectedMedia?.id === item.id || selectedMedia?.url === item.url) {
        setSelectedMedia(null);
      }
      showToast(`Deleted ${item.name} from Content Library`, 'info');
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-200">
      
      {/* Top Header & Actions Bar */}
      <div className="bg-[#1C080C] p-5 sm:p-6 rounded-2xl border border-[#F4A62A]/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#500A18] border border-[#F4A62A]/40 flex items-center justify-center text-[#F4A62A] shadow-lg">
            <FolderOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif-temple font-bold text-xl sm:text-2xl text-[#F4A62A]">
              Content & Media Library
            </h1>
            <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
              Manage, preview, download, and delete all website photos, catalog PDFs, and documents.
            </p>
          </div>
        </div>

        {/* Upload Buttons */}
        <div className="flex items-center gap-2.5 w-full md:w-auto">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Upload className="w-4 h-4" /> Upload Photo / File
          </button>

          <button
            onClick={() => setIsUrlModalOpen(true)}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 font-bold text-xs hover:bg-[#9E1632] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
          >
            <Link className="w-4 h-4" /> Add from Link URL
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Media Library Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#2B1217] p-4.5 rounded-2xl border border-[#F4A62A]/30 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#500A18] border border-[#F4A62A]/30 text-[#F4A62A] flex items-center justify-center">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#FFF8F0]/60 uppercase tracking-wider font-bold block">Total Media Assets</span>
            <span className="text-xl font-extrabold text-white">{allMediaItems.length} Files</span>
          </div>
        </div>

        <div className="bg-[#2B1217] p-4.5 rounded-2xl border border-[#F4A62A]/30 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#500A18] border border-[#F4A62A]/30 text-[#F4A62A] flex items-center justify-center">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#FFF8F0]/60 uppercase tracking-wider font-bold block">Photos & Images</span>
            <span className="text-xl font-extrabold text-white">{photoCount} Photos</span>
          </div>
        </div>

        <div className="bg-[#2B1217] p-4.5 rounded-2xl border border-[#F4A62A]/30 shadow-lg flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#500A18] border border-[#F4A62A]/30 text-[#F4A62A] flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] text-[#FFF8F0]/60 uppercase tracking-wider font-bold block">Documents & PDFs</span>
            <span className="text-xl font-extrabold text-white">{docCount} Documents</span>
          </div>
        </div>
      </div>

      {/* Main Workplace Body: Controls Bar */}
      <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 shadow-xl overflow-hidden p-4 space-y-4">
        
        {/* Search & Tabs Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#1A0B0E] p-1 rounded-xl border border-[#F4A62A]/20 w-full sm:w-auto">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === 'all'
                  ? 'bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40'
                  : 'text-[#FFF8F0]/70 hover:text-white'
              }`}
            >
              All ({allMediaItems.length})
            </button>
            <button
              onClick={() => setActiveFilter('image')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'image'
                  ? 'bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40'
                  : 'text-[#FFF8F0]/70 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Photos ({photoCount})
            </button>
            <button
              onClick={() => setActiveFilter('document')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeFilter === 'document'
                  ? 'bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40'
                  : 'text-[#FFF8F0]/70 hover:text-white'
              }`}
            >
              <FileText className="w-3.5 h-3.5" /> Documents ({docCount})
            </button>
          </div>

          {/* Search Bar & View Mode Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#F4A62A]" />
              <input
                type="text"
                placeholder="Search photos or documents..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-[36px] pl-9 pr-4 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white text-xs focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div className="flex items-center gap-1 bg-[#1A0B0E] p-1 rounded-xl border border-[#F4A62A]/20">
              <button
                onClick={() => setViewStyle('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewStyle === 'grid' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#FFF8F0]/50 hover:text-white'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewStyle('table')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewStyle === 'table' ? 'bg-[#7A1126] text-[#F4A62A]' : 'text-[#FFF8F0]/50 hover:text-white'
                }`}
                title="Table List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

        {/* MEDIA CONTENT GRID VIEW */}
        {viewStyle === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pt-2">
            {filteredMedia.length === 0 ? (
              <div className="col-span-full text-center py-12 text-xs text-[#FFF8F0]/50 space-y-2">
                <FolderOpen className="w-8 h-8 text-[#F4A62A]/40 mx-auto" />
                <p>No media files found matching your search.</p>
              </div>
            ) : (
              filteredMedia.map(item => (
                <div
                  key={item.id}
                  className="bg-[#1A0B0E] border border-[#F4A62A]/25 rounded-2xl p-3 flex flex-col justify-between space-y-3 group hover:border-[#F4A62A] transition-all relative"
                >
                  {/* Thumbnail Frame */}
                  <div 
                    onClick={() => setSelectedMedia(item)}
                    className="w-full h-36 rounded-xl overflow-hidden bg-[#120508] border border-[#F4A62A]/20 flex items-center justify-center relative cursor-pointer group-hover:shadow-lg"
                  >
                    {item.type === 'image' ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 p-3 text-center">
                        <FileText className="w-10 h-10 text-[#F4A62A]" />
                        <span className="text-[10px] font-bold text-[#F4A62A] uppercase tracking-wider px-2 py-0.5 rounded bg-[#500A18]">
                          {item.format}
                        </span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedMedia(item); }}
                        className="p-2 rounded-xl bg-[#500A18] text-[#F4A62A] border border-[#F4A62A]/40 hover:bg-[#7A1126]"
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs text-white line-clamp-1 group-hover:text-[#F4A62A] transition-colors" title={item.name}>
                      {item.name}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-[#FFF8F0]/60">
                      <span>{item.source}</span>
                      <span className="font-mono text-[#F4A62A] font-bold">{item.size}</span>
                    </div>
                  </div>

                  {/* Actions Row (Download & Delete) */}
                  <div className="pt-2 border-t border-[#F4A62A]/15 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleDownload(item)}
                      className="flex-1 py-1.5 px-2 rounded-xl bg-[#7A1126] border border-[#F4A62A]/40 text-[#F4A62A] hover:bg-[#9E1632] font-bold text-[11px] flex items-center justify-center gap-1 cursor-pointer transition-all"
                      title="Download file"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>

                    <button
                      onClick={() => handleDelete(item)}
                      className="p-1.5 rounded-xl bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900 cursor-pointer transition-all"
                      title="Delete file"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))
            )}
          </div>
        ) : (
          /* MEDIA CONTENT TABLE LIST VIEW */
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20">
                <tr>
                  <th className="p-3">File Preview</th>
                  <th className="p-3">File Name</th>
                  <th className="p-3">Source Tag</th>
                  <th className="p-3">Format</th>
                  <th className="p-3">Size</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4A62A]/10">
                {filteredMedia.map(item => (
                  <tr key={item.id} className="hover:bg-[#1A0B0E]/60 transition-colors">
                    <td className="p-3 w-16">
                      <div className="w-10 h-10 rounded-lg bg-[#120508] border border-[#F4A62A]/30 overflow-hidden flex items-center justify-center text-[#F4A62A]">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>
                    </td>
                    <td className="p-3 font-bold text-white max-w-xs truncate">{item.name}</td>
                    <td className="p-3 text-[#FFF8F0]/70">{item.source}</td>
                    <td className="p-3 font-mono font-bold text-[#F4A62A]">{item.format}</td>
                    <td className="p-3 font-mono text-[#FFF8F0]/80">{item.size}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleDownload(item)}
                          className="px-3 py-1.5 rounded-lg bg-[#7A1126] text-[#F4A62A] border border-[#F4A62A]/40 font-bold text-xs hover:bg-[#9E1632] flex items-center gap-1 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="p-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900 cursor-pointer"
                          title="Delete file"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* FULL-SCREEN PREVIEW MODAL */}
      {selectedMedia && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#2B1217] border border-[#F4A62A]/50 rounded-2xl w-full max-w-3xl flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            
            {/* Modal Header */}
            <div className="p-4 bg-[#1C080C] border-b border-[#F4A62A]/20 flex items-center justify-between">
              <div className="flex items-center gap-2 max-w-md">
                {selectedMedia.type === 'image' ? <ImageIcon className="w-5 h-5 text-[#F4A62A]" /> : <FileText className="w-5 h-5 text-[#F4A62A]" />}
                <h3 className="font-bold text-sm text-white truncate">{selectedMedia.name}</h3>
              </div>
              <button
                onClick={() => setSelectedMedia(null)}
                className="p-1 text-[#FFF8F0]/60 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 flex flex-col items-center justify-center min-h-[300px] max-h-[60vh] overflow-y-auto bg-[#120508]">
              {selectedMedia.type === 'image' ? (
                <img src={selectedMedia.url} alt={selectedMedia.name} className="max-h-[50vh] max-w-full object-contain rounded-xl border border-[#F4A62A]/30 shadow-2xl" />
              ) : (
                <div className="text-center space-y-3 p-6">
                  <FileText className="w-16 h-16 text-[#F4A62A] mx-auto" />
                  <h4 className="font-bold text-base text-white">{selectedMedia.name}</h4>
                  <p className="text-xs text-[#FFF8F0]/60">Document Format: {selectedMedia.format} • Size: {selectedMedia.size}</p>
                </div>
              )}
            </div>

            {/* Modal Footer Actions */}
            <div className="p-4 bg-[#1C080C] border-t border-[#F4A62A]/20 flex items-center justify-between">
              <span className="text-xs text-[#FFF8F0]/70 font-medium">Source: {selectedMedia.source}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDelete(selectedMedia)}
                  className="px-3.5 py-2 rounded-xl bg-red-950/70 text-red-300 border border-red-500/40 font-bold text-xs hover:bg-red-900 flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Trash2 className="w-4 h-4" /> Delete File
                </button>
                <button
                  onClick={() => handleDownload(selectedMedia)}
                  className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" /> Download File
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ADD PHOTO / DOCUMENT FROM URL LINK MODAL */}
      {isUrlModalOpen && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#2B1217] border border-[#F4A62A]/50 rounded-2xl w-full max-w-md flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-[#1C080C] border-b border-[#F4A62A]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link className="w-5 h-5 text-[#F4A62A]" />
                <h3 className="font-bold text-sm text-white">Add Photo or Document from Link</h3>
              </div>
              <button
                onClick={() => setIsUrlModalOpen(false)}
                className="p-1 text-[#FFF8F0]/60 hover:text-white rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMediaFromUrl} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#F4A62A] mb-1.5">
                  Photo or Document URL *
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://example.com/image.jpg or PDF URL..."
                  value={inputUrl}
                  onChange={e => setInputUrl(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#F4A62A] mb-1.5">
                  Custom Title / Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Sanctum Photo 2026.jpg"
                  value={inputFileName}
                  onChange={e => setInputFileName(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUrlModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 text-[#FFF8F0]/80 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Add to Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
