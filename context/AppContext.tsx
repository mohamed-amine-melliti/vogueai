import React, { createContext, useContext, useState, useEffect } from 'react';
import { SettingsState, TryOnResult, ToastMessage, AppContextType } from '../types';
import { ToastContainer } from '../components/Toast';
import { DEMO_RESULTS_STORAGE_KEY } from '../constants';

const defaultSettings: SettingsState = {
  darkMode: true,
  cameraDeviceId: '',
  quality: 'balanced',
  autoSave: false,
  showFPS: true,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SettingsState>(defaultSettings);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [results, setResults] = useState<TryOnResult[]>([]);

  // Load results from local storage
  useEffect(() => {
    const savedResults = localStorage.getItem(DEMO_RESULTS_STORAGE_KEY);
    if (savedResults) {
      try {
        setResults(JSON.parse(savedResults));
      } catch (e) {
        console.error("Failed to load results", e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<SettingsState>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const addToast = (type: ToastMessage['type'], message: string) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, type, message }]);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const saveResult = (result: TryOnResult) => {
    const updated = [result, ...results];
    setResults(updated);
    localStorage.setItem(DEMO_RESULTS_STORAGE_KEY, JSON.stringify(updated));
    addToast('success', 'Image saved to gallery');
  };

  const deleteResult = (id: string) => {
    const updated = results.filter(r => r.id !== id);
    setResults(updated);
    localStorage.setItem(DEMO_RESULTS_STORAGE_KEY, JSON.stringify(updated));
    addToast('info', 'Image deleted');
  };

  return (
    <AppContext.Provider value={{
      settings,
      updateSettings,
      addToast,
      results,
      saveResult,
      deleteResult
    }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
