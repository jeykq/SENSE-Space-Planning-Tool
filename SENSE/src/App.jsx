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
import BU_UpdateObjectInfo from './Components/BusinessUser/BU_UpdateObjectInfo';
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
import SA_UpdateLandingPage from './Components/SystemAdmin/SA_UpdateLandingPage';
import GiveReview from './Components/ManageAccount/GiveReview';
import ApplyBusinessUser from './Components/ManageAccount/ApplyBusinessUser';
import BuySubscription from './Components/ManageAccount/BuySubscription';
import FU_Room3D from './Components/FreeUser/FU_Room3D';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Landing />} />
        <Route path="/signup" element={<SignUpForm />} /> 
        <Route path="/paid-signup" element={<PaidSignUpForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/BusinessUserHomepage" element={<BusinessUserHomepage />} />
        <Route path="/FreeUserHomepage" element={<FreeUserHomepage />} />
        <Route path="/PremiumUserHomepage" element={<PremiumUserHomepage />} />
        <Route path="/SystemAdminHomepage" element={<SystemAdminHomepage />} />
        <Route path="/CreateTemplate" element={<CreateTemplate />} />
        <Route path="/ViewTemplates" element={<ViewTemplates />} />
        <Route path="/Room3D" element={<Room3D />} />
        <Route path="/ImportRoom" element={<ImportRoom />} />
        <Route path="/BU_ViewObjects" element={<BU_ViewObjects />} />
        <Route path="/BU_ViewObjectsInfo" element={<BU_ViewObjectsInfo />} />
        <Route path="/BU_ImportObjects" element={<BU_ImportObjects />} />
        <Route path="/BU_UpdateObjectInfo" element={<BU_UpdateObjectInfo />} />
        <Route path="/viewaccount" element={<ViewAccount />} />
        <Route path="/updateaccount" element={<UpdateAccount />} />
        <Route path="/ChangePassword" element={<ChangePassword />} />
        <Route path="/ThreeDPreview" element={<ThreeDPreview />} />
        <Route path="/viewuser/:id" element={<SA_ViewUserAccount />} />
        <Route path="/manageSignUpPage" element={<SA_ManageSignUpPage />} />
        <Route path="/manageObjectCategories" element={<SA_ManageObjCategoriesPage />} />
        <Route path="/manageTags" element={<SA_ManageTagsPage />} />
        <Route path="/manageRoomTypes" element={<SA_ManageRoomTypesPage />} />
        <Route path="/updateLandingPage" element={<SA_UpdateLandingPage />} />
        <Route path="/GiveReview" element={<GiveReview />} />
        <Route path="/BuySubscription" element={<BuySubscription />} />
        <Route path="/ApplyBusinessUser" element={<ApplyBusinessUser />} />
      </Routes>
    </Router>
  )
}

export default App;
