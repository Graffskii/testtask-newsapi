import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

// Импортируем наши роуты
import authRoutes from './routes/auth.routes';

dotenv.config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'News API is running!' });
});

// Подключаем роутер аутентификации с префиксом /api/v1/auth
app.use('/api/v1/auth', authRoutes);


if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}

export default app;