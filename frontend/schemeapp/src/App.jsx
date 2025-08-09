import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import {  Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';
import SetNewPasswordPage from './components/auth/SetNewPassword';
import Dashboard from './components/dashboard/Dashboard';
import UserProfile from './components/profile/UserProfile';
import SchemeList from './components/schemes/SchemeList';
import ViewScheme from './components/schemes/ViewScheme';
import ApplyScheme from './components/schemes/ApplyScheme';
import Application from './components/schemes/Application';
import ResultApply from './components/schemes/ResultApply';
import Bookmark from './components/schemes/Bookmark';
import Recommended from './components/schemes/Recommended';

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element = {<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/otp-verify' element={<ChangePassword/>} />
          <Route path='/confirm-password' element={<SetNewPasswordPage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/user-profile' element={<UserProfile/>} />
          <Route path='/scheme/:category' element={<SchemeList/>} />
          <Route path='/view-scheme/:schemeId' element={<ViewScheme/>} />
          <Route path='/apply-scheme/:schemeId' element={<ApplyScheme/>} />
          <Route path='/application-view' element={<Application/>} />
          <Route path='/result-apply/:applicationId' element={<ResultApply/>} />
          <Route path='/bookmark-view' element={<Bookmark/>} />
          <Route path='/recommended-view' element={<Recommended/>} />
      </Routes>
    </Router>
  )
}

export default App
