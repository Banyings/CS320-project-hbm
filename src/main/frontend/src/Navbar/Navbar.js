import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaImages, FaCalendarAlt, FaInfoCircle, FaEnvelope } from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="nav">
      <div className="logo">Logo</div>
      
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      
      <div className={`nav-links ${isOpen ? 'show' : ''}`}>
        <Link to="/"><FaHome /> Home</Link>
        <Link to="/about"><FaInfoCircle /> About</Link>
        <Link to="/booking"><FaCalendarAlt /> Booking</Link>
        <Link to="/contact"><FaEnvelope /> Contact</Link>
        <Link to="/services"><FaImages /> Services</Link>
      </div>
    </nav>
  );
}
