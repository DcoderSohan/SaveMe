import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';

const DocumentViewModal = ({ document, onClose }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchImage = async () => {
    try {
      // If document.filePath is already a URL (Cloudinary), use it directly
      if (document.filePath && document.filePath.startsWith('http')) {
        setImageUrl(document.filePath);
        setLoading(false);
        return;
      }
      
      // Fallback to download endpoint for local files
      const response = await api.get(
        `/documents/${document._id}/download`,
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(response.data);
      setImageUrl(url);
      setLoading(false);
    } catch (error) {
      console.error('Error loading image:', error);
      setError('Failed to load image');
      setLoading(false);
    }
  };

    if (document.fileType.startsWith('image/')) {
      fetchImage();
    } else {
      setError('This document type cannot be previewed');
      setLoading(false);
    }
  }, [document]);

  useEffect(() => {
    return () => {
      if (imageUrl) {
        window.URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-75 dark:bg-opacity-85 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto no-scrollbar transition-colors duration-300 border border-slate-200 dark:border-slate-700"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-gradient-to-r from-slate-50 to-white dark:from-slate-800 dark:via-slate-900 dark:to-black border-b border-slate-200 dark:border-slate-700 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center transition-colors">
            <h3 className="text-sm sm:text-lg md:text-xl font-bold text-gray-800 dark:text-gray-100 truncate flex-1 mr-2">{document.originalName}</h3>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="bg-gradient-to-r from-slate-600 via-slate-700 to-slate-800 hover:from-slate-700 hover:via-slate-800 hover:to-slate-900 text-white w-8 h-8 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg"
            >
              ×
            </motion.button>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500 dark:text-gray-400">Loading image...</div>
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded"
              >
                {error}
              </motion.div>
            )}

            {imageUrl && !loading && !error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center"
              >
                <img
                  src={imageUrl}
                  alt={document.originalName}
                  className="max-w-full h-auto rounded-lg shadow-md"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentViewModal;

