import React, { useState } from 'react';
import './Posts.css';

const CreatePost = ({ onPostSubmit }) => {
    const [content, setContent] = useState('');
    const [tags, setTags] = useState(''); // New state for tags string

    const handleSubmit = (e) => {
        e.preventDefault();
        if (content.trim()) {
            // Convert comma-separated string to an array of trimmed strings
            const tagsArray = tags.split(',')
                .map(tag => tag.trim())
                .filter(tag => tag !== ""); // Remove empty strings

            onPostSubmit(content, tagsArray);
            setContent('');
            setTags('');
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
                    
                    {/* New Tags Input Field */}
                    <div className="tags-input-wrapper">
                        <input 
                            type="text" 
                            placeholder="Add tags (e.g. coding, react, saas)" 
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                            className="tags-field"
                        />
                    </div>

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