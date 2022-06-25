import { ApolloServer } from 'apollo-server';
import { typeDefs } from './schema';
import { Query, Mutation } from './resolvers';
import { PrismaClient, Prisma } from '@prisma/client';

export interface Context {
    prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined>;
}

const prisma = new PrismaClient();

const server = new ApolloServer({
    typeDefs,
    resolvers: { Query, Mutation },
    context: {
        prisma,
    },
});

server.listen().then(({ url }) => {
    console.log(`server rady on ${url}`);
});