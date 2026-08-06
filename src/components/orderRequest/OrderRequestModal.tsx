import React, { useState } from 'react';
import { FileText, User, Phone, Mail, MapPin, Calendar, IndianRupee, Sparkles, X, CheckCircle2, MessageCircle } from 'lucide-react';

interface OrderRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OrderRequestModal: React.FC<OrderRequestModalProps> = ({ isOpen, onClose }) => {
  const [devoteeName, setDevoteeName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [requestType, setRequestType] = useState('Special Mahaprasad Box');
  const [details, setDetails] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [estimatedAmount, setEstimatedAmount] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReqNo, setSubmittedReqNo] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!devoteeName || !phone) return;

    const reqNo = `REQ-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newReq = {
      id: `req-${Date.now()}`,
      reqNo: reqNo,
      devoteeName,
      phone,
      email: email || 'devotee@babadham.org',
      address: address || 'Deoghar Dham',
      requestType,
      details: details || requestType,
      preferredDate: preferredDate || new Date().toISOString().split('T')[0],
      estimatedAmount: parseFloat(estimatedAmount) || 1500,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const STORAGE_KEY = 'babadham_order_requests';
      const existingStr = localStorage.getItem(STORAGE_KEY);
      const existing = existingStr ? JSON.parse(existingStr) : [];
      const updated = [newReq, ...existing];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Trigger cross-tab sync
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('bbp_db_updated'));
      try {
        const channel = new BroadcastChannel('bbp_db_sync');
        channel.postMessage({ type: 'DB_UPDATED' });
        channel.close();
      } catch (err) {}

      // Server persistence sync
      fetch('/api/db', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-CSRF-Token': 'babadham_sec_token_882910',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify({ babadham_order_requests: updated })
      }).catch(() => {});

    } catch (err) {}

    setSubmittedReqNo(reqNo);
    setIsSubmitted(true);
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setDevoteeName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setRequestType('Special Mahaprasad Box');
    setDetails('');
    setPreferredDate('');
    setEstimatedAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#1C080C] border-2 border-[#F4A62A]/40 rounded-3xl max-w-xl w-full overflow-hidden shadow-[0_0_40px_rgba(244,166,42,0.3)] my-auto relative">
        
        {/* Close Button */}
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-[#500A18] text-[#F4A62A] hover:bg-[#7A1126] hover:text-white border border-[#F4A62A]/40 flex items-center justify-center cursor-pointer transition-all z-10 shadow-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Banner Header */}
        <div className="bg-gradient-to-r from-[#500A18] via-[#7A1126] to-[#500A18] p-6 text-center border-b border-[#F4A62A]/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,166,42,0.15),transparent_70%)]"></div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#120508]/60 border border-[#F4A62A]/40 text-[#F4A62A] text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" /> Baidyanath Sacred Services
          </div>
          <h2 className="font-serif-temple font-extrabold text-xl sm:text-2xl text-[#F4A62A] drop-shadow-md">
            Custom Order & Puja Request
          </h2>
          <p className="text-xs text-[#FFF8F0]/80 mt-1 max-w-md mx-auto">
            विशेष प्रसाद, थोक पेड़ा, अथवा विशेष पूजा सेवा हेतु अपना अनुरोध सबमिट करें।
          </p>
        </div>

        {/* Form Body or Success Screen */}
        <div className="p-6">
          {isSubmitted ? (
            <div className="text-center space-y-5 py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-950 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto shadow-lg animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div>
                <h3 className="font-serif-temple text-2xl font-bold text-[#F4A62A]">
                  अनुरोध सफलतापूर्वक दर्ज हुआ!
                </h3>
                <p className="text-xs text-[#FFF8F0]/80 mt-1">
                  Har Har Mahadev! Your request reference number is:
                </p>
                <div className="mt-3 inline-block px-4 py-2 rounded-xl bg-[#2B1217] border border-[#F4A62A]/50 text-[#F4A62A] font-mono font-bold text-lg shadow-inner">
                  {submittedReqNo}
                </div>
              </div>

              <div className="bg-[#2B1217] p-4 rounded-2xl border border-[#F4A62A]/20 text-xs text-[#FFF8F0]/80 text-left space-y-1.5">
                <div className="font-bold text-[#F4A62A]">Next Steps:</div>
                <p>• Our temple seva command center will review your request within 1 hour.</p>
                <p>• You will receive a call / WhatsApp message on <strong>{phone}</strong> regarding pricing and dispatch timing.</p>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                <a
                  href={`https://wa.me/919876543211?text=Jai%20Baba%20Baidyanath!%20I%20have%20submitted%20Custom%20Order%20Request%20${submittedReqNo}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-all flex items-center justify-center gap-2 shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> Connect on WhatsApp
                </a>
                <button
                  onClick={handleResetAndClose}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-[#500A18] text-[#F4A62A] font-bold text-xs hover:bg-[#7A1126] transition-all border border-[#F4A62A]/40"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Devotee Name (पूरा नाम) *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={devoteeName}
                      onChange={e => setDevoteeName(e.target.value)}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Mobile Number (फोन नंबर) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Email Address (optional)
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="devotee@example.com"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Service / Prasad Category *
                  </label>
                  <select
                    value={requestType}
                    onChange={e => setRequestType(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="Special Mahaprasad Box">Special Mahaprasad Box (महाप्रसाद)</option>
                    <option value="Bulk Pure Milk Peda Prasad">Bulk Pure Milk Peda Prasad (5kg+)</option>
                    <option value="Garbhagriha Touch Blessing">Garbhagriha Touch Blessing Prasad</option>
                    <option value="Sultanganj Sacred Gangajal Jars">Sultanganj Sacred Gangajal Jars</option>
                    <option value="Sphatik Shivalinga & Rudraksha Mala">Sphatik Shivalinga & Rudraksha Mala</option>
                    <option value="Special Somvar Rudrabhishek Bhog">Special Somvar Rudrabhishek Bhog</option>
                    <option value="Other Custom Prasad / Ritual">Other Custom Prasad / Ritual Request</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">
                  Delivery Address & City (पता) *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="Full Address, Landmark, City & Pincode"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#F4A62A] font-bold mb-1">
                  Specific Requirements / Details (आवश्यक विवरण)
                </label>
                <textarea
                  rows={2}
                  value={details}
                  onChange={e => setDetails(e.target.value)}
                  placeholder="Mention exact peda weight, packaging preferences, sacred name for puja blessing..."
                  className="w-full p-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Preferred Date (इच्छित तिथि)
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={e => setPreferredDate(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#F4A62A] font-bold mb-1">
                    Estimated Budget (₹)
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 text-[#F4A62A]/70 absolute left-3 top-2.5" />
                    <input
                      type="number"
                      value={estimatedAmount}
                      onChange={e => setEstimatedAmount(e.target.value)}
                      placeholder="e.g. 2000"
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#120508] border border-[#F4A62A]/30 text-white placeholder-[#FFF8F0]/30 focus:outline-none focus:border-[#F4A62A]"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={handleResetAndClose}
                  className="px-5 py-2.5 rounded-xl bg-[#120508] text-[#FFF8F0]/70 font-bold hover:text-white transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4A62A] to-[#E59210] text-[#2B1A16] font-extrabold hover:bg-white transition-all cursor-pointer shadow-lg flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" /> Submit Order Request
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};
