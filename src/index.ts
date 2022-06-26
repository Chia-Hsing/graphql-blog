import { ApolloServer } from 'apollo-server';
import { PrismaClient, Prisma } from '@prisma/client';

import { typeDefs } from './schema';
import { Query, Mutation, Profile, Post, User } from './resolvers';
import { getUserFromToken } from './utils/getUserFromToken';

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
    userInfo: { userId: number } | null;
}

export const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation, Profile, Post, User },
    context: async ({ req }: any): Promise<Context> => {
        const userInfo = await getUserFromToken(req.headers.authorization);

        return {
            prisma,
            userInfo,
        };
    },
});

server.listen().then(({ url }) => {
    console.log(`server rady on ${url}`);
});
