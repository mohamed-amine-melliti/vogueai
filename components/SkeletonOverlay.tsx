import React, { useRef, useEffect } from 'react';
import { Keypoint } from '@tensorflow-models/pose-detection';

interface SkeletonOverlayProps {
  keypoints: Keypoint[];
  width: number;
  height: number;
}

export const SkeletonOverlay: React.FC<SkeletonOverlayProps> = ({ keypoints, width, height }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const requestRef = useRef<number>();

  // Neo-Brutalist Colors
  const COLORS = {
    bone: '#FACC15',    // Yellow
    joint: '#A78BFA',   // Purple
    border: '#000000',  // Black
    bg: 'transparent'
  };

  const STYLES = {
    boneWidth: 8,
    jointRadius: 8,
    borderWidth: 3
  };

  const drawSkeleton = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // If we have no keypoints, stop
    if (keypoints.length === 0) return;

    // Use keypoints directly as they are now smoothed by the parent
    const smoothedKeypoints = keypoints;

    const connections = [
      ['left_shoulder', 'right_shoulder'],
      ['left_shoulder', 'left_elbow'],
      ['left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow'],
      ['right_elbow', 'right_wrist'],
      ['left_shoulder', 'left_hip'],
      ['right_shoulder', 'right_hip'],
      ['left_hip', 'right_hip'],
      ['left_hip', 'left_knee'],
      ['right_hip', 'right_knee'],
      ['left_knee', 'left_ankle'],
      ['right_knee', 'right_ankle']
    ];

    // Draw Bones (Lines)
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    connections.forEach(([start, end]) => {
      const startKp = smoothedKeypoints.find(kp => kp.name === start);
      const endKp = smoothedKeypoints.find(kp => kp.name === end);

      if (startKp && endKp && (startKp.score ?? 0) > 0.3 && (endKp.score ?? 0) > 0.3) {
        // Draw border (stroke)
        ctx.beginPath();
        ctx.moveTo(startKp.x, startKp.y);
        ctx.lineTo(endKp.x, endKp.y);
        ctx.lineWidth = STYLES.boneWidth + STYLES.borderWidth * 2;
        ctx.strokeStyle = COLORS.border;
        ctx.stroke();

        // Draw inner line
        ctx.beginPath();
        ctx.moveTo(startKp.x, startKp.y);
        ctx.lineTo(endKp.x, endKp.y);
        ctx.lineWidth = STYLES.boneWidth;
        ctx.strokeStyle = COLORS.bone;
        ctx.stroke();
      }
    });

    // Draw Joints (Circles)
    smoothedKeypoints.forEach(keypoint => {
      if ((keypoint.score ?? 0) > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, STYLES.jointRadius, 0, 2 * Math.PI);
        
        // Border
        ctx.lineWidth = STYLES.borderWidth;
        ctx.strokeStyle = COLORS.border;
        ctx.stroke();
        
        // Fill
        ctx.fillStyle = COLORS.joint;
        ctx.fill();
      }
    });

    requestRef.current = requestAnimationFrame(drawSkeleton);
  };

  useEffect(() => {
    // Start the animation loop
    requestRef.current = requestAnimationFrame(drawSkeleton);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [keypoints]); // Re-bind when keypoints update target, but loop continues

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute top-0 left-0 pointer-events-none"
      style={{ transform: 'scaleX(-1)' }} // Mirror effect
    />
  );
};
