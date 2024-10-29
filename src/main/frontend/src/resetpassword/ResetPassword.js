// ResetPassword.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ResetPassword.css';

export default function ResetPassword() {
    const [formData, setFormData] = useState({
        email: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Basic validation
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        console.log('Password reset data:', formData);
        // Here you would typically make an API call to reset the password
    };

    return (
        <div className="reset-container">
            <h1 className="reset-title">Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="newPassword">New Password</label>
                    <input 
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input 
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        required
                    />
                </div>

                {error && <div className="error-message">{error}</div>}

                <button type="submit">Reset Password</button>
                
                <div className="login-link">
                    Remember your password? <Link to="/login">Login</Link>
                </div>
            </form>
        </div>
    );
}