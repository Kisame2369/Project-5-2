import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authSchema, loginSchema, resetEmailPasswordSchema, resetPasswordSchema, codeSchema } from '../validation/authSchema.js';
import { loginController, logoutController, refreshController, resetEmailPasswordController, resetPasswordController, oauthController,oauthConfirmController } from '../controllers/auth.js';


const router = express.Router();

router.post("/register", validateBody(authSchema), ctrlWrapper(authController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/send-reset-email", validateBody(resetEmailPasswordSchema), ctrlWrapper(resetEmailPasswordController));
router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
router.get("/get-oauth-url", ctrlWrapper(oauthController));
router.post("/oauth-confirm", validateBody(codeSchema), ctrlWrapper(oauthConfirmController));
export default router;