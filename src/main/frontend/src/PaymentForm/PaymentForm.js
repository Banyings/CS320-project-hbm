import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PaymentForm.css';

function Payment() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    amount: '',
    email: ''
  });

  const [paymentDetails, setPaymentDetails] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchPaymentSession = async () => {
      try {
        const paymentData = localStorage.getItem('paymentData');
        if (!paymentData) {
          navigate('/appointmentCart');
          return;
        }

        const { sessionId } = JSON.parse(paymentData);
        const response = await fetch(`/api/payment/session/${sessionId}`);
        if (!response.ok) throw new Error('Failed to fetch payment session');

        const data = await response.json();
        setPaymentDetails(data);
        setFormData((prev) => ({
          ...prev,
          amount: data.amount.toFixed(2),
          email: data.customerEmail || ''
        }));
      } catch (error) {
        console.error('Error fetching payment session:', error);
        navigate('/appointmentCart');
      }
    };

    fetchPaymentSession();
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};
    const cardNumberRegex = /^[0-9]{16}$/;
    const expiryDateRegex = /^(0[1-9]|1[0-2])\/\d{2}$/;
    const cvvRegex = /^[0-9]{3,4}$/;

    if (!formData.cardName) newErrors.cardName = 'Card name is required';
    if (!formData.cardNumber || !cardNumberRegex.test(formData.cardNumber.replace(/\s/g, '')))
      newErrors.cardNumber = 'Invalid card number';
    if (!formData.expiryDate || !expiryDateRegex.test(formData.expiryDate))
      newErrors.expiryDate = 'Invalid expiry date';
    if (!formData.cvv || !cvvRegex.test(formData.cvv)) newErrors.cvv = 'Invalid CVV';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitSuccess(false);

    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentSessionId: paymentDetails.sessionId,
            paymentMethod: {
              cardName: formData.cardName,
              cardNumber: formData.cardNumber.replace(/\s/g, ''),
              expiryDate: formData.expiryDate,
              cvv: formData.cvv
            },
            amount: paymentDetails.amount,
            customerEmail: formData.email
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Payment processing failed');
        }

        await fetch('/api/cart', { method: 'DELETE' });
        localStorage.removeItem('appointmentCart');
        localStorage.removeItem('paymentData');
        
        setSubmitSuccess(true);
        
        setTimeout(() => {
          navigate('/');
        }, 1500);
        
      } catch (error) {
        setSubmitError(error.message || 'An error occurred while processing your payment. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="payment-form-container">
      <h2>Complete Your Payment</h2>
      <form onSubmit={handleSubmit} className="payment-form">
        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleInputChange}
            className={errors.cardName ? 'error' : ''}
          />
          {errors.cardName && <p className="error-message">{errors.cardName}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            className={errors.cardNumber ? 'error' : ''}
          />
          {errors.cardNumber && <p className="error-message">{errors.cardNumber}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="expiryDate">Expiry Date (MM/YY)</label>
          <input
            type="text"
            id="expiryDate"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleInputChange}
            className={errors.expiryDate ? 'error' : ''}
          />
          {errors.expiryDate && <p className="error-message">{errors.expiryDate}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="cvv">CVV</label>
          <input
            type="text"
            id="cvv"
            name="cvv"
            value={formData.cvv}
            onChange={handleInputChange}
            className={errors.cvv ? 'error' : ''}
          />
          {errors.cvv && <p className="error-message">{errors.cvv}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <input type="text" id="amount" name="amount" value={formData.amount} readOnly />
        </div>

        <button type="submit" disabled={isSubmitting} className="submit-button">
          {isSubmitting ? 'Processing...' : 'Pay Now'}
        </button>
        {submitError && <p className="error-message">{submitError}</p>}
        {submitSuccess && <p className="success-message">Payment successful! Redirecting...</p>}
      </form>
    </div>
  );
}

export default Payment;
