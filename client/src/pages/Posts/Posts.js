import React from 'react';
import Post from '../../components/Post/Post';
import { useQuery, gql } from '@apollo/client';

const GET_POSTS = gql`
    query {
        posts {
            id
            title
            content
            createAt
            user {
                name
            }
        }
    }
`;

export default function Posts() {
    const { error, loading, data } = useQuery(GET_POSTS);

    if (error) return <div>Error Page</div>;

    if (loading) return <div>Spinner...</div>;

    const { posts } = data;

    return (
        <div>
            {posts.map((post) => {
                return (
                    <Post key={post.id} title={post.title} content={post.content} date={post.createAt} id={post.id} user={post.user.name} />
                );
            })}
        </div>
    );
}
