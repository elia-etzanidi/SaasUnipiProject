import React from 'react';
import './Posts.css';

const PostItem = ({ author, handle, content }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <div className="user-avatar"></div>
                <div className="author-info">
                    <span className="author-name">{author}</span>
                    <span className="author-handle">{handle}</span>
                </div>
            </div>
            <div className="post-body">
                <p>{content}</p>
            </div>
        </div>
    );
};

export default PostItem;