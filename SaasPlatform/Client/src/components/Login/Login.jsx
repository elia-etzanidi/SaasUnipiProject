import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    // Manual Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/users/login', formData);
            
            // Save token to localStorage for authenticated requests
            localStorage.setItem('token', res.data.token);
            
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.msg || 'Login failed');
        }
    };

    // Google Login
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            // Google token is sent to backend for verification and user creation/login
            const res = await axios.post('http://localhost:5000/api/users/google', {
                token: credentialResponse.credential
            });

            localStorage.setItem('token', res.data.token);

            // newly registered users will be redirected to 
            // complete their profile, while existing users go to dashboard
            if (res.data.isNewUser) {
                navigate('/complete-profile'); 
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Google login error", err);
            alert("Google login failed. Try again.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Welcome Back</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input 
                            type="email" 
                            placeholder="user@example.com"
                            onChange={e => setFormData({...formData, email: e.target.value})} 
                            required 
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            placeholder="••••••••"
                            onChange={e => setFormData({...formData, password: e.target.value})} 
                            required 
                        />
                    </div>
                    <button type="submit" className="btn-submit">Sign In</button>
                </form>
                {/* Seperator */}
                <div className="separator"><span>OR</span></div>

                {/* Google Button*/}
                <div className="google-btn-container">
                    <GoogleLogin 
                        onSuccess={handleGoogleSuccess}
                        onError={() => console.log('Login Failed')}
                        theme="outline"
                        width="450"
                    />
                </div>
                <div className="auth-footer">
                    Don't have an account? <Link to="/register">Register here</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;