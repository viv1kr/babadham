import React from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, ShoppingBag, CheckCircle2 } from 'lucide-react';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, searchQuery, setSearchQuery } = useAdmin();

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.address.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.address.phone.includes(searchQuery)
  );

  return (
    <div className="space-y-4">
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#2B1217] p-4 rounded-2xl border border-[#F4A62A]/30">
        <h2 className="font-serif-temple text-lg font-bold text-[#F4A62A]">
          Devotee Orders & Temple Dispatch Command ({orders.length})
        </h2>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#F4A62A] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by Order ID, Name or Phone..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-xs text-[#FFF8F0] focus:outline-none focus:border-[#F4A62A]"
          />
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-[#2B1217] p-12 rounded-2xl text-center border border-[#F4A62A]/20">
          <ShoppingBag className="w-12 h-12 text-[#F4A62A]/40 mx-auto mb-3" />
          <p className="text-sm text-[#FFF8F0]/70">No orders match your search terms.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-[#2B1217] p-5 rounded-2xl border border-[#F4A62A]/30 space-y-4 shadow-lg">
              
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F4A62A]/20 pb-3">
                <div>
                  <span className="font-mono text-sm font-bold text-[#F4A62A]">{order.id}</span>
                  <span className="text-xs text-[#FFF8F0]/60 ml-3">{new Date(order.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#F4A62A]">Status:</label>
                  <select
                    value={order.orderStatus}
                    onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                    className="bg-[#1A0B0E] text-[#FFF8F0] border border-[#F4A62A]/40 rounded-lg px-2.5 py-1 text-xs font-bold focus:outline-none"
                  >
                    <option value="ORDER_PLACED">Order Received</option>
                    <option value="TEMPLE_BLESSING">Temple Blessing Done</option>
                    <option value="PACKED">Air-Tight Sealed</option>
                    <option value="IN_TRANSIT">In Transit (Courier)</option>
                    <option value="DELIVERED">Delivered</option>
                  </select>
                </div>
              </div>

              {/* Order Info & Items */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="font-bold text-[#F4A62A] mb-1">Devotee Address:</div>
                  <div className="font-semibold text-white">{order.address.fullName}</div>
                  <div className="text-[#FFF8F0]/80">{order.address.addressLine}</div>
                  <div className="text-[#FFF8F0]/80">{order.address.city}, {order.address.state} - {order.address.pincode}</div>
                  <div className="text-[#F4A62A] mt-1 font-mono">📞 {order.address.phone}</div>
                </div>

                <div>
                  <div className="font-bold text-[#F4A62A] mb-1">Items Ordered:</div>
                  <div className="space-y-1">
                    {order.items.map((it, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[#FFF8F0]/90">
                        <span>{it.product.name} x {it.quantity}</span>
                        <span className="font-bold">₹{it.product.price * it.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#1A0B0E] p-3 rounded-xl border border-[#F4A62A]/20 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between text-[#FFF8F0]/80"><span>Payment Method:</span><span className="font-bold text-white">{order.paymentMethod}</span></div>
                    <div className="flex justify-between text-[#FFF8F0]/80 mt-1"><span>Total Amount:</span><span className="font-bold text-xl text-[#F4A62A]">₹{order.totalAmount}</span></div>
                  </div>

                  <div className="text-[10px] text-emerald-400 mt-2 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Blessed at Garbhagriha
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
