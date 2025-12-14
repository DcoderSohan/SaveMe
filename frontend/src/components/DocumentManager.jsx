import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import DocumentList from './DocumentList';
import DocumentViewModal from './DocumentViewModal';

const DocumentManager = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`Upload Progress: ${percentCompleted}%`);
        }
      });
      
      if (response.data) {
        fetchDocuments();
        e.target.value = ''; // Reset input
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to upload document';
      alert(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) {
      return;
    }

    try {
      await api.delete(`/documents/${id}`);
      fetchDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      alert(error.response?.data?.error || 'Failed to delete document');
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await api.get(
        `/documents/${document._id}/download`,
        { responseType: 'blob' }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.originalName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Failed to download document');
    }
  };

  const handleView = (document) => {
    setSelectedDocument(document);
  };

  const handleCloseModal = () => {
    setSelectedDocument(null);
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        Loading documents...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">My Documents</h2>
        <motion.label
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 py-2.5 rounded-lg font-semibold cursor-pointer transition-all duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base text-center"
        >
          {uploading ? 'Uploading...' : '📤 Upload Document'}
          <input
            type="file"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </motion.label>
      </div>

      <DocumentList
        documents={documents}
        onView={handleView}
        onDownload={handleDownload}
        onDelete={handleDelete}
      />

      <AnimatePresence>
        {selectedDocument && (
          <DocumentViewModal
            document={selectedDocument}
            onClose={handleCloseModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default DocumentManager;

