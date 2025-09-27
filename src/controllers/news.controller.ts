import { Request, Response } from 'express';
import NewsService from '../services/news.service';

/**
 * Контроллер для обработки CRUD-запросов для новостей.
 */
class NewsController {
    /**
     * Создание новой статьи.
     */
    public async create(req: Request, res: Response): Promise<Response> {
        try {
            const news = await NewsService.create(req.body, req.user!.id);
            return res.status(201).json({ success: true, data: news });
        } catch (error: any) {
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Получение всех статей текущего пользователя.
     */
    public async getAll(req: Request, res: Response): Promise<Response> {
        try {
            const news = await NewsService.findAllByAuthor(req.user!.id);
            return res.status(200).json({ success: true, data: news });
        } catch (error: any) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    
    /**
     * Обновление статьи.
     */
    public async update(req: Request, res: Response): Promise<Response> {
        try {
            const news = await NewsService.update(req.params.id, req.body, req.user!.id);
            return res.status(200).json({ success: true, data: news });
        } catch (error: any) {
             if (error.message.includes('не найдена')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            if (error.message.includes('Доступ запрещен')) {
                return res.status(403).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Удаление статьи.
     */
    public async delete(req: Request, res: Response): Promise<Response> {
        try {
            await NewsService.delete(req.params.id, req.user!.id);
            return res.status(204).send();
        } catch (error: any) {
            if (error.message.includes('не найдена')) {
                return res.status(404).json({ success: false, message: error.message });
            }
            if (error.message.includes('Доступ запрещен')) {
                return res.status(403).json({ success: false, message: error.message });
            }
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

export default new NewsController();