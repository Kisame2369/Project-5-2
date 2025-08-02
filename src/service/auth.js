import { UserCollection } from "../db/user.js";
import { SessionCollection } from "../db/session.js";
import createHtttpError from "http-errors";
import bcrypt from "bcrypt";

export async function registerUser(payload) {
    const user = await UserCollection.findOne({ email: payload.email });

    if (user !== null) {
        throw new createHtttpError.Conflict('User with this email already exists');
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    return UserCollection.create(payload);
};

export async function loginUser(email, password) {
    const user = await UserCollection.findOne({ email });
    
    if (user === null) {
        throw new createHtttpError.NotFound('Email or password is incorrect');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new createHtttpError.Unauthorized('Email or password is incorrect');
    }

    await SessionCollection.deleteOne({ userId: user._id });

    return SessionCollection.create({
        userId: user._id,
        accessToken: "AccessToken", 
        refreshTokn: "RefreshToken",
        accessTokenValidUntil: new Date(Date.now() + 10 * 60 * 1000),
        refreshTokenValidUntil: new Date(Date.now() + 24 * 60 * 60 * 1000), 
    });
};