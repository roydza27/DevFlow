import 'dotenv/config';

import app from './app/app.js';
import { PORT } from './config/env.js';
import { getDB, closeDB } from './infrastructure/database/sqlite.js';
import {
  heraClient,
} from './infrastructure/hera/index.js';
import {
  stopAllWatchers,
} from './infrastructure/filesystem/watcher.service.js';

let server = null;

async function start() {
  try {
    // Initialize SQLite.
    getDB();

    // Start Hera state observation.
    await heraClient.start();

    server = app.listen(PORT, () => {
      console.log(
        `🚀 DevFlow API Service running on http://localhost:${PORT}`
      );
    });
  } catch (err) {
    console.error(
      'Failed to start DevFlow API Service:',
      err.message
    );

    await heraClient.stop().catch(() => {});
    closeDB();

    process.exit(1);
  }
}

function gracefulShutdown(signal) {
  console.log(
    `\nReceived ${signal}. Shutting down DevFlow API Service gracefully...`
  );

  stopAllWatchers();

  heraClient
    .stop()
    .catch((error) => {
      console.error('Failed to stop Hera:', error.message);
    })
    .finally(() => {
      if (server) {
        server.close(() => {
          console.log('HTTP server closed.');

          closeDB();

          process.exit(0);
        });
      } else {
        closeDB();
        process.exit(0);
      }
    });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));

await start();