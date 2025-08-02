import { ContactCollection } from '../db/Contact.js';

export async function getAllContacts(page, perPage, sortBy, sortOrder, userId) {

  const skip = page > 0 ? (page - 1) * perPage : 0;

  const data = await ContactCollection.find().where("userId").equal(userId).sort({ [sortBy]: sortOrder }).skip(skip).limit(perPage);
  const totalItems = await ContactCollection.countDocuments();
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
  
};

export function getContactById(id, userId) {
  return ContactCollection.findById( { _id: id, userId } );
};

export function createContact(payload) {
  return ContactCollection.create(payload);
}

export function deleteContact(id, userId) {
  return ContactCollection.findByIdAndDelete( {_id:id, userId});
}

export function updateContact(id, userId, payload) {
  return ContactCollection.findByIdAndUpdate(
    { _id: id, userId },
    payload,
    { new: true }
  );
}