/**
 * Simple 1D Kalman Filter implementation
 * Optimized for real-time tracking of noisy signals (like webcam keypoints)
 */
class KalmanFilter {
  private x: number; // State estimate
  private p: number; // Estimation error covariance
  private q: number; // Process noise covariance (jitter)
  private r: number; // Measurement noise covariance (lag vs smoothness)
  private k: number; // Kalman gain

  constructor(q: number = 1, r: number = 10, initialValue: number = 0) {
    this.q = q;
    this.r = r;
    this.x = initialValue;
    this.p = 0;
    this.k = 0;
  }

  /**
   * Update the filter with a new measurement
   * @param measurement The raw value from the sensor/detector
   * @returns The smoothed estimated value
   */
  public filter(measurement: number): number {
    // Prediction update
    this.p = this.p + this.q;

    // Measurement update
    this.k = this.p / (this.p + this.r);
    this.x = this.x + this.k * (measurement - this.x);
    this.p = (1 - this.k) * this.p;

    return this.x;
  }

  public reset(value: number) {
    this.x = value;
    this.p = 0;
  }
}

interface Keypoint {
  x: number;
  y: number;
  score?: number;
  name?: string;
}

/**
 * Manages Kalman filters for all body keypoints
 */
export class PoseSmoother {
  private xFilters: Map<string, KalmanFilter>;
  private yFilters: Map<string, KalmanFilter>;
  
  // Configuration for tuning
  // q: Process noise. Lower = assumes constant position. Higher = assumes movement.
  // r: Measurement noise. Higher = more smoothing (laggy). Lower = more responsive (jittery).
  private config: { q: number; r: number };

  constructor(config = { q: 0.1, r: 2.5 }) {
    this.xFilters = new Map();
    this.yFilters = new Map();
    this.config = config;
  }

  /**
   * Smooths an array of keypoints
   * @param keypoints Raw keypoints from the detector
   * @returns Smoothed keypoints array
   */
  public smooth(keypoints: Keypoint[]): Keypoint[] {
    return keypoints.map((kp) => {
      // Use name as ID, or fallback to index if we were tracking by index (not implemented here)
      // BlazePose keypoints usually have names.
      const id = kp.name || `kp_${keypoints.indexOf(kp)}`;

      let xFilter = this.xFilters.get(id);
      let yFilter = this.yFilters.get(id);

      // Initialize filters if they don't exist
      if (!xFilter || !yFilter) {
        xFilter = new KalmanFilter(this.config.q, this.config.r, kp.x);
        yFilter = new KalmanFilter(this.config.q, this.config.r, kp.y);
        this.xFilters.set(id, xFilter);
        this.yFilters.set(id, yFilter);
      }

      // If confidence is very low, we might want to reset the filter or skip smoothing
      // But for now, we just filter everything to prevent "teleporting" when confidence flickers
      const smoothedX = xFilter.filter(kp.x);
      const smoothedY = yFilter.filter(kp.y);

      return {
        ...kp,
        x: smoothedX,
        y: smoothedY,
      };
    });
  }
  
  /**
   * Reset filters (useful when camera restarts or user changes)
   */
  public reset() {
    this.xFilters.clear();
    this.yFilters.clear();
  }
}
