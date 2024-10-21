import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './App.css';

function App() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');

  const navigateToServices = () => {
    navigate('/Services');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/hello/personalized", {
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
    } catch (error) {
      console.error('Error fetching message:', error);
      setMessage('Failed to fetch message from server');
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Welcome To BanyingsBarshop</h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Your First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Enter Your Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <button type="submit">Submit</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button onClick={navigateToServices}> Go To Services</button>
      </main>
    </div>
  );
}

export default App;
