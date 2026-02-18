import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CompleteProfile.css';

const CompleteProfile = () => {
    const [data, setData] = useState({ interests: '', courses: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const finalData = {
            interests: data.interests.split(',').map(i => i.trim()),
            courses: data.courses.split(',').map(c => c.trim())
        };

        try {
            // put request to update user profile
            await axios.put('http://localhost:5000/api/users/profile', finalData, {
                headers: { 'x-auth-token': token }
            });
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="auth-wrapper">
        <div className="auth-card">
            <div className="complete-profile-steps">
                <span className="step-badge">FINAL STEP</span>
                <h2>Welcome!</h2>
                <p>We've almost set up your account via Google. Just tell us a bit about your interests to personalize your feed.</p>
            </div>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Interests (comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. React, Python, UI Design" 
                        onChange={e => setData({...data, interests: e.target.value})}
                        required 
                    />
                </div>
                <div className="form-group">
                    <label>Courses (comma separated)</label>
                    <input 
                        type="text" 
                        placeholder="e.g. Web Development, Algorithms" 
                        onChange={e => setData({...data, courses: e.target.value})}
                        required 
                    />
                </div>
                <button type="submit" className="btn-submit">Start Networking</button>
            </form>
        </div>
    </div>
    );
};

export default CompleteProfile;