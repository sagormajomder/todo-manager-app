import app from '@/app.js';
import connectDB from '@/config/db.js';
import env from '@/config/env.js';
import { SHUTDOWN_TIMEOUT } from '@/utils/constants.js';
import mongoose from 'mongoose';
import type { Server } from 'node:http';

const port = env.PORT;
let server: Server;
let hasError = false;

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Force exit if draining takes too long
  const forceExitTimer = setTimeout(() => {
    console.error('Shutdown timed out. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  forceExitTimer.unref();

  // Stop accepting new connections and drain in-flight requests
  try {
    if (server) {
      await new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()));
      });
      console.log('Server is successfully close');
    }
  } catch (err) {
    console.error('   ✗ Error closing HTTP server:', err);
    hasError = true;
  }

  // Close database connection
  try {
    await mongoose.connection.close();
    console.log('Database connection successfully close');
  } catch (error) {
    console.error('Error during Database closing:', error);
    hasError = true;
  }

  console.log('Shutdown complete');
  process.exit(hasError ? 1 : 0);
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason: unknown) => {
  console.error(`Unhandled Rejection reason:`, reason);
  gracefulShutdown('UNHANDLED_REJECTION');
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

const handleServerError = (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`Permission denied for port ${port}`);
  } else {
    console.error('Server failed to start');
  }

  console.error(error);
  process.exit(1);
};

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    server.on('error', handleServerError);

    server.keepAliveTimeout = 65_000;
    server.headersTimeout = 66_000;
  } catch (error) {
    console.error('Unexpected server startup error', error);
    process.exit(1);
  }
};

startServer();
