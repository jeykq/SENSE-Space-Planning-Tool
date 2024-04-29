import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from "react-scroll";

const Navbar = () => {

    const [sticky, setSticky] = useState(false);
    useEffect(()=>{
      window.addEventListener('scroll', ()=>{
        window.scrollY > 40 ? setSticky(true) : setSticky(false);
      })
    },[]);

  return (
    <nav className={`navbar text-white w-full py-1 fixed top-0 left-0 flex items-center justify-between z-10 ${sticky? 'bg-black duration-75' : ''}`}
                    >
      <img src={logo} alt="" className='logo w-20' />
      <ul className="md:flex">
        {/* <li className="p-4 my-1.5 mx-8 text-base"><Link to='plan' smooth={true} offset={-100} duration={500}>Plans</Link></li> */}
        <li className="p-4 my-1.5 mx-5 text-base"><Link to='reviews' smooth={true} offset={-150} duration={500}>Reviews</Link></li>
        <li className="p-4 my-1.5 mx-5 text-base"><Link to='video' smooth={true} offset={-80} duration={500}>Demo</Link></li>
        <li className="p-4 my-1.5 mx-5 text-base"><Link to='templates' smooth={true} offset={0} duration={500}>Templates</Link></li>
        <li className="p-4 my-1.5 mx-5 text-base"><Link to='missionContact' smooth={true} offset={-100} duration={500}>Our Mission</Link></li>
        <li className="p-4 my-1.5 mx-5 text-base"><Link to='missionContact' smooth={true} offset={0} duration={500}>Contact Us</Link></li>
        <li><button className='btn '>Log In</button></li>
      </ul>
    </nav>
  );
}

export default Navbar;
