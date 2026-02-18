const Navbar = ({ searchQuery, setSearchQuery, onSearch, onLogout, navigate }) => {
    return (
        <header className="top-bar">
            <div className="logo" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                All Devs Feed
            </div>
            <div className="search-container">
                <input 
                    type="text" 
                    placeholder="Search for posts or users..." 
                    className="search-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={onSearch}
                />
                <span className="search-icon">🔍</span>
            </div>
            <div className="nav-actions">
                <button onClick={onLogout} className="logout-btn">Logout</button>
            </div>
        </header>
    );
};

export default Navbar;