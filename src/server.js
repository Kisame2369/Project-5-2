import express from 'express';
import cors from 'cors';
import pino from 'express-pino-logger';
import { getEnvVariable } from './utils/getEnvVariable.js';
import { getAllContacts, getContactById } from './service/contacts.js';

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

    app.get('/contacts', async (req, res) => {
        const contacts = await getAllContacts();
        res.json({
          status: 200,
          message: 'Successfully found contacts!',
          data: contacts,
        });
      });
    
      app.get('/contacts/:id', async (req, res) => {
        const { id } = req.params;
        const contact = await getContactById(id);
        if (!contact) {
          res.status(404).json({
            message: 'Contact not found',
          });
          return;
        }
        res.json({
          status: 200,
          message: `Successfully found contact with id: ${id}!`,
          data: contact,
        });
      });

    app.use((req, res, next) => {
        res.status(404).json({ status: 404, message: 'Not found' });
    });
};