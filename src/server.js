import express from 'express';
import cors from 'cors';
import pino from 'express-pino-logger';
import { getEnvVariable } from './utils/getEnvVariable.js';
import contactRoutes from './routes/routes.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

export default function setupServer() {

    const app = express();
    
    app.use(cors());

    app.use(
      pino({
        transport: {
          target: 'pino-pretty',
        },
      }),
  );
  
  app.use(express.json());
    
  const PORT = getEnvVariable('PORT') || 3000;
      
    app.listen(PORT, (error) => {
    
        if (error) {
            throw error;
        }
    
        console.log(`Server is running on port ${PORT}`);
    });

    app.use('/contacts', contactRoutes);

    app.use(notFoundHandler);
    app.use(errorHandler); 

};