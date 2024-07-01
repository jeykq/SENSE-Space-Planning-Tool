// App.js
import * as React from 'react';
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
import SA_ManageRoomTypesPage from './Components/SystemAdmin/SA_ManageRoomTypes';
import GiveReview from './Components/ManageAccount/GiveReview';
import ApplyBusinessUser from './Components/ManageAccount/ApplyBusinessUser';
import { AuthProvider } from './AuthContext';
import ProtectedRoute from './ProtectedRoute'; 

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" exact element={<Landing />} />
          <Route path="/signup" element={<SignUpForm />} /> 
          <Route path="/paid-signup" element={<PaidSignUpForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/BusinessUserHomepage" element={<ProtectedRoute><BusinessUserHomepage /></ProtectedRoute>} />
          <Route path="/FreeUserHomepage" element={<ProtectedRoute><FreeUserHomepage /></ProtectedRoute>} />
          <Route path="/PremiumUserHomepage" element={<ProtectedRoute><PremiumUserHomepage /></ProtectedRoute>} />
          <Route path="/SystemAdminHomepage" element={<ProtectedRoute><SystemAdminHomepage /></ProtectedRoute>} />
          <Route path="/CreateTemplate" element={<ProtectedRoute><CreateTemplate /></ProtectedRoute>} />
          <Route path="/ViewTemplates" element={<ProtectedRoute><ViewTemplates /></ProtectedRoute>} />
          <Route path="/Room3D" element={<ProtectedRoute><Room3D /></ProtectedRoute>} />
          <Route path="/ImportRoom" element={<ProtectedRoute><ImportRoom /></ProtectedRoute>} />
          <Route path="/BU_ViewObjects" element={<ProtectedRoute><BU_ViewObjects /></ProtectedRoute>} />
          <Route path="/BU_ViewObjectsInfo" element={<ProtectedRoute><BU_ViewObjectsInfo /></ProtectedRoute>} />
          <Route path="/BUdelete" element={<ProtectedRoute><BUdelete /></ProtectedRoute>} />
          <Route path="/BU_ImportObjects" element={<ProtectedRoute><BU_ImportObjects /></ProtectedRoute>} />
          <Route path="/viewaccount" element={<ProtectedRoute><ViewAccount /></ProtectedRoute>} />
          <Route path="/updateaccount" element={<ProtectedRoute><UpdateAccount /></ProtectedRoute>} />
          <Route path="/ChangePassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
          <Route path="/ThreeDPreview" element={<ProtectedRoute><ThreeDPreview /></ProtectedRoute>} />
          <Route path="/viewuser/:id" element={<ProtectedRoute><SA_ViewUserAccount /></ProtectedRoute>} />
          <Route path="/manageSignUpPage" element={<ProtectedRoute><SA_ManageSignUpPage /></ProtectedRoute>} />
          <Route path="/manageObjectCategories" element={<ProtectedRoute><SA_ManageObjCategoriesPage /></ProtectedRoute>} />
          <Route path="/manageTags" element={<ProtectedRoute><SA_ManageTagsPage /></ProtectedRoute>} />
          <Route path="/manageRoomTypes" element={<ProtectedRoute><SA_ManageRoomTypesPage /></ProtectedRoute>} />
          <Route path="/GiveReview" element={<ProtectedRoute><GiveReview /></ProtectedRoute>} />
          <Route path="/ApplyBusinessUser" element={<ProtectedRoute><ApplyBusinessUser /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App;
