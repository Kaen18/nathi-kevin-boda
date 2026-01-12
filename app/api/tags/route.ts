import { NextResponse } from 'next/server';
import { db } from '@boda/lib/db';
import { tags, mediaTags } from '@boda/db/schema';
import { sql, eq } from 'drizzle-orm';

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
