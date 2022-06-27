import { gql } from 'apollo-server';

export const typeDefs = gql`
    type Query {
        me: User
        posts: [Post!]!
        profile(userId: ID!): Profile
    }

    type Mutation {
        postCreate(post: PostInput!): PostPayload!
        postUpdate(postId: ID!, post: PostInput!): PostPayload!
        postDelete(postId: ID!): PostPayload!
        signup(credentials: CredentialsInput, name: String, bio: String): AuthPayload!
        signin(credentials: CredentialsInput): AuthPayload!
        postPublish(postId: ID!): PostPayload!
        postUnpublish(postId: ID!): PostPayload!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        createAt: String!
        published: Boolean!
        authorId: Int!
        user: User!
    }

    type User {
        id: ID!
        name: String!
        email: String
        posts: [Post!]!
    }

    type Profile {
        id: ID!
        bio: String!
        isMyProfile: Boolean!
        user: User!
    }

    type UserError {
        message: String!
    }

    type PostPayload {
        userErrors: [UserError!]!
        post: Post
    }

    type AuthPayload {
        userErrors: [UserError!]!
        token: String
    }

    input PostInput {
        title: String
        content: String
    }

    input CredentialsInput {
        email: String!
        password: String!
    }
`;
