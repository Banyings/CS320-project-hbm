import React from 'react';
import './Contact.css'
function Contact() {
  return (
    <div className="contact">
        <h1>Contact Us</h1>
      <form>
      <p>Address: 123 Barber Street, YourCity, Country</p>
      <p>Phone: (123) 456-xxxx</p>
      <p>Email: info@barbershop.com</p>
        <label>
          Name:
          <input type="text" name="name" />
        </label>
        <label>
          Email:
          <input type="email" name="email" />
        </label>
        <label>
          Message:
          <textarea name="message"></textarea>
        </label>
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default Contact;
