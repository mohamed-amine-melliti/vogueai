import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  message?: string;
  overlay?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, message, overlay = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center space-y-3">
      <Loader2 className="animate-spin text-primary-500" size={size} />
      {message && <p className="text-gray-300 text-sm font-medium animate-pulse">{message}</p>}
    </div>
  );

  if (overlay) {
    return (
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-xl">
        {content}
      </div>
    );
  }

  return content;
};
