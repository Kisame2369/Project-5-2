import express from 'express';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';

import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/controllers.js';

 const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:id', ctrlWrapper(getContactByIdController));
router.post('/', ctrlWrapper(createContactController));
router.delete('/:id', ctrlWrapper(deleteContactController));
router.patch('/:id', ctrlWrapper(updateContactController));

export default router;