import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { CreditCard, Save, MapPin, Copy, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { PaymentGatewayConfig, StateShippingTax } from '../../types/ecommerce';

export const PaymentsShippingView: React.FC = () => {
  const { brandSettings, saveBrandSettings } = useAdmin();

  const [activeTab, setActiveTab] = useState<'gateways' | 'shipping'>('gateways');

  // Global Payment Mode
  const [globalPaymentMode, setGlobalPaymentMode] = useState<'TEST' | 'LIVE'>(brandSettings.paymentGateways?.globalPaymentMode || 'TEST');

  // Active Method State
  const [isRazorpayActive, setIsRazorpayActive] = useState(brandSettings.paymentGateways?.isRazorpayActive || false);
  const [isPayUMoneyActive, setIsPayUMoneyActive] = useState(brandSettings.paymentGateways?.isPayUMoneyActive || false);
  const [isCodActive, setIsCodActive] = useState(brandSettings.paymentGateways?.isCodActive ?? true);

  // Gateway Form State
  const [razorpayKeyId, setRazorpayKeyId] = useState(brandSettings.paymentGateways?.razorpayKeyId || '');
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(brandSettings.paymentGateways?.razorpayKeySecret || '');
  const [razorpayWebhookSecret, setRazorpayWebhookSecret] = useState(brandSettings.paymentGateways?.razorpayWebhookSecret || '');
  
  const [payUMerchantKey, setPayUMerchantKey] = useState(brandSettings.paymentGateways?.payUMerchantKey || '');
  const [payUSalt, setPayUSalt] = useState(brandSettings.paymentGateways?.payUSalt || '');
  const [payUWebhookSecret, setPayUWebhookSecret] = useState(brandSettings.paymentGateways?.payUWebhookSecret || '');

  // UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));

  const handleCopy = (text: string, id: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Shipping Form State
  const [shippingRates, setShippingRates] = useState<StateShippingTax[]>(brandSettings.stateShippingRates || []);

  const handleSaveGateways = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentGateways: PaymentGatewayConfig = {
      globalPaymentMode,
      isRazorpayActive,
      razorpayKeyId,
      razorpayKeySecret,
      razorpayWebhookSecret,
      isPayUMoneyActive,
      payUMerchantKey,
      payUSalt,
      payUWebhookSecret,
      isCodActive
    };
    saveBrandSettings({ paymentGateways });
  };

  const handleUpdateShipping = (index: number, field: 'taxPercent' | 'shippingCost', value: number) => {
    const updated = [...shippingRates];
    updated[index] = { ...updated[index], [field]: value };
    setShippingRates(updated);
  };

  const handleSaveShipping = () => {
    saveBrandSettings({ stateShippingRates: shippingRates });
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-serif-temple text-2xl font-bold text-[#F4A62A] mb-2">Payments & Shipping</h2>
        <p className="text-white/60">Configure your payment gateways, webhooks, and state-wise shipping costs.</p>
      </div>

      <div className="flex items-center space-x-2 border-b border-[#F4A62A]/20 pb-4">
        <button 
          onClick={() => setActiveTab('gateways')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-bold ${activeTab === 'gateways' ? 'bg-[#2B1217] text-[#F4A62A] border-b-2 border-[#F4A62A] shadow-[0_-4px_15px_rgba(244,166,42,0.1)]' : 'text-white/50 hover:text-white hover:bg-[#2B1217]/50'}`}
        >
          <CreditCard className="w-5 h-5" /> Payment Gateways
        </button>
        <button 
          onClick={() => setActiveTab('shipping')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-bold ${activeTab === 'shipping' ? 'bg-[#2B1217] text-[#F4A62A] border-b-2 border-[#F4A62A] shadow-[0_-4px_15px_rgba(244,166,42,0.1)]' : 'text-white/50 hover:text-white hover:bg-[#2B1217]/50'}`}
        >
          <MapPin className="w-5 h-5" /> State-wise Shipping
        </button>
      </div>

      <div className="space-y-8">
        {activeTab === 'gateways' && (
          <form onSubmit={handleSaveGateways} className="bg-[#2B1217] p-6 rounded-b-3xl rounded-tr-3xl border border-[#F4A62A]/30 space-y-8 shadow-xl text-sm">
          
          {/* Global Mode Toggle */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-[#1A0B0E] p-5 rounded-2xl border border-[#F4A62A]/20 gap-4">
            <div>
              <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A]">Global Payment Environment</h3>
              <p className="text-xs text-white/50 mt-1">Switch all gateways between Sandbox testing and Live production instantly.</p>
            </div>
            <div className="flex bg-[#120508] p-1.5 rounded-xl border border-[#F4A62A]/30 relative w-max shrink-0">
              <button
                type="button"
                onClick={() => setGlobalPaymentMode('TEST')}
                className={`relative px-6 py-2.5 rounded-lg font-bold text-sm transition-all z-10 w-32 ${globalPaymentMode === 'TEST' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                TEST MODE
              </button>
              <button
                type="button"
                onClick={() => setGlobalPaymentMode('LIVE')}
                className={`relative px-6 py-2.5 rounded-lg font-bold text-sm transition-all z-10 w-32 ${globalPaymentMode === 'LIVE' ? 'text-white' : 'text-white/40 hover:text-white/80'}`}
              >
                LIVE MODE
              </button>
              {/* Animated Background Indicator */}
              <div 
                className={`absolute top-1.5 bottom-1.5 w-32 bg-[#F4A62A] rounded-lg shadow-[0_0_15px_rgba(244,166,42,0.4)] transition-transform duration-300 ease-out`}
                style={{ transform: globalPaymentMode === 'TEST' ? 'translateX(0)' : 'translateX(calc(100%))' }}
              />
            </div>
          </div>

          <div>
            <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] border-b border-[#F4A62A]/20 pb-2 mb-4">Active Payment Methods</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div 
                onClick={() => setIsRazorpayActive(!isRazorpayActive)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${isRazorpayActive ? 'bg-[#F4A62A]/10 border-[#F4A62A] shadow-[0_0_15px_rgba(244,166,42,0.15)]' : 'bg-[#1A0B0E] border-white/10 hover:border-[#F4A62A]/50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${isRazorpayActive ? 'text-[#F4A62A]' : 'text-white/70'}`}>Razorpay</span>
                  {isRazorpayActive && <CheckCircle2 className="w-5 h-5 text-[#F4A62A]" />}
                </div>
                <p className="text-xs text-white/50">Enable India's most popular payment gateway.</p>
              </div>

              <div 
                onClick={() => setIsPayUMoneyActive(!isPayUMoneyActive)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${isPayUMoneyActive ? 'bg-[#F4A62A]/10 border-[#F4A62A] shadow-[0_0_15px_rgba(244,166,42,0.15)]' : 'bg-[#1A0B0E] border-white/10 hover:border-[#F4A62A]/50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${isPayUMoneyActive ? 'text-[#F4A62A]' : 'text-white/70'}`}>PayU Money</span>
                  {isPayUMoneyActive && <CheckCircle2 className="w-5 h-5 text-[#F4A62A]" />}
                </div>
                <p className="text-xs text-white/50">Enable PayU Money integration for payments.</p>
              </div>

              <div 
                onClick={() => setIsCodActive(!isCodActive)}
                className={`cursor-pointer p-4 rounded-2xl border transition-all ${isCodActive ? 'bg-[#F4A62A]/10 border-[#F4A62A] shadow-[0_0_15px_rgba(244,166,42,0.15)]' : 'bg-[#1A0B0E] border-white/10 hover:border-[#F4A62A]/50'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-bold ${isCodActive ? 'text-[#F4A62A]' : 'text-white/70'}`}>Cash on Delivery</span>
                  {isCodActive && <CheckCircle2 className="w-5 h-5 text-[#F4A62A]" />}
                </div>
                <p className="text-xs text-white/50">Allow devotees to pay upon receiving prasad.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] border-b border-[#F4A62A]/20 pb-2 mb-4">Razorpay Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Key ID</label>
                <input type="text" value={razorpayKeyId} onChange={e => setRazorpayKeyId(e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="rzp_test_..." />
              </div>
              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Key Secret</label>
                <div className="relative">
                  <input type={showSecrets['rzp'] ? 'text' : 'password'} value={razorpayKeySecret} onChange={e => setRazorpayKeySecret(e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                  <button type="button" onClick={() => toggleSecret('rzp')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showSecrets['rzp'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#1A0B0E]/50 border border-[#F4A62A]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Webhook URL</label>
                    <p className="text-[10px] text-white/40 mb-2 leading-tight">Copy this URL and paste it into the Razorpay Webhooks dashboard.</p>
                    <div className="relative">
                      <input type="text" readOnly value={`${window.location.origin}/api/webhooks/razorpay`} className="w-full h-[48px] pl-3.5 pr-12 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/10 text-[#F4A62A] cursor-not-allowed focus:outline-none font-mono text-xs" />
                      <button type="button" onClick={() => handleCopy(`${window.location.origin}/api/webhooks/razorpay`, 'rzp-url')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#F4A62A]/10 hover:bg-[#F4A62A]/20 text-[#F4A62A] rounded-lg transition-colors" title="Copy to clipboard">
                        {copiedId === 'rzp-url' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Webhook Secret</label>
                    <p className="text-[10px] text-white/40 mb-2 leading-tight">The secret you set in Razorpay for validating webhook signatures.</p>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <input type={showSecrets['rzp-wh'] ? 'text' : 'password'} value={razorpayWebhookSecret} onChange={e => setRazorpayWebhookSecret(e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                        <button type="button" onClick={() => toggleSecret('rzp-wh')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                          {showSecrets['rzp-wh'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button type="button" onClick={() => handleCopy(razorpayWebhookSecret, 'rzp-wh-copy')} className="h-[48px] px-4 bg-[#F4A62A]/10 hover:bg-[#F4A62A]/20 border border-[#F4A62A]/20 text-[#F4A62A] rounded-xl transition-colors shrink-0 flex items-center justify-center" title="Copy to clipboard">
                        {copiedId === 'rzp-wh-copy' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] border-b border-[#F4A62A]/20 pb-2 mb-4 mt-8">PayU Money Configuration</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Merchant Key</label>
                <input type="text" value={payUMerchantKey} onChange={e => setPayUMerchantKey(e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" />
              </div>
              <div>
                <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Salt</label>
                <div className="relative">
                  <input type={showSecrets['payu'] ? 'text' : 'password'} value={payUSalt} onChange={e => setPayUSalt(e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                  <button type="button" onClick={() => toggleSecret('payu')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                    {showSecrets['payu'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div className="sm:col-span-2 p-4 rounded-xl bg-[#1A0B0E]/50 border border-[#F4A62A]/20">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Webhook URL</label>
                    <p className="text-[10px] text-white/40 mb-2 leading-tight">Copy this URL and paste it into the PayUMoney Webhooks dashboard.</p>
                    <div className="relative">
                      <input type="text" readOnly value={`${window.location.origin}/api/webhooks/payumoney`} className="w-full h-[48px] pl-3.5 pr-12 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/10 text-[#F4A62A] cursor-not-allowed focus:outline-none font-mono text-xs" />
                      <button type="button" onClick={() => handleCopy(`${window.location.origin}/api/webhooks/payumoney`, 'payu-url')} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#F4A62A]/10 hover:bg-[#F4A62A]/20 text-[#F4A62A] rounded-lg transition-colors" title="Copy to clipboard">
                        {copiedId === 'payu-url' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Webhook Secret</label>
                    <p className="text-[10px] text-white/40 mb-2 leading-tight">The secret you set in PayUMoney for validating webhook signatures.</p>
                    <div className="relative flex gap-2">
                      <div className="relative flex-1">
                        <input type={showSecrets['payu-wh'] ? 'text' : 'password'} value={payUWebhookSecret} onChange={e => setPayUWebhookSecret(e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                        <button type="button" onClick={() => toggleSecret('payu-wh')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                          {showSecrets['payu-wh'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <button type="button" onClick={() => handleCopy(payUWebhookSecret, 'payu-wh-copy')} className="h-[48px] px-4 bg-[#F4A62A]/10 hover:bg-[#F4A62A]/20 border border-[#F4A62A]/20 text-[#F4A62A] rounded-xl transition-colors shrink-0 flex items-center justify-center" title="Copy to clipboard">
                        {copiedId === 'payu-wh-copy' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6 border-t border-[#F4A62A]/20 pt-6">
            <button type="submit" className="flex items-center gap-2 bg-[#F4A62A] text-[#120508] px-8 py-3.5 rounded-xl font-bold hover:bg-[#F4A62A]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(244,166,42,0.3)]">
              <Save className="w-5 h-5" /> Save Gateways
            </button>
          </div>
        </form>
        )}

        {activeTab === 'shipping' && (
        <div className="bg-[#2B1217] p-6 rounded-b-3xl rounded-tr-3xl border border-[#F4A62A]/30 space-y-6 shadow-xl text-sm">
          <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4">
            <div>
              <h3 className="font-serif-temple text-xl font-bold text-[#F4A62A]">State-wise Shipping & Taxes</h3>
              <p className="text-xs text-white/50 mt-1">Set the specific shipping cost and tax rate for every Indian State and Union Territory.</p>
            </div>
            <button onClick={handleSaveShipping} className="flex items-center gap-2 bg-[#F4A62A] text-[#120508] px-6 py-2.5 rounded-xl font-bold hover:bg-[#F4A62A]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_15px_rgba(244,166,42,0.3)] shrink-0">
              <Save className="w-4 h-4" /> Save Rates
            </button>
          </div>
          
          <div className="overflow-x-auto rounded-xl border border-[#F4A62A]/20">
            <table className="w-full text-left text-white border-collapse">
              <thead>
                <tr className="bg-[#1A0B0E] text-[#F4A62A] border-b border-[#F4A62A]/20 uppercase text-xs tracking-wider">
                  <th className="p-4 font-bold">Indian State / UT</th>
                  <th className="p-4 font-bold">Tax Percent (%)</th>
                  <th className="p-4 font-bold">Shipping Cost (₹)</th>
                </tr>
              </thead>
              <tbody>
                {shippingRates.map((rate, idx) => (
                  <tr key={rate.stateName} className="border-b border-[#F4A62A]/10 hover:bg-[#1A0B0E]/50 transition-colors">
                    <td className="p-4 font-bold">{rate.stateName}</td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        min="0" max="100" 
                        value={rate.taxPercent} 
                        onChange={e => handleUpdateShipping(idx, 'taxPercent', Number(e.target.value))}
                        className="w-[100px] h-[36px] px-3 rounded-lg bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" 
                      />
                    </td>
                    <td className="p-4">
                      <input 
                        type="number" 
                        min="0" 
                        value={rate.shippingCost} 
                        onChange={e => handleUpdateShipping(idx, 'shippingCost', Number(e.target.value))}
                        className="w-[100px] h-[36px] px-3 rounded-lg bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" 
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
