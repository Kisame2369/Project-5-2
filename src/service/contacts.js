import { ContactCollection } from '../db/Contact.js';

export const getAllContacts = async () => {
  const contacts = ContactCollection.find();
  return contacts;
};

export const getContactById = async (id) => {
  const contact = ContactCollection.findById(id);
  return contact;
};