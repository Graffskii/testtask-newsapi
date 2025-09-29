import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import path from 'path';
import cors from 'cors';
import { corsOptions } from './config/cors';
import http from 'http';
import { Server } from 'socket.io';
import SocketService from './services/socket.service';

import authRoutes from './routes/auth.routes';
import newsRoutes from './routes/news.routes';

import SchedulerService from './services/scheduler.service';

dotenv.config();
connectDB();
SchedulerService.initScheduledJobs();

const app: Application = express();
const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
    cors: corsOptions 
});

SocketService.init(io);

app.use(cors(corsOptions));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api/v1/health', (req: Request, res: Response) => {
    res.status(200).json({ status: 'UP', message: 'News API is running!' });
});


app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/news', newsRoutes);


if (require.main === module) {
    httpServer.listen(PORT, () => {
        console.log(`Сервер запущен на http://localhost:${PORT}`);
    });
}

export default app;