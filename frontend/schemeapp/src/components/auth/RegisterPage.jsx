import axios from 'axios';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password1, setPassword1] = useState('');
  const [password2, setPassword2] = useState('');
  const [msg, setMsg] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    console.log({ username, email, password1, password2 });

    try {
       await axios.post(
        'http://localhost:8000/dj-rest-auth/registration/',
        {
          username,
          email,
          password1,
          password2
        },
        {
          withCredentials: true,
        }
      );
      setMsg(' Registration successful!');
    } catch (error) {
      console.error(error);
      if (error.response?.data) {
        const data = error.response.data;
        const firstError =
          data.username?.[0] ||
          data.email?.[0] ||
          data.password1?.[0] ||
          data.non_field_errors?.[0] ||
          'Registration failed!';
        setMsg(firstError);
      } else {
        setMsg('Something went wrong.');
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form
        onSubmit={handleRegister}
        className="p-5 rounded-4 shadow bg-white w-100"
        style={{ maxWidth: '500px' }}
      >
        <div className="text-center mb-4">
          <h2 className="text-success fw-bold">Create Account</h2>
          <p className="text-muted">Sign up to get started</p>
        </div>

        <div className="mb-3">
          <label htmlFor="username" className="form-label fw-semibold">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="form-control"
            placeholder="Choose a username"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="email" className="form-label fw-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="password1" className="form-label fw-semibold">
            Password
          </label>
          <input
            type="password"
            id="password1"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
            className="form-control"
            placeholder="Minimum 8 characters"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password2" className="form-label fw-semibold">
            Confirm Password
          </label>
          <input
            type="password"
            id="password2"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            className="form-control"
            placeholder="Re-enter password"
            required
          />
        </div>

        <button type="submit" className="btn btn-success w-100 fw-semibold">
          Register
        </button>

        {msg && (
          <p className="mt-3 text-center text-danger small">
            {msg}
          </p>
        )}
        <div className="text-center mt-4">
              <span className="text-muted">If already have account? </span>
                <Link to="/" className="text-primary fw-semibold text-decoration-none">
          Login here
        </Link>
            </div>
      </form>
    </div>
  );
}

export default RegisterPage;
