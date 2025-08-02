import createHttpError from 'http-errors';
import { SessionCollection } from '../db/session';

export function auth(req, res, next) {
    const { autherization } = req.headers;
    
    if (typeof autherization !== 'string') {
        throw new createHttpError.Unauthorized('Please provie access token');
    };

    const [bearer, accessToken] = autherization.split(' ', 2);

    if (bearer !== 'Bearer' || typeof accessToken !== 'string') {
        throw new createHttpError.Unauthorized('Please provide access token');
    };

    const session = SessionCollection.findOne({ accessToken });
    
    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    };

    if (session.accessTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Access token expired');
    };

    const user = session.userId;
    
    if (user === null) {
        throw new createHttpError.Unauthorized('User not found');
    };

    req.user = {id: user._id, email: user.email};

    next();
};