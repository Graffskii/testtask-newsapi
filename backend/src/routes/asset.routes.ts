import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import AssetController from '../controllers/asset.controller';
import { upload } from '../middleware/upload.middleware'; 

const router = Router();
router.use(protect); 

/**
 * @openapi
 * /api/v1/assets/upload:
 *   post:
 *     tags: [Assets]
 *     summary: Загрузить ассет (изображение или файл)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file: # Изменим имя поля на 'file' для универсальности
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Файл успешно загружен, возвращает URL
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
router.post('/upload', upload.single('file'), AssetController.upload);

export default router;