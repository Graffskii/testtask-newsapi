import { CorsOptions } from 'cors';

/**
 * Список разрешенных доменов (origins).
 */
const allowedOrigins: string[] = [
    'http://localhost:3000', // API
    'http://localhost:5173', // Vite
];

/**
 * Опции для middleware 'cors'.
 */
export const corsOptions: CorsOptions = {
    /**
     * origin - это функция, которая определяет, следует ли разрешать доступ
     * источнику запроса (origin).
     * @param origin - Источник запроса.
     * @param callback - Callback, который нужно вызвать.
     */
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Доступ запрещен политикой CORS'));
        }
    },
    
    /**
     * Указывает, что в ответе на preflight-запрос могут быть переданы
     * учетные данные (например, cookies, заголовки авторизации).
     */
    credentials: true,

    /**
     * Определяет разрешенные HTTP-методы.
     */
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};