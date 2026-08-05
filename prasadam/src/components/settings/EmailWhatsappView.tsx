import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Mail, MessageSquare, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { EmailWhatsappConfig } from '../../types/ecommerce';

export const EmailWhatsappView: React.FC = () => {
  const { brandSettings, saveBrandSettings } = useAdmin();

  const [activeTab, setActiveTab] = useState<'email' | 'whatsapp'>('email');
  
  // Default Config
  const initialConfig: EmailWhatsappConfig = brandSettings.emailWhatsappConfig || {
    emailProvider: 'smtp',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    fromEmail: '',
    fromName: 'Babadham Prasad',
    whatsappProvider: 'meta',
    whatsappApiKey: '',
    whatsappPhoneNumberId: '',
    whatsappBusinessAccountId: '',
    whatsappOtpTemplateId: 'user_registration_otp',
    whatsappOrderConfirmationTemplateId: 'order_confirmation',
    whatsappShippingUpdateTemplateId: 'order_shipping_update'
  };

  const [config, setConfig] = useState<EmailWhatsappConfig>(initialConfig);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const toggleSecret = (id: string) => setShowSecrets(prev => ({ ...prev, [id]: !prev[id] }));

  const handleChange = (field: keyof EmailWhatsappConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveBrandSettings({ emailWhatsappConfig: config });
    // In a real app, this would also trigger a toast notification from context
    alert('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="font-serif-temple text-2xl font-bold text-[#F4A62A] mb-2">Email & WhatsApp API Integration</h2>
        <p className="text-white/60">Configure your SMTP email server and WhatsApp Business API for transactional messaging.</p>
      </div>

      <div className="flex items-center space-x-2 border-b border-[#F4A62A]/20 pb-4">
        <button 
          onClick={() => setActiveTab('email')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-bold ${activeTab === 'email' ? 'bg-[#2B1217] text-[#F4A62A] border-b-2 border-[#F4A62A] shadow-[0_-4px_15px_rgba(244,166,42,0.1)]' : 'text-white/50 hover:text-white hover:bg-[#2B1217]/50'}`}
        >
          <Mail className="w-5 h-5" /> Email Integration (SMTP)
        </button>
        <button 
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all font-bold ${activeTab === 'whatsapp' ? 'bg-[#2B1217] text-[#F4A62A] border-b-2 border-[#F4A62A] shadow-[0_-4px_15px_rgba(244,166,42,0.1)]' : 'text-white/50 hover:text-white hover:bg-[#2B1217]/50'}`}
        >
          <MessageSquare className="w-5 h-5" /> WhatsApp API Integration
        </button>
      </div>

      <div className="space-y-8">
        <form onSubmit={handleSave} className="bg-[#2B1217] p-6 rounded-b-3xl rounded-tr-3xl border border-[#F4A62A]/30 space-y-8 shadow-xl text-sm">
          
          {activeTab === 'email' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] border-b border-[#F4A62A]/20 pb-2">SMTP Server Details</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Email Provider</label>
                  <select 
                    value={config.emailProvider} 
                    onChange={e => handleChange('emailProvider', e.target.value)}
                    className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="smtp">Custom SMTP / Gmail</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="aws-ses">AWS SES</option>
                  </select>
                </div>

                <div className="hidden sm:block"></div>

                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">SMTP Host</label>
                  <input type="text" value={config.smtpHost} onChange={e => handleChange('smtpHost', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="smtp.gmail.com" />
                </div>
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">SMTP Port</label>
                  <input type="text" value={config.smtpPort} onChange={e => handleChange('smtpPort', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="587" />
                </div>
                
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">SMTP Username / Email</label>
                  <input type="text" value={config.smtpUser} onChange={e => handleChange('smtpUser', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="support@domain.com" />
                </div>
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">SMTP Password / App Password</label>
                  <div className="relative">
                    <input type={showSecrets['smtpPass'] ? 'text' : 'password'} value={config.smtpPass} onChange={e => handleChange('smtpPass', e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                    <button type="button" onClick={() => toggleSecret('smtpPass')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                      {showSecrets['smtpPass'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="col-span-1 sm:col-span-2 border-t border-[#F4A62A]/10 mt-2 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">From Email Address</label>
                    <input type="text" value={config.fromEmail} onChange={e => handleChange('fromEmail', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="support@domain.com" />
                  </div>
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">From Name</label>
                    <input type="text" value={config.fromName} onChange={e => handleChange('fromName', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="Babadham Prasad" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'whatsapp' && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="font-serif-temple text-lg font-bold text-[#F4A62A] border-b border-[#F4A62A]/20 pb-2">WhatsApp Business API Configuration</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">WhatsApp Provider</label>
                  <select 
                    value={config.whatsappProvider} 
                    onChange={e => handleChange('whatsappProvider', e.target.value)}
                    className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]"
                  >
                    <option value="meta">Meta Cloud API (Official)</option>
                    <option value="interakt">Interakt</option>
                    <option value="wati">WATI</option>
                    <option value="twilio">Twilio WhatsApp</option>
                  </select>
                </div>

                <div className="hidden sm:block"></div>

                <div className="sm:col-span-2">
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">API Key / Access Token</label>
                  <div className="relative">
                    <input type={showSecrets['whatsappKey'] ? 'text' : 'password'} value={config.whatsappApiKey} onChange={e => handleChange('whatsappApiKey', e.target.value)} className="w-full h-[48px] pl-3.5 pr-10 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="••••••••••••••" />
                    <button type="button" onClick={() => toggleSecret('whatsappKey')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors">
                      {showSecrets['whatsappKey'] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-white/40 mt-1">Permanent access token or API key provided by your vendor.</p>
                </div>

                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Phone Number ID</label>
                  <input type="text" value={config.whatsappPhoneNumberId || ''} onChange={e => handleChange('whatsappPhoneNumberId', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="e.g. 10145678910" />
                </div>
                <div>
                  <label className="block text-[#FFF8F0]/80 mb-1 font-bold">WhatsApp Business Account ID</label>
                  <input type="text" value={config.whatsappBusinessAccountId || ''} onChange={e => handleChange('whatsappBusinessAccountId', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="e.g. 11567890123" />
                </div>
                
                <div className="col-span-1 sm:col-span-2 border-t border-[#F4A62A]/10 mt-2 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">OTP Template ID</label>
                    <input type="text" value={config.whatsappOtpTemplateId || ''} onChange={e => handleChange('whatsappOtpTemplateId', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="user_registration_otp" />
                    <p className="text-[10px] text-white/40 mt-1">Used for mobile authentication.</p>
                  </div>
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Order Conf. Template ID</label>
                    <input type="text" value={config.whatsappOrderConfirmationTemplateId || ''} onChange={e => handleChange('whatsappOrderConfirmationTemplateId', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="order_confirmation" />
                    <p className="text-[10px] text-white/40 mt-1">Sent when purchase completes.</p>
                  </div>
                  <div>
                    <label className="block text-[#FFF8F0]/80 mb-1 font-bold">Shipping Update Template ID</label>
                    <input type="text" value={config.whatsappShippingUpdateTemplateId || ''} onChange={e => handleChange('whatsappShippingUpdateTemplateId', e.target.value)} className="w-full h-[48px] px-3.5 rounded-xl bg-[#1A0B0E] border border-[#F4A62A]/30 text-white focus:outline-none focus:border-[#F4A62A]" placeholder="order_shipping_update" />
                    <p className="text-[10px] text-white/40 mt-1">Sent when order is dispatched.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-6 border-t border-[#F4A62A]/20 pt-6">
            <button type="submit" className="flex items-center gap-2 bg-[#F4A62A] text-[#120508] px-8 py-3.5 rounded-xl font-bold hover:bg-[#F4A62A]/90 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_20px_rgba(244,166,42,0.3)]">
              <Save className="w-5 h-5" /> Save Integrations
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
