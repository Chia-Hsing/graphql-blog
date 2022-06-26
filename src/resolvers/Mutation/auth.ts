import { Context } from '../../index';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import JWT from 'jsonwebtoken';
import { keys } from '../../keys';

interface SignupArgs {
    credentials: { password: string; email: string };
    name: string;
    bio: string;
}
interface SigninArgs {
    credentials: { password: string; email: string };
    name: string;
    bio: string;
}

interface UserPayload {
    userErrors: { message: string }[];
    token: string | null;
}

export default {
    signup: async (_: any, { credentials, name, bio }: SignupArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;

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

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id,
            },
        });

        return {
            userErrors: [],
            token: JWT.sign({ userId: user.id, email }, keys.JWT_SIGNATURE, {
                expiresIn: 3600,
            }),
        };
    },
    signin: async (_: any, { credentials }: SigninArgs, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (!user) {
            return {
                userErrors: [{ message: 'invalid credentials' }],
                token: null,
            };
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return {
                userErrors: [{ message: 'invalid credentials' }],
                token: null,
            };
        }

        return {
            userErrors: [],
            token: JWT.sign({ userId: user.id }, keys.JWT_SIGNATURE, {
                expiresIn: 3600,
            }),
        };
    },
};
