import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    service: '',
    date: '',
    time: '',
    paymentMethod: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    // Here you might want to save the form data or pass it to the payment page
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
  };

  return (
    <div className="booking">
      <h1>Book an Appointment</h1>
      <form onSubmit={handleSubmit}>
        <label className='label'>
          Name:
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
          />
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