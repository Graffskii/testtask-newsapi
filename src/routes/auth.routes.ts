import { Router } from 'express';
import AuthController from '../controllers/auth.controller';

const router = Router();

/**
 * @route POST /api/v1/auth/register
 * @description Регистрация нового пользователя
 * @access Public
 */
router.post('/register', AuthController.register);

/**
 * @route POST /api/v1/auth/login
 * @description Вход пользователя в систему
 * @access Public
 */
router.post('/login', AuthController.login);

export default router;