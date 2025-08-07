import { UserCollection } from "../db/user.js";
import { SessionCollection } from "../db/session.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { getEnvVariable } from "../utils/getEnvVariable.js";
import { sendMail } from "../utils/sendMail.js";
import Handlebars from "handlebars";
import * as fs from 'node:fs';
import path from 'node:path';

const resetPasswordTemplatePath = fs.readFileSync(path.resolve('src/templates/reset-password-mail.hbs'), 'utf-8');
const resetPasswordTemplate = Handlebars.compile(resetPasswordTemplatePath);

const ACCESS_TOKEN_LIFETIME = 10 * 60 * 1000;
const REFRESH_TOKEN_LIFETIME = 24 * 60 * 60 * 1000; 

export async function registerUser(payload) {
    const user = await UserCollection.findOne({ email: payload.email });

    if (user !== null) {
        throw new createHttpError.Conflict('User with this email already exists');
    }

    payload.password = await bcrypt.hash(payload.password, 10);

    return UserCollection.create(payload);
}

export async function loginUser(email, password) {
    const user = await UserCollection.findOne({ email });
    
    if (user === null) {
        throw new createHttpError.NotFound('Email or password is incorrect');
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new createHttpError.Unauthorized('Email or password is incorrect');
    }

    const accessToken = crypto.randomBytes(32).toString("base64");
    const refreshToken = crypto.randomBytes(32).toString("base64");
    
    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    await SessionCollection.deleteOne({ userId: user._id });

    return SessionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });
}

export async function logoutUser(sessionId) {
    const session = await SessionCollection.findById(sessionId);
    
    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    }

    await SessionCollection.deleteOne({ _id: sessionId });
}

export async function refreshUserSession(sessionId, refreshToken) { 
    const session = await SessionCollection.findById(sessionId);

    if (session === null) {
        throw new createHttpError.Unauthorized('Session not found');
    }

    if (session.refreshToken !== refreshToken) {
        throw new createHttpError.Unauthorized('Invalid refresh token');
    }

    if (session.refreshTokenValidUntil < new Date()) {
        throw new createHttpError.Unauthorized('Refresh token expired');
    }

    const newAccessToken = crypto.randomBytes(32).toString("base64");
    const newRefreshToken = crypto.randomBytes(32).toString("base64");
    
    const accessTokenValidUntil = new Date(Date.now() + ACCESS_TOKEN_LIFETIME);
    const refreshTokenValidUntil = new Date(Date.now() + REFRESH_TOKEN_LIFETIME);

    await SessionCollection.deleteOne({ _id: session._id });

    return SessionCollection.create({
        userId: session.userId,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        accessTokenValidUntil,
        refreshTokenValidUntil,
    });
};

export async function sendResetPasswordEmail(email) {
    const user = await UserCollection.findOne({ email });

    if (user === null) {
        return;
    };

    const token = jwt.sign({
        sub: user._id,
        email: user.email,
        name: user.name,
    },
        getEnvVariable("JWT_SECRET"),
        
    {
        expiresIn: '5m',
    }
    );

    await sendMail({
        to: email,
        subject: 'Reset Password',
        html: resetPasswordTemplate({
            reserPasswordLink: `http://localhost:3000/auth/reset-password?token=${token}`,
        }),

    });


};

export async function resetPassword(token, password) {

    try {
        const decoded = jwt.verify(token, getEnvVariable('JWT_SECRET'));

        const user = await UserCollection.findById(decoded.sub);

        if (user === null) {
            throw new createHttpError.NotFound('User not found');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserCollection.findByIdAndUpdate(user._id, { password: hashedPassword });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new createHttpError.Unauthorized('Token is expired');
        }

        if (error.name === 'JsonWebTokenError') {
            throw new createHttpError.Unauthorized('Token is unauthorized');
        }

        throw error;
    }
};