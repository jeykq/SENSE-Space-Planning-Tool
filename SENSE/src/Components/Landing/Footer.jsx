import React from 'react'

const Footer = () => {
  return (
    <div className='my-2.5 mx-10 flex items-center justify-between border-t border-solid border-gray-600 py-4'>
      <p>@ 2024 SENSE. All rights reserved.</p>
      <ul>
        <a href="/TermsOfService" className='list-none inline-block ml-5 hover:underline'>Terms of Service</a>
        <a href="/PrivacyPolicy" className='list-none inline-block ml-5 hover:underline'>Privacy Policy</a>
      </ul>
    </div>
  )
}

export default Footer
