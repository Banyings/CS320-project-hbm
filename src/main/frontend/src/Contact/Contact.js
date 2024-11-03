import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Contact.css';

function Contact() {
  const [showThankYou, setShowThankYou] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowThankYou(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        alert('Error sending message. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error sending message. Please try again.');
    }
  };

  if (showThankYou) {
    return (
      <div className="thank-you-message">
        <h2>Thanks for contacting us!</h2>
        <p>We will shortly get back to you</p>
        <p className="redirecting">Redirecting to home page...</p>
      </div>
    );
  }

  return (
    <div className="contact">
      <h1>Contact Us</h1>
      <div className="contact-info">
        <div className="info-item">
          <i className="location-icon">📍</i>
          <p>123 Barber Street, YourCity, Country</p>
        </div>
        <div className="info-item">
          <i className="phone-icon">📞</i>
          <p>Phone: (123) 456-xxxx</p>
        </div>
        <div className="info-item">
          <i className="email-icon">✉️</i>
          <p>Email: info@barbershop.com</p>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
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
          <label htmlFor="message">Message:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Type your message here"
            required
          ></textarea>
        </div>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Contact;