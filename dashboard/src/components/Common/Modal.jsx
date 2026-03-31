import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiX } from 'react-icons/fi';
import { closeModal } from '../../redux/slices/uiSlice';

const Modal = () => {
  const dispatch = useDispatch();
  const { isOpen, type, data } = useSelector((state) => state.ui.modal);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleClose = () => {
    dispatch(closeModal());
  };

  const handleConfirm = () => {
    if (data?.onConfirm) {
      data.onConfirm();
    }
    handleClose();
  };

  const handleCancel = () => {
    if (data?.onCancel) {
      data.onCancel();
    }
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full p-6 transform transition-all">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiX size={20} />
          </button>

          {/* Content based on type */}
          {type === 'confirm' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {data?.title || 'Confirm Action'}
              </h3>
              <p className="text-gray-600 mb-6">
                {data?.message || 'Are you sure you want to proceed?'}
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCancel}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className="btn-primary"
                >
                  Confirm
                </button>
              </div>
            </div>
          )}

          {type === 'alert' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {data?.title || 'Alert'}
              </h3>
              <p className="text-gray-600 mb-6">
                {data?.message || ''}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={handleClose}
                  className="btn-primary"
                >
                  OK
                </button>
              </div>
            </div>
          )}

          {type === 'custom' && data?.content}
        </div>
      </div>
    </div>
  );
};

export default Modal;