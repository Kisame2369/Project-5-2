import { ContactCollection } from '../db/Contact.js';

export function getAllContacts(){
  return ContactCollection.find();
};

export function getContactById(id) {
  return ContactCollection.findById(id);
};

export function createContact(payload) {
  return ContactCollection.create(payload);
}

export function deleteContact(id) {
  return ContactCollection.findByIdAndDelete(id);
}

export function updateContact(id, payload) {
  return ContactCollection.findByIdAndUpdate(id, payload, { new: true });
}