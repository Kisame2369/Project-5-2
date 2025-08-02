import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authController } from '../controllers/auth.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authSchema, loginSchema } from '../validation/authSchema.js';
import {loginController} from '../controllers/auth.js';


const router = express.Router();

router.post("/register", validateBody(authSchema), ctrlWrapper(authController));
router.post("/login", validateBody(loginSchema), ctrlWrapper(loginController));

export default router; 