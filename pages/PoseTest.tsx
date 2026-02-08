import React, { useState } from 'react';
import { PoseDetector } from '../components/PoseDetector';
import { WardrobeSelector } from '../components/WardrobeSelector';
import { ErrorBoundary } from '../components/ErrorBoundary';

// Sample garments data
const SAMPLE_GARMENTS = [
  {
    id: '1',
    name: 'Red T-Shirt',
    // Using a reliable placeholder for a red shirt
    src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Blue_Tshirt.jpg/480px-Blue_Tshirt.jpg', // Placeholder, actually blue but labeled red for demo
    thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Blue_Tshirt.jpg/100px-Blue_Tshirt.jpg'
  },
  {
    id: '2',
    name: 'Pug Graphic',
    src: 'https://raw.githubusercontent.com/FabricJs/fabric.js/master/assets/pug_small.jpg',
    thumbnail: 'https://raw.githubusercontent.com/FabricJs/fabric.js/master/assets/pug_small.jpg'
  },
  {
    id: '3',
    name: 'Logo Tee',
    src: 'https://raw.githubusercontent.com/FabricJs/fabric.js/master/assets/logo.png',
    thumbnail: 'https://raw.githubusercontent.com/FabricJs/fabric.js/master/assets/logo.png'
  }
];

export const PoseTest: React.FC = () => {
  console.log('Rendering PoseTest page');
  const [poseData, setPoseData] = useState<any>(null);
  const [selectedGarment, setSelectedGarment] = useState(SAMPLE_GARMENTS[0]);

  return (
    <div className="container mx-auto p-4 pt-24">
      <h1 className="text-4xl font-bold mb-8 font-display brutal-shadow">Virtual Try-On Demo</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Camera */}
        <div className="flex-shrink-0">
          <ErrorBoundary>
            <PoseDetector 
              onPoseDetected={(data) => setPoseData(data)}
              width={640}
              height={480}
              garmentSrc={selectedGarment.src}
            />
          </ErrorBoundary>
          <p className="text-sm mt-2 text-gray-500 max-w-[640px]">
            * Stand back until your upper body is visible. The garment will scale and rotate to match your shoulders.
          </p>
        </div>

        {/* Right Column: Wardrobe & Data */}
        <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
          
          <WardrobeSelector 
            garments={SAMPLE_GARMENTS}
            selectedId={selectedGarment.id}
            onSelect={setSelectedGarment}
          />

          <div className="bg-white border-4 border-black p-4 shadow-brutal flex-1 overflow-auto max-h-[400px]">
            <h2 className="text-2xl font-bold mb-4 border-b-2 border-black pb-2">Debug Data</h2>
            {poseData ? (
              <div className="font-mono text-xs space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 bg-gray-50 border border-black">
                    <h3 className="font-bold text-primary">Shoulders</h3>
                    <p>L: {Math.round(poseData.shoulders.left.x)}, {Math.round(poseData.shoulders.left.y)}</p>
                    <p>R: {Math.round(poseData.shoulders.right.x)}, {Math.round(poseData.shoulders.right.y)}</p>
                  </div>
                  <div className="p-2 bg-gray-50 border border-black">
                    <h3 className="font-bold text-secondary">Hips</h3>
                    <p>L: {Math.round(poseData.hips.left.x)}, {Math.round(poseData.hips.left.y)}</p>
                    <p>R: {Math.round(poseData.hips.right.x)}, {Math.round(poseData.hips.right.y)}</p>
                  </div>
                </div>
                <div className="text-gray-500">
                  Angle: {poseData.shoulders.left && poseData.shoulders.right ? 
                    (Math.atan2(
                      poseData.shoulders.right.y - poseData.shoulders.left.y, 
                      poseData.shoulders.right.x - poseData.shoulders.left.x
                    ) * 180 / Math.PI).toFixed(1) + '°' 
                    : 'N/A'}
                </div>
              </div>
            ) : (
              <div className="text-gray-500 italic">Waiting for detection...</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
