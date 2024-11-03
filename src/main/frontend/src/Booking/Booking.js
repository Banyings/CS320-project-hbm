// Booking.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Booking.css';

function Booking() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    service: '',
    date: '',
    time: '',
    paymentMethod: ''
  });

  const [errors, setErrors] = useState({
    email: '',
    time: '',
    submit: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState({});
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch services and prices from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesResponse, paymentMethodsResponse] = await Promise.all([
          fetch('/api/services'),
          fetch('/api/payment-methods')
        ]);

        if (!servicesResponse.ok || !paymentMethodsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const servicesData = await servicesResponse.json();
        const paymentMethodsData = await paymentMethodsResponse.json();

        setServices(servicesData);
        setPaymentMethods(paymentMethodsData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setErrors(prev => ({
          ...prev,
          submit: 'Failed to load booking data. Please refresh the page.'
        }));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateTime = (time) => {
    const [hours] = time.split(':').map(Number);
    return hours >= 8 && hours < 18;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Reset errors
    const newErrors = {
      email: '',
      time: '',
      submit: ''
    };

    // Validate email
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate time
    if (!validateTime(formData.time)) {
      newErrors.time = 'Please select a time between 8:00 AM and 6:00 PM';
    }

    // If there are any errors, don't submit
    if (newErrors.email || newErrors.time) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setErrors({ email: '', time: '', submit: '' });

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          price: services[formData.service] || 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create appointment');
      }

      const appointmentData = await response.json();
      
      // Get existing cart items from localStorage or initialize empty array
      const existingCart = JSON.parse(localStorage.getItem('appointmentCart') || '[]');
      const updatedCart = [...existingCart, appointmentData];
      localStorage.setItem('appointmentCart', JSON.stringify(updatedCart));

      navigate('/appointmentCart');
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
      window.scrollTo(0, 0); // Scroll to top to show error
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  if (isLoading) {
    return <div className="booking loading">Loading booking form...</div>;
  }

  return (
    <div className="booking">
      <h1>Book an Appointment</h1>
      
      {errors.submit && (
        <div className="error-message" role="alert">
          {errors.submit}
        </div>
      )}
      
      <form onSubmit={handleSubmit} noValidate>
        <label>
          Email:
          <input
            type="email"
            name="email"
            placeholder="johndoe@gmail.com"
            value={formData.email}
            onChange={handleInputChange}
            className={errors.email ? 'error' : ''}
            required
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span className="error-message" id="email-error" role="alert">
              {errors.email}
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
            {Object.entries(services).map(([service, price]) => (
              <option key={service} value={service}>
                {service.replace(/_/g, ' ')} (${price})
              </option>
            ))}
          </select>
        </label>

        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            min={new Date().toISOString().split('T')[0]}
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
            className={errors.time ? 'error' : ''}
            aria-invalid={errors.time ? 'true' : 'false'}
            aria-describedby={errors.time ? 'time-error' : undefined}
          />
          {errors.time && (
            <span className="error-message" id="time-error" role="alert">
              {errors.time}
            </span>
          )}
          <span className="helper-text">Business hours: 8:00 AM - 6:00 PM</span>
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
            {paymentMethods.map(method => (
              <option key={method} value={method}>
                {method.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </label>

        <button 
          type="submit" 
          disabled={isSubmitting || isLoading}
          className={isSubmitting ? 'submitting' : ''}
        >
          {isSubmitting ? 'Adding to Cart...' : 'Add to Cart'}
        </button>
      </form>
    </div>
  );
}

export default Booking;