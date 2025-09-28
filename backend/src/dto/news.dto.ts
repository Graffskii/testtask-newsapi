import { NewsStatus } from '../models/News.model';

/**
 * DTO для создания новой новостной статьи.
 * Определяет поля, которые клиент должен предоставить.
 */
export class CreateNewsDto {
    /**
     * Заголовок статьи.
     * @type {string}
     */
    title!: string;

    /**
     * Основное содержание статьи.
     * @type {string}
     */
    content!: string;

    /**
     * Необязательная дата для отложенной публикации.
     * Если указана, статья будет опубликована в это время.
     * @type {Date}
     */
    publishAt?: Date;
}

/**
 * DTO для обновления существующей новостной статьи.
 * Все поля являются необязательными, так как клиент может захотеть обновить только часть данных.
 */
export class UpdateNewsDto {
    /**
     * Новый заголовок статьи.
     * @type {string}
     */
    title?: string;

    /**
     * Новое содержание статьи.
     * @type {string}
     */
    content?: string;

    /**
     * Новый статус статьи (например, 'published').
     * @type {NewsStatus}
     */
    status?: NewsStatus;

    /**
     * Новая дата для отложенной публикации.
     * @type {Date}
     */
    publishAt?: Date;
}