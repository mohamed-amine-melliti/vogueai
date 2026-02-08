import React, { useState, useEffect } from 'react';
import { galleryStorage, GalleryItem } from '../utils/galleryStorage';
import { Download, Trash2, X, Share2, Grid } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);

  useEffect(() => {
    setImages(galleryStorage.getImages());
  }, []);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this look?')) {
      const updated = galleryStorage.deleteImage(id);
      setImages(updated);
      if (selectedImage?.id === id) {
        setSelectedImage(null);
      }
    }
  };

  const handleDownload = (item: GalleryItem, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const link = document.createElement('a');
    link.href = item.dataUrl;
    link.download = `vogueai-look-${item.timestamp}.png`;
    link.click();
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-l-8 border-black pl-6">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase mb-2 tracking-tighter">Lookbook</h1>
          <p className="text-gray-600 font-bold text-lg">Your curated collection.</p>
        </header>

        {images.length === 0 ? (
          <div className="bg-white border-4 border-black p-12 text-center shadow-brutal">
            <div className="flex justify-center mb-6">
              <Grid className="w-16 h-16 text-gray-300" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">No looks saved yet</h2>
            <p className="text-gray-600 mb-8">Head to the fitting room to create your first look.</p>
            <a 
              href="#/tryon" 
              className="inline-block px-8 py-3 bg-primary border-4 border-black shadow-brutal text-black font-black uppercase hover:-translate-y-1 hover:shadow-brutal-lg transition-all"
            >
              Go to Fitting Room
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((item) => (
              <div 
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="group relative bg-white border-4 border-black shadow-brutal cursor-pointer transition-all hover:-translate-y-1 hover:shadow-brutal-lg"
              >
                <div className="aspect-[3/4] overflow-hidden border-b-4 border-black">
                  <img 
                    src={item.dataUrl} 
                    alt={`Look ${item.timestamp}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-3 flex justify-between items-center bg-white">
                  <span className="text-xs font-mono font-bold text-gray-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={(e) => handleDownload(item, e)}
                      className="p-1.5 hover:bg-gray-100 border-2 border-transparent hover:border-black rounded-sm transition-all"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>
                    <button 
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-1.5 hover:bg-red-50 text-red-500 border-2 border-transparent hover:border-red-500 rounded-sm transition-all"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-4xl bg-white border-4 border-black shadow-brutal-lg overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-white border-4 border-black shadow-brutal hover:bg-gray-100 transition-all"
              >
                <X size={24} />
              </button>

              <div className="flex-1 bg-gray-100 flex items-center justify-center p-4 md:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black">
                <img 
                  src={selectedImage.dataUrl} 
                  alt="Selected Look" 
                  className="max-w-full max-h-[70vh] object-contain border-4 border-black shadow-brutal"
                />
              </div>

              <div className="w-full md:w-80 p-6 flex flex-col bg-white">
                <h3 className="text-2xl font-black uppercase mb-2">Look Details</h3>
                <p className="font-mono text-sm text-gray-500 mb-8 border-b-2 border-black pb-4">
                  Captured on {new Date(selectedImage.timestamp).toLocaleString()}
                </p>

                <div className="space-y-4 mt-auto">
                  <button 
                    onClick={() => handleDownload(selectedImage)}
                    className="w-full py-4 bg-accent border-4 border-black shadow-brutal text-black font-black uppercase hover:-translate-y-1 hover:shadow-brutal-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={20} />
                    <span>Download Image</span>
                  </button>
                  
                  <button 
                    className="w-full py-4 bg-white border-4 border-black shadow-brutal text-black font-black uppercase hover:-translate-y-1 hover:shadow-brutal-lg transition-all flex items-center justify-center gap-2"
                    onClick={() => alert('Sharing coming soon!')}
                  >
                    <Share2 size={20} />
                    <span>Share Look</span>
                  </button>

                  <button 
                    onClick={(e) => {
                      handleDelete(selectedImage.id, e);
                      setSelectedImage(null);
                    }}
                    className="w-full py-4 bg-red-50 text-red-600 border-4 border-red-600 shadow-none font-black uppercase hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                  >
                    <Trash2 size={20} />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
