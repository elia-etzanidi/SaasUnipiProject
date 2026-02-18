import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserCard.css';

const UserCard = ({ user, isFriend, isMe, onFollow, onMessage }) => {
    const navigate = useNavigate();

    return (
        <div className="user-search-card">
            <div className="user-card-info">
                <div className="avatar-medium"></div>
                <div className="user-details">
                    <h4 onClick={() => navigate(`/profile/${user._id}`)} className="user-name">
                        {user.fullName}
                    </h4>
                    <p className="user-email">{user.email}</p>
                    
                    <div className="user-tags">
                        {/* user interests */}
                        {user.interests && user.interests.map((interest, index) => (
                            <span key={`int-${index}`} className="user-tag-badge interest">
                                {interest}
                            </span>
                        ))}
                        
                        {/* user courses */}
                        {user.courses && user.courses.map((course, index) => (
                            <span key={`cour-${index}`} className="user-tag-badge course">
                                {course}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            
            <div className="user-card-actions">
                {isMe ? (
                    <span className="action-btn">You</span>
                ) : isFriend ? (
                    <button className="action-btn message" onClick={onMessage}>
                        Message
                    </button>
                ) : (
                    <button className="action-btn follow" onClick={onFollow}>
                        Follow
                    </button>
                )}
            </div>
        </div>
    );
};

export default UserCard;