import React from 'react';
import { Shirt, Check } from 'lucide-react';

interface Garment {
  id: string;
  name: string;
  src: string;
  thumbnail: string;
}

interface WardrobeSelectorProps {
  garments: Garment[];
  selectedId: string | null;
  onSelect: (garment: Garment) => void;
}

export const WardrobeSelector: React.FC<WardrobeSelectorProps> = ({
  garments,
  selectedId,
  onSelect,
}) => {
  return (
    <div className="bg-white border-4 border-black p-4 shadow-brutal w-full">
      <div className="flex items-center gap-2 mb-4 border-b-2 border-black pb-2">
        <Shirt className="w-6 h-6" />
        <h2 className="text-xl font-bold font-display">Wardrobe</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {garments.map((garment) => {
          const isSelected = selectedId === garment.id;
          return (
            <button
              key={garment.id}
              onClick={() => onSelect(garment)}
              className={`
                relative group flex flex-col items-center p-2 border-2 transition-all duration-200
                ${isSelected 
                  ? 'border-black bg-accent shadow-brutal-sm translate-x-[2px] translate-y-[2px]' 
                  : 'border-black hover:bg-gray-50 hover:shadow-brutal-sm'
                }
              `}
            >
              <div className="relative w-full aspect-square mb-2 bg-gray-100 border-2 border-black overflow-hidden">
                <img
                  src={garment.thumbnail}
                  alt={garment.name}
                  className="w-full h-full object-contain p-2"
                />
                {isSelected && (
                  <div className="absolute top-1 right-1 bg-black text-white p-0.5 rounded-full">
                    <Check className="w-3 h-3" />
                  </div>
                )}
              </div>
              <span className="text-sm font-bold text-center truncate w-full">
                {garment.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
