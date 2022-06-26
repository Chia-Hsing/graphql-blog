import { Post, Prisma } from '@prisma/client';
import { Context } from '../../index';
import { canUserMutatePost } from '../../utils/canUserMutatePost';

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
    postCreate: async (parent: any, { post: { title, content } }: PostArgs, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return { userErrors: [{ message: 'Forbidden access (unauthenticated)' }], post: null };
        }

        if (!title || !content) {
            return {
                userErrors: [{ message: 'You must provide title and content' }],
                post: null,
            };
        }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId,
                },
            }),
        };
    },
    postUpdate: async (_: any, { post, postId }: { postId: string; post: PostArgs['post'] }, { prisma, userInfo }: Context) => {
        const { title, content } = post;

        if (!userInfo) {
            return { userErrors: [{ message: 'Forbidden access (unauthenticated)' }], post: null };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma,
        });

        if (error) return error;

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
    postDelete: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return { userErrors: [{ message: 'Forbidden access (unauthenticated)' }], post: null };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: +postId,
            prisma,
        });

        if (error) return error;

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
    postPublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden access (unauthenticated)',
                    },
                ],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma,
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId),
                },
                data: {
                    published: true,
                },
            }),
        };
    },
    postUnpublish: async (_: any, { postId }: { postId: string }, { prisma, userInfo }: Context): Promise<PostPayloadType> => {
        if (!userInfo) {
            return {
                userErrors: [
                    {
                        message: 'Forbidden access (unauthenticated)',
                    },
                ],
                post: null,
            };
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma,
        });

        if (error) return error;

        return {
            userErrors: [],
            post: prisma.post.update({
                where: {
                    id: Number(postId),
                },
                data: {
                    published: false,
                },
            }),
        };
    },
};
