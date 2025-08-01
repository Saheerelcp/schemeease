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
      </Routes>
    </Router>
  )
}

export default App
