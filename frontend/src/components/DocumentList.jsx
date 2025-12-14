import { motion } from 'framer-motion';

const DocumentList = ({ documents, onView, onDownload, onDelete }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word')) return '📝';
    if (fileType.includes('excel') || fileType.includes('spreadsheet')) return '📊';
    return '📎';
  };

  if (documents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 text-gray-500 dark:text-gray-400"
      >
        <p className="text-lg">No documents uploaded yet.</p>
        <p className="text-sm mt-2">Click "Upload Document" to get started!</p>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
      {documents.map((document, index) => (
        <motion.div
          key={document._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
          className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-black border border-slate-200 dark:border-slate-700 rounded-xl p-3 sm:p-4 hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-start gap-3 mb-3">
            <span className="text-3xl">{getFileIcon(document.fileType)}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate">
                {document.originalName}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {formatFileSize(document.fileSize)}
              </p>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mt-3">
            {document.fileType.startsWith('image/') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onView(document)}
                className="flex-1 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
              >
                👁️ View
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDownload(document)}
              className="flex-1 bg-gradient-to-r from-green-600 via-green-700 to-green-800 hover:from-green-700 hover:via-green-800 hover:to-green-900 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ⬇️ Download
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onDelete(document._id)}
              className="flex-1 bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:from-red-700 hover:via-red-800 hover:to-red-900 text-white px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              🗑️ Delete
            </motion.button>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Uploaded: {new Date(document.createdAt).toLocaleDateString()}
          </p>
        </motion.div>
      ))}
    </div>
  );
};

export default DocumentList;

