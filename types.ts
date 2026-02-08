export interface Garment {
  id: string;
  name: string;
  category: 'shirt' | 'pants' | 'dress' | 'jacket';
  imageUrl: string;
  isCustom?: boolean;
}

export interface TryOnResult {
  id: string;
  originalImage: string;
  garmentImage: string;
  resultImage: string;
  timestamp: number;
}

export interface SettingsState {
  darkMode: boolean;
  cameraDeviceId: string;
  quality: 'high' | 'balanced' | 'speed';
  autoSave: boolean;
  showFPS: boolean;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

export interface AppContextType {
  settings: SettingsState;
  updateSettings: (newSettings: Partial<SettingsState>) => void;
  addToast: (type: ToastMessage['type'], message: string) => void;
  results: TryOnResult[];
  saveResult: (result: TryOnResult) => void;
  deleteResult: (id: string) => void;
}
