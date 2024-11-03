
import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaImages, FaCalendarAlt, FaInfoCircle,FaShoppingCart,FaCreditCard, FaEnvelope } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="nav">
      <div className="logo">
        <img src="/src/main/frontend/public/logo.png" alt="logo"/>
      </div>
      <div className="nav-links">
        <Link to="/" title="Home"><FaHome /><span className="link-text">Home</span></Link>
        <Link to="/about" title="About"><FaInfoCircle /><span className="link-text">About</span></Link>
        <Link to="/booking" title="Booking"><FaCalendarAlt /><span className="link-text">Booking</span></Link>
        <Link to="/contact" title="Contact"><FaEnvelope /><span className="link-text">Contact</span></Link>
        <Link to="/services" title="Services"><FaImages /><span className="link-text">Services</span></Link>
        <Link to="/appointmentCart" title="shoppincart"><FaShoppingCart /><span className="link-text">Cart</span></Link>
        <Link to="/payment" title="Services"><FaCreditCard/><span className="link-text">Payment</span></Link>
      </div>
    </nav>
  );
}
