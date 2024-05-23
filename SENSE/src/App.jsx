import * as React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './Components/SignUp/SignUpForm';
import PaidSignUpForm from './Components/SignUp/PaidSignUpForm';
import Landing from './Components/Landing/Landing';
import LoginForm from './Components/Login/LoginForm';
import BusinessUserHomepage from './Components/BusinessUser/BusinessUserHomepage';
import FreeUserHomepage from './Components/FreeUser/FreeUserHomepage';
import PremiumUserHomepage from './Components/PremiumUser/PremiumUserHomepage';
import SystemAdminHomepage from './Components/SystemAdmin/SystemAdminHomepage';
import CreateTemplate from './Components/BusinessUser/CreateTemplate';
import Room3D from './Components/BusinessUser/Room3D';
import ImportRoom from './Components/BusinessUser/ImportRoom';

const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/signup" element={<SignUpForm />} /> 
          <Route path="/paid-signup" element={<PaidSignUpForm/>} />
          <Route path="/login" element={<LoginForm/>} />
          <Route path="/BusinessUserHomepage" element={<BusinessUserHomepage/>} />
          <Route path="/FreeUserHomepage" element={<FreeUserHomepage/>} />
          <Route path="/PremiumUserHomepage" element={<PremiumUserHomepage/>} />
          <Route path="/SystemAdminHomepage" element={<SystemAdminHomepage/>} />
          <Route path="/CreateTemplate" element={<CreateTemplate/>} />
          <Route path="/Room3D" element={<Room3D/>} />
          <Route path="/ImportRoom" element={<ImportRoom/>} />
      </Routes>
    </Router>
      
  )
}

export default App
