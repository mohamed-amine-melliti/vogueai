import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const styles = {
    success: 'bg-green-400',
    error: 'bg-red-400',
    warning: 'bg-yellow-400',
    info: 'bg-blue-300',
  };

  const icons = {
    success: <CheckCircle size={20} strokeWidth={2.5} />,
    error: <AlertCircle size={20} strokeWidth={2.5} />,
    warning: <AlertTriangle size={20} strokeWidth={2.5} />,
    info: <Info size={20} strokeWidth={2.5} />,
  };

  return (
    <div className={`flex items-center p-4 mb-3 w-full max-w-sm border-4 border-black shadow-brutal transition-all duration-300 transform translate-x-0 ${styles[toast.type]}`}>
      <div className="mr-3 text-black">{icons[toast.type]}</div>
      <div className="text-sm font-bold flex-1 text-black uppercase tracking-tight">{toast.message}</div>
      <button onClick={() => onDismiss(toast.id)} className="ml-2 p-1 hover:bg-black hover:text-white border-2 border-transparent hover:border-transparent transition-colors">
        <X size={16} strokeWidth={3} />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC<{ toasts: ToastMessage[]; onDismiss: (id: string) => void }> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col items-end pointer-events-none">
      <div className="pointer-events-auto">
        {toasts.map(t => <Toast key={t.id} toast={t} onDismiss={onDismiss} />)}
      </div>
    </div>
  );
};