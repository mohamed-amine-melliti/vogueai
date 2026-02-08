import React, { useRef, useEffect, useState } from 'react';
import { Keypoint } from '@tensorflow-models/pose-detection';

interface GarmentOverlayProps {
  keypoints: Keypoint[];
  width: number;
  height: number;
  garmentSrc: string; // URL to the garment PNG
}

export const GarmentOverlay: React.FC<GarmentOverlayProps> = ({ 
  keypoints, 
  width, 
  height, 
  garmentSrc 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const garmentImgRef = useRef<HTMLImageElement | null>(null);
  const requestRef = useRef<number>();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  // Preload image
  useEffect(() => {
    let isActive = true;
    const img = new Image();
    img.src = garmentSrc;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      if (isActive) {
        garmentImgRef.current = img;
        setIsImageLoaded(true);
      }
    };

    return () => {
      isActive = false;
    };
  }, [garmentSrc]);

  const drawGarment = () => {
    const canvas = canvasRef.current;
    const img = garmentImgRef.current;
    
    if (!canvas || !img || !isImageLoaded) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // Need at least shoulders and hips to place a shirt
    // BlazePose IDs: 
    // 11: left_shoulder, 12: right_shoulder
    // 23: left_hip, 24: right_hip
    
    const leftShoulder = keypoints.find(kp => kp.name === 'left_shoulder');
    const rightShoulder = keypoints.find(kp => kp.name === 'right_shoulder');
    const leftHip = keypoints.find(kp => kp.name === 'left_hip');
    const rightHip = keypoints.find(kp => kp.name === 'right_hip');

    if (
      leftShoulder && rightShoulder && 
      (leftShoulder.score ?? 0) > 0.5 && (rightShoulder.score ?? 0) > 0.5
    ) {
      // 1. Calculate Center Point (between shoulders)
      const centerX = (leftShoulder.x + rightShoulder.x) / 2;
      const centerY = (leftShoulder.y + rightShoulder.y) / 2;

      // 2. Calculate Angle (Rotation)
      const dx = rightShoulder.x - leftShoulder.x;
      const dy = rightShoulder.y - leftShoulder.y;
      const angle = Math.atan2(dy, dx);

      // 3. Calculate Dimensions
      const shoulderWidth = Math.sqrt(dx * dx + dy * dy);
      
      // Calculate Torso Length if hips are available
      let garmentHeight;
      if (leftHip && rightHip && (leftHip.score ?? 0) > 0.3 && (rightHip.score ?? 0) > 0.3) {
        const hipCenterX = (leftHip.x + rightHip.x) / 2;
        const hipCenterY = (leftHip.y + rightHip.y) / 2;
        const torsoLength = Math.sqrt(
          Math.pow(hipCenterX - centerX, 2) + Math.pow(hipCenterY - centerY, 2)
        );
        // Garment usually extends from slightly above shoulder (neck) to slightly below hip
        // 1.4x torso length is a good heuristic for t-shirts
        garmentHeight = torsoLength * 1.5;
      } else {
        // Fallback if hips not visible: use aspect ratio from shoulder width
        const aspectRatio = img.height / img.width;
        garmentHeight = (shoulderWidth * 2.4) * aspectRatio;
      }

      // Widen the shirt relative to shoulder bones (bones are inside the flesh)
      const garmentWidth = shoulderWidth * 2.4;

      // 4. Draw
      ctx.save();
      
      // Translate to the center of the chest area
      ctx.translate(centerX, centerY);
      
      // Rotate
      ctx.rotate(angle);

      // Draw image centered horizontally
      // Offset vertically to start slightly above the shoulder line (for the neck/collar)
      // typically ~15-20% of the total garment height should be above the shoulder center
      const verticalOffset = -garmentHeight * 0.18;

      ctx.drawImage(
        img,
        -garmentWidth / 2, // X: move left by half width
        verticalOffset,    // Y: move up to place collar correctly
        garmentWidth,
        garmentHeight
      );

      ctx.restore();
    }

    requestRef.current = requestAnimationFrame(drawGarment);
  };

  useEffect(() => {
    if (isImageLoaded) {
      requestRef.current = requestAnimationFrame(drawGarment);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [keypoints, isImageLoaded]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ transform: 'scaleX(-1)' }} // Mirror effect to match video
    />
  );
};
