import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';

/**
 * Определяет, является ли загружаемый файл изображением.
 * Проверяет mimetype файла.
 * @param {Request} req - Объект запроса.
 * @param {Express.Multer.File} file - Объект файла.
 * @param {FileFilterCallback} cb - Callback для завершения.
 */
const imageFileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); 
    } else {
        cb(new Error('Недопустимый тип файла')); 
    }
};

/**
 * Настройка хранилища для multer.
 * Указывает, что файлы должны сохраняться на диске.
 */
const storage = multer.diskStorage({
    /**
     * Определяет папку для сохранения файлов.
     */
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    /**
     * Генерирует уникальное имя для сохраняемого файла.
     * Формат: 'news-<timestamp>.<original_extension>'
     */
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `news-${uniqueSuffix}${extension}`);
    }
});

/**
 * Экземпляр middleware multer, сконфигурированный для загрузки одного изображения.
 */
export const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }
});