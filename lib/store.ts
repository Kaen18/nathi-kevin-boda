import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Media, Tag, GalleryFilters, UploadProgress } from '@boda/types';

// ============================================
// Auth Store - Maneja la autenticación
// ============================================
interface AuthStore {
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (code: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (code: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch('/api/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code }),
          });

          const data = await response.json();

          if (data.success) {
            set({ isAuthenticated: true, isLoading: false });
            return true;
          } else {
            set({ error: data.error || 'Código inválido', isLoading: false });
            return false;
          }
        } catch {
          set({ error: 'Error de conexión', isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({ isAuthenticated: false, error: null });
      },
    }),
    {
      name: 'nathi-kevin-auth', // Clave en localStorage
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated }),
    }
  )
);

// ============================================
// Gallery Store - Maneja la galería de medios
// ============================================
interface GalleryStore {
  media: Media[];
  tags: Tag[];
  filters: GalleryFilters;
  isLoading: boolean;
  hasMore: boolean;
  cursor: string | null;
  
  fetchMedia: (reset?: boolean) => Promise<void>;
  fetchTags: () => Promise<void>;
  setFilter: (key: keyof GalleryFilters, value: unknown) => void;
  addMedia: (newMedia: Media) => void;
  addTag: (tag: Tag) => void;
}

export const useGalleryStore = create<GalleryStore>((set, get) => ({
  media: [],
  tags: [],
  filters: {
    tags: [],
    type: 'all',
    sortBy: 'newest',
  },
  isLoading: false,
  hasMore: true,
  cursor: null,

  fetchMedia: async (reset = false) => {
    const { filters, cursor, media } = get();
    
    if (get().isLoading) return;
    
    set({ isLoading: true });

    try {
      const params = new URLSearchParams();
      if (filters.tags.length > 0) params.set('tags', filters.tags.join(','));
      if (filters.type !== 'all') params.set('type', filters.type);
      params.set('sortBy', filters.sortBy);
      if (!reset && cursor) params.set('cursor', cursor);

      const response = await fetch(`/api/media?${params}`);
      const data = await response.json();

      if (data.success) {
        set({
          media: reset ? data.data.media : [...media, ...data.data.media],
          hasMore: data.data.hasMore,
          cursor: data.data.nextCursor || null,
        });
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  fetchTags: async () => {
    try {
      const response = await fetch('/api/tags');
      const data = await response.json();
      
      if (data.success) {
        set({ tags: data.data });
      }
    } catch (error) {
      console.error('Error fetching tags:', error);
    }
  },

  setFilter: (key, value) => {
    set((state) => ({
      filters: { ...state.filters, [key]: value },
    }));
    get().fetchMedia(true);
  },

  addMedia: (newMedia) => {
    set((state) => ({
      media: [newMedia, ...state.media],
    }));
  },

  addTag: (tag) => {
    set((state) => ({
      tags: [...state.tags, tag],
    }));
  },
}));

// ============================================
// Upload Store - Maneja las subidas
// ============================================
interface UploadStore {
  uploads: UploadProgress[];
  isUploading: boolean;
  showModal: boolean;
  
  setShowModal: (show: boolean) => void;
  addUpload: (upload: UploadProgress) => void;
  updateUpload: (fileId: string, updates: Partial<UploadProgress>) => void;
  removeUpload: (fileId: string) => void;
  clearCompleted: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  uploads: [],
  isUploading: false,
  showModal: false,

  setShowModal: (show) => set({ showModal: show }),

  addUpload: (upload) => {
    set((state) => ({
      uploads: [...state.uploads, upload],
      isUploading: true,
    }));
  },

  updateUpload: (fileId, updates) => {
    set((state) => ({
      uploads: state.uploads.map((u) =>
        u.fileId === fileId ? { ...u, ...updates } : u
      ),
      isUploading: state.uploads.some(
        (u) => u.fileId !== fileId && 
              (u.status === 'uploading' || u.status === 'processing')
      ),
    }));
  },

  removeUpload: (fileId) => {
    set((state) => ({
      uploads: state.uploads.filter((u) => u.fileId !== fileId),
    }));
  },

  clearCompleted: () => {
    set((state) => ({
      uploads: state.uploads.filter((u) => u.status !== 'complete'),
    }));
  },
}));