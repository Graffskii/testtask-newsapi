import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import path from 'path';


/**
 * Настройка хранилища для multer.
 * Указывает, что файлы должны сохраняться на диске.
 */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const extension = path.extname(file.originalname);
        cb(null, `${path.basename(file.originalname, extension)}-${uniqueSuffix}${extension}`);
    }
});

/**
 * Экземпляр middleware multer, сконфигурированный для загрузки файла.
 */
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }
});