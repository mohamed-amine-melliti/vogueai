import React, { useEffect, useRef, useState } from 'react';
import { Camera, StopCircle, Video, Activity, AlertTriangle } from 'lucide-react';
import { WebSocketManager } from '../services/api';
import { WS_URL } from '../constants';
import { useAppContext } from '../context/AppContext';

export const LiveTryOn: React.FC = () => {
  const { addToast } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocketManager>(new WebSocketManager());
  
  const [isActive, setIsActive] = useState(false);
  const [fps, setFps] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      stopLive();
    };
  }, []);

  const startLive = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 640, height: 480, facingMode: 'user' } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          setIsActive(true);
          startProcessing();
        };
      }
      
      // Initialize WebSocket
      wsRef.current.connect(
        WS_URL,
        (frameData) => {
           // On receive frame from server
        },
        (err) => {
          addToast('warning', 'Live server disconnected.');
        }
      );

    } catch (err) {
      setError("Camera permission denied");
      addToast('error', "Could not access camera");
    }
  };

  const stopLive = () => {
    setIsActive(false);
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(t => t.stop());
    }
    wsRef.current.disconnect();
  };

  const startProcessing = () => {
    let lastTime = performance.now();
    let frameCount = 0;

    const processFrame = () => {
      if (!isActive || !videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (ctx && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
        ctx.restore();

        // Brutalist overlay
        ctx.strokeStyle = '#FACC15'; // Accent yellow
        ctx.lineWidth = 8;
        ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
        
        ctx.font = 'bold 30px monospace';
        ctx.fillStyle = '#FACC15';
        ctx.fillText("ANALYZING...", 60, 90);
      }

      const now = performance.now();
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }

      if (isActive) {
        requestAnimationFrame(processFrame);
      }
    };
    
    requestAnimationFrame(processFrame);
  };
  
  useEffect(() => {
    if (isActive) {
        startProcessing();
    }
  }, [isActive]);

  return (
    <div className="min-h-[calc(100vh-80px)] p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-black text-black flex items-center gap-2 uppercase tracking-tighter">
              <Activity className="text-red-500" strokeWidth={4} /> Live AR Mode
            </h1>
            <p className="text-gray-800 font-bold border-b-2 border-black inline-block">Real-time processing. Zero latency.</p>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
             <div className="bg-black px-4 py-2 border-2 border-black text-sm font-mono text-accent font-bold">
               {fps} FPS
             </div>
             {!isActive ? (
               <button 
                 onClick={startLive}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-primary border-2 border-black shadow-brutal hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all text-black font-bold uppercase"
               >
                 <Video size={18} strokeWidth={3} /> Start Stream
               </button>
             ) : (
               <button 
                 onClick={stopLive}
                 className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2 bg-red-500 border-2 border-black shadow-brutal hover:translate-y-[-2px] hover:shadow-brutal-lg transition-all text-white font-bold uppercase"
               >
                 <StopCircle size={18} strokeWidth={3} /> Stop Stream
               </button>
             )}
          </div>
        </div>

        <div className="relative aspect-video bg-gray-100 border-4 border-black shadow-brutal overflow-hidden">
          {!isActive && !error && (
             <div className="absolute inset-0 flex flex-col items-center justify-center text-black">
               <Video size={64} className="mb-4 text-black" strokeWidth={1.5} />
               <p className="font-bold text-xl uppercase">Start stream to activate</p>
             </div>
          )}
          
          <video ref={videoRef} className="hidden" playsInline muted />
          <canvas ref={canvasRef} className="w-full h-full object-cover" />

          {isActive && (
            <div className="absolute top-4 left-4">
              <div className="flex items-center gap-2 px-4 py-1 bg-red-500 border-2 border-black text-white text-sm font-black uppercase animate-pulse">
                LIVE
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6 p-4 bg-accent border-4 border-black shadow-brutal flex items-start gap-4">
          <AlertTriangle className="text-black shrink-0 mt-1" size={24} strokeWidth={3} />
          <div className="text-black">
            <p className="font-black uppercase text-lg">Demo Mode</p>
            <p className="font-medium">Running local simulation. Backend disconnected.</p>
          </div>
        </div>
      </div>
    </div>
  );
};