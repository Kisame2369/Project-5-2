import createHttpError from 'http-errors';
import { isValidObjectId } from 'mongoose';

export function isValidID(req, res, next) {
  if (isValidObjectId(req.params.id) !== true) {
    throw createHttpError(400, 'Bad Request');
  }

  next();
}