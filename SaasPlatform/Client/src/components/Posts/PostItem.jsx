import React, { useState, useEffect } from 'react';
import './Posts.css';
import axios from 'axios';

const PostItem = ({ author, handle, content, tags, postUserId, currentUserId, currentUserContacts }) => {
    // Check if the post belongs to the logged-in user
    const isOwnPost = postUserId === currentUserId;
    
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        // Ελέγχουμε αν το postUserId περιέχεται ήδη στα contacts του χρήστη
        if (currentUserContacts && currentUserContacts.includes(postUserId)) {
            setIsFollowing(true);
        }
    }, [currentUserContacts, postUserId]);

    const handleFollow = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:5000/api/users/follow/${postUserId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            setIsFollowing(true);
        } catch (err) {
            console.error("Error adding contact:", err);
        }
    };

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
                            <button className="action-btn follow" onClick={handleFollow}>+ Follow</button>
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