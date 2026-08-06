import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Tag, TrendingUp, Plus, Trash2, Edit2, X, Power, PowerOff } from 'lucide-react';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon, updateCoupon, deleteCoupon, upsellConditions, addUpsell, updateUpsell, deleteUpsell, products } = useAdmin();

  const [activeTab, setActiveTab] = useState<'PROMO' | 'UPSELL'>('PROMO');

  // Coupon form state
  const [couponCode, setCouponCode] = useState('');
  const [couponPercent, setCouponPercent] = useState(15);
  const [couponMinSpend, setCouponMinSpend] = useState(499);
  const [editingCouponCode, setEditingCouponCode] = useState<string | null>(null);

  // Upsell form state
  const [editingUpsellId, setEditingUpsellId] = useState<string | null>(null);
  const [upsellType, setUpsellType] = useState<'CART_TOTAL' | 'SPECIFIC_PRODUCT' | 'PRODUCT_BUNDLE'>('CART_TOTAL');
  const [upsellTargetValue, setUpsellTargetValue] = useState<string>('1000');
  const [upsellBundleProducts, setUpsellBundleProducts] = useState<string[]>([]);
  const [upsellDiscountType, setUpsellDiscountType] = useState<'PERCENTAGE' | 'FIXED_AMOUNT' | 'FREE_SHIPPING' | 'FREE_PRODUCT' | 'DISCOUNTED_PRODUCT'>('PERCENTAGE');
  const [upsellDiscountValue, setUpsellDiscountValue] = useState<number>(10);
  const [upsellRewardProductId, setUpsellRewardProductId] = useState<string>('');
  const [upsellDescription, setUpsellDescription] = useState('');

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    
    if (editingCouponCode) {
      updateCoupon(editingCouponCode, {
        code: couponCode.toUpperCase().trim(),
        discountPercent: Number(couponPercent),
        description: `${couponPercent}% off on orders above ₹${couponMinSpend}`,
        minSpend: Number(couponMinSpend),
        maxDiscount: 500
      });
      setEditingCouponCode(null);
    } else {
      addCoupon({
        code: couponCode.toUpperCase().trim(),
        discountPercent: Number(couponPercent),
        description: `${couponPercent}% off on orders above ₹${couponMinSpend}`,
        minSpend: Number(couponMinSpend),
        maxDiscount: 500
      });
    }
    
    setCouponCode('');
    setCouponPercent(15);
    setCouponMinSpend(499);
  };

  const handleEditCoupon = (code: string) => {
    const coupon = coupons.find(c => c.code === code);
    if (coupon) {
      setCouponCode(coupon.code);
      setCouponPercent(coupon.discountPercent);
      setCouponMinSpend(coupon.minSpend);
      setEditingCouponCode(coupon.code);
      setActiveTab('PROMO');
    }
  };

  const cancelEdit = () => {
    setEditingCouponCode(null);
    setCouponCode('');
    setCouponPercent(15);
    setCouponMinSpend(499);
  };

  const handleEditUpsell = (id: string) => {
    const upsell = upsellConditions.find(u => u.id === id);
    if (upsell) {
      setEditingUpsellId(upsell.id);
      setUpsellType(upsell.type);
      if (upsell.type === 'PRODUCT_BUNDLE') {
        setUpsellBundleProducts(upsell.targetValue as string[]);
        setUpsellTargetValue('1000');
      } else {
        setUpsellTargetValue(upsell.targetValue as string);
        setUpsellBundleProducts([]);
      }
      setUpsellDiscountType(upsell.discountType as any);
      setUpsellDiscountValue(upsell.discountValue);
      setUpsellRewardProductId(upsell.rewardProductId || '');
      setUpsellDescription(upsell.description);
      setActiveTab('UPSELL');
    }
  };

  const cancelEditUpsell = () => {
    setEditingUpsellId(null);
    setUpsellType('CART_TOTAL');
    setUpsellTargetValue('1000');
    setUpsellBundleProducts([]);
    setUpsellDiscountType('PERCENTAGE');
    setUpsellDiscountValue(10);
    setUpsellRewardProductId('');
    setUpsellDescription('');
  };

  const handleAddUpsellSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let desc = upsellDescription;
    if (!desc) {
      const conditionText = upsellType === 'CART_TOTAL'
        ? `orders over ₹${upsellTargetValue}`
        : upsellType === 'SPECIFIC_PRODUCT'
          ? `adding ${products.find(p => p.id === upsellTargetValue)?.name || 'product'} to cart`
          : `adding a bundle of ${upsellBundleProducts.length} products to cart`;
        
      let rewardText = '';
      if (upsellDiscountType === 'PERCENTAGE') rewardText = `${upsellDiscountValue}% OFF`;
      else if (upsellDiscountType === 'FIXED_AMOUNT') rewardText = `₹${upsellDiscountValue} OFF`;
      else if (upsellDiscountType === 'FREE_SHIPPING') rewardText = 'FREE SHIPPING';
      else if (upsellDiscountType === 'FREE_PRODUCT') rewardText = `a FREE ${products.find(p => p.id === upsellRewardProductId)?.name || 'Product'}`;
      else if (upsellDiscountType === 'DISCOUNTED_PRODUCT') rewardText = `${upsellDiscountValue}% OFF on ${products.find(p => p.id === upsellRewardProductId)?.name || 'Product'}`;
      
      desc = `Get ${rewardText} on ${conditionText}`;
    }

    let tValue: string | number | string[] = upsellTargetValue;
    if (upsellType === 'CART_TOTAL') tValue = Number(upsellTargetValue);
    if (upsellType === 'PRODUCT_BUNDLE') tValue = upsellBundleProducts;

    if (editingUpsellId) {
      updateUpsell(editingUpsellId, {
        type: upsellType,
        targetValue: tValue,
        discountType: upsellDiscountType,
        discountValue: upsellDiscountType === 'FREE_PRODUCT' ? 100 : Number(upsellDiscountValue),
        rewardProductId: (upsellDiscountType === 'FREE_PRODUCT' || upsellDiscountType === 'DISCOUNTED_PRODUCT') ? upsellRewardProductId : undefined,
        description: desc
      });
      setEditingUpsellId(null);
    } else {
      addUpsell({
        type: upsellType,
        targetValue: tValue,
        discountType: upsellDiscountType,
        discountValue: upsellDiscountType === 'FREE_PRODUCT' ? 100 : Number(upsellDiscountValue),
        rewardProductId: (upsellDiscountType === 'FREE_PRODUCT' || upsellDiscountType === 'DISCOUNTED_PRODUCT') ? upsellRewardProductId : undefined,
        description: desc,
        isActive: true
      });
    }

    setUpsellType('CART_TOTAL');
    setUpsellTargetValue('1000');
    setUpsellBundleProducts([]);
    setUpsellDiscountType('PERCENTAGE');
    setUpsellDiscountValue(10);
    setUpsellRewardProductId('');
    setUpsellDescription('');
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Tabs */}
      <div className="flex space-x-1 bg-[#2B1217] p-1 rounded-xl w-full max-w-md border border-white/10">
        <button
          onClick={() => setActiveTab('PROMO')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'PROMO' ? 'bg-[#F4A62A] text-black shadow-md' : 'text-white/60 hover:text-white'
          }`}
        >
          <Tag className="w-4 h-4" /> Promo Codes
        </button>
        <button
          onClick={() => setActiveTab('UPSELL')}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${
            activeTab === 'UPSELL' ? 'bg-[#F4A62A] text-black shadow-md' : 'text-white/60 hover:text-white'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Upsell Rules
        </button>
      </div>

      {activeTab === 'PROMO' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add Coupon Form */}
          <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                <Tag className="w-5 h-5" /> {editingCouponCode ? 'Edit Promo Coupon' : 'Generate Promo Coupon Code'}
              </h3>
              {editingCouponCode && (
                <button onClick={cancelEdit} className="text-white/60 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded">
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleAddCouponSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Coupon Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., BHOLE15"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white uppercase font-mono font-bold focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Discount (%)</label>
                <input
                  type="number"
                  required
                  value={couponPercent}
                  onChange={e => setCouponPercent(Number(e.target.value))}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Min Spend (₹)</label>
                <input
                  type="number"
                  required
                  value={couponMinSpend}
                  onChange={e => setCouponMinSpend(Number(e.target.value))}
                  className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="sm:col-span-3 text-right">
                <button
                  type="submit"
                  className="h-[48px] px-8 rounded-xl bg-[#F4A62A] text-[#2B1A16] font-bold text-xs hover:bg-white transition-all shadow-md cursor-pointer"
                >
                  {editingCouponCode ? 'Update Coupon Code' : 'Generate Active Coupon Code'}
                </button>
              </div>
            </form>
          </div>

          {/* Coupons List */}
          <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg space-y-4">
            <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">Active Promo Coupons ({coupons?.length || 0})</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coupons?.map((c, i) => (
                <div key={i} className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="font-mono text-base font-extrabold text-[#F4A62A]">{c.code}</span>
                    <div className="text-xs text-[#FFF8F0]/80 mt-1">{c.description}</div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleEditCoupon(c.code)}
                        className="p-1.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Edit Coupon"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteCoupon(c.code)}
                        className="p-1.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30 whitespace-nowrap">
                      {c.discountPercent}% OFF
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'UPSELL' && (
        <div className="space-y-6 animate-fade-in">
          {/* Add Upsell Form */}
          <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
                {editingUpsellId ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                {editingUpsellId ? 'Edit Upsell Condition' : 'Create New Upsell Condition'}
              </h3>
              {editingUpsellId && (
                <button onClick={cancelEditUpsell} className="text-white/60 hover:text-white flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded">
                  <X className="w-3 h-3" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleAddUpsellSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              <div className="bg-[#1C080C] p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="font-bold text-white/80 uppercase tracking-wider text-[10px]">1. Condition (If...)</h4>
                <div>
                  <label className="block text-white/50 mb-1">When customer...</label>
                  <select 
                    value={upsellType} 
                    onChange={e => {
                      setUpsellType(e.target.value as any);
                      if (e.target.value === 'CART_TOTAL') setUpsellTargetValue('1000');
                      else if (e.target.value === 'SPECIFIC_PRODUCT') setUpsellTargetValue(products[0]?.id || '');
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="CART_TOTAL">Cart total exceeds amount</option>
                    <option value="SPECIFIC_PRODUCT">Adds specific product to cart</option>
                    <option value="PRODUCT_BUNDLE">Adds a bundle of products to cart</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 mb-1">
                    {upsellType === 'CART_TOTAL' ? 'Amount (₹)' : upsellType === 'SPECIFIC_PRODUCT' ? 'Select Product' : 'Select Bundle Products'}
                  </label>
                  {upsellType === 'CART_TOTAL' && (
                    <input
                      type="number"
                      required
                      value={upsellTargetValue as string}
                      onChange={e => setUpsellTargetValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    />
                  )}
                  {upsellType === 'SPECIFIC_PRODUCT' && (
                    <select
                      required
                      value={upsellTargetValue as string}
                      onChange={e => setUpsellTargetValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                  {upsellType === 'PRODUCT_BUNDLE' && (
                    <div className="space-y-2 max-h-32 overflow-y-auto bg-[#2B1217] border border-white/10 rounded-lg p-2">
                      {products.map(p => (
                        <label key={p.id} className="flex items-center gap-2 text-white/80 cursor-pointer hover:bg-white/5 p-1 rounded">
                          <input 
                            type="checkbox"
                            checked={upsellBundleProducts.includes(p.id)}
                            onChange={(e) => {
                              if (e.target.checked) setUpsellBundleProducts(prev => [...prev, p.id]);
                              else setUpsellBundleProducts(prev => prev.filter(id => id !== p.id));
                            }}
                            className="accent-[#F4A62A]"
                          />
                          <span className="truncate">{p.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-white/50 mb-1">
                    {upsellType === 'CART_TOTAL' ? 'Amount (₹)' : 'Select Product'}
                  </label>
                  {upsellType === 'CART_TOTAL' ? (
                    <input
                      type="number"
                      required
                      value={upsellTargetValue}
                      onChange={e => setUpsellTargetValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    />
                  ) : (
                    <select
                      required
                      value={upsellTargetValue}
                      onChange={e => setUpsellTargetValue(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  )}
                </div>
              </div>

              <div className="bg-[#1C080C] p-4 rounded-xl border border-white/5 space-y-3">
                <h4 className="font-bold text-white/80 uppercase tracking-wider text-[10px]">2. Reward (Then...)</h4>
                <div>
                  <label className="block text-white/50 mb-1">They will get...</label>
                  <select 
                    value={upsellDiscountType} 
                    onChange={e => {
                      setUpsellDiscountType(e.target.value as any);
                      if (e.target.value === 'FREE_PRODUCT' || e.target.value === 'DISCOUNTED_PRODUCT') {
                        setUpsellRewardProductId(products[0]?.id || '');
                      }
                    }}
                    className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="PERCENTAGE">Percentage (%) Discount</option>
                    <option value="FIXED_AMOUNT">Fixed Amount (₹) Discount</option>
                    <option value="FREE_SHIPPING">Free Shipping</option>
                    <option value="FREE_PRODUCT">Get Free Product</option>
                    <option value="DISCOUNTED_PRODUCT">Get Product at Discount</option>
                  </select>
                </div>
                
                {(upsellDiscountType === 'FREE_PRODUCT' || upsellDiscountType === 'DISCOUNTED_PRODUCT') && (
                  <div>
                    <label className="block text-white/50 mb-1">Select Reward Product</label>
                    <select
                      required
                      value={upsellRewardProductId}
                      onChange={e => setUpsellRewardProductId(e.target.value)}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                )}

                {upsellDiscountType !== 'FREE_SHIPPING' && upsellDiscountType !== 'FREE_PRODUCT' && (
                  <div>
                    <label className="block text-white/50 mb-1">Discount Value</label>
                    <input
                      type="number"
                      required
                      value={upsellDiscountValue}
                      onChange={e => setUpsellDiscountValue(Number(e.target.value))}
                      className="w-full h-10 px-3 rounded-lg bg-[#2B1217] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                )}
              </div>

              <div className="sm:col-span-2 space-y-2 mt-2">
                <label className="block text-white/50 mb-1">Custom Description (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Add Babadham Kada to get 15% off your entire order!"
                  value={upsellDescription}
                  onChange={e => setUpsellDescription(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-[#1A0B0E] border border-white/10 text-white focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="sm:col-span-2 text-right mt-2">
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg bg-[#F4A62A] text-black font-bold hover:bg-white transition-colors"
                >
                  {editingUpsellId ? 'Update Upsell Rule' : 'Save Upsell Rule'}
                </button>
              </div>
            </form>
          </div>

          {/* Upsells List */}
          <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg space-y-4">
            <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">Active Upsell Rules ({upsellConditions?.length || 0})</h3>
            <div className="space-y-3">
              {upsellConditions?.map((u) => {
                const isProduct = u.type === 'SPECIFIC_PRODUCT';
                const pName = isProduct ? products.find(p => p.id === u.targetValue)?.name : '';
                
                return (
                  <div key={u.id} className={`p-4 rounded-xl ${u.isActive ? 'bg-[#1C080C]' : 'bg-[#1C080C]/50 opacity-60'} border border-white/10 flex items-center justify-between shadow-sm transition-all`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[#F4A62A]/10 flex items-center justify-center border border-[#F4A62A]/20">
                        <TrendingUp className="w-6 h-6 text-[#F4A62A]" />
                      </div>
                      <div>
                        <div className="text-white font-bold mb-1">
                          {u.type === 'CART_TOTAL' && `If spends > ₹${u.targetValue}`}
                          {u.type === 'SPECIFIC_PRODUCT' && `If adds ${pName}`}
                          {u.type === 'PRODUCT_BUNDLE' && `If adds bundle (${(u.targetValue as string[])?.length} items)`}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="text-xs text-[#F4A62A] bg-[#F4A62A]/10 px-2 py-0.5 rounded-full inline-block">
                            {u.discountType === 'PERCENTAGE' && `${u.discountValue}% OFF`}
                            {u.discountType === 'FIXED_AMOUNT' && `₹${u.discountValue} OFF`}
                            {u.discountType === 'FREE_SHIPPING' && `FREE SHIPPING`}
                            {u.discountType === 'FREE_PRODUCT' && `FREE ${products.find(p => p.id === u.rewardProductId)?.name}`}
                            {u.discountType === 'DISCOUNTED_PRODUCT' && `${u.discountValue}% OFF on ${products.find(p => p.id === u.rewardProductId)?.name}`}
                          </div>
                          {!u.isActive && <span className="text-[10px] text-red-400 font-bold border border-red-400/30 px-1.5 py-0.5 rounded-full bg-red-400/10">INACTIVE</span>}
                        </div>
                        <div className="text-[11px] text-white/50">{u.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => updateUpsell(u.id, { isActive: !u.isActive })}
                        className={`p-1.5 rounded-lg transition-colors flex items-center justify-center ${u.isActive ? 'text-gray-400 hover:bg-white/5 hover:text-white' : 'text-emerald-400 hover:bg-emerald-400/10'}`}
                        title={u.isActive ? "Deactivate Rule" : "Activate Rule"}
                      >
                        {u.isActive ? <PowerOff className="w-4 h-4" /> : <Power className="w-4 h-4" />}
                      </button>
                      <button 
                        onClick={() => handleEditUpsell(u.id)}
                        className="p-1.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Edit Rule"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => deleteUpsell(u.id)}
                        className="p-1.5 text-gray-400 hover:bg-white/5 hover:text-white rounded-lg transition-colors flex items-center justify-center"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
