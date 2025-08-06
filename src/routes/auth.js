import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authSchema, loginSchema, resetEmailPasswordSchema, resetPasswordSchema } from '../validation/authSchema.js';
import { loginController, logoutController, refreshController, resetEmailPasswordController, resetPasswordController } from '../controllers/auth.js';


const router = express.Router();

router.post("/register", validateBody(authSchema), ctrlWrapper(authController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));
router.post("/logout", ctrlWrapper(logoutController));
router.post("/refresh", ctrlWrapper(refreshController));
router.post("/send-reset-email", validateBody(resetEmailPasswordSchema), ctrlWrapper(resetEmailPasswordController));
router.post("/reset-password", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
export default router; 