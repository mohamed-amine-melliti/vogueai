import React, { useRef, useEffect, useState, useMemo } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl'; // Ensure WebGL backend is registered
import { SkeletonOverlay } from './SkeletonOverlay';
import { PoseSmoother } from '../utils/poseSmoother';
import { GarmentOverlay } from './GarmentOverlay';
import { HUDOverlay } from './HUDOverlay';

interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

interface PoseData {
  shoulders: { left: Keypoint; right: Keypoint };
  elbows: { left: Keypoint; right: Keypoint };
  wrists: { left: Keypoint; right: Keypoint };
  hips: { left: Keypoint; right: Keypoint };
  knees: { left: Keypoint; right: Keypoint };
}

interface PoseDetectorProps {
  onPoseDetected?: (data: PoseData) => void;
  width?: number;
  height?: number;
  garmentSrc?: string; // Optional garment to overlay
  onCapture?: (dataUrl: string) => void;
}

export const PoseDetector: React.FC<PoseDetectorProps> = ({ 
  onPoseDetected, 
  width = 640, 
  height = 480,
  garmentSrc,
  onCapture
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const detectorRef = useRef<poseDetection.PoseDetector | null>(null);
  const requestRef = useRef<number>();
  const [keypoints, setKeypoints] = useState<poseDetection.Keypoint[]>([]);
  
  // Performance Monitoring
  const [fps, setFps] = useState(0);
  const [latency, setLatency] = useState(0);
  const frameCount = useRef(0);
  const lastFpsUpdate = useRef(performance.now());
  
  // Initialize smoother with custom tuning
  // q (process noise): 0.1 means we expect smooth movements
  // r (measurement noise): 2 means we trust the measurement but want some smoothing
  const smoother = useMemo(() => new PoseSmoother({ q: 0.5, r: 2 }), []);

  useEffect(() => {
    let isMounted = true;

    const runPoseDetection = async () => {
      try {
        await tf.ready();
        console.log('TensorFlow JS is ready');
        
        // Initialize the BlazePose detector
        const model = poseDetection.SupportedModels.BlazePose;
        const detectorConfig: poseDetection.BlazePoseTfjsModelConfig = {
          runtime: 'tfjs',
          enableSmoothing: true,
          modelType: 'lite', // 'lite', 'full', or 'heavy'
        };
        
        const detector = await poseDetection.createDetector(model, detectorConfig);
        detectorRef.current = detector;
        
        if (isMounted) {
          setIsLoading(false);
          setupCamera();
        }
      } catch (err) {
        console.error('Failed to load model:', err);
        setError('Failed to load pose detection model');
        setIsLoading(false);
      }
    };

    runPoseDetection();

    return () => {
      isMounted = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  const setupCamera = async () => {
    if (!videoRef.current) return;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode: 'user',
        },
      });
      
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play();
        detectPose();
      };
    } catch (err) {
      console.error('Camera access denied:', err);
      setError('Could not access camera');
    }
  };

  const detectPose = async () => {
    if (!detectorRef.current || !videoRef.current) return;

    const video = videoRef.current;

    if (video.readyState === 4 && video.videoWidth > 0) {
      try {
        const start = performance.now();
        const poses = await detectorRef.current.estimatePoses(video);
        const end = performance.now();
        const currentLatency = end - start;
        
        // Update FPS and Latency every 500ms
        frameCount.current++;
        const now = performance.now();
        if (now - lastFpsUpdate.current >= 500) {
          const currentFps = (frameCount.current / (now - lastFpsUpdate.current)) * 1000;
          setFps(currentFps);
          setLatency(currentLatency);
          frameCount.current = 0;
          lastFpsUpdate.current = now;
        }

        if (poses.length > 0) {
          const pose = poses[0];
          // Apply Kalman filter smoothing
          const smoothedKeypoints = smoother.smooth(pose.keypoints);
          
          setKeypoints(smoothedKeypoints); // Update keypoints for overlay
          processKeypoints(smoothedKeypoints);
        } else {
          setKeypoints([]);
        }
      } catch (err) {
        console.error('Detection error:', err);
      }
    }

    requestRef.current = requestAnimationFrame(detectPose);
  };

  const processKeypoints = (keypoints: poseDetection.Keypoint[]) => {
    // Extract specific keypoints: shoulders, elbows, hips, knees, wrists
    
    // Helper to find keypoint by name
    const findKp = (name: string) => keypoints.find(kp => kp.name === name);

    const data: PoseData = {
      shoulders: {
        left: findKp('left_shoulder') || { x: 0, y: 0, score: 0 },
        right: findKp('right_shoulder') || { x: 0, y: 0, score: 0 }
      },
      elbows: {
        left: findKp('left_elbow') || { x: 0, y: 0, score: 0 },
        right: findKp('right_elbow') || { x: 0, y: 0, score: 0 }
      },
      wrists: {
        left: findKp('left_wrist') || { x: 0, y: 0, score: 0 },
        right: findKp('right_wrist') || { x: 0, y: 0, score: 0 }
      },
      hips: {
        left: findKp('left_hip') || { x: 0, y: 0, score: 0 },
        right: findKp('right_hip') || { x: 0, y: 0, score: 0 }
      },
      knees: {
        left: findKp('left_knee') || { x: 0, y: 0, score: 0 },
        right: findKp('right_knee') || { x: 0, y: 0, score: 0 }
      }
    };

    if (onPoseDetected) {
      onPoseDetected(data);
    }
  };

  const captureSnapshot = () => {
    if (!containerRef.current || !onCapture) return;

    // Create a temporary canvas to combine video and overlays
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    // 1. Draw Video (mirrored)
    if (videoRef.current) {
      ctx.save();
      ctx.scale(-1, 1);
      ctx.drawImage(videoRef.current, -width, 0, width, height);
      ctx.restore();
    }

    // 2. Draw Overlays
    // Note: We can't easily grab the WebGL/Canvas context from child components directly
    // without them exposing it. For a robust solution, we would move drawing logic up
    // or use `html2canvas`. However, since we have the data, we can just grab the
    // rendered DOM elements if they are canvases.
    
    // Quick hack: find all canvases in container and draw them
    const canvases = containerRef.current.querySelectorAll('canvas');
    canvases.forEach((overlayCanvas) => {
      // Check if it's mirrored in CSS
      const style = window.getComputedStyle(overlayCanvas);
      const matrix = new DOMMatrix(style.transform);
      
      ctx.save();
      if (matrix.a === -1) { // if scaleX(-1)
         ctx.scale(-1, 1);
         ctx.drawImage(overlayCanvas, -width, 0, width, height);
      } else {
         ctx.drawImage(overlayCanvas, 0, 0, width, height);
      }
      ctx.restore();
    });

    onCapture(canvas.toDataURL('image/png'));
  };

  return (
    <div ref={containerRef} className="relative border-4 border-black shadow-brutal bg-white p-2 inline-block">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
          <span className="font-bold">Loading Model...</span>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-100 z-10 text-red-600 font-bold p-4 text-center">
          {error}
        </div>
      )}
      <div className="relative group">
        <video 
          ref={videoRef} 
          width={width} 
          height={height} 
          playsInline 
          muted
          className="block bg-black"
          style={{ transform: 'scaleX(-1)' }} // Mirror effect
        />
        <HUDOverlay 
          fps={fps} 
          latency={latency} 
          isTracking={keypoints.length > 0} 
        />
        <SkeletonOverlay 
          keypoints={keypoints} 
          width={width} 
          height={height} 
        />
        {garmentSrc && (
          <GarmentOverlay 
            keypoints={keypoints}
            width={width}
            height={height}
            garmentSrc={garmentSrc}
          />
        )}
        
        {/* Capture Button (Visible on Hover) */}
        {onCapture && !isLoading && (
          <button
            onClick={captureSnapshot}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border-4 border-black p-4 rounded-full shadow-brutal hover:scale-110 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
            title="Capture Snapshot"
          >
            <div className="w-4 h-4 bg-red-500 rounded-full" />
          </button>
        )}
      </div>
      <div className="p-2 text-sm font-mono border-t-2 border-black mt-2">
        Status: {isLoading ? 'Initializing...' : error ? 'Error' : 'Running'}
      </div>
    </div>
  );
};
