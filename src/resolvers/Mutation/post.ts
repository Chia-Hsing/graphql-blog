import { Post, Prisma } from '@prisma/client';
import { Context } from '../../index';

interface PostPayloadType {
    userErrors: { message: string }[];
    post: Post | Prisma.Prisma__PostClient<Post> | null;
}

interface PostArgs {
    post: {
        title?: string;
        content?: string;
    };
}

export default {
    postCreate: async (parent: any, { post: { title, content } }: PostArgs, { prisma }: Context): Promise<PostPayloadType> => {
        if (!title || !content) {
            return {
                userErrors: [{ message: 'You must provide title and content' }],
                post: null,
            };
        }

        const post = await prisma.post.create({
            data: {
                title,
                content,
                authorId: 1,
            },
        });

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: 1,
                },
            }),
        };
    },
    postUpdate: async (_: any, { post, postId }: { postId: string; post: PostArgs['post'] }, { prisma }: Context) => {
        const { title, content } = post;

        if (!title && !content) {
            return {
                userErrors: [{ message: 'You must provide title and content' }],
                post: null,
            };
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: +postId,
            },
        });

        if (!existingPost) {
            return {
                userErrors: [{ message: 'Post does not exist.' }],
                post: null,
            };
        }

        let payloadToUpdate = {
            title,
            content,
        };

        if (!title) delete payloadToUpdate.title;
        if (!content) delete payloadToUpdate.content;

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate,
                },
                where: {
                    id: +postId,
                },
            }),
        };
    },
    postDelete: async (_: any, { postId }: { postId: string }, { prisma }: Context): Promise<PostPayloadType> => {
        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId),
            },
        });

        if (!post) {
            return {
                userErrors: [{ message: 'Post does not exist' }],
                post: null,
            };
        }

        await prisma.post.delete({
            where: {
                id: Number(postId),
            },
        });

        return {
            userErrors: [],
            post,
        };
    },
};
