'use client';

import { useGalleryStore } from '@boda/lib/store';
import type { Tag } from '@boda/types';
import { cn } from '@boda/lib/utils';

interface FilterTagsProps {
  tags: Tag[];
}

export default function FilterTags({ tags }: FilterTagsProps) {
  const { filters, setFilter } = useGalleryStore();

  const toggleTag = (tagId: string) => {
    const currentTags = filters.tags;
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId];
    
    setFilter('tags', newTags);
  };

  const setTypeFilter = (type: 'all' | 'photo' | 'video') => {
    setFilter('type', type);
  };

  return (
    <div className="space-y-4">
      {/* Filtro por tipo */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-charcoal/50 uppercase tracking-wider mr-2">
          Mostrar:
        </span>
        
        <button
          onClick={() => setTypeFilter('all')}
          className={cn(
            'tag-chip',
            filters.type === 'all' && 'active'
          )}
        >
          Todo
        </button>
        
        <button
          onClick={() => setTypeFilter('photo')}
          className={cn(
            'tag-chip',
            filters.type === 'photo' && 'active'
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Fotos
        </button>
        
        <button
          onClick={() => setTypeFilter('video')}
          className={cn(
            'tag-chip',
            filters.type === 'video' && 'active'
          )}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          Videos
        </button>
      </div>

      {/* Filtro por tags */}
      {tags.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-charcoal/50 uppercase tracking-wider mr-2">
            Etiquetas:
          </span>
          
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleTag(tag.id)}
              className={cn(
                'tag-chip',
                filters.tags.includes(tag.id) && 'active'
              )}
            >
              {tag.name}
              {tag.count !== undefined && (
                <span className="ml-1 opacity-60">({tag.count})</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}