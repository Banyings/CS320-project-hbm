import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Booking from'./Booking/Booking';
import About from './About/About';
import Contact from'./Contact/Contact';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Navbar from './Navbar/Navbar'
import Services from './Services/Services';
import Payment from './PaymentForm/PaymentForm';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes>
      <Route path="/" element ={<App/>}/>
       {/* <Route path="/Gallery" element ={<Gallery/>}/> */}
       <Route path = "/booking" element ={<Booking/>}/>
       <Route path = "/about" element ={<About/>}/>
       <Route path = "/contact" element ={<Contact/>}/>
       <Route path = "/services" element ={<Services/>}/>
       <Route path = "/payment" element ={<Payment/>}/>
    </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
