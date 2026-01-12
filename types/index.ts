// Tipos para Media (fotos y videos)
export interface Media {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  type: 'photo' | 'video';
  size: number;
  mimeType: string;
  width?: number;
  height?: number;
  duration?: number; // Para videos, en segundos
  tags: Tag[];
  uploadedAt: Date;
}

// Tipos para Tags
export interface Tag {
  id: string;
  name: string;
  isDefault: boolean;
  count?: number;
}

// Estado de subida
export interface UploadProgress {
  fileId: string;
  filename: string;
  progress: number; // 0-100
  status: 'pending' | 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
}

// Respuesta de la API de media
export interface MediaResponse {
  media: Media[];
  total: number;
  hasMore: boolean;
  nextCursor?: string;
}

// Filtros de galería
export interface GalleryFilters {
  tags: string[];
  type: 'all' | 'photo' | 'video';
  sortBy: 'newest' | 'oldest';
}

// Estado de autenticación
export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  error?: string;
}

// Respuesta de API genérica
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Configuración del evento - PERSONALIZA AQUÍ
export const EVENT_CONFIG = {
  names: {
    partner1: 'Nathi',
    partner2: 'Kevin',
  },
  date: '07-02-26',
  monogram: 'NK',
  defaultTags: [
    'Ceremonia',
    'Fiesta',
    'Preparativos',
    'Novios',
    'Familia',
    'Amigos',
    'Momentos especiales',
  ],
};