import React from 'react';
import './Posts.css';

const PostItem = ({ author, handle, content, tags, postUserId, currentUserId }) => {
    // Check if the post belongs to the logged-in user
    const isOwnPost = postUserId === currentUserId;
    
    // For now, let's assume "isFollowing" is false until we build the followers logic
    const isFollowing = false; 

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="user-avatar"></div>
                <div className="author-info">
                    <span className="author-name">{author}</span>
                    <span className="author-handle">{handle}</span>
                </div>

                {/* Right side actions */}
                {!isOwnPost && (
                    <div className="post-actions-top">
                        {isFollowing ? (
                            <button className="action-btn message">Message</button>
                        ) : (
                            <button className="action-btn follow">+ Follow</button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="post-body">
                <p>{content}</p>
            </div>

            {tags && tags.length > 0 && (
                <div className="post-tags">
                    {tags.map((tag, index) => (
                        <span key={index} className="tag-badge">#{tag}</span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PostItem;