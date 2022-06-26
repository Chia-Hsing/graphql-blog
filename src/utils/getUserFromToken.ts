import JWT from 'jsonwebtoken';
import { keys } from '../keys';

export const getUserFromToken = (token: string) => {
    try {
        return JWT.verify(token, keys.JWT_SIGNATURE) as { userId: number };
    } catch (error) {
        return null;
    }
};
