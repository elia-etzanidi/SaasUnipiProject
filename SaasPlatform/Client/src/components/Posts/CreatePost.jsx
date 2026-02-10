import React, { useState } from 'react';
import './Posts.css';

const CreatePost = ({ onPostSubmit }) => {
    const [content, setContent] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            onPostSubmit(content);
            setContent(''); // Clear the textarea after posting
        }
    };

    return (
        <div className="post-card create-post-container">
            <div className="post-header">
                <div className="user-avatar"></div>
                <form onSubmit={handleSubmit} className="post-form">
                    <textarea 
                        placeholder="What's on your mind?" 
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div className="post-footer">
                        <button type="submit" className="post-btn" disabled={!content.trim()}>
                            Post
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreatePost;