import React, { useState } from 'react';
import './Dashboard.css';
import CreatePost from '../Posts/CreatePost.jsx';
import PostItem from '../Posts/PostItem.jsx';

const Dashboard = () => {
    const [posts, setPosts] = useState([
        { id: 1, author: 'Sara Mitchell', handle: '@saramitch', content: 'Just shipped a new feature that reduces load time by 40%. The trick? Lazy loading + edge caching.' },
        { id: 2, author: 'Alex Chen', handle: '@alexchen', content: 'The best code you\'ll ever write is the code you delete.' }
    ]);

    const addNewPost = (content) => {
        const newEntry = {
            id: Date.now(),
            author: "Current User",
            handle: "@me",
            content: content
        };
        setPosts([newEntry, ...posts]);
    };

    return (
        <div className="feed-container">
            <CreatePost onPostSubmit={addNewPost} />
            
            <div className="posts-list">
                {posts.map(post => (
                    <PostItem 
                        key={post.id}
                        author={post.author}
                        handle={post.handle}
                        content={post.content}
                    />
                ))}
            </div>
        </div>
    );
};

export default Dashboard;