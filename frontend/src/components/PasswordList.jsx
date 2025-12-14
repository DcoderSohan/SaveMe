import { motion } from 'framer-motion';

const PasswordList = ({ passwords, onEdit, onDelete, onView }) => {
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

  if (passwords.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <p className="text-lg">No passwords saved yet.</p>
        <p className="text-sm mt-2">Click "Add Password" to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
      {passwords.map((password, index) => (
        <motion.div
          key={password._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -2 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-4 sm:p-5 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-2xl">{getCategoryIcon(password.category || 'other')}</span>
              <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 truncate">{password.title}</h3>
            </div>
          </div>

          <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${getCategoryColor(password.category || 'other')}`}>
            {password.category || 'other'}
          </div>

          {password.username && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
              <span className="font-semibold">Username:</span> {password.username}
            </p>
          )}

          {password.website && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 truncate">
              <span className="font-semibold">Website:</span>{' '}
              <a
                href={password.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {password.website}
              </a>
            </p>
          )}

          {password.notes && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
              <span className="font-semibold">Notes:</span> {password.notes}
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onView(password)}
              className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              👁️ View
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onEdit(password)}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-800 hover:from-indigo-700 hover:via-indigo-800 hover:to-indigo-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              ✏️ Edit
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(password._id)}
              className="flex-1 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🗑️ Delete
            </motion.button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 text-center">
            Created: {new Date(password.createdAt).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default PasswordList;

