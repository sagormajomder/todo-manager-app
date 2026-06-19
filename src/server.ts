import app from '@/app.js';
import connectDB from '@/config/db.js';
import env from '@/config/env.js';
import { SHUTDOWN_TIMEOUT } from '@/utils/constants.js';
import mongoose from 'mongoose';
import type { Server } from 'node:http';

const port = env.PORT;
let server: Server;

async function gracefulShutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  // Force exit if draining takes too long
  const forceExitTimer = setTimeout(() => {
    console.error('Shutdown timed out. Forcing exit.');
    process.exit(1);
  }, SHUTDOWN_TIMEOUT);
  forceExitTimer.unref();

  try {
    // Stop accepting new connections and drain in-flight requests
    await new Promise<void>((resolve, reject) => {
      server.close(err => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Close database connection
    await mongoose.connection.close();
    console.log('Server shut down gracefully.');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandled Rejection at ${promise}, reason:`, reason);
  gracefulShutdown('unhandledRejection');
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
  } catch (error) {
    console.error('Unexpected server startup error');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

startServer();
