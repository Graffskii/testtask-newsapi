import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import NewsController from '../controllers/news.controller';

const router = Router();

router.use(protect);

/**
 * @route POST /api/v1/news
 * @description Создать новую статью
 * @access Private
 */
router.post('/', NewsController.create);

/**
 * @route GET /api/v1/news
 * @description Получить все статьи авторизованного пользователя
 * @access Private
 */
router.get('/', NewsController.getAll);

/**
 * @route PUT /api/v1/news/:id
 * @description Обновить статью по ID
 * @access Private (только автор)
 */
router.put('/:id', NewsController.update);

/**
 * @route DELETE /api/v1/news/:id
 * @description Удалить статью по ID
 * @access Private (только автор)
 */
router.delete('/:id', NewsController.delete);


export default router;