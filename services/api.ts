import { TryOnResult } from '../types';

// Simulating an API service
class ApiService {
  async tryOn(personImage: Blob, garmentImage: string | File): Promise<string> {
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // For demo purposes, we just return the original person image
        // In a real app, this would return the URL of the processed image from the backend
        const url = URL.createObjectURL(personImage);
        resolve(url); 
      }, 3000);
    });
  }

  async estimateDepth(image: Blob): Promise<string> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("depth-map-mock-data");
      }, 1500);
    });
  }
}

export const api = new ApiService();

export class WebSocketManager {
  private ws: WebSocket | null = null;
  private onFrame: ((frame: string) => void) | null = null;
  private onError: ((err: Event) => void) | null = null;
  private reconnectInterval: any = null;

  connect(url: string, onFrame: (frame: string) => void, onError: (err: Event) => void) {
    this.onFrame = onFrame;
    this.onError = onError;

    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WS Connected');
        if (this.reconnectInterval) clearInterval(this.reconnectInterval);
      };

      this.ws.onmessage = (event) => {
        if (this.onFrame) this.onFrame(event.data);
      };

      this.ws.onerror = (err) => {
        console.error('WS Error', err);
        if (this.onError) this.onError(err);
      };

      this.ws.onclose = () => {
        console.log('WS Closed');
        this.attemptReconnect(url);
      };
    } catch (e) {
      // Fallback for demo when no backend is running
      console.warn("WebSocket connection failed (expected in demo).");
    }
  }

  sendFrame(frame: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'frame', data: frame }));
    } else {
      // Mock echo back for demo if offline
      if (this.onFrame) {
         // Simulate slight processing delay and return the frame
         setTimeout(() => this.onFrame && this.onFrame(frame), 50);
      }
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    if (this.reconnectInterval) clearInterval(this.reconnectInterval);
  }

  private attemptReconnect(url: string) {
    this.reconnectInterval = setInterval(() => {
      console.log('Attempting reconnect...');
      // logic to reconnect
    }, 5000);
  }
}
