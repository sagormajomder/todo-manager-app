import app from '@/app.js';
import connectDB from '@/config/db.js';
import env from '@/config/env.js';

const port = env.PORT;

process.on('unhandledRejection', (reason, promise) => {
  console.error(`Unhandle Rejection at ${promise}, reason : ${reason}`);
  process.exit(1);
});

process.on('uncaughtException', (err: Error) => {
  console.error('Uncaught exception is :', err.message);
  console.error(err.stack);
  process.exit(1);
});

const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    const server = app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      } else {
        console.error('Server error: ', err.message);
      }
      process.exit(1);
    });
  } catch (error) {
    console.error('Server failed to start');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }
    process.exit(1);
  }
};

startServer();
