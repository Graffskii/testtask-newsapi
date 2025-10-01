import { Request, Response } from 'express';

/**
 * Контроллер для управления файлами.
 */
class AssetController {
    /**
     * Загружает файл и возвращает публичный URL для доступа к нему.
     */
    public upload(req: Request, res: Response): Response {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Файл не был загружен' });
        }

        const fileUrl = `/uploads/${req.file.filename}`;

        return res.status(201).json({ success: true, data: { url: fileUrl } });
    }
}

export default new AssetController();