import 'dotenv/config';
import app from './app.js';
import { PORT } from './config/env.js';
import { getDB, closeDB } from './config/sqlite.js';
import { stopAllWatchers } from './services/watcherService.js';

let server = null;

try {
  // Initialize SQLite database
  getDB();

  server = app.listen(PORT, () => {
    console.log(`🚀 DevFlow API Service running on http://localhost:${PORT}`);
  });
} catch (err) {
  console.error('Failed to start DevFlow API Service:', err.message);
  process.exit(1);
}

// ── Graceful Shutdown ─────────────────────────────────────────────────────────
function gracefulShutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down DevFlow API Service gracefully...`);

  // Stop file watchers
  stopAllWatchers();

  // Close HTTP server
  if (server) {
    server.close(() => {
      console.log('HTTP server closed.');

      // Close database connection
      closeDB();

      process.exit(0);
    });
  } else {
    closeDB();
    process.exit(0);
  }
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));