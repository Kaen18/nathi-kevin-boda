import { NextRequest, NextResponse } from 'next/server';
import { db } from '@boda/lib/db';
import { media, tags, mediaTags } from '@boda/db/schema';
import { eq, desc, asc, inArray, and, SQL } from 'drizzle-orm';
import type { Media, MediaResponse, ApiResponse } from '@boda/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tagsFilter = searchParams.get('tags');
    const typeFilter = searchParams.get('type');
    const sortBy = searchParams.get('sortBy') || 'newest';
    const limit = 20;

    // Construir condiciones de filtro
    const conditions: SQL[] = [];

    // Filtrar por tipo
    if (typeFilter && typeFilter !== 'all') {
      conditions.push(eq(media.type, typeFilter as 'photo' | 'video'));

    }

    // Filtrar por tags (usando IDs de tags)
    if (tagsFilter) {
      const tagIds = tagsFilter.split(',');
      const mediaIdsWithTags = db
        .select({ mediaId: mediaTags.mediaId })
        .from(mediaTags)
        .where(inArray(mediaTags.tagId, tagIds));
  
      conditions.push(inArray(media.id, mediaIdsWithTags));
    }

    // Construir y ejecutar query
    const orderBy = sortBy === 'oldest' ? asc(media.uploadedAt) : desc(media.uploadedAt);
    
    const results = await db
      .select({
        id: media.id,
        filename: media.filename,
        originalName: media.originalName,
        url: media.url,
        type: media.type,
        mimeType: media.mimeType,
        size: media.size,
        width: media.width,
        height: media.height,
        duration: media.duration,
        uploadedAt: media.uploadedAt,
      })
      .from(media)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(orderBy)
      .limit(limit + 1);

    // Verificar si hay más resultados
    const hasMore = results.length > limit;
    const mediaList = hasMore ? results.slice(0, limit) : results;

    // Obtener tags para cada media
    const mediaWithTags: Media[] = await Promise.all(
      mediaList.map(async (m) => {
        const tagsResult = await db
          .select({
            id: tags.id,
            name: tags.name,
            isDefault: tags.isDefault,
          })
          .from(mediaTags)
          .innerJoin(tags, eq(tags.id, mediaTags.tagId))
          .where(eq(mediaTags.mediaId, m.id));

        return {
          ...m,
          tags: tagsResult,
        } as Media;
      })
    );

    const response: ApiResponse<MediaResponse> = {
      success: true,
      data: {
        media: mediaWithTags,
        total: mediaWithTags.length,
        hasMore,
        nextCursor: hasMore ? mediaList[mediaList.length - 1]?.id : undefined,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching media:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los medios' },
      { status: 500 }
    );
  }
}
