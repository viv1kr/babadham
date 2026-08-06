import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Calendar, Save, AlertCircle, Clock, Users, IndianRupee, Tag } from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingSlotsView: React.FC = () => {
  const { showToast, db } = useAdmin();
  
  const [totalSlotLimit, setTotalSlotLimit] = useState('500');
  const [startDate, setStartDate] = useState('2026-08-05');
  const [endDate, setEndDate] = useState('2026-08-19');
  const [slotPeriodText, setSlotPeriodText] = useState('5 to 19 August');
  const [confirmBookingAmount, setConfirmBookingAmount] = useState('251');
  const [confirmBookingDiscount, setConfirmBookingDiscount] = useState('12');
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  const formatDatesToPeriodText = (start: string, end: string) => {
    if (!start || !end) return;
    try {
      const s = new Date(start);
      const e = new Date(end);
      if (!isNaN(s.getTime()) && !isNaN(e.getTime())) {
        const sDay = s.getDate();
        const sMonth = s.toLocaleString('en-US', { month: 'long' });
        const eDay = e.getDate();
        const eMonth = e.toLocaleString('en-US', { month: 'long' });

        let formatted = '';
        if (sMonth === eMonth) {
          formatted = `${sDay} to ${eDay} ${sMonth}`;
        } else {
          formatted = `${sDay} ${sMonth} to ${eDay} ${eMonth}`;
        }
        setSlotPeriodText(formatted);
      }
    } catch (err) {}
  };

  useEffect(() => {
    try {
      let config = null;
      const brandSettings = db?.getBrandSettings();
      if (brandSettings && brandSettings.bookingSlotsConfig) {
        config = brandSettings.bookingSlotsConfig;
      }
      if (!config) {
        const stored = localStorage.getItem('babadham_booking_slots_config');
        if (stored) config = JSON.parse(stored);
      }
      
      if (config) {
        if (config.totalSlotLimit !== undefined) setTotalSlotLimit(String(config.totalSlotLimit));
        if (config.startDate) setStartDate(config.startDate);
        if (config.endDate) setEndDate(config.endDate);
        if (config.slotPeriodText !== undefined) setSlotPeriodText(config.slotPeriodText);
        if (config.confirmBookingAmount !== undefined) setConfirmBookingAmount(String(config.confirmBookingAmount));
        if (config.confirmBookingDiscount !== undefined) setConfirmBookingDiscount(String(config.confirmBookingDiscount));
      }
    } catch (e) {
      console.error('Error loading booking slots config', e);
    }
  }, [db]);

  const handleSave = () => {
    setIsSaving(true);
    setSaveProgress(0);
    
    try {
      const configObj = {
        totalSlotLimit: parseInt(totalSlotLimit) || 500,
        startDate,
        endDate,
        slotPeriodText,
        confirmBookingAmount,
        confirmBookingDiscount
      };
      
      const updatedSettings = db?.updateBrandSettings({ bookingSlotsConfig: configObj });
      
      localStorage.setItem('babadham_booking_slots_config', JSON.stringify(configObj));
      window.dispatchEvent(new Event('bbp_booking_config_updated'));
      window.dispatchEvent(new Event('storage'));

      // Broadcast channels for live cross-tab/cross-origin sync
      try {
        const channel = new BroadcastChannel('bbp_brand_sync');
        channel.postMessage({ type: 'BRAND_SETTINGS_UPDATED', settings: updatedSettings });
        channel.close();
      } catch (e) {}

      try {
        const dbChannel = new BroadcastChannel('bbp_db_sync');
        dbChannel.postMessage({ type: 'DB_UPDATED' });
        dbChannel.close();
      } catch (e) {}

      const frame = document.getElementById('babadham-sync-frame') as HTMLIFrameElement;
      if (frame && frame.contentWindow) {
        frame.contentWindow.postMessage({
          type: 'SYNC_BRANDING_CROSS_ORIGIN',
          settings: JSON.stringify(updatedSettings)
        }, '*');
      }
    } catch (e) {
      showToast('Failed to save settings.', 'error');
      setIsSaving(false);
      return;
    }
    
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setSaveProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setIsSaving(false);
          setSaveProgress(0);
          showToast('Booking slots updated successfully!', 'success');
        }, 300);
      }
    }, 40);
  };

  return (
    <div className="w-full h-full flex flex-col space-y-6 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0B0E] p-6 rounded-2xl border border-[#F4A62A]/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-temple font-bold text-[#F4A62A] flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Booking Slots Management
          </h2>
          <p className="text-[#FFF8F0]/60 text-sm mt-1">
            Configure total slot limits, booking amounts, discounts, and period labels.
          </p>
        </div>
      </div>

      <div className="bg-[#FFF8F0]/5 border border-[#F4A62A]/20 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3 p-4 bg-[#2B1A16]/40 rounded-xl border border-[#F4A62A]/10">
          <AlertCircle className="w-5 h-5 text-[#F4A62A] shrink-0 mt-0.5" />
          <div className="text-sm text-[#FFF8F0]/80">
            <p className="font-bold text-[#F4A62A] mb-1">Configuration Note</p>
            <p>These settings control total booking limits, discounts, and custom week/period labels for your booking slot banner.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Slot Limit Setting */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0] flex items-center gap-2">
              <Users className="w-4 h-4 text-[#F4A62A]" /> Total Slot Limit
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Set the maximum number of bookings allowed.
            </p>
          </div>
          <div className="p-6 bg-[#120508] flex-1">
            <label className="block text-sm font-medium text-[#FFF8F0]/80 mb-2">
              Maximum Slots
            </label>
            <input
              type="number"
              min="1"
              value={totalSlotLimit}
              onChange={(e) => setTotalSlotLimit(e.target.value)}
              placeholder="e.g. 500"
              className="w-full bg-[#000000]/50 text-[#FFF8F0] p-3 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Slot Time Period / Date Range Picker */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0] flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#F4A62A]" /> Slot Calendar & Date Range
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Select start and end dates from the calendar to generate active slot period.
            </p>
          </div>
          <div className="p-6 bg-[#120508] flex-1 flex flex-col justify-between">
            <div>
              {/* Calendar Inputs */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-xs font-medium text-[#FFF8F0]/80 mb-1">
                    Start Date 📅
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      formatDatesToPeriodText(e.target.value, endDate);
                    }}
                    className="w-full bg-[#000000]/60 text-[#FFF8F0] p-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none text-xs transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#FFF8F0]/80 mb-1">
                    End Date 📅
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      formatDatesToPeriodText(startDate, e.target.value);
                    }}
                    className="w-full bg-[#000000]/60 text-[#FFF8F0] p-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none text-xs transition-all"
                  />
                </div>
              </div>

              <label className="block text-xs font-medium text-[#FFF8F0]/80 mb-1">
                Generated / Custom Display Text
              </label>
              <input
                type="text"
                value={slotPeriodText}
                onChange={(e) => setSlotPeriodText(e.target.value)}
                placeholder="e.g. 5 to 19 August"
                className="w-full bg-[#000000]/50 text-[#FFF8F0] p-3 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all font-semibold text-sm"
              />
            </div>

            {/* Quick Presets */}
            <div className="mt-4 pt-3 border-t border-white/5">
              <span className="text-[11px] text-[#FFF8F0]/60 font-medium block mb-2">Quick Date Presets:</span>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('2026-08-05');
                    setEndDate('2026-08-19');
                    setSlotPeriodText('5 to 19 August');
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#2B1217] text-[#F4A62A] border border-[#F4A62A]/30 hover:bg-[#F4A62A] hover:text-[#120508] transition-all"
                >
                  5 to 19 August
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('2026-08-01');
                    setEndDate('2026-08-07');
                    setSlotPeriodText('1st Week (1-7 Aug)');
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#2B1217] text-[#F4A62A] border border-[#F4A62A]/30 hover:bg-[#F4A62A] hover:text-[#120508] transition-all"
                >
                  1st Week (1-7 Aug)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('2026-08-08');
                    setEndDate('2026-08-15');
                    setSlotPeriodText('2nd Week (8-15 Aug)');
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#2B1217] text-[#F4A62A] border border-[#F4A62A]/30 hover:bg-[#F4A62A] hover:text-[#120508] transition-all"
                >
                  2nd Week (8-15 Aug)
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Confirm Booking Amount Setting */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0] flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#F4A62A]" /> Booking Amount
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Set the required amount for confirming a booking slot.
            </p>
          </div>
          <div className="p-6 bg-[#120508] flex-1">
            <label className="block text-sm font-medium text-[#FFF8F0]/80 mb-2">
              Amount (₹)
            </label>
            <input
              type="number"
              min="0"
              value={confirmBookingAmount}
              onChange={(e) => setConfirmBookingAmount(e.target.value)}
              placeholder="e.g. 251"
              className="w-full bg-[#000000]/50 text-[#FFF8F0] p-3 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Confirm Booking Discount Setting */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0] flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#F4A62A]" /> Booking Discount
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Set any discount percentage applied during confirm booking.
            </p>
          </div>
          <div className="p-6 bg-[#120508] flex-1">
            <label className="block text-sm font-medium text-[#FFF8F0]/80 mb-2">
              Discount Percentage (%)
            </label>
            <input
              type="number"
              min="0"
              max="100"
              value={confirmBookingDiscount}
              onChange={(e) => setConfirmBookingDiscount(e.target.value)}
              placeholder="e.g. 12"
              className="w-full bg-[#000000]/50 text-[#FFF8F0] p-3 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all"
            />
          </div>
        </motion.div>

      </div>

      {/* Live Slot Banner Preview Block */}
      <div className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/30 p-6 mt-6">
        <h4 className="text-xs font-bold text-[#F4A62A] uppercase tracking-wider mb-3">
          Live Slot Banner Preview (Customer View - Live Dynamic Bookings)
        </h4>
        <div className="w-full bg-gradient-to-r from-[#4A0812] via-[#6B0D1B] to-[#3B060E] rounded-xl p-3.5 border border-red-900/60 shadow-lg select-none">
          <div className="flex items-center justify-between gap-2 mb-2 px-1">
            <span className="text-xs sm:text-sm font-medium text-white/90">
              Booked Slots:
            </span>
            <span className="text-xs sm:text-sm font-bold text-white tracking-wide text-center px-1">
              {slotPeriodText || '5 August to 19 August'}
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#F4A62A]">
              Live Dynamic / {totalSlotLimit || 500}
            </span>
          </div>
          <div className="w-full bg-black/50 h-2.5 rounded-full overflow-hidden p-0.5 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-orange-400 to-amber-300 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(244,166,42,0.8)]"
              style={{ width: '45%' }}
            />
          </div>
        </div>
      </div>

      {/* Save Button floating at bottom */}
      <div className="sticky bottom-0 mt-8 bg-[#120508]/90 backdrop-blur-xl border-t border-[#F4A62A]/20 p-4 z-40 -mx-4 sm:-mx-0 rounded-b-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-end">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#F4A62A] to-[#D98C1F] text-[#120508] font-bold hover:shadow-[0_0_20px_rgba(244,166,42,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2 relative overflow-hidden"
          >
            {isSaving ? (
              <>
                <span className="relative z-10 flex items-center gap-2">
                  Saving...
                </span>
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/30 z-0 transition-all duration-75"
                  style={{ width: `${saveProgress}%` }}
                />
              </>
            ) : (
              <>
                <Save className="w-4 h-4" /> Save Changes
              </>
            )}
          </button>
        </div>
      </div>
      
    </div>
  );
};
