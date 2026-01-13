'use client';

import { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { useGalleryStore, useUploadStore } from '@boda/lib/store';
import { EVENT_CONFIG } from '@boda/types';
import { cn, generateId, formatFileSize, isValidFileType, getMediaType } from '@boda/lib/utils';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FilePreview {
  id: string;
  file: File;
  preview: string;
  type: 'photo' | 'video';
}

export default function UploadModal({ isOpen, onClose }: UploadModalProps) {
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTagInput, setCustomTagInput] = useState('');
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [isCreatingTag, setIsCreatingTag] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { tags: existingTags, addMedia, fetchTags, addTag } = useGalleryStore();
  const { addUpload, updateUpload } = useUploadStore();

  // Cargar tags existentes al abrir el modal
  useEffect(() => {
    if (isOpen) {
      fetchTags();
    }
  }, [isOpen, fetchTags]);

  // Combinar etiquetas predefinidas con las de la base de datos
  const allAvailableTags = [
    ...EVENT_CONFIG.defaultTags,
    ...existingTags
      .filter((t) => !EVENT_CONFIG.defaultTags.includes(t.name))
      .map((t) => t.name),
    ...customTags.filter(
      (t) => !EVENT_CONFIG.defaultTags.includes(t) && 
             !existingTags.some((et) => et.name === t)
    ),
  ];

  // Configurar dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    setError(null);
    
    const validFiles = acceptedFiles.filter((file) => {
      if (!isValidFileType(file.type)) {
        setError(`Archivo no permitido: ${file.name}`);
        return false;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB
        setError(`Archivo muy grande: ${file.name} (máx. 100MB)`);
        return false;
      }
      return true;
    });

    const newFiles: FilePreview[] = validFiles.map((file) => ({
      id: generateId(),
      file,
      preview: URL.createObjectURL(file),
      type: getMediaType(file.type),
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.heic', '.heif'],
      'video/*': ['.mp4', '.mov', '.webm'],
    },
    maxSize: 100 * 1024 * 1024, // 100MB
  });

  // Remover archivo
  const removeFile = (id: string) => {
    setFiles((prev) => {
      const file = prev.find((f) => f.id === id);
      if (file) URL.revokeObjectURL(file.preview);
      return prev.filter((f) => f.id !== id);
    });
  };

  // Toggle tag
  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  // Crear etiqueta personalizada
  const handleCreateCustomTag = async () => {
    const tagName = customTagInput.trim();
    
    if (!tagName) return;
    
    // Verificar que no exista ya
    if (allAvailableTags.some((t) => t.toLowerCase() === tagName.toLowerCase())) {
      setError('Esta etiqueta ya existe');
      return;
    }

    if (tagName.length > 50) {
      setError('La etiqueta es muy larga (máx. 50 caracteres)');
      return;
    }

    setIsCreatingTag(true);
    setError(null);

    try {
      const response = await fetch('/api/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tagName }),
      });

      const data = await response.json();

      if (data.success) {
        // Añadir al store global si no es existente
        if (!data.existing) {
          addTag(data.data);
        }
        
        // Añadir a las etiquetas personalizadas locales
        setCustomTags((prev) => [...prev, tagName]);
        
        // Seleccionar automáticamente la nueva etiqueta
        setSelectedTags((prev) => [...prev, tagName]);
        
        // Limpiar input
        setCustomTagInput('');
      } else {
        setError(data.error || 'Error al crear la etiqueta');
      }
    } catch {
      setError('Error al crear la etiqueta');
    } finally {
      setIsCreatingTag(false);
    }
  };

  // Manejar Enter en input de etiqueta
  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCreateCustomTag();
    }
  };

  // Subir archivos
  const handleUpload = async () => {
    if (files.length === 0) return;
    if (selectedTags.length === 0) {
      setError('Debes seleccionar al menos una etiqueta');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    const totalFiles = files.length;
    let uploadedCount = 0;

    for (const fileItem of files) {
      try {
        const formData = new FormData();
        formData.append('file', fileItem.file);
        formData.append('tags', JSON.stringify(selectedTags));

        const uploadId = generateId();
        addUpload({
          fileId: uploadId,
          filename: fileItem.file.name,
          progress: 0,
          status: 'uploading',
        });

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (data.success) {
          updateUpload(uploadId, { progress: 100, status: 'complete' });
          addMedia(data.data);
          uploadedCount++;
          setUploadProgress(Math.round((uploadedCount / totalFiles) * 100));
        } else {
          updateUpload(uploadId, { status: 'error', error: data.error });
          setError(`Error subiendo ${fileItem.file.name}: ${data.error}`);
        }
      } catch (err) {
        console.error('Error uploading:', err);
        setError(`Error subiendo ${fileItem.file.name}`);
      }
    }

    // Limpiar y cerrar
    setIsUploading(false);
    if (uploadedCount === totalFiles) {
      // Limpiar previews
      files.forEach((f) => URL.revokeObjectURL(f.preview));
      setFiles([]);
      setSelectedTags([]);
      setUploadProgress(0);
      fetchTags(); // Actualizar tags
      onClose();
    }
  };

  // Cerrar modal
  const handleClose = () => {
    if (isUploading) return;
    files.forEach((f) => URL.revokeObjectURL(f.preview));
    setFiles([]);
    setSelectedTags([]);
    setCustomTags([]);
    setCustomTagInput('');
    setError(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-charcoal/50 backdrop-blur-sm animate-fade-in"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-cream rounded-3xl shadow-elegant overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-floral-light/30">
          <h2 className="font-serif text-xl text-navy">Subir recuerdos</h2>
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 text-charcoal/50 hover:text-charcoal rounded-full hover:bg-charcoal/5 transition-all disabled:opacity-50"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Dropzone */}
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all',
              isDragActive
                ? 'border-navy bg-navy/5'
                : 'border-floral-light hover:border-floral hover:bg-floral/5'
            )}
          >
            <input {...getInputProps()} />
            <div className="flex flex-col items-center gap-3">
              <div className={cn(
                'w-16 h-16 rounded-full flex items-center justify-center transition-colors',
                isDragActive ? 'bg-navy/10 text-navy' : 'bg-floral-light/30 text-floral'
              )}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p className="font-serif text-lg text-navy">
                  {isDragActive ? '¡Suelta aquí!' : 'Arrastra tus fotos y videos'}
                </p>
                <p className="text-sm text-charcoal/50 mt-1">
                  o haz clic para seleccionar
                </p>
              </div>
              <p className="text-xs text-charcoal/40">
                JPG, PNG, HEIC, MP4, MOV • Máx. 100MB por archivo
              </p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* Preview de archivos */}
          {files.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-charcoal/60 mb-3">
                {files.length} archivo{files.length !== 1 && 's'} seleccionado{files.length !== 1 && 's'}
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {files.map((fileItem) => (
                  <div key={fileItem.id} className="relative group aspect-square rounded-xl overflow-hidden bg-charcoal/5">
                    {fileItem.type === 'photo' ? (
                      <img
                        src={fileItem.preview}
                        alt={fileItem.file.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-charcoal/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-charcoal/40" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                    
                    {/* Botón eliminar */}
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    {/* Info */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <p className="text-[10px] text-white truncate">{fileItem.file.name}</p>
                      <p className="text-[9px] text-white/70">{formatFileSize(fileItem.file.size)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selector de tags */}
          {files.length > 0 && (
            <div className="mt-6">
              <p className="text-sm text-charcoal/60 mb-3">
                Etiquetas <span className="text-red-500">*</span>
              </p>
              
              {/* Etiquetas disponibles */}
              <div className="flex flex-wrap gap-2 mb-4">
                {allAvailableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={cn(
                      'tag-chip',
                      selectedTags.includes(tag) && 'active'
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>

              {/* Input para crear etiqueta personalizada */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customTagInput}
                  onChange={(e) => {
                    setCustomTagInput(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={handleTagInputKeyDown}
                  placeholder="Crear nueva etiqueta..."
                  maxLength={50}
                  disabled={isCreatingTag}
                  className="flex-1 px-3 py-2 text-sm border border-floral-light rounded-xl focus:outline-none focus:ring-2 focus:ring-navy/20 focus:border-navy transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={handleCreateCustomTag}
                  disabled={!customTagInput.trim() || isCreatingTag}
                  className="px-4 py-2 text-sm bg-floral text-white rounded-xl hover:bg-floral-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                >
                  {isCreatingTag ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Añadir
                    </>
                  )}
                </button>
              </div>
              <p className="text-xs text-charcoal/40 mt-2">
                Puedes crear tus propias etiquetas para organizar mejor los recuerdos
              </p>
            </div>
          )}

          {/* Barra de progreso */}
          {isUploading && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-charcoal/60">Subiendo...</span>
                <span className="text-navy font-medium">{uploadProgress}%</span>
              </div>
              <div className="h-2 bg-floral-light/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-navy rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-floral-light/30 flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={isUploading}
            className="btn-secondary"
          >
            Cancelar
          </button>
          <button
            onClick={handleUpload}
            disabled={files.length === 0 || selectedTags.length === 0 || isUploading}
            className="btn-primary"
          >
            {isUploading ? 'Subiendo...' : `Subir ${files.length > 0 ? `(${files.length})` : ''}`}
          </button>
        </div>
      </div>
    </div>
  );
}