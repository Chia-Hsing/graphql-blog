import { Context } from '../index';
interface ProfileParentType {
    id: number;
    bio: string;
    userId: number;
}

export const Profile = {
    user: async ({ userId }: ProfileParentType, _args: any, { prisma }: Context) => {
        return prisma.user.findUnique({
            where: {
                id: userId,
            },
        });
    },
};
