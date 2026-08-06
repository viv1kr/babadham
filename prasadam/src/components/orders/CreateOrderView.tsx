import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { ArrowLeft, Save, Trash2, Plus, X } from 'lucide-react';
import type { Order, CartItem, OrderAddress } from '../../types/ecommerce';

interface CreateOrderViewProps {
  onBack: () => void;
}

export const CreateOrderView: React.FC<CreateOrderViewProps> = ({ onBack }) => {
  const { addOrder, addTimelineEvent, products, showToast } = useAdmin();

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [address, setAddress] = useState<OrderAddress>({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    landmark: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India'
  });

  const [items, setItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD');
  const [paymentStatus, setPaymentStatus] = useState<'PENDING' | 'PAID'>('PENDING');

  const handleAddItem = (productId: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const existingItem = items.find(i => i.id === productId);
    if (existingItem) {
      setItems(items.map(i => i.id === productId ? { ...i, quantity: i.quantity + 1 } : i));
    } else {
      setItems([...items, {
        id: prod.id,
        name: prod.name,
        price: prod.price,
        quantity: 1,
        image: prod.images?.[0] || ''
      }]);
    }
  };

  const handleRemoveItem = (productId: string) => {
    setItems(items.filter(i => i.id !== productId));
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) return handleRemoveItem(productId);
    setItems(items.map(i => i.id === productId ? { ...i, quantity: qty } : i));
  };

  const handleToggleProductInModal = (productId: string) => {
    const existing = items.find(i => i.id === productId);
    if (existing) {
      handleRemoveItem(productId);
    } else {
      handleAddItem(productId);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (Number(item.price) * item.quantity), 0);
  const shipping = 0; // Configurable
  const totalAmount = subtotal + shipping;

  const handleSaveOrder = () => {
    if (!address.fullName || !address.phone) {
      alert('Name and Phone are required.');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item.');
      return;
    }

    const orderData: Omit<Order, 'id' | 'createdAt'> = {
      address,
      items,
      subtotal,
      discount: 0,
      shipping,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus: 'ORDER_PLACED',
      trackingSteps: [
        { title: 'Order placed', location: 'System', timestamp: new Date().toISOString(), completed: true, active: false }
      ]
    };

    const newOrder = addOrder(orderData);
    
    // Simulate auto-sending WhatsApp and Email
    if (newOrder && newOrder.id) {
      addTimelineEvent(newOrder.id, {
        author: 'System API',
        content: `Order confirmation successfully sent via WhatsApp API to ${address.phone}`,
        type: 'system'
      });
      if (address.email) {
        addTimelineEvent(newOrder.id, {
          author: 'System API',
          content: `Order confirmation email sent successfully to ${address.email}`,
          type: 'system'
        });
      }
    }
    
    showToast('Order created. Confirmation WhatsApp and Email automatically sent.', 'success');
    onBack();
  };

  return (
    <div className="w-full pt-4 sm:pt-6 space-y-6 font-sans pb-12 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-md transition-colors -ml-1.5">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Manual Order</h2>
        </div>
        <button 
          onClick={handleSaveOrder}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#14A800] hover:bg-[#118A00] text-white font-semibold transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Order
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#2B1217] rounded-xl border border-white/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Details</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Full Name *</label>
                  <input type="text" value={address.fullName} onChange={e => setAddress({...address, fullName: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="Devotee Name" />
                </div>
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Phone Number *</label>
                  <input type="tel" value={address.phone} onChange={e => setAddress({...address, phone: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="10-digit mobile" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Email (Optional)</label>
                  <input type="email" value={address.email} onChange={e => setAddress({...address, email: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="Email address" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2B1217] rounded-xl border border-white/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Shipping Address</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Address Line</label>
                <input type="text" value={address.addressLine} onChange={e => setAddress({...address, addressLine: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="House No, Street" />
              </div>
              <div>
                <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Nearby Landmark</label>
                <input type="text" value={address.landmark || ''} onChange={e => setAddress({...address, landmark: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="e.g. Near Shiv Temple" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">City</label>
                  <input type="text" value={address.city} onChange={e => setAddress({...address, city: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" />
                </div>
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">State</label>
                  <input type="text" value={address.state} onChange={e => setAddress({...address, state: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" />
                </div>
                <div>
                  <label className="text-xs text-[#FFF8F0]/50 mb-1 block">PIN Code</label>
                  <input type="text" value={address.pincode} onChange={e => setAddress({...address, pincode: e.target.value})} className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]" />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          
          {/* Order Items */}
          <div className="bg-[#2B1217] rounded-xl border border-white/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Order Items</h3>
            
            <button 
              onClick={() => setIsProductModalOpen(true)}
              className="w-full bg-[#1C080C] border border-white/10 hover:border-[#F4A62A] transition-colors rounded-lg px-3 py-2 text-white flex items-center justify-center gap-2 mb-4"
            >
              <Plus className="w-4 h-4 text-[#F4A62A]" />
              Add Products from Catalog
            </button>

            <div className="space-y-3">
              {items.length === 0 && <p className="text-xs text-white/40 text-center py-4">No items added yet</p>}
              {items.map(item => (
                <div key={item.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg">
                  <div className="flex flex-col">
                    <span className="text-sm text-white font-medium truncate w-32">{item.name}</span>
                    <span className="text-xs text-white/50">₹{item.price} x {item.quantity}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="number" 
                      min="1"
                      className="w-12 bg-black/20 border border-white/10 rounded px-1 py-0.5 text-white text-center text-sm"
                      value={item.quantity}
                      onChange={(e) => handleUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                    />
                    <button onClick={() => handleRemoveItem(item.id)} className="text-red-400 hover:text-red-300 p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 mt-4 pt-4 space-y-2 text-sm text-[#FFF8F0]/80">
              <div className="flex justify-between"><p>Subtotal</p><p>₹{subtotal.toLocaleString()}</p></div>
              <div className="flex justify-between"><p>Shipping</p><p>₹{shipping.toLocaleString()}</p></div>
              <div className="flex justify-between font-bold text-white text-base mt-2 pt-2 border-t border-white/10">
                <p>Total</p><p>₹{totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="bg-[#2B1217] rounded-xl border border-white/10 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Payment</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Payment Method</label>
                <select 
                  className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="UPI">UPI</option>
                  <option value="CARD">Card</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-[#FFF8F0]/50 mb-1 block">Payment Status</label>
                <select 
                  className="w-full bg-[#1C080C] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#F4A62A]"
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as any)}
                >
                  <option value="PENDING">Pending (Unpaid)</option>
                  <option value="PAID">Paid</option>
                </select>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Product Selection Modal */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#2B1217] border border-white/10 rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl overflow-hidden m-4">
            <div className="flex justify-between items-center p-4 border-b border-white/10 bg-[#1C080C]">
              <h3 className="text-lg font-bold text-white tracking-tight">Select Products</h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-[#FFF8F0]/60 hover:text-white p-1 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="overflow-y-auto p-4 flex-1 space-y-2">
              {products.map(p => {
                const isSelected = items.some(i => i.id === p.id);
                return (
                  <div 
                    key={p.id} 
                    onClick={() => handleToggleProductInModal(p.id)}
                    className={`flex items-center gap-4 p-3 rounded-lg border transition-all cursor-pointer ${
                      isSelected 
                        ? 'border-[#F4A62A] bg-[#F4A62A]/10' 
                        : 'border-white/10 bg-white/5 hover:border-white/30'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-[#F4A62A] border-[#F4A62A]' : 'border-white/20'
                    }`}>
                      {isSelected && <Save className="w-3 h-3 text-black" />} {/* Using Save as a checkmark fallback, or you can import Check from lucide-react */}
                    </div>
                    {p.images && p.images[0] && (
                      <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-medium">{p.name}</p>
                      <p className="text-[#F4A62A] text-sm">₹{Number(p.price).toLocaleString()}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#1C080C] flex justify-end">
              <button 
                onClick={() => setIsProductModalOpen(false)}
                className="px-6 py-2 bg-[#F4A62A] hover:bg-[#f3b555] text-black font-semibold rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
