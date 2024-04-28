import React from 'react';
import logo from '../assets/logo.png';

const Navbar = () => {
  return (
    <nav className='text-white w-full py-4 fixed top-0 left-0 flex items-center justify-between z-10'>
      <img src={logo} alt="" className='w-20 mx-8' />
      <ul className="hidden md:flex">
        <li className="p-4 my-1.5 mx-8 text-base">About</li>
        <li className="p-4 my-1.5 mx-8 text-base">Our Mission</li>
        <li className="p-4 my-1.5 mx-8 text-base">Template</li>
        <li className="p-4 my-1.5 mx-8 text-base">Reviews</li>
        <li className="p-4 my-1.5 mx-8 text-base">Contact Us</li>
        <li><button className='bg-white text-gray-800 mx-6 px-6 py-3 text-base rounded-full cursor-pointer border-none outline-none inline-flex items-center justify-center'>Log In</button></li>
      </ul>
      <button className='md:hidden bg-white text-gray-800 mx-6 px-6 py-3 text-base rounded-full cursor-pointer border-none outline-none inline-flex items-center justify-center'>Log In</button>
    </nav>
  );
}

export default Navbar;
