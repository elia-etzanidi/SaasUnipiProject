import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './MainLayout.css';
import ChatWindow from '../Chat/ChatWindow.jsx';
import Navbar from './Navbar.jsx';
import Sidebar from './Sidebar.jsx';
import CreateGroupModal from '../CreateGroup/CreateGroupModal';
import { io } from 'socket.io-client';
import { toast, ToastContainer } from 'react-toastify';

const MainLayout = () => {
    const [user, setUser] = useState(null);
    const [socket, setSocket] = useState(null);
    const [activeTab, setActiveTab] = useState('friends');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeChat, setActiveChat] = useState(null);
    const [showGroupModal, setShowGroupModal] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/me', {
                    headers: { 'x-auth-token': token }
                });
                setUser(res.data);
            } catch (err) {
                if (err.response && err.response.status === 401) {
                    localStorage.removeItem('token'); // Καθαρίζουμε το ληγμένο token
                    navigate('/login');
                }
            }
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

    const handleGroupCreated = (newGroup) => {
        setRefreshTrigger(prev => prev + 1);
        setActiveTab('groups');
        setActiveChat(newGroup);
        setShowGroupModal(false);
    };

    // CONNECTION TO SOCKET.IO SERVER
    useEffect(() => {
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        return () => newSocket.close(); // Clean on unmount
    }, []);

    // Verify user is authenticated before emitting addUser
    useEffect(() => {
        if (socket && user) {
            socket.emit("addUser", user._id);
        }
    }, [socket, user]);

    // LISTEN FOR NOTIFICATIONS
    useEffect(() => {
        if (socket) {
            socket.on("notification", (data) => {
                console.log("Notification data received:", data);
                toast.info(
                    <div>
                        <strong>{data.title}</strong>
                        <p>{data.text}</p>
                    </div>, 
                    { position: "top-right", autoClose: 4000 }
                );
            });
        }
        return () => socket?.off("notification");
    }, [socket]);

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
                    refreshTrigger={refreshTrigger}
                />

                <main className="main-content">
                    <Outlet context={{ setActiveChat, socket }} />
                </main>

                <ToastContainer 
                    position="top-right" 
                    autoClose={4000} 
                    hideProgressBar={false}
                />

                {showGroupModal && (
                    <CreateGroupModal 
                        friends={user?.contacts || []} 
                        onClose={() => setShowGroupModal(false)}
                        onGroupCreated={handleGroupCreated}
                    />
                )}

                <ChatWindow 
                    receiver={activeChat} 
                    onClose={() => setActiveChat(null)} 
                    currentUserId={user?._id}
                    socket={socket}
                />
            </div>
        </div>
    );
};

export default MainLayout;