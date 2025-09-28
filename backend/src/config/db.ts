import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Устанавливает соединение с базой данных MongoDB.
 * Использует строку подключения из переменных окружения.
 * В случае ошибки логирует ее и завершает процесс.
 */
const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        if (!mongoURI) {
            console.error('Ошибка: MONGO_URI не определена в .env файле');
            process.exit(1);
        }

        await mongoose.connect(mongoURI);

        console.log('MongoDB успешно подключена');
    } catch (err: any) {
        console.error('Ошибка подключения к MongoDB:', err.message);
        process.exit(1);
    }
};

export default connectDB;