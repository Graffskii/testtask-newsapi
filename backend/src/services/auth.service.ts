import User, { IUser } from '../models/User.model';
import { RegisterUserDto, LoginUserDto } from '../dto/auth.dto';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Сервис, отвечающий за бизнес-логику аутентификации пользователей.
 */
export class AuthService {
    /**
     * Регистрирует нового пользователя в системе.
     * Проверяет, не занят ли email, и сохраняет нового пользователя.
     * @param {RegisterUserDto} registerDto - Данные для регистрации.
     * @returns {Promise<Omit<IUser, 'password'>>} - Созданный пользователь без поля password.
     * @throws {Error} - Если пользователь с таким email уже существует.
     */
    public async register(registerDto: RegisterUserDto): Promise<Omit<IUser, 'password'>> {
        const { email, password } = registerDto;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            throw new Error('Пользователь с таким email уже существует');
        }

        const user = new User({ email, password });
        await user.save();

        const userObject = user.toObject();
        delete userObject.password;
        
        return userObject;
    }

    /**
     * Аутентифицирует пользователя и возвращает JWT.
     * @param {LoginUserDto} loginDto - Данные для входа.
     * @returns {Promise<{token: string}>} - Объект, содержащий JWT.
     * @throws {Error} - Если учетные данные неверны.
     */
    public async login(loginDto: LoginUserDto): Promise<{ token: string }> {
        const { email, password } = loginDto;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new Error('Неверные учетные данные');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new Error('Неверные учетные данные');
        }

        const payload = { id: user._id };
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET не определен');
        }

        const token = jwt.sign(payload, secret, { expiresIn: '1h' });

        return { token };
    }
}

export default new AuthService();