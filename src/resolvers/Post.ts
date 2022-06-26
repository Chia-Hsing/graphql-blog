import { Context } from '../index';
import { userLoader } from '../loader/userLoader';

interface PostParentType {
    authorId: number;
}

export const Post = {
    user: async ({ authorId }: PostParentType, _args: any, { prisma }: Context) => {
        // return prisma.user.findUnique({
        //     where: {
        //         id: authorId,
        //     },
        // });
        return userLoader.load(authorId);
    },
};
