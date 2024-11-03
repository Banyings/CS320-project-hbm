import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ResetPassword.css';

export default function ResetPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        email: '',
        code: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/rest-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: formData.email })
            });

            if (!response.ok) {
                const error = await response.json();
                setError(error.error);
                return;
            }

            setStep(2);
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    const handleResetSubmit = async (e) => {
        e.preventDefault();
        if (formData.newPassword !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (formData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            return;
        }

        try {
            const response = await fetch('/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    code: formData.code,
                    newPassword: formData.newPassword
                })
            });

            if (!response.ok) {
                const error = await response.json();
                setError(error.error);
                return;
            }

            alert('Password reset successful!');
            navigate('/login');
        } catch (error) {
            setError('An error occurred. Please try again later.');
        }
    };

    return (
        <div className="reset-container">
            <h1 className="reset-title">Reset Password</h1>
            {error && <div className="error-message">{error}</div>}
            
            {step === 1 ? (
                <form onSubmit={handleEmailSubmit}>
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
                    <button type="submit">Send Reset Code</button>
                </form>
            ) : (
                <form onSubmit={handleResetSubmit}>
                    <div className="form-group">
                        <label htmlFor="code">Verification Code</label>
                        <input
                            type="text"
                            id="code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="Enter verification code"
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
                    <button type="submit">Reset Password</button>
                </form>
            )}
            
            <div className="login-link">
                Remember your password? <Link to="/login">Login</Link>
            </div>
        </div>
    );
}