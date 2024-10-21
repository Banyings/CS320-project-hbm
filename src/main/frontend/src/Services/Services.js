import React from 'react';
import './Services.css';

function Services() {
  const services = [
    { name: 'Haircut', price: '$25' },
    { name: 'Shave', price: '$15' },
    { name: 'Beard Trim', price: '$10' },
    { name: 'Haircut & Beard Trim', price: '$35' }
  ];

  return (
    <div className="services">
      <h1>Our Services</h1>
      <ul>
        {services.map((service, index) => (
          <li key={index}>
            {service.name} - {service.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Services;
