import React from 'react';
import './Posts.css';

const PostItem = ({ author, handle, content, tags }) => {
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

            {/* Render tags if they exist */}
            {tags && tags.length > 0 && (
                <div className="post-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-badge">
                            #{tag}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostItem;