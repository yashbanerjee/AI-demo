import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const databaseDir = join(root, 'data', 'pg');
const firstRun = !existsSync(databaseDir);

const pg = new EmbeddedPostgres({
  databaseDir,
  user: 'postgres',
  password: 'postgres',
  port: 5433,
  persistent: true,
});

if (firstRun) {
  console.log('Initialising Postgres data directory...');
  await pg.initialise();
}

await pg.start();
if (firstRun) {
  await pg.createDatabase('vedha');
}
console.log('Postgres running on port 5433 (database: vedha). Press Ctrl+C to stop.');

const stop = async () => {
  await pg.stop();
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
