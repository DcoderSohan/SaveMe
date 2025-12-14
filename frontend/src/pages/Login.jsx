import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-800 to-slate-900 dark:from-slate-900 dark:via-blue-900 dark:to-black px-4 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg bg-white dark:bg-slate-800 bg-opacity-20 dark:bg-opacity-50 hover:bg-opacity-30 transition-all"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-2xl p-6 sm:p-8 w-full max-w-md transition-colors duration-300 border border-slate-200 dark:border-slate-700"
      >
        <h2 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Login
        </h2>
        
        {error && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-4"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Enter your password"
            />
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white py-2.5 px-4 rounded-lg font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {loading ? 'Logging in...' : '🔐 Login'}
          </motion.button>
        </form>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
            Register here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

