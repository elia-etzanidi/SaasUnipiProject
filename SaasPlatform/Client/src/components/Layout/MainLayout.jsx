import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainLayout.css';
import ChatWindow from '../Chat/ChatWindow.jsx';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import CreateGroupModal from '../CreateGroup/CreateGroupModal';

const MainLayout = () => {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) { console.error("Error fetching user", err); }
        };
        if (token) fetchUser();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim() !== '') {
            navigate(`/search?q=${searchQuery}`);
        }
    };

    return (
        <div className="layout-wrapper">
            <Navbar 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
                onSearch={handleSearch} 
                onLogout={handleLogout} 
            />

            <div className="layout-body">
                <Sidebar 
                    user={user} 
                    activeTab={activeTab} 
                    setActiveTab={setActiveTab} 
                    onUserClick={setActiveChat}
                    onAddGroup={() => setShowGroupModal(true)}
                    navigate={navigate}
                />

                <main className="main-content">
                    <Outlet context={setActiveChat} />
                </main>

                {showGroupModal && (
                    <CreateGroupModal 
                        friends={user?.contacts || []} 
                        onClose={() => setShowGroupModal(false)} 
                    />
                )}

                <ChatWindow 
                    receiver={activeChat} 
                    onClose={() => setActiveChat(null)} 
                    currentUserId={user?._id}
                />
            </div>
        </div>
    );
};

export default MainLayout;