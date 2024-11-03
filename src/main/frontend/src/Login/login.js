import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './login.css';

export default function Login() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const error = await response.json();
                setError(error.error);
                return;
            }

            const data = await response.json();
            // Store user data and redirect
            localStorage.setItem('user', JSON.stringify(data));
            navigate('/dashboard');
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="login-container">
            <h1 className="welcome-back">Welcome Back</h1>
            {error && <div className="error-message">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="johdoe@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="johxxxxxx"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="remember-me">
                    <input
                        type="checkbox"
                        id="remember"
                    />
                    <label htmlFor="remember">Remember me</label>
                </div>
                <div className="forgot-password">
                    <Link to="/resetPassword">Forgot Password?</Link>
                </div>
                <button type="submit" className="login-button">Login</button>
                <div className="signup-link">
                    Don't have an account? <Link to="/signup">Sign up</Link>
                </div>
            </form>
        </div>
    );
}
