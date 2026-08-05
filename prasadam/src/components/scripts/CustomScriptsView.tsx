import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Code, Save, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const CustomScriptsView: React.FC = () => {
  const { brandSettings, saveBrandSettings, showToast } = useAdmin();
  const [headerScripts, setHeaderScripts] = useState(brandSettings?.headerScripts || '');
  const [bodyScripts, setBodyScripts] = useState(brandSettings?.bodyScripts || '');
  const [footerScripts, setFooterScripts] = useState(brandSettings?.footerScripts || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  useEffect(() => {
    setHeaderScripts(brandSettings?.headerScripts || '');
    setBodyScripts(brandSettings?.bodyScripts || '');
    setFooterScripts(brandSettings?.footerScripts || '');
  }, [brandSettings]);

  const handleSave = () => {
    setIsSaving(true);
    setSaveProgress(0);
    
    if (
      headerScripts.includes('<script') === false && headerScripts.trim() !== '' &&
      headerScripts.includes('<style') === false && headerScripts.includes('<meta') === false && headerScripts.includes('<link') === false
    ) {
      showToast('Warning: Header scripts usually contain <script> or <meta> tags.', 'warning');
    }

    saveBrandSettings({
      headerScripts: headerScripts.trim(),
      bodyScripts: bodyScripts.trim(),
      footerScripts: footerScripts.trim()
    });
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 5;
      setSaveProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSaving(false);
          setSaveProgress(0);
          showToast('Custom scripts saved successfully!', 'success');
        }, 300);
      }
    }, 40);
  };

  return (
    <div className="w-full space-y-6 pb-24 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0B0E] p-6 rounded-2xl border border-[#F4A62A]/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-temple font-bold text-[#F4A62A] flex items-center gap-3">
            <Code className="w-6 h-6" />
            Custom Scripts & Tags
          </h2>
          <p className="text-[#FFF8F0]/60 text-sm mt-1">
            Manage your Google Analytics, Facebook Pixel, and other third-party integration scripts.
          </p>
        </div>
      </div>

      <div className="bg-[#FFF8F0]/5 border border-[#F4A62A]/20 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3 p-4 bg-[#2B1A16]/40 rounded-xl border border-[#F4A62A]/10">
          <AlertCircle className="w-5 h-5 text-[#F4A62A] shrink-0 mt-0.5" />
          <div className="text-sm text-[#FFF8F0]/80">
            <p className="font-bold text-[#F4A62A] mb-1">Important Note</p>
            <p>These scripts are directly injected into the public storefront. Please ensure you only paste code from trusted sources (like Google or Meta). Malformed tags might break your website's layout or functionality.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        
        {/* Header Scripts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0]">Header Scripts</h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Code injected right before the closing &lt;/head&gt; tag. Ideal for Google Analytics (gtag.js), Meta Pixel base code, and CSS links.
            </p>
          </div>
          <div className="p-4 bg-[#120508]">
            <textarea
              value={headerScripts}
              onChange={(e) => setHeaderScripts(e.target.value)}
              placeholder="<!-- Paste your header scripts here... -->"
              className="w-full h-48 bg-[#000000]/50 text-[#FFF8F0] font-mono text-sm p-4 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </motion.div>

        {/* Body Scripts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0]">Body Scripts (Start)</h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Code injected immediately after the opening &lt;body&gt; tag. Required by Google Tag Manager (noscript fallback).
            </p>
          </div>
          <div className="p-4 bg-[#120508]">
            <textarea
              value={bodyScripts}
              onChange={(e) => setBodyScripts(e.target.value)}
              placeholder="<!-- Paste your body scripts here... -->"
              className="w-full h-32 bg-[#000000]/50 text-[#FFF8F0] font-mono text-sm p-4 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </motion.div>

        {/* Footer Scripts */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0]">Footer Scripts</h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Code injected right before the closing &lt;/body&gt; tag. Good for chat widgets, performance-heavy scripts, or custom JS tracking.
            </p>
          </div>
          <div className="p-4 bg-[#120508]">
            <textarea
              value={footerScripts}
              onChange={(e) => setFooterScripts(e.target.value)}
              placeholder="<!-- Paste your footer scripts here... -->"
              className="w-full h-48 bg-[#000000]/50 text-[#FFF8F0] font-mono text-sm p-4 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all resize-y"
              spellCheck={false}
            />
          </div>
        </motion.div>

      </div>

      {/* Sticky Save Button */}
      <div className="fixed bottom-20 md:bottom-24 right-6 z-50">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="relative overflow-hidden bg-[#F4A62A] text-[#2B1A16] w-14 h-14 rounded-full flex items-center justify-center hover:scale-110 active:scale-95 shadow-xl shadow-[#F4A62A]/40 transition-all border border-[#F4A62A]/50"
        >
          {isSaving ? (
            <>
              {/* Progress Background Fill (Bottom to top) */}
              <div 
                className="absolute left-0 bottom-0 right-0 bg-[#D98C1F] transition-all duration-75 ease-linear" 
                style={{ height: `${saveProgress}%` }}
              />
              <span className="relative z-10 flex items-center justify-center">
                <span className="text-[11px] font-mono font-extrabold">{saveProgress}%</span>
              </span>
            </>
          ) : (
            <span className="relative z-10 flex items-center justify-center">
              <Save className="w-6 h-6" strokeWidth={2.5} />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
