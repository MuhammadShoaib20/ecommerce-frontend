import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaUser, FaLock, FaSave, FaShieldAlt } from 'react-icons/fa';
import { updateUser } from '../redux/slices/authSlice';
import { getProfileAPI, updateProfileAPI, updatePasswordAPI } from '../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({ name: '', email: '' });
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => { fetchProfile(); }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getProfileAPI();
      if (data.success && data.user) {
        setProfileData({ name: data.user.name || '', email: data.user.email || '' });
        dispatch(updateUser(data.user));
      }
    } catch {
      toast.error('Failed to fetch profile');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await updateProfileAPI(profileData);
      if (data.success) { dispatch(updateUser(data.user)); toast.success('Profile updated!'); }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally { setLoading(false); }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (passwordData.newPassword.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setPasswordLoading(true);
    try {
      const { data } = await updatePasswordAPI({ currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword });
      if (data.success) { toast.success('Password updated!'); setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
    } finally { setPasswordLoading(false); }
  };

  const inputClass = "w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-500/25">
            {profileData.name?.charAt(0).toUpperCase() || <FaUser size={20} />}
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{user?.role || 'User'}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Profile Card */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center border border-blue-100">
                <FaUser size={13} />
              </div>
              <h2 className="font-bold text-gray-900">Personal Information</h2>
            </div>

            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input type="text" value={profileData.name} required placeholder="John Doe"
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input type="email" value={profileData.email} required placeholder="john@example.com"
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })} className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Account Role</label>
                <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200">
                  <FaShieldAlt className="text-blue-500" size={13} />
                  <span className="text-sm font-semibold text-gray-700 capitalize">{user?.role || 'User'}</span>
                </div>
              </div>
              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] shadow-lg shadow-blue-500/20 disabled:opacity-60 text-sm">
                <FaSave size={13} /> {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Password Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 bg-red-50 text-red-500 rounded-xl flex items-center justify-center border border-red-100">
                <FaLock size={13} />
              </div>
              <h2 className="font-bold text-gray-900">Change Password</h2>
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className={labelClass}>Current Password</label>
                <input type="password" value={passwordData.currentPassword} required autoComplete="current-password" className={inputClass}
                  placeholder="Enter current password"
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>New Password</label>
                <input type="password" value={passwordData.newPassword} required minLength={6} autoComplete="new-password" className={inputClass}
                  placeholder="Minimum 6 characters"
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
              </div>
              <div>
                <label className={labelClass}>Confirm New Password</label>
                <input type="password" value={passwordData.confirmPassword} required minLength={6} autoComplete="new-password" className={inputClass}
                  placeholder="Repeat new password"
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
              </div>
              <button type="submit" disabled={passwordLoading}
                className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded-xl transition-all active:scale-[.98] disabled:opacity-60 text-sm">
                <FaLock size={12} /> {passwordLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;