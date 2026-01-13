import { NextRequest, NextResponse } from 'next/server';
import { db } from '@boda/lib/db';
import { media } from '@boda/db/schema';
import { eq } from 'drizzle-orm';
import { r2Client, R2_BUCKET_NAME, GetObjectCommand } from '@boda/lib/r2';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mediaId = searchParams.get('id');

    if (!mediaId) {
      return NextResponse.json(
        { success: false, error: 'ID de media requerido' },
        { status: 400 }
      );
    }

    // Obtener info del media desde la base de datos
    const mediaItem = await db
      .select()
      .from(media)
      .where(eq(media.id, mediaId))
      .limit(1);

    if (mediaItem.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Archivo no encontrado' },
        { status: 404 }
      );
    }

    const item = mediaItem[0];

    // Obtener el archivo desde R2
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: item.filename,
    });

    const response = await r2Client.send(command);

    if (!response.Body) {
      return NextResponse.json(
        { success: false, error: 'Error al obtener el archivo' },
        { status: 500 }
      );
    }

    // Convertir el stream a un ArrayBuffer
    const chunks: Uint8Array[] = [];
    const reader = response.Body.transformToWebStream().getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }

    const buffer = Buffer.concat(chunks);

    // Crear la respuesta con headers de descarga
    const headers = new Headers();
    headers.set('Content-Type', item.mimeType);
    headers.set('Content-Length', String(buffer.length));
    headers.set(
      'Content-Disposition',
      `attachment; filename="${encodeURIComponent(item.originalName)}"`
    );
    headers.set('Cache-Control', 'private, max-age=3600');

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error('Error downloading file:', error);
    return NextResponse.json(
      { success: false, error: 'Error al descargar el archivo' },
      { status: 500 }
    );
  }
}
