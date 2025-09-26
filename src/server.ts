import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';

dotenv.config();

connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'News API is running!' });
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}

export default app; 