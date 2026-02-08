import { Garment } from './types';

export const API_BASE_URL = 'http://localhost:8000';
export const WS_URL = 'ws://localhost:8000/ws/live-tryon';

export const MOCK_GARMENTS: Garment[] = [
  {
    id: '1',
    name: 'Classic White Tee',
    category: 'shirt',
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '2',
    name: 'Denim Jacket',
    category: 'jacket',
    imageUrl: 'https://images.unsplash.com/photo-1551537482-f20963253d69?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '3',
    name: 'Floral Summer Dress',
    category: 'dress',
    imageUrl: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '4',
    name: 'Slim Fit Jeans',
    category: 'pants',
    imageUrl: 'https://images.unsplash.com/photo-1542272454315-4c01d7abdf4a?auto=format&fit=crop&w=500&q=80',
  },
  {
    id: '5',
    name: 'Black Hoodie',
    category: 'shirt',
    imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=500&q=80',
  }
];

export const DEMO_RESULTS_STORAGE_KEY = 'vogueai_results';
export const SETTINGS_STORAGE_KEY = 'vogueai_settings';
