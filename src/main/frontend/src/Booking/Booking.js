import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    service: '',
    date: '',
    time: '',
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({
    username: '',
    submit: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [processingTime, setProcessingTime] = useState(30);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(formData.username)) {
      setErrors(prev => ({
        ...prev,
        username: 'Please enter a valid email address'
      }));
      return;
    }

    setIsSubmitting(true);
    setErrors({ username: '', submit: '' });

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      // Show success message and start countdown
      setSuccessMessage('Almost there! Processing your booking...');
      
      // Start 30-second countdown
      let timeLeft = 30;
      const countdownInterval = setInterval(() => {
        timeLeft -= 1;
        setProcessingTime(timeLeft);
        
        if (timeLeft <= 0) {
          clearInterval(countdownInterval);
          navigate('/payment', { 
            state: { 
              bookingData: formData,
              bookingId: data.bookingId 
            } 
          });
        }
      }, 1000);

    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
      setSuccessMessage('');
      setProcessingTime(30);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    if (name === 'username') {
      setErrors(prev => ({
        ...prev,
        username: ''
      }));
    }
    setSuccessMessage('');
    setProcessingTime(30);
  };

  return (
    <div className="booking">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        {successMessage && (
          <div className="success-message">
            <div className="success-content">
              {successMessage}
              {isSubmitting && (
                <div className="processing-timer">
                  Redirecting to payment in {processingTime} seconds...
                </div>
              )}
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ 
                  width: `${((30 - processingTime) / 30) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        )}
        
        {errors.submit && (
          <div className="error-message">
            {errors.submit}
          </div>
        )}
        
        <label>
          Username:
          <input
            type="email"
            name="username"
            placeholder="johndoe@gmail.com"
            value={formData.username}
            onChange={handleInputChange}
            className={errors.username ? 'error' : ''}
            required
          />
          {errors.username && (
            <span className="error-message">
              {errors.username}
            </span>
          )}
        </label>

        <label>
          Service:
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a service</option>
            <option value="haircut">Haircut $25</option>
            <option value="shave">Shave $15</option>
            <option value="beard_trim">Beard Trim $10</option>
            <option value="beard_trim & haircut">Beard Trim & Haircut $35</option>
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Time:
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
          />
        </label>

        <label>
          Payment Method:
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="cash">Cash</option>
            <option value="cash_app">CashApp</option>
            <option value="paypal">PayPal</option>
            <option value="venmo">Venmo</option>
            <option value="zelle">Zelle</option>
          </select>
        </label>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className={isSubmitting ? 'submitting' : ''}
        >
          {isSubmitting ? 'Processing...' : 'Book Now'}
        </button>
      </form>
    </div>
  );
}

export default Booking;