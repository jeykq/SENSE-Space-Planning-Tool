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
import ViewTemplates from './Components/BusinessUser/ViewTemplates';
import Room3D from './Components/BusinessUser/Room3D';
import ImportRoom from './Components/BusinessUser/ImportRoom';
import BU_ViewObjects from './Components/BusinessUser/BU_ViewObjects';
import BU_ViewObjectsInfo from './Components/BusinessUser/BU_ViewObjectsInfo';
import BUdelete from './Components/BusinessUser/BUdelete';
import ViewAccount from './Components/ManageAccount/ViewAccount';
import UpdateAccount from './Components/ManageAccount/UpdateAccount';
import ChangePassword from './Components/ManageAccount/ChangePassword';
import BU_ImportObjects from './Components/BusinessUser/BU_ImportObjects';
import ThreeDPreview from './Components/BusinessUser/ThreeDPreview';
import SA_ViewUserAccount from './Components/SystemAdmin/SA_ViewUserAcc';
import SA_ManageSignUpPage from './Components/SystemAdmin/SA_ManageSignUpPage';
import SA_ManageObjCategoriesPage from './Components/SystemAdmin/SA_ManageObjCategories';
import SA_ManageTagsPage from './Components/SystemAdmin/SA_ManageTags';

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
          <Route path="/ViewTemplates" element={<ViewTemplates />} />
          <Route path="/Room3D" element={<Room3D/>} />
          <Route path="/ImportRoom" element={<ImportRoom/>} />
          <Route path="/BU_ViewObjects" element={<BU_ViewObjects/>} />
          <Route path="/BU_ViewObjectsInfo" element={<BU_ViewObjectsInfo/>} />
          <Route path="/BUdelete" element={<BUdelete/>} />
          <Route path="/BU_ImportObjects" element={<BU_ImportObjects/>} />
          <Route path="/viewaccount" element={<ViewAccount/>} />
          <Route path="/updateaccount" element={<UpdateAccount/>} />
          <Route path="/ChangePassword" element={<ChangePassword/>} />
          <Route path="/ThreeDPreview" element={<ThreeDPreview/>} />
          <Route path="/viewuser/:id" element={<SA_ViewUserAccount />} />
          <Route path="/manageSingUpPage" element={<SA_ManageSignUpPage/>} />
          <Route path="/manageObjectCategories" element={<SA_ManageObjCategoriesPage/>} />
          <Route path="/manageTags" element={<SA_ManageTagsPage/>} />
          
      </Routes>
    </Router>
      
  )
}

export default App
