import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string; 
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
    {
        email: {
            type: String,
            required: [true, 'Email обязателен'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Пароль обязателен'],
            minlength: [6, 'Пароль должен быть не менее 6 символов'],
        },
    },
    {
        timestamps: true, 
    }
);

/**
 * Middleware, который запускается перед сохранением документа.
 * Хеширует пароль пользователя, если тот был изменен.
 */
UserSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

/**
 * Метод для сравнения предоставленного пароля с хешированным в базе данных.
 * @param enteredPassword Пароль, введенный пользователем при логине.
 * @returns {Promise<boolean>} true, если пароли совпадают, иначе false.
 */
UserSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    if (!this.password) return false;
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = model<IUser>('User', UserSchema);

export default User;