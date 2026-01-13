import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

// Cliente de Cloudflare R2 (compatible con S3)
export const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!; // URL pública del bucket (dominio personalizado o r2.dev)

export { GetObjectCommand };

export interface UploadResult {
  url: string;
  key: string;
}

/**
 * Sube un archivo a Cloudflare R2
 * @param buffer - Buffer del archivo
 * @param filename - Nombre del archivo (ya debe ser único)
 * @param contentType - Tipo MIME del archivo
 * @returns URL pública y key del archivo subido
 */
export async function uploadToR2(
  buffer: Buffer,
  filename: string,
  contentType: string
): Promise<UploadResult> {
  // Organizar archivos por año/mes
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const key = `uploads/${year}/${month}/${filename}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  });

  await r2Client.send(command);

  // Construir URL pública
  const url = `${PUBLIC_URL}/${key}`;

  return { url, key };
}

/**
 * Genera una URL pública para un key existente
 */
export function getPublicUrl(key: string): string {
  return `${PUBLIC_URL}/${key}`;
}
