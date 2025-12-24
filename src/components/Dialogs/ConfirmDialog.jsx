import { useContext } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { AppContext } from '../../App';

const getIcon = (type) => {
  const iconClass = 'w-6 h-6';
  switch (type) {
    case 'success':
      return <CheckCircle className={`${iconClass} text-green-600`} />;
    case 'error':
      return <AlertCircle className={`${iconClass} text-red-600`} />;
    case 'warning':
      return <AlertTriangle className={`${iconClass} text-amber-600`} />;
    case 'info':
    default:
      return <Info className={`${iconClass} text-[#0B8FAC]`} />;
  }
};

const getColors = (type, darkMode) => {
  const colors = {
    success: {
      header: darkMode ? 'bg-green-950/40 border-green-800' : 'bg-green-50 border-green-200',
      headerText: darkMode ? 'text-green-300' : 'text-green-700',
      button: darkMode ? 'bg-green-700 hover:bg-green-600 active:bg-green-800 text-white' : 'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white'
    },
    error: {
      header: darkMode ? 'bg-red-950/40 border-red-800' : 'bg-red-50 border-red-200',
      headerText: darkMode ? 'text-red-300' : 'text-red-700',
      button: darkMode ? 'bg-red-700 hover:bg-red-600 active:bg-red-800 text-white' : 'bg-red-600 hover:bg-red-700 active:bg-red-800 text-white'
    },
    warning: {
      header: darkMode ? 'bg-amber-950/40 border-amber-800' : 'bg-amber-50 border-amber-200',
      headerText: darkMode ? 'text-amber-300' : 'text-amber-700',
      button: darkMode ? 'bg-amber-700 hover:bg-amber-600 active:bg-amber-800 text-white' : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white'
    },
    info: {
      header: darkMode ? 'bg-blue-950/40 border-blue-800' : 'bg-blue-50 border-blue-200',
      headerText: darkMode ? 'text-blue-300' : 'text-blue-700',
      button: darkMode ? 'bg-[#0B8FAC] hover:bg-[#0a7a94] active:bg-[#086582] text-white' : 'bg-[#0B8FAC] hover:bg-[#0a7a94] active:bg-[#086582] text-white'
    }
  };

  return colors[type] || colors.info;
};

export default function ConfirmDialog({
  isOpen,
  type = 'info',
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  loading = false
}) {
  const { darkMode, language, t } = useContext(AppContext);

  if (!isOpen) return null;

  const colors = getColors(type, darkMode);
  const isRTL = language === 'ar';

  // استخدم الـ translations الافتراضية إذا لم تكن محددة
  const finalConfirmText = confirmText || t.confirm || 'تأكيد';
  const finalCancelText = cancelText || t.cancel || 'إلغاء';
  const closeLabel = language === 'ar' ? 'إغلاق' : 'Close';

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          isOpen ? 'bg-black/50 opacity-100' : 'bg-black/50 opacity-0'
        }`}
      />

      {/* Modal */}
      <div
        className={`relative max-w-md w-full ${
          darkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-900'
        } rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 ${
          isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-message"
      >
        {/* Header */}
        <div
          className={`${colors.header} border-b ${
            darkMode ? 'border-gray-700' : 'border-gray-200'
          } p-6`}
        >
          <div className={`flex items-start ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-4`}>
            <div className="shrink-0 mt-0.5">
              {getIcon(type)}
            </div>
            <div className="flex-1">
              <h2
                id="dialog-title"
                className={`text-lg font-bold ${colors.headerText}`}
              >
                {title}
              </h2>
            </div>
            <button
              onClick={handleCancel}
              className={`shrink-0 p-1 rounded-lg transition ${
                darkMode
                  ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-300'
                  : 'text-gray-500 hover:bg-gray-100 hover:text-gray-700'
              }`}
              aria-label={closeLabel}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div
          className={`p-6 ${
            darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'
          }`}
        >
          <p
            id="dialog-message"
            className="text-base leading-relaxed whitespace-pre-wrap"
          >
            {message}
          </p>
        </div>

        {/* Footer */}
        <div
          className={`${
            darkMode ? 'bg-gray-700/50 border-gray-700' : 'bg-gray-50 border-gray-200'
          } px-6 py-4 flex ${isRTL ? 'flex-row-reverse' : 'flex-row'} gap-3 border-t`}
        >
          {/* Cancel Button */}
          <button
            onClick={handleCancel}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition ${
              darkMode
                ? 'bg-gray-600 hover:bg-gray-500 text-white disabled:opacity-50 disabled:cursor-not-allowed'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed'
            }`}
          >
            {finalCancelText}
          </button>

          {/* Confirm Button */}
          <button
            onClick={handleConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              colors.button
            }`}
          >
            {loading && (
              <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
            )}
            {finalConfirmText}
          </button>
        </div>
      </div>
    </div>
  );
}