import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ user, activeTab, setActiveTab, onUserClick, onAddGroup, navigate, refreshTrigger }) => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/groups', {
                    headers: { 'x-auth-token': localStorage.getItem('token') }
                });
                setGroups(res.data);
            } catch (err) {
                console.error("Error fetching groups", err);
            }
        };
        fetchGroups();
    }, [refreshTrigger]); // Load groups once when the component mounts

    return (
        <aside className="sidebar">
            <div className="sidebar-user-card">
                <div className="avatar-large"></div>
                <div className="user-info-text">
                    <span className="user-name">{user?.fullName || "Loading..."}</span>
                    <span className="user-email">{user?.email}</span>
                </div>
            </div>
            
            <div className="community-section">
                <h3>Community</h3>
                <div className="community-tabs">
                    <span 
                        className={activeTab === 'friends' ? 'tab-item active' : 'tab-item'} 
                        onClick={() => setActiveTab('friends')}
                    >
                        Friends
                    </span>
                    <div className="group-tab-wrapper">
                        <span 
                            className={activeTab === 'groups' ? 'tab-item active' : 'tab-item'} 
                            onClick={() => setActiveTab('groups')}
                        >
                            Groups
                        </span>
                        {activeTab === 'groups' && (
                            <button className="add-group-btn" onClick={onAddGroup}>+</button>
                        )}
                    </div>
                </div>

                <div className="user-list">
                    {activeTab === 'friends' ? (
                        user?.contacts?.length > 0 ? (
                            user.contacts.map((contact) => (
                                <div key={contact._id} className="user-item" onClick={() => onUserClick(contact)}>
                                    <div className="avatar-small"></div>
                                    <span>{contact.fullName}</span>
                                </div>
                            ))
                        ) : <p className="empty-msg">No friends yet.</p>
                    ) : (
                        groups.map((group) => (
                            <div key={group._id} className="user-item" onClick={() => onUserClick(group)}>
                                <div className="avatar-small square"></div>
                                <span>{group.name}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;