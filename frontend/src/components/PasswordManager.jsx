import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'framer-motion';
import api from '../utils/axios';
import PasswordForm from './PasswordForm';
import PasswordList from './PasswordList';
import PasswordViewModal from './PasswordViewModal';

const PasswordManager = () => {
  const [passwords, setPasswords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState(null);
  const [viewingPassword, setViewingPassword] = useState(null);

  useEffect(() => {
    fetchPasswords();
  }, []);

  const fetchPasswords = async () => {
    try {
      const response = await api.get('/passwords');
      setPasswords(response.data);
    } catch (error) {
      console.error('Error fetching passwords:', error);
      if (error.response?.status === 401) {
        // Will be handled by axios interceptor
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPassword(null);
    setShowForm(true);
  };

  const handleEdit = (password) => {
    setEditingPassword(password);
    setShowForm(true);
    setViewingPassword(null);
  };

  const handleView = (password) => {
    setViewingPassword(password);
  };

  const handleCloseViewModal = () => {
    setViewingPassword(null);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this password?')) {
      return;
    }

    try {
      await api.delete(`/passwords/${id}`);
      fetchPasswords();
    } catch (error) {
      console.error('Error deleting password:', error);
      alert(error.response?.data?.error || 'Failed to delete password');
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPassword(null);
  };

  const handleFormSubmit = () => {
    fetchPasswords();
    handleFormClose();
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-600 dark:text-gray-400">
        Loading passwords...
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">My Passwords</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white px-6 py-2.5 rounded-lg font-semibold text-sm sm:text-base transition-all duration-300 shadow-lg hover:shadow-xl"
        >
          ➕ Add Password
        </motion.button>
      </div>

      <AnimatePresence>
        {showForm && (
          <PasswordForm
            password={editingPassword}
            onClose={handleFormClose}
            onSubmit={handleFormSubmit}
          />
        )}
        {viewingPassword && (
          <PasswordViewModal
            password={viewingPassword}
            onClose={handleCloseViewModal}
          />
        )}
      </AnimatePresence>

      <PasswordList
        passwords={passwords}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
    </div>
  );
};

export default PasswordManager;

