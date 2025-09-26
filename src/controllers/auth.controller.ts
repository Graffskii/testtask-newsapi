import { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service';

/**
 * Контроллер для обработки запросов, связанных с аутентификацией.
 */
class AuthController {
    /**
     * Обрабатывает запрос на регистрацию нового пользователя.
     * @param {Request} req - Объект запроса Express.
     * @param {Response} res - Объект ответа Express.
     * @param {NextFunction} next - Функция для передачи управления следующему middleware.
     */
    public async register(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const user = await AuthService.register(req.body);
            return res.status(201).json({
                success: true,
                message: 'Пользователь успешно зарегистрирован',
                data: user
            });
        } catch (error) {
            // В будущем здесь будет middleware для обработки ошибок
            if (error instanceof Error && error.message.includes('уже существует')) {
                return res.status(400).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
        }
    }

    /**
     * Обрабатывает запрос на вход пользователя в систему.
     * @param {Request} req - Объект запроса Express.
     * @param {Response} res - Объект ответа Express.
     * @param {NextFunction} next - Функция для передачи управления следующему middleware.
     */
    public async login(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
        try {
            const { token } = await AuthService.login(req.body);
            return res.status(200).json({
                success: true,
                message: 'Вход выполнен успешно',
                token: token
            });
        } catch (error) {
             if (error instanceof Error && error.message.includes('Неверные учетные данные')) {
                return res.status(401).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: 'Внутренняя ошибка сервера' });
        }
    }
}

export default new AuthController();