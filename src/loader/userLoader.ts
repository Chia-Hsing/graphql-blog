import { User } from '@prisma/client';
import DataLoader from 'dataLoader';
import { prisma } from '../index';

type BatchUsers = (ids: number[]) => Promise<User[]>;

export const batchUsers: BatchUsers = async (ids) => {
    const users = await prisma.user.findMany({
        where: {
            id: {
                in: ids,
            },
        },
    });

    const userMap: { [key: string]: User } = {};

    users.forEach((user) => {
        userMap[user.id] = user;
    });

    return ids.map((id) => userMap[id]);
};

//@ts-ignore
//<number, User> means take the id as number and return User
export const userLoader = new DataLoader<number, User>(batchUsers);
