import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { db } from '@boda/lib/db';
import { media, tags, mediaTags } from '@boda/db/schema';
import { eq } from 'drizzle-orm';
import { getMediaType, sanitizeFilename } from '@boda/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileId, key, publicUrl, originalName, contentType, size, selectedTags } = body;

    // Validar campos requeridos
    if (!fileId || !key || !publicUrl || !originalName || !contentType || !size) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Determinar tipo de media
    const mediaType = getMediaType(contentType);

    // Guardar en base de datos
    const newMedia = {
      id: fileId,
      filename: key,
      originalName: sanitizeFilename(originalName),
      url: publicUrl,
      type: mediaType,
      mimeType: contentType,
      size: size,
      uploadedAt: new Date(),
    };

    await db.insert(media).values(newMedia);

    // Procesar tags si se proporcionaron
    const tagsToProcess: string[] = selectedTags || [];
    const mediaTagsData: { id: string; name: string; isDefault: boolean }[] = [];

    for (const tagName of tagsToProcess) {
      // Buscar si el tag existe
      let existingTag = await db
        .select()
        .from(tags)
        .where(eq(tags.name, tagName))
        .get();

      // Si no existe, crearlo
      if (!existingTag) {
        const tagId = uuidv4();
        await db.insert(tags).values({
          id: tagId,
          name: tagName,
          isDefault: false,
          createdAt: new Date(),
        });
        existingTag = { id: tagId, name: tagName, isDefault: false, createdAt: new Date() };
      }

      // Crear relación media-tag
      await db.insert(mediaTags).values({
        mediaId: fileId,
        tagId: existingTag.id,
      });

      mediaTagsData.push({
        id: existingTag.id,
        name: existingTag.name,
        isDefault: existingTag.isDefault ?? false,
      });
    }

    // Respuesta exitosa
    return NextResponse.json({
      success: true,
      data: {
        ...newMedia,
        tags: mediaTagsData,
      },
    });
  } catch (error) {
    console.error('Error confirmando upload:', error);
    return NextResponse.json(
      { success: false, error: 'Error al confirmar la subida' },
      { status: 500 }
    );
  }
}
