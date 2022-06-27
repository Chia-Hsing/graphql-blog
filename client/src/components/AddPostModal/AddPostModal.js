import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { gql, useMutation } from '@apollo/client';

const CREATE_POST = gql`
    mutation createPost($title: String!, $content: String!) {
        postCreate(post: { title: $title, content: $content }) {
            userErrors {
                message
            }
            post {
                title
                content
                published
                createAt
                user {
                    name
                }
            }
        }
    }
`;

export default function AddPostModal() {
    const [show, setShow] = useState(false);
    const [error, setError] = useState(null);

    const [postCreate, { data, loading }] = useMutation(CREATE_POST);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [content, setContent] = useState('');
    const [title, setTitle] = useState('');

    const handleClick = () => {
        if (!title || !content) return;
        else {
            postCreate({
                variables: {
                    title,
                    content,
                },
            });
            handleClose();
        }
    };

    useEffect(() => {
        if (data) {
            if (data.postCreate.userErrors.length) {
                setError(data.postCreate.userErrors[0].message);
            }
            if (data.postCreate.token) {
                localStorage.setItem('token', data.postCreate.token);
            }
        }
    }, [data]);

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Add Post
            </Button>

            <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="" value={title} onChange={(e) => setTitle(e.target.value)} />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                            <Form.Label>Content</Form.Label>
                            <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {error && <p>{error}</p>}
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleClick}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
