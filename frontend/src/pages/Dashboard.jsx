import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { BASE_URL } from '../utils/axios';
import PasswordManager from '../components/PasswordManager';
import DocumentManager from '../components/DocumentManager';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('passwords');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-100 to-slate-200 dark:from-slate-900 dark:via-blue-900 dark:to-black transition-colors duration-300">
      <nav className="bg-gradient-to-r from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black shadow-md transition-colors duration-300 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="flex justify-between h-14 sm:h-16 items-center">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
              SaveMe
            </h1>
            <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
              <div className="hidden sm:flex items-center gap-2 md:gap-3">
                {user?.avatar ? (
                  <img
                    src={user.avatar.startsWith('http') ? user.avatar : `${BASE_URL}${user.avatar.startsWith('/') ? user.avatar : '/' + user.avatar}`}
                    alt="Avatar"
                    className="w-8 h-8 md:w-10 md:h-10 rounded-full object-cover border-2 border-blue-500"
                    onError={(e) => {
                      console.error('Avatar image failed to load:', user.avatar);
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-sm md:text-base">
                    {user?.displayName?.charAt(0) || user?.username?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-xs md:text-sm text-gray-700 dark:text-gray-300 hidden md:inline">
                  {user?.displayName || user?.username}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/profile')}
                className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">👤 Profile</span>
                <span className="sm:hidden">👤</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white p-1.5 sm:p-2 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg text-sm sm:text-base"
              >
                {darkMode ? '☀️' : '🌙'}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logout}
                className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-3 sm:px-4 md:px-5 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 shadow-md hover:shadow-lg"
              >
                <span className="hidden sm:inline">🚪 Logout</span>
                <span className="sm:hidden">🚪</span>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-4 sm:py-6 md:py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-xl transition-colors duration-300 border border-slate-200 dark:border-slate-700"
        >
          <div className="border-b border-gray-200 dark:border-slate-700">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('passwords')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'passwords'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Passwords
              </button>
              <button
                onClick={() => setActiveTab('documents')}
                className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 sm:py-3 text-sm sm:text-base font-medium transition-colors ${
                  activeTab === 'documents'
                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                Documents
              </button>
            </nav>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            <AnimatePresence mode="wait">
              {activeTab === 'passwords' && (
                <motion.div
                  key="passwords"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <PasswordManager />
                </motion.div>
              )}
              {activeTab === 'documents' && (
                <motion.div
                  key="documents"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <DocumentManager />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;

