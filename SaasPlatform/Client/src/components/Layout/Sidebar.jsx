const Sidebar = ({ user, activeTab, setActiveTab, onUserClick, navigate }) => {
    return (
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
                        ['React Developers', 'Node Enthusiasts'].map((group, i) => (
                            <div key={i} className="user-item">
                                <div className="avatar-small square"></div>
                                <span>{group}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;