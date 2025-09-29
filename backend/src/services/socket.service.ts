import { Server, Socket } from 'socket.io';

/**
 * Сервис для управления real-time взаимодействием через Socket.IO.
 */
export class SocketService {
    private io: Server | null = null;

    /**
     * Инициализирует сервис с экземпляром Socket.IO сервера.
     * @param {Server} io - Экземпляр сервера Socket.IO.
     */
    public init(io: Server): void {
        this.io = io;
        console.log('Socket.IO сервис инициализирован.');

        this.io.on('connection', (socket: Socket) => {
            console.log(`Клиент подключен: ${socket.id}`);

            socket.on('disconnect', () => {
                console.log(`Клиент отключен: ${socket.id}`);
            });
        });
    }

    /**
     * Отправляет событие всем подключенным клиентам.
     * @param {string} eventName - Имя события.
     * @param {any} data - Данные для отправки.
     */
    public emit(eventName: string, data: any): void {
        if (this.io) {
            this.io.emit(eventName, data);
        }
    }
}

export default new SocketService();