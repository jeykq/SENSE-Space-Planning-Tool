import React from 'react'
import Navbar from './Navbar'
import Sense from './Sense'
import Plan from './Plan'
import Reviews from './Reviews'
import UserJobIndustryChart from './UserJobIndustryChart'
import Video from './Video'
import TemplateSlideshow from './TemplateSlideshow'
import OurMission from './OurMission'
import ContactUs from './ContactUs'
import Footer from './Footer'


const Landing = () => {
  return (
    <div>
      <Navbar/>
      <Sense/>
      <Plan/>
      <Reviews/>
      <UserJobIndustryChart/>
      <Video/>
      <TemplateSlideshow/>
      <OurMission/>
      <ContactUs/>
      <Footer/>
    </div>
  )
}

export default Landing
