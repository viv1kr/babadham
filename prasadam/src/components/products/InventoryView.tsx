import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Plus, Search, Trash2, Package, Eye, EyeOff, Pencil, PackageX, PackageCheck, ShoppingBag } from 'lucide-react';

interface InventoryViewProps {
  onAddProductClick?: () => void;
  onEditProductClick?: (id: string) => void;
  allowDirectEdit?: boolean;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ onAddProductClick, onEditProductClick, allowDirectEdit = false }) => {
  const { products, orders, deleteProduct, updateProduct, searchQuery, setSearchQuery } = useAdmin();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'draft'>('all');

  const getProductOrderStats = (productId: string) => {
    let orderCount = 0;
    let unitsSold = 0;
    (orders || []).forEach(o => {
      const found = o.items?.find(i => i.id === productId);
      if (found) {
        orderCount += 1;
        unitsSold += (found.quantity || 1);
      }
    });
    return { orderCount, unitsSold };
  };

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
            {allowDirectEdit 
              ? 'Manage your store stock levels, inventory counts, and status directly in the table.' 
              : 'Manage your store catalog, pricing, categories, and temple suppliers.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {onAddProductClick && (
            <button
              onClick={onAddProductClick}
              className="px-4 py-2.5 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all cursor-pointer shadow-md flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          )}
        </div>
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
                <th className="p-3 min-w-[180px]">
                  {allowDirectEdit ? 'Inventory (Direct Update)' : 'Inventory'}
                </th>
                <th className="p-3">Total Orders</th>
                <th className="p-3">Category</th>
                <th className="p-3">Product type</th>
                <th className="p-3">Vendor</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4A62A]/10">
              {filteredProducts.map(p => {
                const isActive = p.status !== 'Draft';
                const stats = getProductOrderStats(p.id);
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

                    {/* STATUS COLUMN */}
                    <td className="p-3">
                      {allowDirectEdit ? (
                        <button
                          type="button"
                          onClick={() => toggleStatus(p.id, p.status)}
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-all shadow-sm border select-none ${
                            isActive 
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900 hover:text-white' 
                              : 'bg-red-950/80 text-red-300 border-red-500/40 hover:bg-red-900 hover:text-white'
                          }`}
                          title="Click to toggle Active / Inactive status"
                        >
                          {isActive ? 'Active' : 'Inactive'}
                        </button>
                      ) : (
                        isActive ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/80 text-red-300 border border-red-500/30">
                            Inactive
                          </span>
                        )
                      )}
                    </td>

                    {/* INVENTORY COLUMN */}
                    <td className="p-3">
                      {allowDirectEdit ? (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              const current = p.stockCount ?? 0;
                              const next = Math.max(0, current - 1);
                              updateProduct(p.id, { stockCount: next, inStock: next > 0 });
                            }}
                            className="w-6 h-6 rounded bg-[#120508] border border-[#F4A62A]/40 text-[#F4A62A] font-extrabold flex items-center justify-center hover:bg-[#7A1126] hover:text-white transition-colors cursor-pointer text-xs select-none shadow-sm"
                            title="Decrease stock count"
                          >
                            -
                          </button>

                          <input
                            type="number"
                            min="0"
                            value={p.stockCount ?? 0}
                            onChange={(e) => {
                              const val = parseInt(e.target.value, 10);
                              const next = isNaN(val) ? 0 : Math.max(0, val);
                              updateProduct(p.id, { stockCount: next, inStock: next > 0 });
                            }}
                            className="w-16 h-7 text-center rounded bg-[#120508] border border-[#F4A62A]/40 text-xs font-bold text-white focus:border-[#F4A62A] focus:outline-none shadow-inner"
                            title="Directly edit stock count"
                          />

                          <button
                            type="button"
                            onClick={() => {
                              const current = p.stockCount ?? 0;
                              const next = current + 1;
                              updateProduct(p.id, { stockCount: next, inStock: next > 0 });
                            }}
                            className="w-6 h-6 rounded bg-[#120508] border border-[#F4A62A]/40 text-[#F4A62A] font-extrabold flex items-center justify-center hover:bg-[#7A1126] hover:text-white transition-colors cursor-pointer text-xs select-none shadow-sm"
                            title="Increase stock count"
                          >
                            +
                          </button>

                          <span className="text-[11px] text-[#FFF8F0]/70 font-medium ml-1">
                            {p.inStock && (p.stockCount ?? 0) > 0 ? 'in stock' : <span className="text-red-400 font-bold">Out of stock</span>}
                          </span>
                        </div>
                      ) : (
                        <div className="text-[#FFF8F0]/80 font-medium">
                          {p.inStock && (p.stockCount ?? 0) > 0 ? (
                            `${p.stockCount} in stock`
                          ) : (
                            <span className="text-red-400 font-bold">Out of stock</span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* TOTAL ORDERS COLUMN */}
                    <td className="p-3">
                      <div className="flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5 text-[#F4A62A]" />
                        <span className="font-bold text-[#F4A62A] text-xs">
                          {stats.orderCount} {stats.orderCount === 1 ? 'order' : 'orders'}
                        </span>
                        {stats.unitsSold > 0 && (
                          <span className="text-[10px] text-[#FFF8F0]/60 font-mono">({stats.unitsSold} pcs)</span>
                        )}
                      </div>
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
                      {allowDirectEdit ? (
                        <button
                          type="button"
                          onClick={() => {
                            const isCurrentlyInStock = p.inStock && (p.stockCount ?? 0) > 0;
                            if (isCurrentlyInStock) {
                              updateProduct(p.id, { inStock: false, stockCount: 0 });
                            } else {
                              updateProduct(p.id, { inStock: true, stockCount: (p.stockCount && p.stockCount > 0) ? p.stockCount : 10 });
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer shadow-md border inline-flex items-center gap-1.5 ${
                            p.inStock && (p.stockCount ?? 0) > 0
                              ? 'bg-red-950/80 text-red-300 border-red-500/40 hover:bg-red-900 hover:text-white'
                              : 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900 hover:text-white'
                          }`}
                          title={p.inStock && (p.stockCount ?? 0) > 0 ? "Click to set Out of Stock" : "Click to set In Stock"}
                        >
                          {p.inStock && (p.stockCount ?? 0) > 0 ? (
                            <>
                              <PackageX className="w-3.5 h-3.5" />
                              <span>Out of Stock</span>
                            </>
                          ) : (
                            <>
                              <PackageCheck className="w-3.5 h-3.5" />
                              <span>In Stock</span>
                            </>
                          )}
                        </button>
                      ) : (
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
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-[#FFF8F0]/50 font-medium">
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
