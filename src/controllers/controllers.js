import createHttpError from 'http-errors';

import { getAllContacts, getContactById, createContact, deleteContact, updateContact} from '../service/contacts.js';
import { parsePagintionsParams } from '../utils/parsePagintionsParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';


export async function getAllContactsController(req, res) {
    
  const { page, perPage } = parsePagintionsParams(req.query);  

  const { sortBy, sortOrder } = parseSortParams(req.query);

  const contacts = await getAllContacts(page, perPage, sortBy, sortOrder, req.user.id);

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });

};
 
export async function getContactByIdController(req, res) {
    
  const contact = await getContactById(req.params.id, req.user.id);

    if (contact === null) {
        throw new createHttpError.NotFound('Contact not found');
  };
   
    
  res.json({
    status: 200,
    message: `Successfully found contact!`,
    data: contact,
  });
};

export async function createContactController(req, res) {

  const contact = await createContact({ ...req.body, userId: req.user.id });

    res.status(201).json({
      status: 201,
      message: 'Successfully created contact!',
      data: contact,
    });
}

export async function deleteContactController(req, res) {

    const contact = await deleteContact(req.params.id, req.user.id);

    if (contact === null) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.status(204).send();
};

export async function updateContactController(req, res) {

    const contact = await updateContact(req.params.id, req.body, req.user.id);

    if (contact === null) {
      throw new createHttpError.NotFound('Contact not found');
    }

    res.json({
      status: 200,
      message: 'Successfully updated contact!',
      data: contact,
    });
}
