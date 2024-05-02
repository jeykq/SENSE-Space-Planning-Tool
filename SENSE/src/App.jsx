import * as React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpForm from './Components/SignUp/SignUpForm';
import PaidSignUpForm from './Components/SignUp/PaidSignUpForm';
import Landing from './Components/Landing/Landing';
import LoginForm from './Components/Login/LoginForm';


const App = () => {
  return (
    <Router>
      <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/signup" element={<SignUpForm />} /> 
          <Route path="/paid-signup" element={<PaidSignUpForm/>} />
          <Route path="/login" element={<LoginForm/>} />
      </Routes>
    </Router>
      
  )
}

export default App
