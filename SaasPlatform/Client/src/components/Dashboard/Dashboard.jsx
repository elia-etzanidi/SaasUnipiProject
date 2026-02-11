import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import CreatePost from '../Posts/CreatePost.jsx';
import PostItem from '../Posts/PostItem.jsx';
import { useOutletContext } from 'react-router-dom';

const Dashboard = () => {
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const token = localStorage.getItem('token');
    const setActiveChat = useOutletContext();

    // Fetch all posts when the page loads
    useEffect(() => {
    const fetchData = async () => {
        try {
            // Fetch User Data
            const userRes = await axios.get('http://localhost:5000/api/users/me', {
                headers: { 'x-auth-token': token }
            });
            setUser(userRes.data);

            // Fetch Posts
            const postsRes = await axios.get('http://localhost:5000/api/posts', {
                headers: { 'x-auth-token': token }
            });
            setPosts(postsRes.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        }
    };

    if (token) {
        fetchData();
    }
}, [token]);

    // Send new post to Backend
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
                        key={post._id}
                        author={post.author}
                        handle={post.handle}
                        content={post.content}
                        tags={post.tags}
                        postUserId={post.user} // The ID of the person who made the post
                        currentUserId={user?._id} // Your ID from the "user" state
                        currentUserContacts={user.contacts} // User contacts
                        openChat={setActiveChat} 
                        authorFullObject={{ _id: post.user, fullName: post.author }}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;