import { Schema, model } from 'mongoose';
import { hashPassword } from '../services/hashPassword.js';

const UserSchema = new Schema({
    name: {
        type: String,
        require: true,
    },
    username: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
        length: { min: 8 },
    },
    email: {type: String},
    image: {type: String},
    refreshTokens: {
        type: [String], default: []
    }
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = await hashPassword(user.password)
    next();
});

export const UserModel = model('Users', UserSchema);