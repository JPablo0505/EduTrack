import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

declare global {
  // eslint-disable-next-line no-var
  var dbInstance: Database.Database | undefined;
}

// Ubicar base de datos en la carpeta /data del proyecto
const DB_PATH = path.join(process.cwd(), 'data', 'edutrack.db');

// Asegurar la existencia del directorio contenedor
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

let db: Database.Database;

if (process.env.NODE_ENV === 'production') {
  db = new Database(DB_PATH);
} else {
  // Evitar múltiples conexiones abiertas por hot-reloads de Next.js en desarrollo
  if (!global.dbInstance) {
    global.dbInstance = new Database(DB_PATH);
  }
  db = global.dbInstance;
}

// Forzar llaves foráneas y activar modo WAL para lecturas/escrituras concurrentes eficientes
db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');

export default db;
export { DB_PATH };
