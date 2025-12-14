import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import api, { BASE_URL } from '../utils/axios';

const ProfileSettings = () => {
  const { user, updateUser, refreshUser } = useAuth();
  const { darkMode, toggleDarkMode, theme } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    displayName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        email: user.email || ''
      });
      if (user.avatar) {
        const avatarUrl = user.avatar.startsWith('http') 
          ? user.avatar 
          : `${BASE_URL}${user.avatar.startsWith('/') ? user.avatar : '/' + user.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }
    }
  }, [user]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) {
      setMessage({ type: 'error', text: 'Please select an image file first' });
      return;
    }

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(avatarFile.type)) {
      setMessage({ type: 'error', text: 'Invalid file type. Please select an image file (JPEG, PNG, GIF, or WebP)' });
      return;
    }

    // Validate file size (5MB)
    if (avatarFile.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size too large. Maximum size is 5MB' });
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });

      // Refresh user data to get updated avatar URL
      await refreshUser();
      
      // Get updated user data and update preview
      const updatedUserResponse = await api.get('/user/profile');
      if (updatedUserResponse.data?.avatar) {
        const avatarUrl = updatedUserResponse.data.avatar.startsWith('http') 
          ? updatedUserResponse.data.avatar 
          : `${BASE_URL}${updatedUserResponse.data.avatar.startsWith('/') ? updatedUserResponse.data.avatar : '/' + updatedUserResponse.data.avatar}`;
        setAvatarPreview(avatarUrl);
        updateUser(updatedUserResponse.data);
      }
      
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
      setAvatarFile(null);
    } catch (error) {
      console.error('Avatar upload error:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload avatar';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (!window.confirm('Are you sure you want to delete your avatar?')) return;

    setLoading(true);
    try {
      await api.delete('/user/avatar');
      await refreshUser();
      setAvatarPreview(null);
      setMessage({ type: 'success', text: 'Avatar deleted successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to delete avatar' });
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await api.put('/user/profile', formData);
      updateUser(response.data);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      await api.put('/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-blue-900 dark:to-black transition-colors duration-300">
      <nav className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black shadow-md transition-colors duration-300 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
            >
              SaveMe
            </button>
            <div className="flex items-center gap-2 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.button>
              <span className="hidden sm:inline text-xs md:text-sm text-gray-700 dark:text-gray-300">Welcome, {user?.displayName || user?.username}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-xl p-4 sm:p-6 transition-colors duration-300 border border-slate-200 dark:border-slate-700"
        >
          <div className="border-b border-gray-200 dark:border-slate-700 mb-4 sm:mb-6 overflow-x-auto">
            <nav className="flex min-w-max sm:min-w-0">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap rounded-t-lg ${
                  activeTab === 'profile'
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                👤 Profile
              </button>
              <button
                onClick={() => setActiveTab('avatar')}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap rounded-t-lg ${
                  activeTab === 'avatar'
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🖼️ Avatar
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap rounded-t-lg ${
                  activeTab === 'password'
                    ? 'bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                🔒 Password
              </button>
            </nav>
          </div>

          {message.text && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`mb-4 p-4 rounded-lg ${
                message.type === 'success'
                  ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                  : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'
              }`}
            >
              {message.text}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handleProfileUpdate}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter display name"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Updating...' : '💾 Update Profile'}
              </motion.button>
            </motion.form>
          )}

          {activeTab === 'avatar' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-slate-700 mb-4 border-4 border-blue-500 shadow-lg">
                  {avatarPreview ? (
                    <img 
                      src={avatarPreview} 
                      alt="Avatar Preview" 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Avatar image failed to load:', avatarPreview);
                        e.target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-400">
                      {user?.displayName?.charAt(0)?.toUpperCase() || user?.username?.charAt(0)?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="mb-4"
                />

                <div className="flex gap-3">
                  {avatarFile && (
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                      onClick={handleAvatarUpload}
                      disabled={loading}
                      className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      {loading ? 'Uploading...' : '📤 Upload Avatar'}
                    </motion.button>
                  )}
                  {avatarPreview && (
                    <motion.button
                      whileHover={{ scale: loading ? 1 : 1.05 }}
                      whileTap={{ scale: loading ? 1 : 0.95 }}
                      onClick={handleDeleteAvatar}
                      disabled={loading}
                      className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
                    >
                      🗑️ Delete Avatar
                    </motion.button>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'password' && (
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onSubmit={handlePasswordUpdate}
              className="space-y-6"
            >
              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  required
                  minLength={6}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.02 }}
                whileTap={{ scale: loading ? 1 : 0.98 }}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {loading ? 'Changing...' : '🔐 Change Password'}
              </motion.button>
            </motion.form>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default ProfileSettings;

