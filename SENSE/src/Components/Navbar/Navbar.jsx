import React from 'react';
import './Navbar.css';
import logo from '../../assets/room.png';

const Navbar = () => {
  return (
    <nav className='container'>
      <img src={logo} alt="" className='logo' />
      <ul>
        <li>About</li>
        <li>Our Mission</li>
        <li>Template</li>
        <li>Reviews</li>
        <li>Contact Us</li>
        <li><button className='btn'>Log In</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
