import React, { useState } from 'react';
import { Order } from '../../types/ecommerce';
import { 
  ArrowLeft, Printer, ChevronDown, ChevronLeft, ChevronRight, 
  Edit2, Package, CheckCircle2, Smile, AtSign, Hash, Paperclip, 
  AlertCircle, MoreHorizontal, User, Mail, Phone, Check, X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { generateOrderPDF, generatePackingSlipPDF } from '../../utils/pdfGenerator';

interface OrderDetailViewProps {
  order: Order;
  onBack: () => void;
}

export const OrderDetailView: React.FC<OrderDetailViewProps> = ({ order, onBack }) => {
  const { updateOrderStatus, updateOrderPaymentStatus, updateOrderNotes, updateOrderAddress, addTimelineEvent, adminProfile } = useAdmin();

  // Local state for editing
  const [isMoreActionsOpen, setIsMoreActionsOpen] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [noteInput, setNoteInput] = useState(order.notes || '');

  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactInput, setContactInput] = useState({
    email: order.address?.email || '',
    phone: order.address?.phone || ''
  });

  const [isEditingShipping, setIsEditingShipping] = useState(false);
  const [shippingInput, setShippingInput] = useState({
    addressLine: order.address?.addressLine || '',
    city: order.address?.city || '',
    state: order.address?.state || '',
    pincode: order.address?.pincode || ''
  });

  const [timelineInput, setTimelineInput] = useState('');

  const isUnpaid = (order.paymentMethod || '').toUpperCase() === 'COD' && order.orderStatus !== 'DELIVERED';
  const paymentPillClass = order.paymentStatus === 'REFUNDED'
    ? 'bg-red-500/15 text-red-400 border-red-500/20'
    : isUnpaid 
      ? 'bg-[#F4A62A]/15 text-[#F4A62A] border-[#F4A62A]/20' 
      : 'bg-white/10 text-white border-white/10';
  
  const isUnfulfilled = order.orderStatus === 'ORDER_PLACED' || order.orderStatus === 'TEMPLE_BLESSING';
  const fulfillmentPillClass = isUnfulfilled
    ? 'bg-[#F4A62A]/15 text-[#F4A62A] border-[#F4A62A]/20'
    : 'bg-white/10 text-white border-white/10';

  const formatOrderDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
  };

  const totalItems = (order.items || []).reduce((acc, it) => acc + (it.quantity || 1), 0);

  // Handlers
  const handleFulfillItems = () => {
    updateOrderStatus(order.id, 'PACKED');
    addTimelineEvent(order.id, {
      author: adminProfile?.name || 'Admin',
      content: 'Fulfillment process started. Items marked as packed.',
      type: 'system'
    });
  };

  const handleCreateShippingLabel = () => {
    alert('Shipping label generated successfully via partner integration.');
    updateOrderStatus(order.id, 'IN_TRANSIT');
    addTimelineEvent(order.id, {
      author: adminProfile?.name || 'Admin',
      content: 'Shipping label created. Order is now in transit.',
      type: 'system'
    });
  };

  const handleSaveNotes = () => {
    updateOrderNotes(order.id, noteInput);
    setIsEditingNotes(false);
  };

  const handleSaveContact = () => {
    updateOrderAddress(order.id, 'shipping', { ...order.address, ...contactInput });
    setIsEditingContact(false);
  };

  const handleSaveShipping = () => {
    updateOrderAddress(order.id, 'shipping', { ...order.address, ...shippingInput });
    setIsEditingShipping(false);
  };

  const handlePostComment = () => {
    if (!timelineInput.trim()) return;
    addTimelineEvent(order.id, {
      author: adminProfile?.name || 'Admin Sevak',
      content: timelineInput,
      type: 'comment'
    });
    setTimelineInput('');
  };

  return (
    <div className="max-w-[1400px] mx-auto font-sans pb-12 animate-fade-in text-[13px] text-[#FFF8F0]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-md transition-colors -ml-1.5">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h2 className="text-2xl font-bold text-white tracking-tight">#{order.id.slice(-4).toUpperCase()}</h2>
            
            <div className="flex items-center gap-2 ml-1">
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-medium text-xs ${paymentPillClass}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${order.paymentStatus === 'REFUNDED' ? 'bg-red-400' : isUnpaid ? 'bg-[#F4A62A]' : 'bg-white/70'}`}></div>
                {order.paymentStatus === 'REFUNDED' ? 'Refunded' : isUnpaid ? 'Payment pending' : 'Paid'}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border font-medium text-xs ${fulfillmentPillClass}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${isUnfulfilled ? 'bg-[#F4A62A]' : 'bg-white/70'}`}></div>
                {isUnfulfilled ? 'Unfulfilled' : 'Fulfilled'}
              </span>
            </div>
          </div>
          <p className="text-[#FFF8F0]/50 mt-1 pl-10">{formatOrderDate(order.createdAt)} from Online Store</p>
        </div>
        
        <div className="flex items-center gap-2 md:pl-0 pl-10 relative">
          <button 
            onClick={() => updateOrderPaymentStatus(order.id, 'REFUNDED')}
            className="px-3 py-1.5 font-semibold rounded-lg bg-[#2B1217] hover:bg-[#3d1921] text-[#FFF8F0] border border-white/10 transition-colors shadow-sm"
          >
            Refund
          </button>
          <button className="px-3 py-1.5 font-semibold rounded-lg bg-[#2B1217] hover:bg-[#3d1921] text-[#FFF8F0] border border-white/10 transition-colors shadow-sm flex items-center gap-1.5">
            Print <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsMoreActionsOpen(!isMoreActionsOpen)}
              className="px-3 py-1.5 font-semibold rounded-lg bg-[#2B1217] hover:bg-[#3d1921] text-[#FFF8F0] border border-white/10 transition-colors shadow-sm flex items-center gap-1.5"
            >
              More actions <ChevronDown className="w-3.5 h-3.5 opacity-70" />
            </button>
            {isMoreActionsOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#1C080C] border border-white/10 rounded-xl shadow-xl py-2 z-50 animate-fade-in">
                <button className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors text-red-400">Cancel order</button>
                <button className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors">Archive</button>
                <div className="border-t border-white/10 my-2"></div>
                <button 
                  onClick={() => { generateOrderPDF(order); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  Print order page
                </button>
                <button 
                  onClick={() => { generatePackingSlipPDF(order); setIsMoreActionsOpen(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-white/5 transition-colors"
                >
                  Print packing slips
                </button>
              </div>
            )}
          </div>
          <div className="flex ml-1">
            <button className="p-1.5 border border-white/10 rounded-l-lg bg-[#2B1217] hover:bg-[#3d1921] transition-colors"><ChevronLeft className="w-4 h-4" /></button>
            <button className="p-1.5 border border-white/10 border-l-0 rounded-r-lg bg-[#2B1217] hover:bg-[#3d1921] transition-colors"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-5">
          
          {/* Fulfillment Card */}
          <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium text-xs ${fulfillmentPillClass}`}>
                    <Package className="w-3.5 h-3.5" />
                    {isUnfulfilled ? `Unfulfilled (${totalItems})` : `Fulfilled (${totalItems})`}
                  </span>
                </div>
                <div className="text-[#FFF8F0]/50 mb-0.5">Delivery method</div>
                <div className="font-medium">Shipping</div>
              </div>
              <button className="text-[#FFF8F0]/40 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
            </div>
            
            <div className="p-4 space-y-4">
              {(order.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
                    {item.product?.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-white/30" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate text-[14px] hover:underline cursor-pointer">{item.product?.name || 'Unknown Product'}</div>
                  </div>
                  <div className="text-right flex items-center gap-4 text-[#FFF8F0]/80">
                    <span>₹{item.product?.price?.toLocaleString('en-IN') || 0} × {item.quantity || 1}</span>
                    <span className="font-medium text-white w-20">₹{((item.product?.price || 0) * (item.quantity || 1)).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>
              ))}
            </div>

            {isUnfulfilled && (
              <div className="p-4 border-t border-white/10 bg-[#250d12] flex justify-end gap-3">
                <button 
                  onClick={handleFulfillItems}
                  className="px-4 py-2 font-semibold rounded-lg bg-white/10 hover:bg-white/15 text-white transition-colors shadow-sm"
                >
                  Fulfill items
                </button>
                <button 
                  onClick={handleCreateShippingLabel}
                  className="px-4 py-2 font-semibold rounded-lg bg-[#F4A62A] hover:bg-[#F4A62A]/90 text-[#120508] transition-colors shadow-sm"
                >
                  Create shipping label
                </button>
              </div>
            )}
          </div>

          {/* Payment Card */}
          <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md p-4">
            <div className="flex items-center gap-2 mb-4">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border font-medium text-xs ${paymentPillClass}`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {order.paymentStatus === 'REFUNDED' ? 'Refunded' : isUnpaid ? 'Payment pending' : 'Paid'}
              </span>
            </div>
            
            <div className="space-y-2.5 text-[14px]">
              <div className="flex justify-between text-[#FFF8F0]/80">
                <span>Subtotal <span className="text-[#FFF8F0]/50 text-xs ml-1">{totalItems} items</span></span>
                <span>₹{Number(order.subtotal || order.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-2 border-t border-white/5">
                <span>Total</span>
                <span>₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-[#FFF8F0]/80 pt-2 border-t border-white/5">
                <span>{isUnpaid ? 'To be paid (COD)' : 'Paid'}</span>
                <span>₹{Number(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>

          {/* Timeline Card */}
          <div>
            <h3 className="font-bold text-base mb-3 text-white">Timeline</h3>
            <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md p-4 mb-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center border border-emerald-500/30 shrink-0">
                  {adminProfile?.name?.slice(0,2).toUpperCase() || 'MA'}
                </div>
                <div className="flex-1 border border-white/10 rounded-lg bg-white/5 focus-within:bg-white/10 focus-within:border-white/20 transition-all overflow-hidden flex flex-col">
                  <textarea 
                    placeholder="Leave a comment..." 
                    value={timelineInput}
                    onChange={(e) => setTimelineInput(e.target.value)}
                    className="w-full bg-transparent border-none p-3 text-[13px] text-white resize-none focus:outline-none min-h-[60px]"
                  ></textarea>
                  <div className="bg-[#250d12] border-t border-white/10 p-2 flex justify-between items-center">
                    <div className="flex gap-1 text-[#FFF8F0]/40">
                      <button className="p-1 hover:text-white rounded transition-colors" onClick={() => setTimelineInput(prev => prev + ' 😃')}><Smile className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-white rounded transition-colors" onClick={() => setTimelineInput(prev => prev + ' @')}><AtSign className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-white rounded transition-colors" onClick={() => setTimelineInput(prev => prev + ' #')}><Hash className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-white rounded transition-colors" onClick={() => alert('Photo/Document upload would integrate with your S3/Storage bucket here.')}><Paperclip className="w-4 h-4" /></button>
                    </div>
                    <button 
                      onClick={handlePostComment}
                      className={`px-4 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                        timelineInput.trim() ? 'bg-[#F4A62A] text-[#120508] cursor-pointer' : 'bg-white/10 text-[#FFF8F0]/50 cursor-not-allowed'
                      }`}
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-right text-[11px] text-[#FFF8F0]/40 mt-2">Only you and other staff can see comments</div>
            </div>
            
            {/* Timeline Events Dynamic */}
            <div className="ml-4 pl-4 border-l border-white/10 space-y-6 relative py-2">
              {(order.timelineEvents || []).map(event => (
                <div key={event.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full border-2 border-[#120508] ${
                    event.type === 'system' ? 'bg-blue-400' : 'bg-[#F4A62A]'
                  }`}></div>
                  <div className="font-semibold text-[#FFF8F0]/60 text-xs mb-1.5">
                    {formatOrderDate(event.createdAt)}
                  </div>
                  <p className="text-white">
                    <span className="font-semibold">{event.author}: </span> 
                    {event.content}
                  </p>
                </div>
              ))}

              <div className="relative">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-white/20 border-2 border-[#120508]"></div>
                <div className="font-semibold text-[#FFF8F0]/60 text-xs mb-1.5">
                  {formatOrderDate(order.createdAt)}
                </div>
                <p className="text-white">Order placed by {order.address?.fullName || 'Customer'}</p>
              </div>
            </div>
          </div>
          
        </div>

        {/* Sidebar Column */}
        <div className="space-y-4">
          
          {/* Notes Card */}
          <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-white">Notes</h3>
              <button 
                onClick={() => setIsEditingNotes(!isEditingNotes)} 
                className="text-[#FFF8F0]/40 hover:text-white transition-colors"
              >
                {isEditingNotes ? <X className="w-4 h-4" /> : <Edit2 className="w-3.5 h-3.5" />}
              </button>
            </div>
            {isEditingNotes ? (
              <div className="space-y-2 animate-fade-in">
                <textarea 
                  value={noteInput}
                  onChange={e => setNoteInput(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-[13px] min-h-[80px] focus:outline-none focus:border-[#F4A62A]/50"
                  placeholder="Add notes for staff..."
                />
                <button 
                  onClick={handleSaveNotes}
                  className="w-full py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors text-xs"
                >
                  Save Note
                </button>
              </div>
            ) : (
              <p className="text-[#FFF8F0]/60 whitespace-pre-wrap">{order.notes || 'No notes from customer'}</p>
            )}
          </div>

          {/* Customer Card */}
          <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md overflow-hidden">
            <div className="p-4 border-b border-white/10 flex justify-between items-start">
              <h3 className="font-bold text-white">Customer</h3>
              <button className="text-[#FFF8F0]/40 hover:text-white">×</button>
            </div>
            
            <div className="p-4 border-b border-white/10 space-y-1">
              <a href="#" className="text-blue-400 hover:underline font-semibold">{order.address?.fullName || 'No customer'}</a>
              <div className="text-[#FFF8F0]/60">1 order</div>
            </div>
            
            <div className="p-4 border-b border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Contact information</h4>
                <button 
                  onClick={() => setIsEditingContact(!isEditingContact)}
                  className="text-[#FFF8F0]/40 hover:text-white transition-colors"
                >
                  {isEditingContact ? <X className="w-4 h-4" /> : <Edit2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isEditingContact ? (
                <div className="space-y-2 mt-3 animate-fade-in">
                  <div>
                    <label className="text-[11px] text-[#FFF8F0]/40 uppercase">Email</label>
                    <input 
                      type="email" 
                      value={contactInput.email} 
                      onChange={e => setContactInput({...contactInput, email: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-[#FFF8F0]/40 uppercase">Phone</label>
                    <input 
                      type="tel" 
                      value={contactInput.phone} 
                      onChange={e => setContactInput({...contactInput, phone: e.target.value})}
                      className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                  <button onClick={handleSaveContact} className="mt-2 text-xs font-semibold text-[#F4A62A] hover:text-[#f3b555]">Save Contact</button>
                </div>
              ) : (
                <div className="space-y-1 text-[#FFF8F0]/80">
                  <p>{order.address?.email ? <a href={`mailto:${order.address.email}`} className="text-blue-400 hover:underline">{order.address.email}</a> : 'No email provided'}</p>
                  <p>{order.address?.phone || 'No phone number'}</p>
                </div>
              )}
            </div>

            <div className="p-4 border-b border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Shipping address</h4>
                <button 
                  onClick={() => setIsEditingShipping(!isEditingShipping)}
                  className="text-[#FFF8F0]/40 hover:text-white transition-colors"
                >
                  {isEditingShipping ? <X className="w-4 h-4" /> : <Edit2 className="w-3.5 h-3.5" />}
                </button>
              </div>
              {isEditingShipping ? (
                <div className="space-y-2 mt-3 animate-fade-in">
                  <div>
                    <label className="text-[11px] text-[#FFF8F0]/40 uppercase">Address Line</label>
                    <input type="text" value={shippingInput.addressLine} onChange={e => setShippingInput({...shippingInput, addressLine: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]" />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] text-[#FFF8F0]/40 uppercase">City</label>
                      <input type="text" value={shippingInput.city} onChange={e => setShippingInput({...shippingInput, city: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]" />
                    </div>
                    <div>
                      <label className="text-[11px] text-[#FFF8F0]/40 uppercase">State</label>
                      <input type="text" value={shippingInput.state} onChange={e => setShippingInput({...shippingInput, state: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[11px] text-[#FFF8F0]/40 uppercase">PIN / ZIP Code</label>
                    <input type="text" value={shippingInput.pincode} onChange={e => setShippingInput({...shippingInput, pincode: e.target.value})} className="w-full bg-transparent border-b border-white/20 text-white py-1 focus:outline-none focus:border-[#F4A62A]" />
                  </div>
                  <button onClick={handleSaveShipping} className="mt-2 text-xs font-semibold text-[#F4A62A] hover:text-[#f3b555]">Save Address</button>
                </div>
              ) : (
                <div className="space-y-0.5 text-[#FFF8F0]/80">
                  <p className="font-medium text-white">{order.address?.fullName}</p>
                  <p>{order.address?.addressLine}</p>
                  {order.address?.landmark && <p>{order.address.landmark}</p>}
                  <p>{order.address?.city}, {order.address?.state} {order.address?.pincode}</p>
                  <p>India</p>
                </div>
              )}
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white text-xs uppercase tracking-wider">Billing address</h4>
                <button className="text-[#FFF8F0]/40 hover:text-white transition-colors" onClick={() => alert('Billing address edit is tied to payment gateway. Manual override unavailable.')}><Edit2 className="w-3.5 h-3.5" /></button>
              </div>
              <p className="text-[#FFF8F0]/60">Same as shipping address</p>
            </div>
          </div>

          {/* Conversion summary Card */}
          <div className="bg-[#1C080C] border border-white/10 rounded-xl shadow-md p-4">
            <h3 className="font-bold text-white mb-3">Conversion summary</h3>
            <p className="text-[#FFF8F0]/60 mb-2">There aren't any conversion details available for this order.</p>
            <a href="#" className="text-blue-400 hover:underline">Learn more</a>
          </div>



        </div>

      </div>
    </div>
  );
};
