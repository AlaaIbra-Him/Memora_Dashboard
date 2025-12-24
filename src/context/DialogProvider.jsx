import { useState } from 'react';
import { DialogContext } from './DialogContext';

export function DialogProvider({ children }) {
  const [dialog, setDialog] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: '',
    confirmText: 'تأكيد',
    cancelText: 'إلغاء',
    onConfirm: null,
    onCancel: null,
    loading: false
  });

  const showDialog = (config) => {
    setDialog({
      isOpen: true,
      type: config.type || 'info',
      title: config.title || '',
      message: config.message || '',
      confirmText: config.confirmText || 'تأكيد',
      cancelText: config.cancelText || 'إلغاء',
      onConfirm: config.onConfirm || null,
      onCancel: config.onCancel || null,
      loading: config.loading || false
    });
  };

  const closeDialog = () => {
    setDialog({
      isOpen: false,
      type: 'info',
      title: '',
      message: '',
      confirmText: 'تأكيد',
      cancelText: 'إلغاء',
      onConfirm: null,
      onCancel: null,
      loading: false
    });
  };

  const setLoading = (isLoading) => {
    setDialog(prev => ({
      ...prev,
      loading: isLoading
    }));
  };

  const value = {
    dialog,
    showDialog,
    closeDialog,
    setLoading
  };

  return (
    <DialogContext.Provider value={value}>
      {children}
    </DialogContext.Provider>
  );
}