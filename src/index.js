import { initMongoConnection } from './db/initMongoConnection.js';
import setupServer from './server.js';

const run = async () => {
  await initMongoConnection();
  setupServer();
};

run();