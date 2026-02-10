import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import './MainLayout.css';

const MainLayout = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('friends');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="layout-wrapper">
            <header className="top-bar">
                <div className="logo">SaaS.Platform</div>
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
                                ['Sara Mitchell', 'Alex Chen', 'Marcus Webb'].map((name, i) => (
                                    <div key={i} className="user-item">
                                        <div className="avatar-small"></div>
                                        <span>{name}</span>
                                    </div>
                                ))
                            ) : (
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