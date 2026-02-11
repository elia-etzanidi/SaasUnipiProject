import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import { GoogleLogin } from '@react-oauth/google';

const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        interests: '', // Will be split by comma
        courses: ''    // Will be split by comma
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Manual Registration
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Convert comma-separated strings to arrays for the Backend
        const finalData = {
            ...formData,
            interests: formData.interests.split(',').map(i => i.trim()),
            courses: formData.courses.split(',').map(c => c.trim())
        };

        try {
            await axios.post('http://localhost:5000/api/users/register', finalData);
            alert('Registration Successful!');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.msg || 'An error occurred during registration');
        }
    };

    // Google Registration Logic
    const handleGoogleSuccess = async (credentialResponse) => {
        try {
            const res = await axios.post('http://localhost:5000/api/auth/google', {
                token: credentialResponse.credential
            });

            localStorage.setItem('token', res.data.token);

            // Αν ο χρήστης είναι νέος, πρέπει να συμπληρώσει τα interests/courses
            if (res.data.isNewUser) {
                navigate('/complete-profile');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            console.error("Google Auth Error", err);
            alert("Google Sign up failed.");
        }
    };

    return (
        <div className="auth-wrapper">
            <div className="auth-card">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input type="text" name="fullName" placeholder="John Doe" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" name="email" placeholder="john@example.com" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" name="password" placeholder="••••••••" onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Interests (comma separated)</label>
                        <input type="text" name="interests" placeholder="e.g. React, Node, CSS" onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Courses (comma separated)</label>
                        <input type="text" name="courses" placeholder="e.g. Web Dev, Databases" onChange={handleChange} />
                    </div>
                    <button type="submit" className="btn-submit">Sign Up</button>
                    {/* Google Sign Up Button */}
                    <div className="separator"><span>OR</span></div>
                    <div className="google-btn-container">
                        <GoogleLogin 
                            onSuccess={handleGoogleSuccess}
                            onError={() => console.log('Login Failed')}
                            text="signup_with"
                            width="450"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;