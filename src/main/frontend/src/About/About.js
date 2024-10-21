import React from 'react';
import'./About.css';

function About() {
  return (
    <div className="about">
      <h1>About Us</h1>
      <p>
        Welcome to our barbershop! We’ve been serving the community for over 10 years,
        offering top-notch haircuts, shaves, and grooming services. Our team of professional
        barbers is dedicated to giving you the best experience.
      </p>
      <h2>Meet Our Team</h2>
      <ul>
        <li>John Doe - Master Barber</li>
        <li>Jane Smith - Senior Stylist</li>
        <li>Mike Johnson - Grooming Specialist</li>
      </ul>
    </div>
  );
}

export default About;
