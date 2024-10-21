import React, { useState } from 'react';
import './PaymentForm.css';

function Payment() {
  const [formData, setFormData] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = "Cardholder name is required";
    }

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required";
    } else if (!/^\d{16}$/.test(formData.cardNumber)) {
      newErrors.cardNumber = "Card number must be 16 digits";
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = "Expiry date is required";
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = "Expiry date must be in MM/YY format";
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required";
    } else if (!/^\d{3,4}$/.test(formData.cvv)) {
      newErrors.cvv = "CVV must be 3 or 4 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Payment form submitted:", formData);
      // Here you would typically send the data to your payment processor
    } else {
      console.log("Form has errors, please correct them");
    }
  };

  return (
    <div className="payment">
      <h2>Payment Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="cardName">Cardholder Name</label>
          <input
            type="text"
            id="cardName"
            name="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="John Doe"
          />
          {errors.cardName && <span className="error">{errors.cardName}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="cardNumber">Card Number</label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="1234 5678 9012 3456"
            maxLength="16"
          />
          {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="expiryDate">Expiry Date</label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength="5"
            />
            {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="cvv">CVV</label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.cvv}
              onChange={handleChange}
              placeholder="123"
              maxLength="4"
            />
            {errors.cvv && <span className="error">{errors.cvv}</span>}
          </div>
        </div>
        <button type="submit" className="submit-button">Pay Now</button>
      </form>
    </div>
  );
}

export default Payment;