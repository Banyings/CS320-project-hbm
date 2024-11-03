import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

const AppointmentCart = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cartTotals, setCartTotals] = useState({
    subtotal: 0,
    tax: 0,
    serviceFee: 0,
    total: 0
  });

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        // Fetch cart items from backend
        const savedCart = localStorage.getItem('appointmentCart');
        if (savedCart) {
          const cartItems = JSON.parse(savedCart);
          
          // Get updated pricing from backend
          const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: cartItems })
          });

          if (!response.ok) throw new Error('Failed to calculate cart totals');
          
          const { items, totals } = await response.json();
          setAppointments(items);
          setCartTotals(totals);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        // Fallback to local data if API fails
        const savedCart = localStorage.getItem('appointmentCart');
        if (savedCart) {
          setAppointments(JSON.parse(savedCart));
        }
      }
    };

    fetchCartData();
  }, []);

  const handleRemoveAppointment = async (index) => {
    try {
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      
      if (updatedAppointments.length === 0) {
        await fetch('/api/cart', { method: 'DELETE' });
        localStorage.removeItem('appointmentCart');
        localStorage.removeItem('paymentData');
        navigate('/booking');
        return;
      }

      // Update cart in backend
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: updatedAppointments })
      });

      if (!response.ok) throw new Error('Failed to update cart');

      const { items, totals } = await response.json();
      setAppointments(items);
      setCartTotals(totals);
      localStorage.setItem('appointmentCart', JSON.stringify(items));

    } catch (error) {
      console.error('Error updating cart:', error);
      // Fallback to local update if API fails
      const updatedAppointments = appointments.filter((_, i) => i !== index);
      setAppointments(updatedAppointments);
      localStorage.setItem('appointmentCart', JSON.stringify(updatedAppointments));
    }
  };

  const handleProceedToPayment = async () => {
    if (appointments.length === 0) return;

    setIsProcessing(true);
    try {
      const customerEmail = appointments[0]?.email;
      
      // Initialize payment session in backend
      const response = await fetch('/api/payment/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: appointments,
          customerEmail,
          totals: cartTotals
        })
      });

      if (!response.ok) throw new Error('Failed to initialize payment');

      const paymentData = await response.json();
      localStorage.setItem('paymentData', JSON.stringify(paymentData));
      navigate('/payment');
    } catch (error) {
      console.error('Error proceeding to payment:', error);
      alert('There was an error proceeding to payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Appointment Cart</h2>
      <div className="appointments-list">
        {appointments.map((appointment, index) => (
          <div key={index} className="appointment-item">
            <p><strong>Service:</strong> {appointment.service}</p>
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Time:</strong> {appointment.time}</p>
            <button onClick={() => handleRemoveAppointment(index)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="cart-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>${cartTotals.subtotal.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Tax:</span>
          <span>${cartTotals.tax.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Service Fee:</span>
          <span>${cartTotals.serviceFee.toFixed(2)}</span>
        </div>
        <div className="total-row">
          <span>Total:</span>
          <span>${cartTotals.total.toFixed(2)}</span>
        </div>
      </div>

      <button
        className="proceed-button"
        onClick={handleProceedToPayment}
        disabled={isProcessing}
      >
        {isProcessing ? 'Processing...' : 'Proceed to Payment'}
      </button>
    </div>
  );
};

export default AppointmentCart;
