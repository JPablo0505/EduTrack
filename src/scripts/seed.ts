import { runSeeds } from '../database/seeds';

try {
  runSeeds();
  console.log('Sembrado finalizado exitosamente desde script de comando.');
  process.exit(0);
} catch (error) {
  console.error('Error al ejecutar el sembrado:', error);
  process.exit(1);
}
