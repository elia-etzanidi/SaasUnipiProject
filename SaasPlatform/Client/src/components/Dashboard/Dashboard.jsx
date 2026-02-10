import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import CreatePost from '../Posts/CreatePost.jsx';
import PostItem from '../Posts/PostItem.jsx';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const token = localStorage.getItem('token');

    // 1. Fetch all posts when the page loads
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/posts', {
                    headers: { 'x-auth-token': token }
                });
                setPosts(res.data);
            } catch (err) {
                console.error("Error fetching posts:", err);
            }
        };
        fetchPosts();
    }, [token]);

    // 2. Send new post to Backend
    const addNewPost = async (content, tagsArray) => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': token
                }
            };

            const body = {
                content: content,
                tags: tagsArray
            };

            const res = await axios.post('http://localhost:5000/api/posts', body, config);
            
            // Add the new post from the server response to the top of the list
            setPosts([res.data, ...posts]);
        } catch (err) {
            console.error("Error creating post:", err.response?.data);
            alert("Could not save the post. Please try again.");
        }
    };

    return (
        <div className="feed-container">
            <CreatePost onPostSubmit={addNewPost} />
            <div className="posts-list">
                {posts.map(post => (
                    <PostItem 
                        key={post._id} // MongoDB uses _id, not id
                        author={post.author}
                        handle={post.handle}
                        content={post.content}
                        tags={post.tags}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;