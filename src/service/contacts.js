import { ContactCollection } from '../db/Contact.js';

export function getAllContacts(page, perPage, sortBy, sortOrder) {

  const skip = page > 0 ? (page - 1) * perPage : 0;

  const contacts = ContactCollection.find().sort({ [sortBy]: sortOrder }).skip(skip).limit(perPage);
  const total = ContactCollection.countDocuments();
  const totalPages = Math.ceil(total / perPage);

  return {
    contacts,
    total,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
  
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