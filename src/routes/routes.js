import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {validateBody} from '../middlewares/validateBody.js';
import { getAllContactsController, getContactByIdController, createContactController, deleteContactController, updateContactController } from '../controllers/controllers.js';
import { contactSchema, contactUpdateSchema } from '../validation/schema.js';
import { isValidID } from '../middlewares/isValidID.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));
router.get('/:id', isValidID, ctrlWrapper(getContactByIdController));
router.post('/', upload.single('avatar'), validateBody(contactSchema), ctrlWrapper(createContactController));
router.delete('/:id', isValidID, ctrlWrapper(deleteContactController));
router.patch('/:id', isValidID, validateBody(contactUpdateSchema), ctrlWrapper(updateContactController));

export default router;