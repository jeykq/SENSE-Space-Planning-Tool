import React from 'react'
import Navbar from './Components/Navbar'
import Sense from './Components/Sense'
import Plan from './Components/Plan'
import Reviews from './Components/Reviews'
import Video from './Components/Video'
import TemplateSlideshow from './Components/TemplateSlideshow'
import MissionContact from './Components/MissionContact'

const App = () => {
  return (
    <div>
      <Navbar/>
      <Sense/>
      <Plan/>
      <Reviews/>
      <Video/>
      <TemplateSlideshow/>
      <MissionContact/>
    </div>
  )
}

export default App
