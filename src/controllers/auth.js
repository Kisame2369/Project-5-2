import { registerUser } from "../service/auth.js";
import { loginUser } from "../service/auth.js";
import { logoutUser } from "../service/auth.js"; 
import { refreshUserSession } from "../service/auth.js";   

export async function authController(req, res) {
 const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: 'User registered successfully',
        data: user,
    });
};

export async function loginController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);
    console.log(session);

    res.cookie('sessionID', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in!',
        data: {
            accessToken: session.accessToken,
        },
    });
};

export async function logoutController(req, res) {

    const sessionId = req.cookies.sessionID;
    
    if (typeof sessionId !== 'undefined') {
        await logoutUser(sessionId);
    }

    res.clearCookie('sessionID');
    res.clearCookie('refreshToken');

    res.status(204).send();
};

export async function refreshController(req, res) { 
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUserSession(sessionId, refreshToken);

     res.cookie('sessionID', session._id, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expire: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
};