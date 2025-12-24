import { useContext } from 'react';
import { DialogContext } from '../context/DialogContext';

export function useDialog() {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error('useDialog must be used within DialogProvider');
  }

  return {
    showDialog: context.showDialog,
    closeDialog: context.closeDialog,
    setLoading: context.setLoading,
    dialog: context.dialog
  };
}