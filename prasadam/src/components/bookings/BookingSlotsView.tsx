import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { Calendar, Save, AlertCircle, Clock, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export const BookingSlotsView: React.FC = () => {
  const { showToast } = useAdmin();
  
  const [timeLimit, setTimeLimit] = useState('23:59');
  const [totalSlotLimit, setTotalSlotLimit] = useState('500');
  const [isSaving, setIsSaving] = useState(false);
  const [saveProgress, setSaveProgress] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('babadham_booking_slots_config');
      if (stored) {
        const config = JSON.parse(stored);
        if (config.timeLimit) setTimeLimit(config.timeLimit);
        if (config.totalSlotLimit) setTotalSlotLimit(config.totalSlotLimit);
      }
    } catch (e) {
      console.error('Error loading booking slots config', e);
    }
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    setSaveProgress(0);
    
    try {
      localStorage.setItem('babadham_booking_slots_config', JSON.stringify({
        timeLimit,
        totalSlotLimit: parseInt(totalSlotLimit) || 0
      }));
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
    <div className="w-full space-y-6 pb-24 relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0B0E] p-6 rounded-2xl border border-[#F4A62A]/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-temple font-bold text-[#F4A62A] flex items-center gap-3">
            <Calendar className="w-6 h-6" />
            Booking Slots Management
          </h2>
          <p className="text-[#FFF8F0]/60 text-sm mt-1">
            Configure daily booking time limits and maximum slot availability.
          </p>
        </div>
      </div>

      <div className="bg-[#FFF8F0]/5 border border-[#F4A62A]/20 rounded-2xl p-4 sm:p-6 mb-6">
        <div className="flex items-start gap-3 p-4 bg-[#2B1A16]/40 rounded-xl border border-[#F4A62A]/10">
          <AlertCircle className="w-5 h-5 text-[#F4A62A] shrink-0 mt-0.5" />
          <div className="text-sm text-[#FFF8F0]/80">
            <p className="font-bold text-[#F4A62A] mb-1">Configuration Note</p>
            <p>These settings control when users are allowed to make new bookings and limits how many bookings can be accepted per day.</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Time Limit Setting */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 overflow-hidden flex flex-col"
        >
          <div className="bg-[#2B1217] p-4 border-b border-[#F4A62A]/20">
            <h3 className="font-bold text-[#FFF8F0] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F4A62A]" /> Daily Time Limit
            </h3>
            <p className="text-xs text-[#FFF8F0]/60 mt-1">
              Set the deadline time for daily bookings (24-hour format).
            </p>
          </div>
          <div className="p-6 bg-[#120508] flex-1">
            <label className="block text-sm font-medium text-[#FFF8F0]/80 mb-2">
              Cut-off Time
            </label>
            <input
              type="time"
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full bg-[#000000]/50 text-[#FFF8F0] p-3 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none transition-all"
            />
          </div>
        </motion.div>

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
              Set the maximum number of bookings allowed per day.
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

      </div>

      {/* Save Button floating at bottom */}
      <div className="fixed bottom-0 left-0 right-0 sm:left-20 lg:left-72 bg-[#120508]/80 backdrop-blur-xl border-t border-[#F4A62A]/20 p-4 z-40 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center justify-end">
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
