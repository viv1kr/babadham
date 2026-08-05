import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Search, Trash2, Package, Eye, EyeOff, Pencil } from 'lucide-react';

interface InventoryViewProps {
  onAddProductClick?: () => void;
  onEditProductClick?: (id: string) => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onAddProductClick, onEditProductClick }) => {
  const { products, deleteProduct, updateProduct, searchQuery, setSearchQuery } = useAdmin();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  const filteredProducts = products.filter(p => {
    // Text search
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      (p.hindiName && p.hindiName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.category && p.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.vendor && p.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
      
    // Status filter
    let matchesStatus = true;
    if (statusFilter === 'active') {
      matchesStatus = p.status !== 'Draft';
    } else if (statusFilter === 'draft') {
      matchesStatus = p.status === 'Draft';
    }

    return matchesSearch && matchesStatus;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleStatus = (id: string, currentStatus: string | undefined) => {
    const newStatus = currentStatus === 'Active' ? 'Draft' : 'Active';
    updateProduct(id, { status: newStatus as any });
  };

  const activeButtonStyle = "px-3 py-1.5 rounded-md bg-[#500A18] text-[#F4A62A] border border-[#F4A62A]/40 text-sm font-bold shadow-md cursor-pointer";
  const inactiveButtonStyle = "px-3 py-1.5 rounded-md text-sm font-medium text-[#FFF8F0]/70 hover:text-[#F4A62A] hover:bg-[#1A0B0E] transition-colors border border-transparent hover:border-[#F4A62A]/20 cursor-pointer";

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div>
          <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
            <Package className="w-5 h-5" /> All Listed Products ({products.length})
          </h3>
          <p className="text-xs text-[#FFF8F0]/70 mt-0.5">
            Manage your store catalog, pricing, stock levels, categories, and temple suppliers.
          </p>
        </div>
        {onAddProductClick && (
          <button
            onClick={onAddProductClick}
            className="px-4 py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
          >
            <Plus className="w-4 h-4" /> Add Product
          </button>
        )}
      </div>

      {/* Product Inventory Table */}
      <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg space-y-4">
        
        {/* Table Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#F4A62A]/20 pb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setStatusFilter('all')}
                className={statusFilter === 'all' ? activeButtonStyle : inactiveButtonStyle}
              >
                All
              </button>
              <button 
                onClick={() => setStatusFilter('active')}
                className={statusFilter === 'active' ? activeButtonStyle : inactiveButtonStyle}
              >
                Active
              </button>
              <button 
                onClick={() => setStatusFilter('draft')}
                className={statusFilter === 'draft' ? activeButtonStyle : inactiveButtonStyle}
              >
                Draft
              </button>
            </div>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-[#F4A62A] absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-xs text-[#FFF8F0] placeholder-[#FFF8F0]/40 focus:outline-none focus:border-[#F4A62A]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20 select-none">
              <tr>
                <th className="p-3 w-10 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.length > 0 && selectedIds.length === filteredProducts.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]"
                  />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">Status</th>
                <th className="p-3">Inventory</th>
                <th className="p-3">Category</th>
                <th className="p-3">Product type</th>
                <th className="p-3">Vendor</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4A62A]/10">
              {filteredProducts.map(p => {
                const isActive = p.status !== 'Draft';
                return (
                  <tr key={p.id} className="hover:bg-[#1A0B0E]/60 transition-colors">
                    <td className="p-3 text-center">
                      <input 
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => handleSelectOne(p.id)}
                        className="w-4 h-4 rounded bg-[#120508] border-[#F4A62A]/40 text-[#F4A62A] focus:ring-0 cursor-pointer accent-[#F4A62A]" 
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg border border-[#F4A62A]/30 overflow-hidden shrink-0">
                          <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div 
                            onClick={() => onEditProductClick && onEditProductClick(p.id)}
                            className="font-bold text-white hover:text-[#F4A62A] cursor-pointer line-clamp-1 transition-colors"
                          >
                            {p.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
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
                    <td className="p-3 text-[#FFF8F0]/80 font-medium">
                      {p.inStock ? `${p.stockCount} in stock` : <span className="text-red-400 font-bold">Out of stock</span>}
                    </td>
                    <td className="p-3 text-[#FFF8F0]/80 capitalize font-medium">
                      {p.category}
                    </td>
                    <td className="p-3 text-[#FFF8F0]/80 font-medium">
                      {p.categoryName || 'General'}
                    </td>
                    <td className="p-3 text-[#F4A62A] font-medium">
                      {p.vendor || 'My Store'}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onEditProductClick && onEditProductClick(p.id)}
                          className="p-1.5 text-[#F4A62A] hover:text-white bg-[#500A18] hover:bg-[#7A1126] border border-[#F4A62A]/30 rounded-lg transition-colors cursor-pointer shadow-md"
                          title="Edit product"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => toggleStatus(p.id, isActive ? 'Active' : 'Draft')}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer shadow-md border ${
                            isActive 
                              ? 'text-emerald-300 hover:text-white bg-emerald-950 hover:bg-emerald-900 border-emerald-500/40' 
                              : 'text-amber-300 hover:text-white bg-amber-950 hover:bg-amber-900 border-amber-500/40'
                          }`}
                          title={isActive ? "Disable product" : "Enable product"}
                        >
                          {isActive ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Are you sure you want to delete ${p.name}?`)) {
                              deleteProduct(p.id);
                            }
                          }}
                          className="p-1.5 text-red-400 hover:text-red-200 bg-red-950/60 hover:bg-red-900 border border-red-500/30 rounded-lg transition-colors cursor-pointer shadow-md"
                          title="Delete Product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#FFF8F0]/50 font-medium">
                    No products found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
