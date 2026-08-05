import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { 
  IndianRupee, 
  ShoppingBag, 
  Package, 
  Users, 
  TrendingUp
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { orders, products } = useAdmin();
  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      
      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
          <div className="flex items-center justify-between text-[#F4A62A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Total Sales Revenue</span>
            <IndianRupee className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">₹{totalRevenue.toLocaleString()}</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +24.8% growth this week
          </div>
        </div>

        <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
          <div className="flex items-center justify-between text-[#F4A62A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Total Orders</span>
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{orders.length}</div>
          <div className="text-[11px] text-[#F4A62A] mt-1">
            {orders.filter(o => o.orderStatus !== 'DELIVERED').length} active dispatches
          </div>
        </div>

        <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
          <div className="flex items-center justify-between text-[#F4A62A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Store Inventory</span>
            <Package className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{products.length}</div>
          <div className="text-[11px] text-emerald-400 mt-1">100% Temple Standards</div>
        </div>

        <div className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 shadow-lg">
          <div className="flex items-center justify-between text-[#F4A62A]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#FFF8F0]/80">Devotee Base</span>
            <Users className="w-5 h-5" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">1,842</div>
          <div className="text-[11px] text-[#F4A62A] mt-1">Pan India Devotees</div>
        </div>

      </div>

      {/* Dispatch Stream Table */}
      <div className="bg-[#2B1217] rounded-2xl border border-[#F4A62A]/30 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">
            Recent Orders & Dispatch Stream
          </h3>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8 text-xs text-[#FFF8F0]/60">
            No active orders recorded.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#1A0B0E] text-[#F4A62A] font-bold border-b border-[#F4A62A]/20">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">Devotee Name</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4A62A]/10">
                {orders.slice(0, 5).map(order => (
                  <tr key={order.id} className="hover:bg-[#1A0B0E]/50">
                    <td className="p-3 font-mono font-bold text-[#F4A62A]">{order.id}</td>
                    <td className="p-3 font-medium">{order.address.fullName}</td>
                    <td className="p-3 text-[#FFF8F0]/80">{order.address.phone}</td>
                    <td className="p-3 font-bold">₹{order.totalAmount}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px] font-bold">
                        {order.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-[#7A1126] text-[#F4A62A] text-[10px] font-bold">
                        {order.orderStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
