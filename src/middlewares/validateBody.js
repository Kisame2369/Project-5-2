import createHttpError from 'http-errors';

export function validateBody(schema) {
    return async (req, res, next) => {
        try {
            await schema.validateAsync(req.body, {
                abortEarly: false
            });

            next();
        }
        catch (error) {
            const validationErrors = error.details.map(detail => detail.message);
            
            next(new createHttpError.BadRequest(validationErrors));
         };
    };
};