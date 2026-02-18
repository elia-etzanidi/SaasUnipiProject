import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import PostItem from '../Posts/PostItem';
import UserCard from '../Users/UserCard';
import './SearchPage.css';
import { useOutletContext } from 'react-router-dom';

const SearchPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams.get('q'); // Takes q from url /search?q=react
    const [results, setResults] = useState({ users: [], posts: [] });
    const [currentUser, setCurrentUser] = useState(null);
    const activeTab = searchParams.get('tab') || 'posts';
    const [loading, setLoading] = useState(true);
    const { setActiveChat } = useOutletContext();

    const handleTabChange = (tabName) => {
        setSearchParams({ q: query, tab: tabName });
    };

    useEffect(() => {
        const fetchResults = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };

                // Search results
                const searchRes = await axios.get(`http://localhost:5000/api/search?q=${query}`, config);
                
                // User contacts for follow button logic
                const userRes = await axios.get('http://localhost:5000/api/users/me', config);

                setResults(searchRes.data);
                setCurrentUser(userRes.data);
            } catch (err) {
                console.error("Search error:", err);
            }
            setLoading(false);
        };

        if (query) fetchResults();
    }, [query]);

    const handleFollow = async (userId) => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put(`http://localhost:5000/api/users/follow/${userId}`, {}, {
                headers: { 'x-auth-token': token }
            });
            
            // Update current user data to reflect new follow status
            setCurrentUser(res.data.user); 
            window.location.reload();
        } catch (err) {
            console.error("Follow error:", err);
        }
    };

    const handleMessageClick = (targetUser) => {
        // Updates the state in MainLayout
        setActiveChat(targetUser);
    };

    if (loading) return <div className="loader">Searching...</div>;

    return (
        <div className="search-page-container">
            <h2>Results for "{query}"</h2>

            <div className="search-tabs">
                <button 
                    className={activeTab === 'posts' ? 'tab-btn active' : 'tab-btn'} 
                    onClick={() => handleTabChange('posts')}
                >
                    Posts ({results.posts.length})
                </button>
                <button 
                    className={activeTab === 'users' ? 'tab-btn active' : 'tab-btn'} 
                    onClick={() => handleTabChange('users')}
                >
                    People ({results.users.length})
                </button>
            </div>

            <div className="results-content">
                {activeTab === 'posts' ? (
                    results.posts.length > 0 ? (
                        results.posts.map(post => (
                            <PostItem 
                                key={post._id} 
                                {...post} 
                                author={post.user?.fullName || "Unknown"}
                                postUserId={post.user?._id || post.user} 
                                currentUserId={currentUser?._id}
                                currentUserContacts={currentUser?.contacts}
                                openChat={handleMessageClick} 
                                authorFullObject={post.user}
                            />
                        ))
                    ) : <p>No posts found with this tag.</p>
                ) : (
                    results.users.length > 0 ? (
                        results.users.map(user => (
                            <UserCard 
                                key={user._id} 
                                user={user} 
                                isMe={String(currentUser?._id) === String(user._id)}
                                isFriend={currentUser?.contacts?.some(c => (c._id || c) === user._id)}
                                onFollow={() => handleFollow(user._id)}
                                onMessage={() => handleMessageClick(user)}
                            />
                        ))
                    ) : <p>No developers found with this name or interest.</p>
                )}
            </div>
        </div>
    );
};

export default SearchPage;