import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',  // Changed from 'name' to 'username'
    service: '',
    date: '',
    time: '',
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({
    username: ''
  });

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate email before submission
    if (!validateEmail(formData.username)) {
      setErrors(prev => ({
        ...prev,
        username: 'Please enter a valid email address'
      }));
      return;
    }

    console.log(formData);
    navigateToPayment();
  };

  const navigateToPayment = () => {
    navigate('/payment', { state: { bookingData: formData } });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (name === 'username') {
      setErrors(prev => ({
        ...prev,
        username: ''
      }));
    }
  };

  return (
    <div className="booking">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label className='label'>
          Username:
          <input
            type="email"
            name="username"  // Changed from 'username' to 'name'
            placeholder='johndoe@gmail.com'
            value={formData.username}
            onChange={handleInputChange}
            required
          />
          {errors.username && (
            <span className="error-message" style={{ color: 'red', fontSize: '0.8em' }}>
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
        <button type="submit">Book Now</button>
      </form>
    </div>
  );
}

export default Booking;