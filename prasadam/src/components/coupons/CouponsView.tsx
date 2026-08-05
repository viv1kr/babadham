import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Tag } from 'lucide-react';

export const CouponsView: React.FC = () => {
  const { coupons, addCoupon } = useAdmin();

  const [couponCode, setCouponCode] = useState('');
  const [couponPercent, setCouponPercent] = useState(15);
  const [couponMinSpend, setCouponMinSpend] = useState(499);

  const handleAddCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    addCoupon({
      code: couponCode.toUpperCase().trim(),
      discountPercent: Number(couponPercent),
      description: `${couponPercent}% off on orders above ₹${couponMinSpend}`,
      minSpend: Number(couponMinSpend),
      maxDiscount: 500
    });
    setCouponCode('');
  };

  return (
    <div className="space-y-6">
      
      {/* Add Coupon Form */}
      <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
        <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
          <Tag className="w-5 h-5" /> Generate Promo Coupon Code
        </h3>

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
              Generate Active Coupon Code
            </button>
          </div>
        </form>
      </div>

      {/* Coupons List */}
      <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg space-y-4">
        <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">Active Promo Coupons ({coupons.length})</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {coupons.map((c, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 flex items-center justify-between shadow-sm">
              <div>
                <span className="font-mono text-base font-extrabold text-[#F4A62A]">{c.code}</span>
                <div className="text-xs text-[#FFF8F0]/80 mt-1">{c.description}</div>
              </div>
              <span className="px-3 py-1 bg-emerald-950 text-emerald-300 text-xs font-bold rounded-full border border-emerald-500/30">
                {c.discountPercent}% OFF
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
