import { registerUser, loginUser, logoutUser, refreshUserSession, sendResetPasswordEmail, resetPassword, loginOrRegister } from "../service/auth.js";
import { getGoogleAuthUrl, validateCode } from "../utils/googleOAuth.js";

export async function authController(req, res) {
    const user = await registerUser(req.body);
    res.status(201).json({
        status: 201,
        message: 'Successfully registered a user!',
        data: user,
    });
}

export async function loginController(req, res) {
    const session = await loginUser(req.body.email, req.body.password);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in an user!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function logoutController(req, res) {
    const sessionId = req.cookies.sessionId;
    
    if (sessionId) {
        await logoutUser(sessionId);
    }

    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
}

export async function refreshController(req, res) { 
    const { sessionId, refreshToken } = req.cookies;

    const session = await refreshUserSession(sessionId, refreshToken);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed a session!',
        data: {
            accessToken: session.accessToken,
        },
    });
}

export async function resetEmailPasswordController(req, res) {
    await sendResetPasswordEmail(req.body.email);
    res.status(200).json({
        status: 200,
        message: 'Reset password email sent successfully!',
    });
};

export async function resetPasswordController(req, res) {
    await resetPassword(req.body.token, req.body.password);
    res.status(200).json({
        status: 200,
        message: 'Password reset successfully!',
    });
};

export async function oauthController(req, res) {
    const url = await getGoogleAuthUrl();

    res.status(200).json({
        status: 200,
        message: 'Google OAuth URL generated successfully!',
        data: { oauth_url: url },
    });
};

export async function oauthConfirmController(req, res) { 
    const ticket = await validateCode(req.body.code);

    const session = await loginOrRegister(ticket.payload.email, ticket.payload.name);

    res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in or registered via OAuth!',
        data: {
            accessToken: session.accessToken,
        },
    });
}
