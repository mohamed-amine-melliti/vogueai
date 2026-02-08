export interface GalleryItem {
  id: string;
  dataUrl: string;
  timestamp: number;
}

const STORAGE_KEY = 'vogueai_gallery';

export const galleryStorage = {
  saveImage: (dataUrl: string): GalleryItem => {
    const item: GalleryItem = {
      id: crypto.randomUUID(),
      dataUrl,
      timestamp: Date.now(),
    };

    const existing = galleryStorage.getImages();
    const updated = [item, ...existing];
    
    // Optional: Limit storage to last 20 images to avoid QuotaExceededError
    if (updated.length > 20) {
      updated.length = 20;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return item;
  },

  getImages: (): GalleryItem[] => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to load gallery', e);
      return [];
    }
  },

  deleteImage: (id: string) => {
    const existing = galleryStorage.getImages();
    const updated = existing.filter(img => img.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  },

  clearGallery: () => {
    localStorage.removeItem(STORAGE_KEY);
  }
};
