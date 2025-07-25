import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css'
import { Link, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPassword from './components/auth/ForgotPassword';
import ChangePassword from './components/auth/ChangePassword';
import SetNewPasswordPage from './components/auth/SetNewPassword';

function App() {
  return (
    <Router>
      <Routes>
          <Route path='/' element = {<LoginPage/>} />
          <Route path='/register' element={<RegisterPage/>} />
          <Route path='/forgot-password' element={<ForgotPassword/>} />
          <Route path='/otp-verify' element={<ChangePassword/>} />
          <Route path='/confirm-password' element={<SetNewPasswordPage/>} />
      </Routes>
    </Router>
  )
}

export default App
