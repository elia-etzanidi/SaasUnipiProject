import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainLayout.css';

const MainLayout = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('friends');
    const token = localStorage.getItem('token');
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                console.error("Error fetching user for sidebar", err);
            }
        };
        if (token) fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="layout-wrapper">
            <header className="top-bar">
                <div className="logo">All Devs Feed</div>
                <div className="nav-actions">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </div>
            </header>

            <div className="layout-body">
                <aside className="sidebar">
                    <nav className="sidebar-nav">
                        <ul>
                            <li onClick={() => navigate('/dashboard')}>Home</li>
                            <li onClick={() => navigate('/profile')}>Profile</li>
                            <li onClick={() => navigate('/settings')}>Settings</li>
                        </ul>
                    </nav>
                    
                    <div className="community-section">
                        <h3>Community</h3>
                        
                        {/* Tab Headers */}
                        <div className="community-tabs">
                            <span 
                                className={activeTab === 'friends' ? 'tab-item active' : 'tab-item'} 
                                onClick={() => setActiveTab('friends')}
                            >
                                Friends
                            </span>
                            <span 
                                className={activeTab === 'groups' ? 'tab-item active' : 'tab-item'} 
                                onClick={() => setActiveTab('groups')}
                            >
                                Groups
                            </span>
                        </div>

                        {/* Dynamic List based on Active Tab */}
                        <div className="user-list">
                            {activeTab === 'friends' ? (
                                // Contact list from user data
                                user && user.contacts && user.contacts.length > 0 ? (
                                    user.contacts.map((contact) => (
                                        <div key={contact._id} className="user-item">
                                            <div className="avatar-small"></div>
                                            <span>{contact.fullName}</span>
                                        </div>
                                    ))
                                ) : (
                                    <p className="empty-msg">No friends followed yet.</p>
                                )
                            ) : (
                                // Static groups for demonstration
                                ['React Developers', 'Node Enthusiasts', 'UI/UX Design'].map((group, i) => (
                                    <div key={i} className="user-item">
                                        <div className="avatar-small square"></div>
                                        <span>{group}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                <main className="main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default MainLayout;