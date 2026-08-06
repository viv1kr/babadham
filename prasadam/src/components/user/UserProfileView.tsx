import React, { useState } from 'react';
import { useAdmin } from '../../context/AdminContext';
import { User, Shield, Key, History, Save, CheckCircle2, Eye, EyeOff, Lock, Monitor, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export const UserProfileView: React.FC = () => {
  const { adminProfile, saveAdminProfile, loginLogs, showToast } = useAdmin();

  // Local state for profile details
  const [name, setName] = useState(adminProfile?.name || 'Admin Sevak');
  const [designation, setDesignation] = useState(adminProfile?.designation || 'Super Administrator');
  const [photoUrl, setPhotoUrl] = useState(adminProfile?.photoUrl || '');

  // Local state for credentials
  const [adminId, setAdminId] = useState(adminProfile?.adminId || 'admin');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingSecurity, setIsSavingSecurity] = useState(false);

  // Handle Profile Details Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    saveAdminProfile({
      name,
      designation,
      photoUrl
    });
    setTimeout(() => {
      setIsSavingProfile(false);
      showToast('User profile updated successfully!', 'success');
    }, 400);
  };

  // Handle Security Credentials Save
  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminId.trim()) {
      showToast('Admin ID cannot be empty', 'warning');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      showToast('Passwords do not match!', 'warning');
      return;
    }

    setIsSavingSecurity(true);
    saveAdminProfile({
      adminId: adminId.trim(),
      ...(newPassword ? { passwordHash: newPassword } : {})
    });

    setTimeout(() => {
      setIsSavingSecurity(false);
      setNewPassword('');
      setConfirmPassword('');
      showToast('Security credentials updated!', 'success');
    }, 400);
  };

  // Image Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Image file size must be less than 8MB', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          if (file.type.startsWith('image/')) {
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              const MAX_WIDTH = 400;
              const MAX_HEIGHT = 400;
              let width = img.width;
              let height = img.height;

              if (width > height) {
                if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
                }
              } else {
                if (height > MAX_HEIGHT) {
                  width *= MAX_HEIGHT / height;
                  height = MAX_HEIGHT;
                }
              }

              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext('2d');
              ctx?.drawImage(img, 0, 0, width, height);
              
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
              setPhotoUrl(compressedDataUrl);

              fetch('/api/upload-image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  image: compressedDataUrl,
                  type: 'babadham_profile_photo'
                })
              }).then(res => res.json()).then(data => {
                if (data.success) {
                  const freshUrl = `${data.path}?t=${Date.now()}`;
                  setPhotoUrl(freshUrl);
                  saveAdminProfile({ photoUrl: freshUrl });
                }
              }).catch(err => {
                console.warn('Avatar upload fallback to data URL', err);
              });
            };
            img.onerror = () => {
              setPhotoUrl(result);
            };
            img.src = result;
          } else {
            setPhotoUrl(result);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A0B0E] p-6 rounded-2xl border border-[#F4A62A]/20 shadow-lg">
        <div>
          <h2 className="text-xl sm:text-2xl font-serif-temple font-bold text-[#F4A62A] flex items-center gap-3">
            <User className="w-7 h-7 text-[#F4A62A]" />
            Admin Profile & Security Center
          </h2>
          <p className="text-[#FFF8F0]/60 text-sm mt-1">
            Manage your personal profile, credentials, and track active portal login sessions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Personal Profile Details */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 border-b border-[#F4A62A]/20 pb-4 mb-6">
              <User className="w-5 h-5 text-[#F4A62A]" />
              <h3 className="font-serif-temple text-lg font-bold text-[#FFF8F0]">Profile Identity Settings</h3>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-5">
              
              {/* Profile Photo Avatar Preview & Upload */}
              <div className="flex items-center gap-5 bg-[#120508] p-4 rounded-xl border border-[#F4A62A]/10">
                <div className="relative w-20 h-20 rounded-full bg-[#7A1126] border-2 border-[#F4A62A] flex items-center justify-center text-[#F4A62A] overflow-hidden shrink-0 shadow-md">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10" />
                  )}
                </div>
                
                <div className="flex-1 space-y-2">
                  <label className="block text-xs font-bold text-[#F4A62A]">Upload Avatar Photo</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-xs text-[#FFF8F0]/70 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#F4A62A] file:text-[#2B1A16] hover:file:bg-[#F4A62A]/90 cursor-pointer"
                  />
                  <input
                    type="text"
                    placeholder="Or paste image URL here..."
                    value={photoUrl}
                    onChange={(e) => setPhotoUrl(e.target.value)}
                    className="w-full bg-[#1A0B0E] text-xs text-[#FFF8F0] px-3 py-1.5 rounded-lg border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">User Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acharya Rajesh Sharma"
                  className="w-full bg-[#120508] text-sm text-[#FFF8F0] px-4 py-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                  required
                />
              </div>

              {/* Designation */}
              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">Role / Designation</label>
                <input
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. Chief Temple Administrator"
                  className="w-full bg-[#120508] text-sm text-[#FFF8F0] px-4 py-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none"
                  required
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingProfile}
                  className="w-full bg-[#F4A62A] text-[#2B1A16] font-bold py-3 rounded-xl hover:bg-[#F4A62A]/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F4A62A]/20"
                >
                  {isSavingProfile ? (
                    <div className="w-5 h-5 border-2 border-[#2B1A16] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  Save Profile Identity
                </button>
              </div>

            </form>
          </div>
        </motion.div>

        {/* Right Column: Security Credentials */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 p-6 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-3 border-b border-[#F4A62A]/20 pb-4 mb-6">
              <Shield className="w-5 h-5 text-[#F4A62A]" />
              <h3 className="font-serif-temple text-lg font-bold text-[#FFF8F0]">Security & Login Passwords</h3>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-5">
              
              {/* Admin ID / Username */}
              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">Admin ID / Login Username</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-[#F4A62A] absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={adminId}
                    onChange={(e) => setAdminId(e.target.value)}
                    placeholder="admin"
                    className="w-full bg-[#120508] text-sm text-[#FFF8F0] pl-10 pr-4 py-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">New Password (Leave blank to keep current)</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#F4A62A] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#120508] text-sm text-[#FFF8F0] pl-10 pr-10 py-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-[#FFF8F0]/50 hover:text-[#F4A62A]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-[#FFF8F0]/80 mb-1.5">Confirm New Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#F4A62A] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#120508] text-sm text-[#FFF8F0] pl-10 pr-4 py-2.5 rounded-xl border border-[#F4A62A]/20 focus:border-[#F4A62A] focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSavingSecurity}
                  className="w-full bg-[#7A1126] text-[#F4A62A] font-bold py-3 rounded-xl hover:bg-[#F4A62A] hover:text-[#2B1A16] transition-all flex items-center justify-center gap-2 border border-[#F4A62A]/40"
                >
                  {isSavingSecurity ? (
                    <div className="w-5 h-5 border-2 border-[#F4A62A] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Shield className="w-4 h-4" />
                  )}
                  Update Admin Credentials
                </button>
              </div>

            </form>
          </div>
        </motion.div>

      </div>

      {/* Login History Logs Table */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#1A0B0E] rounded-2xl border border-[#F4A62A]/20 p-6"
      >
        <div className="flex items-center justify-between border-b border-[#F4A62A]/20 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-[#F4A62A]" />
            <div>
              <h3 className="font-serif-temple text-lg font-bold text-[#FFF8F0]">Portal Login Audit Logs</h3>
              <p className="text-xs text-[#FFF8F0]/60 mt-0.5">Track real-time security access history and active portal sessions.</p>
            </div>
          </div>
          <span className="text-xs bg-[#F4A62A]/10 text-[#F4A62A] px-3 py-1 rounded-full font-bold border border-[#F4A62A]/20">
            {loginLogs.length} Recorded Sessions
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#FFF8F0]/80">
            <thead className="bg-[#2B1217] text-[#F4A62A] font-bold uppercase tracking-wider">
              <tr>
                <th className="p-3 rounded-l-xl">Timestamp</th>
                <th className="p-3">User ID</th>
                <th className="p-3">Device / Browser</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Location</th>
                <th className="p-3 rounded-r-xl">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4A62A]/10">
              {loginLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FFF8F0]/5 transition-colors">
                  <td className="p-3 font-mono text-[#FFF8F0]/90">
                    {new Date(log.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'medium' })}
                  </td>
                  <td className="p-3 font-bold text-[#F4A62A]">{log.adminId}</td>
                  <td className="p-3 flex items-center gap-2">
                    <Monitor className="w-3.5 h-3.5 text-[#F4A62A]/70" />
                    <span>{log.device}</span>
                  </td>
                  <td className="p-3 font-mono">{log.ipAddress}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#F4A62A]/70" />
                      {log.location}
                    </span>
                  </td>
                  <td className="p-3">
                    {log.status === 'SUCCESS' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                        <CheckCircle2 className="w-3 h-3" />
                        SUCCESS
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/40 px-2.5 py-0.5 rounded-full border border-red-500/30">
                        FAILED
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

    </div>
  );
};
