import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getPresignedUploadUrl } from '@boda/lib/r2';

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { filename, contentType, size } = body;

    // Validar campos requeridos
    if (!filename || !contentType || !size) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos requeridos' },
        { status: 400 }
      );
    }

    // Validar tamaño (100MB)
    if (size > 100 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'El archivo excede el tamaño máximo de 100MB' },
        { status: 400 }
      );
    }

    // Validar tipo
    if (!allowedTypes.includes(contentType)) {
      return NextResponse.json(
        { success: false, error: 'Tipo de archivo no permitido' },
        { status: 400 }
      );
    }

    // Generar nombre único
    const fileId = uuidv4();
    const extension = filename.split('.').pop()?.toLowerCase() || 'jpg';
    const uniqueFilename = `${fileId}.${extension}`;

    // Obtener URL pre-firmada
    const { uploadUrl, publicUrl, key } = await getPresignedUploadUrl(
      uniqueFilename,
      contentType
    );

    return NextResponse.json({
      success: true,
      data: {
        fileId,
        uploadUrl,
        publicUrl,
        key,
      },
    });
  } catch (error) {
    console.error('Error generando URL pre-firmada:', error);
    return NextResponse.json(
      { success: false, error: 'Error al generar URL de subida' },
      { status: 500 }
    );
  }
}
