import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
import { relations } from 'drizzle-orm';

// Tabla de medios (fotos y videos)
export const media = sqliteTable('media', {
  id: text('id').primaryKey(),
  filename: text('filename').notNull(),
  originalName: text('original_name').notNull(),
  url: text('url').notNull(),
  type: text('type', { enum: ['photo', 'video'] }).notNull(),
  mimeType: text('mime_type').notNull(),
  size: integer('size').notNull(),
  width: integer('width'),
  height: integer('height'),
  duration: integer('duration'), // Para videos, en segundos
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).notNull(),
});

// Tabla de etiquetas
export const tags = sqliteTable('tags', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique(),
  isDefault: integer('is_default', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tabla de relación media-tags (muchos a muchos)
export const mediaTags = sqliteTable(
  'media_tags',
  {
    mediaId: text('media_id')
      .notNull()
      .references(() => media.id, { onDelete: 'cascade' }),
    tagId: text('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.mediaId, table.tagId] }),
  })
);

// Relaciones
export const mediaRelations = relations(media, ({ many }) => ({
  mediaTags: many(mediaTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  mediaTags: many(mediaTags),
}));

export const mediaTagsRelations = relations(mediaTags, ({ one }) => ({
  media: one(media, {
    fields: [mediaTags.mediaId],
    references: [media.id],
  }),
  tag: one(tags, {
    fields: [mediaTags.tagId],
    references: [tags.id],
  }),
}));

// Tipos inferidos
export type Media = typeof media.$inferSelect;
export type NewMedia = typeof media.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type MediaTag = typeof mediaTags.$inferSelect;
export type NewMediaTag = typeof mediaTags.$inferInsert;
