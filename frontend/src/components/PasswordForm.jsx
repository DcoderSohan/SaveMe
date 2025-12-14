import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';
import api from '../utils/axios';

const PasswordForm = ({ password, onClose, onSubmit }) => {
  const { darkMode } = useTheme();
  const [formData, setFormData] = useState({
    title: '',
    username: '',
    password: '',
    website: '',
    category: 'other',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (password) {
      setFormData({
        title: password.title || '',
        username: password.username || '',
        password: password.password || '',
        website: password.website || '',
        category: password.category || 'other',
        notes: password.notes || ''
      });
    }
  }, [password]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (password) {
        await api.put(`/passwords/${password._id}`, formData);
      } else {
        await api.post('/passwords', formData);
      }
      onSubmit();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to save password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-xl max-w-md w-full mx-4 p-4 sm:p-6 transition-colors duration-300 max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-700"
      >
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">
          {password ? 'Edit Password' : 'Add Password'}
        </h3>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Gmail Account"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="social">Social Account</option>
              <option value="email">Email Account</option>
              <option value="banking">Banking</option>
              <option value="shopping">Shopping</option>
              <option value="work">Work</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Username/Email
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter username or email"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Website
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-2.5 px-4 rounded-lg font-semibold disabled:opacity-50 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              {loading ? 'Saving...' : password ? '✏️ Update' : '💾 Save'}
            </motion.button>
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 text-white py-2.5 px-4 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ❌ Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default PasswordForm;

