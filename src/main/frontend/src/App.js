import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [showBookButton, setShowBookButton] = useState(false);

  // Set page title and metadata
  useEffect(() => {
    // Update the document title
    document.title = "BanyingsBarshop - Home | Professional Barbershop Services";
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Welcome to BanyingsBarshop - Your premier destination for professional barbershop services. Book your appointment today!');
    }

    // Add home page class to body
    document.body.classList.add('home-page');
    
    // Cleanup function
    return () => {
      document.body.classList.remove('home-page');
    };
  }, []);

  const navigateToBooking = () => {
    navigate('/Booking');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("hello/personalized", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first: firstName, last: lastName }),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const text = await response.text();
      setMessage(text);
      
      if (text.toLowerCase().includes('you can now book an appointment')) {
        setShowBookButton(true);
      }
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Failed to fetch message from server');
    }
  };

  return (
    <div className="App home-page">
      <header className="home-header">
        <h1>Welcome To BanyingsBarshop</h1>
        <p className="subtitle">Your Premier Destination for Professional Grooming</p>
      </header>
      
      <main className="home-main">
        <section className="welcome-section">
          <form onSubmit={handleSubmit} className="welcome-form">
            <input
              type="text"
              placeholder="Enter Your First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              aria-label="First Name"
              className="input-field"
            />
            <input
              type="text"
              placeholder="Enter Your Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              aria-label="Last Name"
              className="input-field"
            />
            <button type="submit" className="submit-button">Submit</button>
          </form>
          
          {message && (
            <p className="message" role="alert">{message}</p>
          )}
          
          {showBookButton && (
            <button 
              className="book-now"
              onClick={navigateToBooking}
              aria-label="Book an appointment now"
            >
              Book Now
            </button>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;