import React from 'react';

const ContactUs = () => {
  return (
    <div name='contactUs' className='text-black text-center mx-auto max-w-screen-lg p-6'>
      <div className='bg-white shadow-lg rounded-lg p-10'>
        <h1 className='text-4xl font-semibold mb-10 text-blue-700'>Contact Us</h1>
        <p className='text-lg my-10 leading-relaxed'>
          For inquiries, feedback, or assistance, please feel free to contact us using the following methods:
        </p>
        <ul className='text-lg space-y-4'>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📧</span>
            <a href='mailto:fypgp42@gmail.com' className='text-blue-600 hover:underline'>fypgp42@gmail.com</a>
          </li>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📞</span>
            <a href='tel:+6577712987' className='text-blue-600 hover:underline'>+65 777-129-87</a>
          </li>
          <li className='flex items-center justify-center'>
            <span className='mr-4'>📍</span>
            461 Clementi Rd, Singapore 599491
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ContactUs;
