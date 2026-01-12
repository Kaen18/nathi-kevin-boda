import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { uploadToR2 } from '@boda/lib/r2';
import { db } from '@boda/lib/db';
import { media, tags, mediaTags } from '@boda/db/schema';
import { eq } from 'drizzle-orm';
import { getMediaType, sanitizeFilename } from '@boda/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const tagsJson = formData.get('tags') as string | null;

    // Validar archivo
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Validar tamaño (100MB)
    if (file.size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'El archivo excede el tamaño máximo de 100MB' },
        { status: 400 }
      );
    }

    // Validar tipo
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/heic',
      'image/heif',
      'video/mp4',
      'video/quicktime',
      'video/webm',
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const fileId = uuidv4();
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filename = `${fileId}.${extension}`;

    // Convertir archivo a Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Subir a R2
    const { url, key } = await uploadToR2(buffer, filename, file.type);

    // Determinar tipo de media
    const mediaType = getMediaType(file.type);

    // Guardar en base de datos
    const newMedia = {
      id: fileId,
      filename: key,
      originalName: sanitizeFilename(file.name),
      url,
      type: mediaType,
      mimeType: file.type,
      size: file.size,
      uploadedAt: new Date(),
    };

    await db.insert(media).values(newMedia);

    // Procesar tags si se proporcionaron
    const selectedTags: string[] = tagsJson ? JSON.parse(tagsJson) : [];
    const mediaTagsData: { id: string; name: string; isDefault: boolean }[] = [];

    for (const tagName of selectedTags) {
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
    console.error('Error en upload:', error);
    return NextResponse.json(
      { success: false, error: 'Error al subir el archivo' },
      { status: 500 }
    );
  }
}