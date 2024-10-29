import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './signup.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        setError(error.message);
        return;
      }

      const signupResponse = await response.json();
      // If the signup is successful, you can redirect the user or display a success message
      console.log('Signup successful! User ID:', signupResponse.userId);
    } catch (error) {
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <div className="signup-container">
      <h1>Create An account</h1>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            placeholder="mani109"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            placeholder="johdoe@gmail.com"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            placeholder="johxxxxxx"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Sign Up</button>
        <div className="login-link">
          Already have an account? <Link to="/login">Log In</Link>
        </div>
      </form>
    </div>
  );
}