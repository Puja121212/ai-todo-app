import toast, { Toaster } from 'react-hot-toast';

export const useToast = () => {
  const showToast = {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    dismiss: () => toast.dismiss(),
  };

  return { showToast, Toaster };
};
