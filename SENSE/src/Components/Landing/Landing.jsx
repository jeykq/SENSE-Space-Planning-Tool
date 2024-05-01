import React from 'react'
import Navbar from './Navbar'
import Sense from './Sense'
import Plan from './Plan'
import Reviews from './Reviews'
import Video from './Video'
import TemplateSlideshow from './TemplateSlideshow'
import MissionContact from './MissionContact'
import Footer from './Footer'


const Landing = () => {
  return (
    <div>
      <Navbar/>
      <Sense/>
      <Plan/>
      <Reviews/>
      <Video/>
      <TemplateSlideshow/>
      <MissionContact/>
      <Footer/>
    </div>
  )
}

export default Landing
