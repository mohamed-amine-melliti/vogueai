import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, XCircle } from 'lucide-react';
import { LoadingSpinner } from './LoadingSpinner';

interface WebcamCaptureProps {
  onCapture: (blob: Blob) => void;
  onError?: (error: string) => void;
  facingMode?: 'user' | 'environment';
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture, onError, facingMode = 'user' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const startCamera = async () => {
    setIsInitializing(true);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
            facingMode,
            width: { ideal: 1280 },
            height: { ideal: 720 }
        },
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      const errorMsg = 'Could not access camera.';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsStreaming(false);
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [facingMode]);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Flip horizontally if front camera for mirror effect
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob((blob) => {
          if (blob) {
            setPreview(URL.createObjectURL(blob));
            onCapture(blob);
            stopCamera(); // Pause stream to show preview state
          }
        }, 'image/jpeg', 0.95);
      }
    }
  };

  const handleRetake = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    startCamera();
  };

  return (
    <div className="relative w-full aspect-[3/4] md:aspect-[4/3] bg-white border-4 border-black shadow-brutal group">
      {/* Decorative dots like a viewfinder */}
      <div className="absolute top-2 left-2 w-3 h-3 bg-black z-30"></div>
      <div className="absolute top-2 right-2 w-3 h-3 bg-black z-30"></div>
      <div className="absolute bottom-2 left-2 w-3 h-3 bg-black z-30"></div>
      <div className="absolute bottom-2 right-2 w-3 h-3 bg-black z-30"></div>

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-20 bg-secondary">
          <XCircle className="text-black mb-2" size={48} strokeWidth={2.5} />
          <p className="text-black font-bold uppercase text-xl">{error}</p>
          <button 
            onClick={startCamera}
            className="mt-4 px-6 py-2 bg-white border-2 border-black shadow-brutal-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-bold"
          >
            RETRY
          </button>
        </div>
      )}

      {/* Loading State */}
      {isInitializing && !error && (
        <div className="absolute inset-0 flex items-center justify-center z-20 bg-gray-100">
          <LoadingSpinner size={40} message="INITIALIZING..." />
        </div>
      )}

      {/* Video Stream */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={`w-full h-full object-cover grayscale-[20%] contrast-125 transition-opacity duration-300 ${isStreaming && !preview ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`}
        onLoadedMetadata={() => videoRef.current?.play()}
      />

      {/* Captured Preview Image */}
      {preview && (
        <img 
          src={preview} 
          alt="Captured" 
          className="absolute inset-0 w-full h-full object-cover z-10"
        />
      )}

      {/* Hidden Canvas for Capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Controls Overlay */}
      <div className="absolute bottom-6 inset-x-0 z-30 flex justify-center items-center pointer-events-none">
        <div className="pointer-events-auto">
        {!preview ? (
          <button
            onClick={handleCapture}
            disabled={!isStreaming}
            className="w-16 h-16 rounded-full border-4 border-black bg-red-500 hover:bg-red-400 active:bg-red-600 transition-all shadow-brutal disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            aria-label="Capture photo"
          >
          </button>
        ) : (
          <button
            onClick={handleRetake}
            className="flex items-center space-x-2 px-6 py-3 bg-white border-2 border-black shadow-brutal text-black font-bold hover:-translate-y-1 hover:shadow-brutal-lg transition-all active:shadow-none active:translate-y-1"
          >
            <RefreshCw size={20} strokeWidth={3} />
            <span>RETAKE</span>
          </button>
        )}
        </div>
      </div>
    </div>
  );
};