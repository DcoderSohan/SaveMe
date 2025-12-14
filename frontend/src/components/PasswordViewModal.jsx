import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const PasswordViewModal = ({ password, onClose }) => {
  const { darkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);

  if (!password) return null;

  const getCategoryColor = (category) => {
    const colors = {
      social: 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
      email: 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
      banking: 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300',
      shopping: 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300',
      work: 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
      other: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
    };
    return colors[category] || colors.other;
  };

  const getCategoryIcon = (category) => {
    const icons = {
      social: '👥',
      email: '📧',
      banking: '🏦',
      shopping: '🛒',
      work: '💼',
      other: '🔐'
    };
    return icons[category] || icons.other;
  };

  const copyToClipboard = (text, label) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-2xl max-w-lg w-full mx-4 p-4 sm:p-6 transition-colors duration-300 max-h-[90vh] overflow-y-auto no-scrollbar border border-slate-200 dark:border-slate-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <span className="text-2xl sm:text-4xl">{getCategoryIcon(password.category || 'other')}</span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 truncate">
                  {password.title}
                </h2>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${getCategoryColor(password.category || 'other')}`}>
                  {password.category || 'other'}
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ×
            </motion.button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {password.username && (
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Username/Email</p>
                    <p className="text-gray-800 dark:text-gray-100 font-medium break-all">
                      {password.username}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(password.username, 'Username')}
                    className="ml-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    📋 Copy
                  </motion.button>
                </div>
              </div>
            )}

            <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
              <div className="flex items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Password</p>
                  <p className="text-gray-800 dark:text-gray-100 font-mono text-lg break-all">
                    {showPassword ? password.password : '•'.repeat(password.password.length)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPassword(!showPassword)}
                    className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    {showPassword ? '🙈 Hide' : '👁️ Show'}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(password.password, 'Password')}
                    className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    📋 Copy
                  </motion.button>
                </div>
              </div>
            </div>

            {password.website && (
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 font-semibold">Website</p>
                    <a
                      href={password.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 hover:underline break-all block font-medium"
                    >
                      {password.website}
                    </a>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => copyToClipboard(password.website, 'Website')}
                    className="ml-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg whitespace-nowrap"
                  >
                    📋 Copy
                  </motion.button>
                </div>
              </div>
            )}

            {password.notes && (
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-semibold">Notes</p>
                <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap break-words">
                  {password.notes}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-slate-700">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                <p>Created: {new Date(password.createdAt).toLocaleDateString()}</p>
                {password.updatedAt && password.updatedAt !== password.createdAt && (
                  <p>Updated: {new Date(password.updatedAt).toLocaleDateString()}</p>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PasswordViewModal;

