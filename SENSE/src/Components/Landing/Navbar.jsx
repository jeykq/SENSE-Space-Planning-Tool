import React, { useEffect, useState } from 'react';
import logo from '../../assets/logo.png';
import { Link } from "react-scroll";
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const handleClickLogin = () => navigate('/login');
  const [sticky, setSticky] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(()=>{
    window.addEventListener('scroll', ()=>{
      window.scrollY > 40 ? setSticky(true) : setSticky(false);
    })
  },[]);

  return (
    <nav className={`navbar text-white w-full py-1 px-4 fixed top-0 left-0 flex items-center justify-between max-h-20 z-10 ${sticky ? 'bg-black duration-75' : ''}`}>
      <img src={logo} alt="" className='logo w-20 mx-2' />
      <button onClick={() => setSidebarOpen(!sidebarOpen)} className="fixed lg:hidden right-0 top-0 m-4 h-6 w-6 z-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div className={`h-screen w-52 lg:w-auto lg:max-h-20 bg-black bg-opacity-100 lg:bg-opacity-0 translate-y-[375px] lg:translate-y-0 ${sidebarOpen ? 'translate-x-4 sticky right-0 top-0' : 'translate-x-full lg:translate-x-0 opacity-0 lg:opacity-100'} duration-100 lg:translate-x-0 px-4`}>
        <ul className="flex flex-col lg:flex-row mb-4 mt-20 lg:mt-1">
          {/* <li className="p-4 my-1.5 mx-8 text-base"><Link to='plan' smooth={true} offset={-100} duration={500}>Plans</Link></li> */}
          <li className="py-4 px-2 my-1.5 mx-5 text-base text-nowrap"><Link onClick={() => setSidebarOpen(false)} to='reviews' smooth={true} offset={-150} duration={500}>Reviews </Link></li>
          <li className="py-4 px-2 my-1.5 mx-5 text-base text-nowrap"><Link onClick={() => setSidebarOpen(false)} to='video' smooth={true} offset={-80} duration={500}>Demo</Link></li>
          <li className="py-4 px-2 my-1.5 mx-5 text-base text-nowrap"><Link onClick={() => setSidebarOpen(false)} to='templates' smooth={true} offset={0} duration={500}>Templates</Link></li>
          <li className="py-4 px-2 my-1.5 mx-5 text-base text-nowrap"><Link onClick={() => setSidebarOpen(false)} to='missionContact' smooth={true} offset={-100} duration={500}>Our Mission</Link></li>
          <li className="py-4 px-2 my-1.5 mx-5 text-base text-nowrap"><Link onClick={() => setSidebarOpen(false)} to='missionContact' smooth={true} offset={0} duration={500}>Contact Us</Link></li>
          <li className="flex items-center px-2 my-1.5 mx-5 text-base text-nowrap"><button onClick={handleClickLogin} className='bg-white text-black rounded-full px-3 py-2 my-2 lg:my-0'>Log In</button></li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;