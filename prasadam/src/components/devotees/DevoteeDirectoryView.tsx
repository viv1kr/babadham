import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Users, Phone, MapPin, CheckCircle2 } from 'lucide-react';

export const DevoteeDirectoryView: React.FC = () => {
  const { orders } = useAdmin();

  // Unique devotees from orders
  const devoteesMap = new Map();
  orders.forEach(o => {
    if (o.address.phone && !devoteesMap.has(o.address.phone)) {
      devoteesMap.set(o.address.phone, {
        name: o.address.fullName,
        phone: o.address.phone,
        email: o.address.email || 'N/A',
        city: o.address.city,
        state: o.address.state,
        totalOrders: 1,
        totalSpent: o.totalAmount,
        lastOrderDate: o.createdAt
      });
    } else if (devoteesMap.has(o.address.phone)) {
      const existing = devoteesMap.get(o.address.phone);
      existing.totalOrders += 1;
      existing.totalSpent += o.totalAmount;
    }
  });

  const devotees = Array.from(devoteesMap.values());

  return (
    <div className="space-y-6">
      
      <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
        <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] flex items-center gap-2">
          <Users className="w-5 h-5" /> Registered Devotees & Customer Directory ({devotees.length})
        </h3>

        {devotees.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#FFF8F0]/60">
            No registered devotees recorded yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {devotees.map((d, i) => (
              <div key={i} className="p-4 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-sm">{d.name}</div>
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Devotee Verified
                  </span>
                </div>

                <div className="text-[#FFF8F0]/80 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-[#F4A62A]" /> {d.phone}
                </div>

                <div className="text-[#FFF8F0]/80 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#F4A62A]" /> {d.city}, {d.state}
                </div>

                <div className="pt-2 border-t border-[#F4A62A]/10 flex justify-between text-[#F4A62A] font-semibold text-[11px]">
                  <span>Total Orders: <strong className="text-white">{d.totalOrders}</strong></span>
                  <span>Total Spent: <strong className="text-white">₹{d.totalSpent}</strong></span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
