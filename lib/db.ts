import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@boda/db/schema';

// Crear cliente de Turso
const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Crear instancia de Drizzle con el esquema
export const db = drizzle(client, { schema });

// Exportar el cliente para operaciones directas si es necesario
export { client };
