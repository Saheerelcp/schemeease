import React from 'react'
import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
function LoginPage() {
  const [username, setUsername] = useState('');
  const [password , setPassword] = useState('')
  const [msg, setMsg] = useState('')

  const handleLogin = async(e) => {
    e.preventDefault();
    try {
       await axios.post(
        'http://localhost:8000/dj-rest-auth/login/',
        { username, password },
        {
          withCredentials: true, // important: sends and receives cookies
        }
      );
      setMsg('Login successful!')
    }
    catch (error) {
      console.error(error);
      setMsg('User does not exist');
    }
  }
    
  return (
     <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
  <form
    onSubmit={handleLogin}
    className="p-5 rounded-4 shadow bg-white"
    style={{ width: "100%", maxWidth: "400px" }}
  >
    <div className="text-center mb-4">
      <h2 className="text-primary fw-bold">Welcome Back</h2>
      <p className="text-muted">Please log in to your account</p>
    </div>

    <div className="mb-3">
      <label htmlFor="email" className="form-label fw-semibold">
        Username
      </label>
      <input
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="form-control"
        placeholder="Enter your email"
        required
      />
    </div>

    <div className="mb-4">
      <label htmlFor="password" className="form-label fw-semibold">
        Password
      </label>
      <input
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="form-control"
        placeholder="Enter your password"
        required
      />
    </div>

    <button type="submit" className="btn btn-primary w-100 fw-semibold">
      Log In
    </button>

    {msg && (
      <p className="mt-3 text-center text-danger small">
        {msg}
      </p>
    )}
    <div className="text-center mt-4">
      <span className="text-muted">Don't have an account? </span>
        <Link to="/register" className="text-primary fw-semibold text-decoration-none">
  Register
</Link>
    </div>
    <div className="text-center mt-4">
      <span className="text-muted">Don't have an account? </span>
        <Link to="/forgot-password" className="text-primary fw-semibold text-decoration-none">
    Forgot password?
</Link>
    </div>
  </form>
</div>

  )
}

export default LoginPage