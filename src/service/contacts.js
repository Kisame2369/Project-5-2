import { ContactCollection } from '../db/Contact.js';

export async function getAllContacts(page, perPage, sortBy, sortOrder, userId) {
  const skip = page > 0 ? (page - 1) * perPage : 0;

  const data = await ContactCollection
    .find({ userId })
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(perPage);
    
  const totalItems = await ContactCollection.countDocuments({ userId });
  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    totalItems,
    page,
    perPage,
    totalPages,
    hasNextPage: totalPages > page,
    hasPreviousPage: page > 1,
  };
}

export function getContactById(id, userId) {
  return ContactCollection.findOne({ _id: id, userId });
}

export function createContact(payload) {
  return ContactCollection.create(payload);
}

export function deleteContact(id, userId) {
  return ContactCollection.findOneAndDelete({ _id: id, userId });
}

export function updateContact(id, userId, payload) {
  return ContactCollection.findOneAndUpdate(
    { _id: id, userId },
    payload,
    { new: true }
  );
}