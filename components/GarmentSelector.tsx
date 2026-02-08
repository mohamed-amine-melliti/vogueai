import React, { useState } from 'react';
import { Upload, Check, Loader2 } from 'lucide-react';
import { Garment } from '../types';
import { MOCK_GARMENTS } from '../constants';

interface GarmentSelectorProps {
  onSelect: (garment: Garment) => void;
  selectedGarmentId?: string;
}

export const GarmentSelector: React.FC<GarmentSelectorProps> = ({ onSelect, selectedGarmentId }) => {
  const [filter, setFilter] = useState<Garment['category'] | 'all'>('all');
  const [customGarments, setCustomGarments] = useState<Garment[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const categories = ['all', 'shirt', 'pants', 'dress', 'jacket'];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert("File too large. Max 10MB.");
        return;
      }
      setIsUploading(true);
      // Simulate upload process
      setTimeout(() => {
        const newGarment: Garment = {
          id: `custom-${Date.now()}`,
          name: file.name.split('.')[0],
          category: 'shirt', // Default to shirt for custom
          imageUrl: URL.createObjectURL(file),
          isCustom: true
        };
        setCustomGarments([newGarment, ...customGarments]);
        setIsUploading(false);
        onSelect(newGarment);
      }, 1000);
    }
  };

  const displayGarments = [...customGarments, ...MOCK_GARMENTS].filter(
    g => filter === 'all' || g.category === filter
  );

  return (
    <div className="flex flex-col h-full bg-white border-4 border-black shadow-brutal p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-4">
        <h3 className="text-xl font-black uppercase tracking-tighter">Wardrobe</h3>
        <div className="relative">
          <input
            type="file"
            id="garment-upload"
            className="hidden"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={isUploading}
          />
          <label
            htmlFor="garment-upload"
            className={`flex items-center space-x-2 px-3 py-1.5 bg-accent border-2 border-black shadow-brutal-sm hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none text-xs font-bold uppercase cursor-pointer transition-all ${isUploading ? 'opacity-70 cursor-wait' : ''}`}
          >
            {isUploading ? <Loader2 className="animate-spin" size={14} /> : <Upload size={14} />}
            <span>Upload</span>
          </label>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-2 mb-4 overflow-x-auto pb-2 hide-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-1.5 border-2 border-black text-xs font-bold uppercase whitespace-nowrap transition-all ${
              filter === cat 
                ? 'bg-black text-white shadow-none' 
                : 'bg-white text-black hover:bg-gray-100 shadow-brutal-sm'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 overflow-y-auto max-h-[500px] hide-scrollbar p-1">
        {displayGarments.map((garment) => (
          <button
            key={garment.id}
            onClick={() => onSelect(garment)}
            className={`group relative aspect-[3/4] overflow-hidden border-2 border-black transition-all ${
              selectedGarmentId === garment.id
                ? 'shadow-brutal ring-2 ring-accent ring-offset-2'
                : 'hover:shadow-brutal'
            }`}
          >
            <img 
              src={garment.imageUrl} 
              alt={garment.name}
              className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0"
            />
            <div className="absolute bottom-0 inset-x-0 bg-black text-white p-1 text-xs font-bold uppercase truncate border-t-2 border-black">
              {garment.name}
            </div>
            {selectedGarmentId === garment.id && (
              <div className="absolute top-2 right-2 bg-accent border-2 border-black p-1 shadow-sm z-10">
                <Check size={16} className="text-black" strokeWidth={3} />
              </div>
            )}
            {garment.isCustom && (
               <div className="absolute top-2 left-2 bg-primary border-2 border-black px-1.5 py-0.5 text-[10px] text-black font-black uppercase">
                Custom
              </div>
            )}
          </button>
        ))}
        {displayGarments.length === 0 && (
           <div className="col-span-full py-10 text-center text-gray-500 font-bold uppercase border-2 border-dashed border-gray-300">
             No garments found.
           </div>
        )}
      </div>
    </div>
  );
};