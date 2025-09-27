import { Schema, model, Document, Types } from 'mongoose';

/**
 * Перечисление возможных статусов новостной статьи.
 */
export enum NewsStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published', 
}

/**
 * Интерфейс, описывающий документ новости для TypeScript.
 */
export interface INews extends Document {
    title: string;
    content: string;
    author: Types.ObjectId; 
    status: NewsStatus;
    publishAt?: Date; // Необязательная дата для отложенной публикации
}

const NewsSchema = new Schema<INews>(
    {
        title: {
            type: String,
            required: [true, 'Заголовок обязателен'],
            trim: true,
        },
        content: {
            type: String,
            required: [true, 'Содержание обязательно'],
        },
        author: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
        },
        status: {
            type: String,
            enum: Object.values(NewsStatus), 
            default: NewsStatus.DRAFT,
        },
        publishAt: {
            type: Date,
        },
    },
    {
        timestamps: true, 
    }
);

const News = model<INews>('News', NewsSchema);

export default News;