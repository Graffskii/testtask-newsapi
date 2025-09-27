import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
    id: string;
}

/**
 * Middleware для проверки JWT токена аутентификации.
 * Ищет токен в заголовке Authorization.
 * Если токен валиден, добавляет в объект req свойство user с id пользователя.
 * @param {Request} req - Объект запроса Express.
 * @param {Response} res - Объект ответа Express.
 * @param {NextFunction} next - Функция для передачи управления следующему middleware.
 */
export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const secret = process.env.JWT_SECRET;
            if (!secret) {
                throw new Error('Секрет JWT не определен в переменных окружения');
            }

            const decoded = jwt.verify(token, secret) as JwtPayload;

            req.user = { id: decoded.id };

            next();
        } catch (error) {
            console.error('Ошибка верификации токена:', error);
            return res.status(401).json({ success: false, message: 'Не авторизован, токен недействителен' });
        }
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Не авторизован, нет токена' });
    }
};