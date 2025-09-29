import News, { INews, NewsStatus } from '../models/News.model';
import { CreateNewsDto, UpdateNewsDto } from '../dto/news.dto';
import { Types } from 'mongoose';
import SocketService from './socket.service';

/**
 * Сервис для управления бизнес-логикой новостных статей.
 */
export class NewsService {
    /**
     * Создает новую новостную статью.
     * @param {CreateNewsDto} createNewsDto - DTO с данными для создания.
     * @param {string} authorId - ID автора, полученный из JWT токена.
     * @returns {Promise<INews>} - Созданный документ новости.
     */
    public async create(createNewsDto: CreateNewsDto, authorId: string): Promise<INews> {
        const newsData: Partial<INews> = {
            ...createNewsDto,
            author: new Types.ObjectId(authorId),
            status: NewsStatus.DRAFT, // Новая статья всегда создается как черновик
        };

        const news = new News(newsData);

        SocketService.emit('news_created', { 
            message: `Создана новая статья: "${news.title}"` 
        });

        return await news.save();
    }

    /**
     * Находит все новости, созданные определенным автором.
     * @param {string} authorId - ID автора.
     * @returns {Promise<INews[]>} - Массив новостных статей.
     */
    public async findAllByAuthor(authorId: string): Promise<INews[]> {
        return await News.find({ author: authorId }).sort({ createdAt: -1 });
    }

    /**
     * Находит одну новостную статью по ее ID.
     * @param {string} id - ID новости.
     * @returns {Promise<INews | null>} - Документ новости или null, если не найден.
     */
    public async findById(id: string): Promise<INews | null> {
        return await News.findById(id);
    }
    
    /**
     * Обновляет новостную статью.
     * Проверяет, что пользователь, пытающийся обновить статью, является ее автором.
     * @param {string} id - ID новости для обновления.
     * @param {UpdateNewsDto} updateNewsDto - DTO с данными для обновления.
     * @param {string} userId - ID пользователя, выполняющего операцию.
     * @returns {Promise<INews | null>} - Обновленный документ новости.
     * @throws {Error} - Если новость не найдена или пользователь не является автором.
     */
    public async update(id: string, updateNewsDto: UpdateNewsDto, userId: string): Promise<INews | null> {
        const news = await this.findById(id);

        if (!news) {
            throw new Error('Новость не найдена');
        }

        if (news.author.toString() !== userId) {
            throw new Error('Доступ запрещен: вы не являетесь автором этой статьи');
        }

        Object.assign(news, updateNewsDto);
        const updatedNews = await news.save();

        SocketService.emit('news_updated', {
            message: `Статья "${updatedNews.title}" была обновлена.`
        });

        return updatedNews
    }

    /**
     * Удаляет новостную статью.
     * Проверяет, что пользователь, пытающийся удалить статью, является ее автором.
     * @param {string} id - ID новости для удаления.
     * @param {string} userId - ID пользователя, выполняющего операцию.
     * @returns {Promise<void>}
     * @throws {Error} - Если новость не найдена или пользователь не является автором.
     */
    public async delete(id: string, userId: string): Promise<void> {
        const news = await this.findById(id);

        if (!news) {
            throw new Error('Новость не найдена');
        }

        if (news.author.toString() !== userId) {
            throw new Error('Доступ запрещен: вы не являетесь автором этой статьи');
        }

        SocketService.emit('news_deleted', {
            message: `Статья "${news.title}" была удалена.`
        });

        await News.findByIdAndDelete(id);
    }

    /**
     * Добавляет или обновляет URL изображения для новостной статьи.
     * @param {string} id - ID новости.
     * @param {string} userId - ID пользователя для проверки прав.
     * @param {string} imageUrl - Путь к файлу изображения.
     * @returns {Promise<INews | null>} - Обновленный документ новости.
     * @throws {Error} - Если новость не найдена или пользователь не является автором.
     */
    public async addImage(id: string, userId: string, imageUrl: string): Promise<INews | null> {
        const news = await this.findById(id);

        if (!news) {
            throw new Error('Новость не найдена');
        }

        if (news.author.toString() !== userId) {
            throw new Error('Доступ запрещен: вы не являетесь автором этой статьи');
        }

        news.imageUrl = imageUrl;
        return await news.save();
    }
}

export default new NewsService();