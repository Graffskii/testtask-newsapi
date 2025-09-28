import cron from 'node-cron';
import News from '../models/News.model';
import { NewsStatus } from '../models/News.model';

/**
 * Сервис для управления фоновыми и отложенными задачами.
 */
export class SchedulerService {

    /**
     * Инициализирует все запланированные задачи (cron jobs) для приложения.
     * Этот метод должен вызываться один раз при старте сервера.
     */
    public initScheduledJobs(): void {
        // (минута час день-месяца месяц день-недели)
        const scheduledJob = cron.schedule('* * * * *', async () => {
            console.log('CRON: Проверка отложенных новостей для публикации...');
            try {
                await this.publishScheduledNews();
            } catch (error) {
                console.error('CRON: Ошибка при публикации отложенных новостей:', error);
            }
        });

        scheduledJob.start();

        console.log('Планировщик задач (cron job) для новостей инициализирован.');
    }

    /**
     * Находит и публикует все статьи, у которых подошло время публикации.
     * Ищет статьи со статусом 'draft' и датой 'publishAt' в прошлом.
     * @private
     */
    private async publishScheduledNews(): Promise<void> {
        const now = new Date();

        const articlesToPublish = await News.find({
            status: NewsStatus.DRAFT,
            publishAt: { $lte: now }, // $lte (less than or equal)
        }).select('_id');

        if (articlesToPublish.length === 0) {
            return;
        }

        const articleIds = articlesToPublish.map(article => article._id);

        const result = await News.updateMany(
            { _id: { $in: articleIds } }, 
            { $set: { status: NewsStatus.PUBLISHED } }
        );

        console.log(`CRON: Успешно опубликовано ${result.modifiedCount} новостных статей.`);
    }
}

export default new SchedulerService();