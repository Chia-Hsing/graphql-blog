import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';

interface SignupArgs {
    name: string;
    email: string;
    password: string;
    bio: string;
}

interface UserPayload {
    userErrors: { message: string }[];
    token: string | null;
}

export default {
    signup: async (_: any, { name, email, bio, password }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
        const isEmail = validator.isEmail(email);

        if (!isEmail) {
            return {
                userErrors: [{ message: 'invalid email' }],
                token: null,
            };
        }

        const isPassword = validator.isLength(password, {
            min: 5,
        });

        if (!isPassword) {
            return {
                userErrors: [{ message: 'invalid password' }],
                token: null,
            };
        }

        if (!name || !bio) {
            return {
                userErrors: [{ message: 'invalid name or bio' }],
                token: null,
            };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
            },
        });

        const token = JWT.sign({ userId: user.id, email }, 'adaada', {
            expiresIn: 3600,
        });

        return {
            userErrors: [],
            token,
        };
    },
};
