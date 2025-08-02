import { registerUser } from "../service/auth.js";
import { loginUser } from "../service/auth.js";

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

    res.status(200).json({
        status: 200,
        message: 'Successfully logged in!',
        data: {
            accessToken: session.accessToken,
            refreshToken: session.refreshToken,
        },
    });
};
