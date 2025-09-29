import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import NewsController from '../controllers/news.controller';

const router = Router();

router.use(protect);

/**
 * @route POST /api/v1/news
 * @description Создать новую статью
 * @access Private
 */
/**
 * @openapi
 * /api/v1/news:
 *   post:
 *     tags: [News]
 *     summary: Создать новую статью
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Заголовок новой статьи
 *               content:
 *                 type: string
 *                 example: <p>Содержимое статьи в формате HTML.</p>
 *               publishAt:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Статья успешно создана
 *       400:
 *         description: Ошибка валидации данных
 *       401:
 *         description: Не авторизован (невалидный или отсутствует токен)
 */
router.post('/', NewsController.create);

/**
 * @route GET /api/v1/news
 * @description Получить все статьи авторизованного пользователя
 * @access Private
 */
/**
 * @openapi
 * /api/v1/news:
 *   get:
 *     tags: [News]
 *     summary: Получить все статьи авторизованного пользователя
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Успешно, возвращает массив статей
 *       401:
 *         description: Не авторизован
 */
router.get('/', NewsController.getAll);

/**
 * @route GET /api/v1/news/:id
 * @description Получить одну статью по ID
 * @access Private (только автор)
 */
/**
 * @openapi
 * /api/v1/news/{id}:
 *   get:
 *     tags: [News]
 *     summary: Получить одну статью по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статьи
 *     responses:
 *       200:
 *         description: Успешно, возвращает данные статьи
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (пользователь не является автором)
 *       404:
 *         description: Новость не найдена
 */
router.get('/:id', NewsController.getById);

/**
 * @route PUT /api/v1/news/:id
 * @description Обновить статью по ID
 * @access Private (только автор)
 */
/**
 * @openapi
 * /api/v1/news/{id}:
 *   put:
 *     tags: [News]
 *     summary: Обновить статью по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статьи
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [draft, published]
 *     responses:
 *       200:
 *         description: Статья успешно обновлена
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (пользователь не является автором)
 *       404:
 *         description: Новость не найдена
 */
router.put('/:id', NewsController.update);

/**
 * @route DELETE /api/v1/news/:id
 * @description Удалить статью по ID
 * @access Private (только автор)
 */
/**
 * @openapi
 * /api/v1/news/{id}:
 *   delete:
 *     tags: [News]
 *     summary: Удалить статью по ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статьи
 *     responses:
 *       204:
 *         description: Статья успешно удалена (нет тела ответа)
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (пользователь не является автором)
 *       404:
 *         description: Новость не найдена
 */
router.delete('/:id', NewsController.delete);

/**
 * @route POST /api/v1/news/:id/image
 * @description Загрузить изображение для статьи
 * @access Private (только автор)
 */
/**
 * @openapi
 * /api/v1/news/{id}/image:
 *   post:
 *     tags: [News]
 *     summary: Загрузить изображение для статьи
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID статьи
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Изображение успешно загружено
 *       400:
 *         description: Файл не был загружен или имеет неверный тип
 *       401:
 *         description: Не авторизован
 *       403:
 *         description: Доступ запрещен (пользователь не является автором)
 *       404:
 *         description: Новость не найдена
 */
router.post(
    '/:id/image',
    upload.single('image'), 
    NewsController.uploadImage
);


export default router;