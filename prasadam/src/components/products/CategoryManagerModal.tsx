import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Tag, Plus, Trash2, X, Package } from 'lucide-react';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory, deleteCategory, showToast } = useAdmin();

  const [newCatName, setNewCatName] = useState('');
  const [newCatHindiName, setNewCatHindiName] = useState('');
  const [newCatTagline, setNewCatTagline] = useState('');

  if (!isOpen) return null;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Please enter a category name', 'warning');
      return;
    }

    addCategory({
      name: newCatName.trim(),
      hindiName: newCatHindiName.trim() || newCatName.trim(),
      tagline: newCatTagline.trim() || `${newCatName.trim()} from Baidyanath Sanctum`
    });

    setNewCatName('');
    setNewCatHindiName('');
    setNewCatTagline('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete category "${name}"?`)) {
      deleteCategory(id);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-[#2B1217] border border-[#F4A62A]/50 rounded-2xl w-full max-w-lg flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="p-4 bg-[#1C080C] border-b border-[#F4A62A]/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Tag className="w-5 h-5 text-[#F4A62A]" />
            <div>
              <h3 className="font-bold text-sm text-white">Manage & Add Custom Categories</h3>
              <p className="text-[11px] text-[#FFF8F0]/60">Add new categories or delete existing ones dynamically</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#FFF8F0]/60 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto bg-[#120508]">
          
          {/* Section 1: Add New Custom Category Form */}
          <form onSubmit={handleAddCategory} className="bg-[#1C080C] p-4 rounded-xl border border-[#F4A62A]/30 space-y-3">
            <h4 className="font-bold text-xs text-[#F4A62A] uppercase tracking-wider flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Add Custom Category
            </h4>

            <div>
              <label className="block text-[11px] font-bold text-[#FFF8F0]/80 mb-1">
                Category Name (English) *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Sacred Angavastram, Shivratri Special..."
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-[#FFF8F0]/80 mb-1">
                  Hindi Name (हिन्दी नाम)
                </label>
                <input
                  type="text"
                  placeholder="उदा. पवित्र अंगवस्त्रम्"
                  value={newCatHindiName}
                  onChange={e => setNewCatHindiName(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#FFF8F0]/80 mb-1">
                  Tagline (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Temple Blessed Silk..."
                  value={newCatTagline}
                  onChange={e => setNewCatTagline(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-md"
            >
              <Plus className="w-4 h-4" /> Save New Category
            </button>
          </form>

          {/* Section 2: Active Categories List with Delete Option */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs text-[#F4A62A] uppercase tracking-wider">
              Active Store Categories ({categories.length})
            </h4>

            <div className="divide-y divide-[#F4A62A]/15 border border-[#F4A62A]/20 rounded-xl bg-[#1C080C] overflow-hidden">
              {categories.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#FFF8F0]/50">No active categories found.</div>
              ) : (
                categories.map(cat => (
                  <div key={cat.id} className="p-3 flex items-center justify-between gap-3 hover:bg-[#2B1217]/50 transition-colors">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-[#500A18] border border-[#F4A62A]/30 flex items-center justify-center text-[#F4A62A]">
                        <Package className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{cat.name} {cat.hindiName && <span className="text-[10px] text-[#F4A62A] font-normal">({cat.hindiName})</span>}</div>
                        <div className="text-[10px] text-[#FFF8F0]/50 font-mono">slug: {cat.slug || cat.id}</div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteCategory(cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-red-950/60 text-red-400 border border-red-500/30 hover:bg-red-900 cursor-pointer transition-all shrink-0"
                      title="Delete category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#1C080C] border-t border-[#F4A62A]/20 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
