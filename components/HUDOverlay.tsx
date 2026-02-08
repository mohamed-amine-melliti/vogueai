import React from 'react';
import { Activity, Zap, Cpu } from 'lucide-react';

interface HUDOverlayProps {
  fps: number;
  latency: number;
  isTracking: boolean;
  modelType?: string;
}

export const HUDOverlay: React.FC<HUDOverlayProps> = ({ 
  fps, 
  latency, 
  isTracking,
  modelType = 'BlazePose Lite'
}) => {
  return (
    <div className="absolute top-4 left-4 flex flex-col gap-3 pointer-events-none z-50">
      {/* Status Badge */}
      <div className={`
        flex items-center gap-2 border-2 border-black px-3 py-1.5 font-bold font-mono text-sm shadow-brutal-sm transition-colors duration-300
        ${isTracking ? 'bg-[#4ADE80] text-black' : 'bg-[#FACC15] text-black'}
      `}>
        <Activity className={`w-4 h-4 ${isTracking ? 'animate-pulse' : 'animate-spin'}`} />
        <span>STATUS: {isTracking ? 'ACTIVE' : 'ANALYZING...'}</span>
      </div>

      {/* Metrics Card */}
      <div className="bg-white border-2 border-black p-3 shadow-brutal-sm font-mono text-xs font-bold space-y-2 min-w-[160px]">
        <div className="flex justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Zap className="w-3 h-3" />
            <span>FPS</span>
          </div>
          <span className={`text-sm ${fps < 24 ? 'text-red-600' : 'text-black'}`}>
            {Math.round(fps)}
          </span>
        </div>
        
        <div className="w-full h-1.5 bg-gray-200 border border-black">
          <div 
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${Math.min((fps / 60) * 100, 100)}%` }}
          />
        </div>

        <div className="flex justify-between items-center gap-4 pt-1">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Cpu className="w-3 h-3" />
            <span>LATENCY</span>
          </div>
          <span>{Math.round(latency)}ms</span>
        </div>
        
        <div className="border-t border-gray-300 my-1"></div>
        
        <div className="text-[10px] text-gray-500 uppercase text-center">
          {modelType}
        </div>
      </div>
    </div>
  );
};
