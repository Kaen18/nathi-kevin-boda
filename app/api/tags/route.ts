import { NextRequest, NextResponse } from 'next/server';
import { db } from '@boda/lib/db';
import { tags, mediaTags } from '@boda/db/schema';
import { sql, eq } from 'drizzle-orm';
import { nanoid } from 'nanoid';

export async function GET() {
  try {
    // Obtener todos los tags con conteo de medios
    const tagsWithCount = await db
      .select({
        id: tags.id,
        name: tags.name,
        isDefault: tags.isDefault,
        count: sql<number>`count(${mediaTags.mediaId})`.as('count'),
      })
      .from(tags)
      .leftJoin(mediaTags, eq(mediaTags.tagId, tags.id))
      .groupBy(tags.id, tags.name, tags.isDefault)
      .orderBy(tags.name);

    return NextResponse.json({
      success: true,
      data: tagsWithCount,
    });
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener los tags' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;

    // Validar que el nombre no esté vacío
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la etiqueta es requerido' },
        { status: 400 }
      );
    }

    const trimmedName = name.trim();

    // Validar longitud máxima
    if (trimmedName.length > 50) {
      return NextResponse.json(
        { success: false, error: 'El nombre de la etiqueta es muy largo (máx. 50 caracteres)' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una etiqueta con ese nombre (case insensitive)
    const existingTags = await db
      .select()
      .from(tags)
      .where(sql`lower(${tags.name}) = lower(${trimmedName})`);

    if (existingTags.length > 0) {
      // Si ya existe, retornar la etiqueta existente
      return NextResponse.json({
        success: true,
        data: {
          id: existingTags[0].id,
          name: existingTags[0].name,
          isDefault: existingTags[0].isDefault,
          count: 0,
        },
        existing: true,
      });
    }

    // Crear nueva etiqueta
    const newTag = {
      id: nanoid(),
      name: trimmedName,
      isDefault: false,
      createdAt: new Date(),
    };

    await db.insert(tags).values(newTag);

    return NextResponse.json({
      success: true,
      data: {
        id: newTag.id,
        name: newTag.name,
        isDefault: newTag.isDefault,
        count: 0,
      },
    });
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json(
      { success: false, error: 'Error al crear la etiqueta' },
      { status: 500 }
    );
  }
}
