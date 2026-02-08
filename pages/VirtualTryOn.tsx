import React, { useState } from 'react';
import { WebcamCapture } from '../components/WebcamCapture';
import { PoseDetector } from '../components/PoseDetector';
import { GarmentSelector } from '../components/GarmentSelector';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { api } from '../services/api';
import { useAppContext } from '../context/AppContext';
import { Garment } from '../types';
import { ArrowRight, Download, Share2, RefreshCw } from 'lucide-react';
import { galleryStorage } from '../utils/galleryStorage';

export const VirtualTryOn: React.FC = () => {
  const { addToast, saveResult } = useAppContext();
  
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<Garment | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCapture = (dataUrl: string) => {
    // Save to gallery directly
    galleryStorage.saveImage(dataUrl);
    setResultImage(dataUrl);
    addToast('success', 'Look saved to gallery!');
  };

  const handleProcess = async () => {
    if (!capturedImage || !selectedGarment) {
      addToast('error', 'Capture a photo and select a garment');
      return;
    }

    setIsProcessing(true);
    try {
      const resultUrl = await api.tryOn(capturedImage, selectedGarment.imageUrl);
      setResultImage(resultUrl);
      addToast('success', 'Try-on successful!');
      
      // Auto save
      saveResult({
        id: Date.now().toString(),
        originalImage: URL.createObjectURL(capturedImage),
        garmentImage: selectedGarment.imageUrl,
        resultImage: resultUrl,
        timestamp: Date.now()
      });

    } catch (error) {
      addToast('error', 'Processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const reset = () => {
    setCapturedImage(null);
    setResultImage(null);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 border-l-8 border-black pl-6">
          <h1 className="text-4xl md:text-5xl font-black text-black uppercase mb-2 tracking-tighter">Fitting Room</h1>
          <p className="text-gray-600 font-bold text-lg">Digital wardrobe. Physical attitude.</p>
        </header>

        {resultImage ? (
          // Result View
          <div className="flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="relative w-full max-w-2xl aspect-[3/4] md:aspect-[4/3] bg-white border-4 border-black shadow-brutal-lg mb-8 p-2">
              <img src={resultImage} alt="Result" className="w-full h-full object-cover border-2 border-black" />
            </div>
            <div className="flex gap-4 mb-8">
                <button 
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = resultImage;
                    link.download = `vogueai-tryon-${Date.now()}.jpg`;
                    link.click();
                    addToast('success', 'Downloaded to device');
                  }}
                  className="flex items-center space-x-2 px-8 py-3 bg-accent border-4 border-black shadow-brutal text-black font-black uppercase hover:-translate-y-1 hover:shadow-brutal-lg transition-all"
                >
                  <Download size={24} strokeWidth={3} />
                  <span>Download</span>
                </button>
                <button 
                  onClick={() => addToast('info', 'Sharing functionality coming soon!')}
                  className="p-3 bg-white border-4 border-black shadow-brutal hover:-translate-y-1 transition-all"
                >
                  <Share2 size={24} strokeWidth={3} />
                </button>
            </div>
            <button 
              onClick={reset}
              className="flex items-center space-x-2 text-black font-bold hover:underline"
            >
              <RefreshCw size={16} />
              <span>TRY ANOTHER LOOK</span>
            </button>
          </div>
        ) : (
          // Input View
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              {/* Replaced WebcamCapture with PoseDetector for real-time AR preview */}
              <PoseDetector 
                width={1280} 
                height={720} 
                garmentSrc={selectedGarment?.imageUrl}
                onPoseDetected={(data) => {
                  // Optional: use pose data for UI feedback
                }}
                onCapture={handleCapture}
              />
              
              {/* Mobile Only: Processing Button */}
              <div className="lg:hidden">
                 <button
                  onClick={handleProcess}
                  disabled={!selectedGarment || isProcessing}
                  className="w-full py-4 bg-primary border-4 border-black shadow-brutal disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed text-black font-black text-xl uppercase transition-all active:translate-y-1 active:shadow-none flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <LoadingSpinner size={24} />
                  ) : (
                    <>
                      <span>Generate Look</span>
                      <ArrowRight size={24} strokeWidth={3} />
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="h-full flex flex-col">
              <GarmentSelector 
                onSelect={setSelectedGarment} 
                selectedGarmentId={selectedGarment?.id} 
              />
              
              {/* Desktop Only: Processing Button */}
              <div className="hidden lg:block mt-6">
                <button
                  onClick={handleProcess}
                  disabled={!selectedGarment || isProcessing}
                  className="w-full py-4 bg-primary border-4 border-black shadow-brutal disabled:bg-gray-300 disabled:shadow-none disabled:cursor-not-allowed text-black font-black text-xl uppercase transition-all hover:-translate-y-1 hover:shadow-brutal-lg active:translate-y-0 active:translate-x-0 active:shadow-none flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <LoadingSpinner size={24} />
                  ) : (
                    <>
                      <span>Generate Look</span>
                      <ArrowRight size={24} strokeWidth={3} />
                    </>
                  )}
                </button>
                <p className="text-center text-xs font-bold uppercase mt-3 text-black">
                  {selectedGarment ? 'Ready to process' : 'Select a garment to preview'}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {isProcessing && <LoadingSpinner overlay message="STITCHING PIXELS..." />}
    </div>
  );
};