# Sistema de Subida de Archivos

## Resumen

El sistema utiliza **URLs pre-firmadas** para subir archivos directamente a Cloudflare R2, evitando los límites de tamaño de Vercel (4.5 MB).

## Límites

| Tipo | Límite |
|------|--------|
| Tamaño máximo por archivo | 100 MB |
| Formatos de imagen | JPEG, PNG, WebP, HEIC, HEIF |
| Formatos de video | MP4, MOV, WebM |

## Arquitectura

```
Cliente                    Vercel                    Cloudflare R2
   │                         │                            │
   ├─── 1. Solicitar URL ───►│                            │
   │    (POST /api/upload/   │                            │
   │     presign)            │                            │
   │◄── URL pre-firmada ─────│                            │
   │                         │                            │
   ├─────────── 2. Subir archivo directamente ───────────►│
   │                    (PUT a uploadUrl)                 │
   │◄──────────────── 200 OK ─────────────────────────────│
   │                         │                            │
   ├─── 3. Confirmar ───────►│                            │
   │    (POST /api/upload/   │                            │
   │     confirm)            │                            │
   │◄── Datos guardados ─────│                            │
```

## Endpoints

### 1. `POST /api/upload/presign`

Genera una URL pre-firmada para subir directamente a R2.

**Request Body:**
```json
{
  "filename": "foto.jpg",
  "contentType": "image/jpeg",
  "size": 10485760
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "fileId": "uuid-generado",
    "uploadUrl": "https://...r2.cloudflarestorage.com/...",
    "publicUrl": "https://tu-dominio.com/uploads/2026/01/uuid.jpg",
    "key": "uploads/2026/01/uuid.jpg"
  }
}
```

### 2. Subida directa a R2

El cliente sube el archivo directamente a la `uploadUrl` recibida.

```javascript
await fetch(uploadUrl, {
  method: 'PUT',
  headers: {
    'Content-Type': file.type,
  },
  body: file,
});
```

### 3. `POST /api/upload/confirm`

Confirma la subida y guarda los metadatos en la base de datos.

**Request Body:**
```json
{
  "fileId": "uuid-generado",
  "key": "uploads/2026/01/uuid.jpg",
  "publicUrl": "https://tu-dominio.com/uploads/2026/01/uuid.jpg",
  "originalName": "foto.jpg",
  "contentType": "image/jpeg",
  "size": 10485760,
  "selectedTags": ["Ceremonia", "Familia"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid-generado",
    "filename": "uploads/2026/01/uuid.jpg",
    "originalName": "foto.jpg",
    "url": "https://tu-dominio.com/uploads/2026/01/uuid.jpg",
    "type": "photo",
    "mimeType": "image/jpeg",
    "size": 10485760,
    "uploadedAt": "2026-01-16T...",
    "tags": [
      { "id": "...", "name": "Ceremonia", "isDefault": true },
      { "id": "...", "name": "Familia", "isDefault": true }
    ]
  }
}
```

## ¿Por qué URLs pre-firmadas?

### Problema
Vercel tiene un límite de **4.5 MB** para el body de las requests en funciones serverless. Esto impedía subir fotos y videos grandes.

### Solución
Las URLs pre-firmadas permiten:

1. **Subida directa**: El archivo va del navegador a R2 sin pasar por Vercel
2. **Sin límites de Vercel**: Solo se envían metadatos (< 1 KB) al servidor
3. **Mejor rendimiento**: Menos saltos de red
4. **Seguridad**: Las URLs expiran en 10 minutos

## Tipos MIME permitidos

```typescript
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
```

## Organización de archivos en R2

Los archivos se organizan por año y mes:

```
uploads/
  └── 2026/
      └── 01/
          ├── uuid1.jpg
          ├── uuid2.png
          └── uuid3.mp4
```

## Variables de entorno requeridas

```env
R2_ACCOUNT_ID=tu-account-id
R2_ACCESS_KEY_ID=tu-access-key
R2_SECRET_ACCESS_KEY=tu-secret-key
R2_BUCKET_NAME=nombre-del-bucket
R2_PUBLIC_URL=https://tu-dominio-publico.com
```

## Dependencias

- `@aws-sdk/client-s3` - Cliente S3 compatible con R2
- `@aws-sdk/s3-request-presigner` - Generación de URLs pre-firmadas
