import React, { useState } from 'react';
import axios from 'axios';
import './CreateGroupModal.css';

const CreateGroupModal = ({ friends, onClose }) => {
    const [groupName, setGroupName] = useState('');
    const [selectedFriends, setSelectedFriends] = useState([]);

    const toggleFriend = (friendId) => {
        if (selectedFriends.includes(friendId)) {
            setSelectedFriends(selectedFriends.filter(id => id !== friendId));
        } else {
            setSelectedFriends([...selectedFriends, friendId]);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName || selectedFriends.length === 0) return alert("Please add a name and at least one friend.");

        try {
            await axios.post('http://localhost:5000/api/groups', {
                name: groupName,
                members: selectedFriends
            }, {
                headers: { 'x-auth-token': localStorage.getItem('token') }
            });
            onGroupCreated(res.data);
            window.location.reload(); // Refresh to show the new group in the sidebar
        } catch (err) {
            console.error("Error creating group", err);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Create New Group</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Group Name..." 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        required
                    />
                    
                    <div className="friends-selection-list">
                        <h4>Select Friends:</h4>
                        {friends.map(friend => (
                            <div 
                                key={friend._id} 
                                className="friend-checkbox-item"
                                onClick={() => toggleFriend(friend._id)}
                            >
                                <input 
                                    type="checkbox" 
                                    checked={selectedFriends.includes(friend._id)}
                                    readOnly
                                />
                                <label>{friend.fullName}</label>
                            </div>
                        ))}
                    </div>

                    <div className="modal-actions">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn-confirm">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateGroupModal;