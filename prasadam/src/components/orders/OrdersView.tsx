import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Search, SlidersHorizontal, ArrowDown, ArrowUpDown, ChevronDown, Download, FilePlus, Bell } from 'lucide-react';
import { OrderDetailView } from './OrderDetailView';
import { CreateOrderView } from './CreateOrderView';

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, searchQuery, setSearchQuery } = useAdmin();
  const [activeFilterTab, setActiveFilterTab] = useState('All');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  let baseOrders = orders?.filter(o => 
    o?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o?.address?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o?.address?.phone?.includes(searchQuery)
  ) || [];

  let filteredOrders = baseOrders;
  if (activeFilterTab === 'Unfulfilled') {
    filteredOrders = baseOrders.filter(o => o.orderStatus === 'ORDER_PLACED' || o.orderStatus === 'TEMPLE_BLESSING');
  } else if (activeFilterTab === 'Unpaid') {
    filteredOrders = baseOrders.filter(o => (o.paymentMethod || '').toUpperCase() === 'COD' && o.orderStatus !== 'DELIVERED');
  } else if (activeFilterTab === 'Open') {
    filteredOrders = baseOrders.filter(o => o.orderStatus !== 'DELIVERED');
  } else if (activeFilterTab === 'Archived') {
    filteredOrders = baseOrders.filter(o => o.orderStatus === 'DELIVERED');
  }

  const handleExport = () => {
    if (filteredOrders.length === 0) return alert('No orders to export.');
    const headers = ['Order ID', 'Date', 'Customer', 'Phone', 'Total Amount', 'Payment Method', 'Fulfillment Status'];
    const rows = filteredOrders.map(o => [
      o.id,
      new Date(o.createdAt).toLocaleString().replace(/,/g, ''),
      `"${o.address?.fullName || 'No customer'}"`,
      o.address?.phone || '',
      o.totalAmount,
      o.paymentMethod || 'N/A',
      o.orderStatus
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_export_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCreateOrder = () => {
    setIsCreatingOrder(true);
  };

  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const today = new Date();
    const isToday = date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
    
    const timeStr = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
    
    if (isToday) {
      return `Today at ${timeStr}`;
    }
    return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at ${timeStr}`;
  };

  const tabs = ['All', 'Unfulfilled', 'Unpaid', 'Open', 'Archived', '+'];

  if (selectedOrderId) {
    const selectedOrder = orders.find(o => o.id === selectedOrderId);
    if (selectedOrder) {
      return <OrderDetailView order={selectedOrder} onBack={() => setSelectedOrderId(null)} />;
    }
  }

  if (isCreatingOrder) {
    return <CreateOrderView onBack={() => setIsCreatingOrder(false)} />;
  }

  return (
    <div className="w-full pt-4 sm:pt-6 space-y-5 font-sans pb-12 animate-fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-2">
        <h2 className="text-2xl font-bold text-[#FFF8F0] flex items-center gap-2">
          Orders
        </h2>
        
        <div className="flex items-center gap-2">
          <button onClick={handleExport} className="px-3 py-1.5 text-[13px] font-semibold rounded-lg bg-[#2B1217] hover:bg-[#3d1921] text-[#FFF8F0] border border-white/10 transition-colors shadow-sm">
            Export
          </button>
          <button onClick={handleCreateOrder} className="px-3 py-1.5 text-[13px] font-semibold rounded-lg bg-[#14A800] hover:bg-[#118A00] text-white transition-colors shadow-sm">
            Create order
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-[#1C080C] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        
        {/* Tab Bar & Search Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-white/10 bg-[#250d12] px-2 py-1.5 gap-2">
          <div className="flex flex-wrap items-center gap-1 overflow-x-auto w-full sm:w-auto">
            {tabs.map((tab, idx) => (
              <button 
                key={idx} 
                onClick={() => setActiveFilterTab(tab)}
                className={`px-3 py-1 text-[13px] font-medium rounded-md whitespace-nowrap transition-colors ${
                  activeFilterTab === tab 
                    ? 'bg-[#1C080C] text-[#FFF8F0] shadow-sm' 
                    : 'text-[#FFF8F0]/60 hover:bg-[#1C080C]/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 px-2 w-full sm:w-auto justify-end">
            <div className="relative">
              <Search className="w-4 h-4 text-[#FFF8F0]/40 absolute left-2.5 top-1.5" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full sm:w-32 pl-8 pr-2 py-1 rounded bg-transparent border-none text-[13px] text-[#FFF8F0] focus:outline-none focus:ring-1 focus:ring-[#F4A62A]/50 placeholder-white/30"
              />
            </div>
            <button className="text-[#FFF8F0]/50 hover:text-[#FFF8F0] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] text-[#FFF8F0] whitespace-nowrap">
            <thead className="border-b border-white/10 bg-[#17060A]">
              <tr>
                <th className="px-4 py-2.5 w-10"><input type="checkbox" className="rounded border-white/20 bg-transparent" /></th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Order</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white flex items-center gap-1">Date <ArrowDown className="w-3.5 h-3.5" /></th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Customer</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white text-right">Total</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Payment status</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Fulfillment status</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Items</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Delivery method</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white">Tags</th>
                <th className="px-4 py-2.5 font-semibold text-[#FFF8F0]/70 cursor-pointer hover:text-white text-center">Notification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-[#FFF8F0]/50">
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  
                  const isUnpaid = (order.paymentMethod || '').toUpperCase() === 'COD' && order.orderStatus !== 'DELIVERED';
                  const paymentPillClass = order.paymentStatus === 'PAID'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                    : 'bg-white/10 text-white/60 border-white/10'; // gray for not paid / refunded
                  
                  const fulfillmentPillClass = order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20'
                    : order.orderStatus === 'IN_TRANSIT'
                    ? 'bg-blue-500/15 text-blue-400 border-blue-500/20'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-red-500/15 text-red-400 border-red-500/20'
                    : order.orderStatus === 'ORDER_PLACED' || order.orderStatus === 'TEMPLE_BLESSING'
                    ? 'bg-[#F4A62A]/15 text-[#F4A62A] border-[#F4A62A]/20'
                    : 'bg-white/10 text-white border-white/10';

                  const fulfillmentBulletClass = order.orderStatus === 'DELIVERED'
                    ? 'bg-emerald-400'
                    : order.orderStatus === 'IN_TRANSIT'
                    ? 'bg-blue-400'
                    : order.orderStatus === 'CANCELLED'
                    ? 'bg-red-400'
                    : order.orderStatus === 'ORDER_PLACED' || order.orderStatus === 'TEMPLE_BLESSING'
                    ? 'bg-[#F4A62A]'
                    : 'bg-white/70';

                  const msgCount = (order.timelineEvents || []).filter(e => e.author === order.address?.fullName || e.author === 'Customer').length;

                  return (
                    <tr key={order.id} onClick={() => setSelectedOrderId(order.id)} className="hover:bg-white/[0.04] transition-colors group cursor-pointer">
                      <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}><input type="checkbox" className="rounded border-white/20 bg-transparent" /></td>
                      <td className="px-4 py-2.5 font-bold hover:underline">#{(order?.id || '').slice(-4).toUpperCase()}</td>
                      <td className="px-4 py-2.5 text-[#FFF8F0]/80">{formatOrderDate(order.createdAt)}</td>
                      <td className="px-4 py-2.5 font-medium">{order?.address?.fullName || 'No customer'}</td>
                      <td className="px-4 py-2.5 font-medium text-right">₹{Number(order?.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</td>
                      
                      {/* Payment Status Pill */}
                      <td className="px-4 py-2.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md border font-medium text-xs ${paymentPillClass}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'PAID' ? 'bg-emerald-400' : 'bg-white/40'}`}></div>
                          {order.paymentStatus === 'PAID' ? 'Paid' : order.paymentStatus === 'REFUNDED' ? 'Refunded' : 'Not paid'}
                        </span>
                      </td>

                      <td className="px-4 py-2.5" onClick={e => e.stopPropagation()}>
                        <div className={`relative inline-flex items-center px-2.5 py-0.5 rounded-md border font-medium text-xs ${fulfillmentPillClass}`}>
                          <select 
                            value={order.orderStatus}
                            onChange={e => updateOrderStatus(order.id, e.target.value as any)}
                            className="appearance-none cursor-pointer outline-none bg-transparent pr-4 z-10"
                          >
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="ORDER_PLACED">Unfulfilled</option>
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="TEMPLE_BLESSING">Temple Blessing</option>
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="PACKED">Packed</option>
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="IN_TRANSIT">In Transit</option>
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="DELIVERED">Delivered</option>
                            <option className="bg-[#1C080C] text-[#FFF8F0]" value="CANCELLED">Cancelled</option>
                          </select>
                          <ChevronDown className="w-3 h-3 opacity-50 absolute right-1 pointer-events-none" />
                        </div>
                      </td>

                      <td className="px-4 py-2.5 text-[#FFF8F0]/80">{(order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0)} item{(order.items || []).length !== 1 ? 's' : ''}</td>
                      

                      
                      <td className="px-4 py-2.5 text-[#FFF8F0]/80">Shipping</td>
                      <td className="px-4 py-2.5 text-center">
                        <div className="inline-flex items-center justify-center">
                          <div className="relative flex h-2.5 w-2.5">
                            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${fulfillmentBulletClass}`}></span>
                            <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${fulfillmentBulletClass}`}></span>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center relative" onClick={e => e.stopPropagation()}>
                        <div className="inline-block relative">
                          <Bell className="w-5 h-5 text-[#FFF8F0]/60 hover:text-white transition-colors cursor-pointer" />
                          {msgCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-sm ring-1 ring-black">
                              {msgCount}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
};
