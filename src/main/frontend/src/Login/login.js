import React from 'react';
import { Link } from 'react-router-dom';
import './login.css';

export default function Login() {
    return (
        <div className="login-container">
            <h1 className="welcome-back">Welcome Back</h1>
            <form>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        placeholder="johdoe@gmail.com"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        id="password"
                        placeholder="johxxxxxx"
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