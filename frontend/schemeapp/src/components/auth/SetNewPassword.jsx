import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedEmail = localStorage.getItem('login_email');
    if (storedEmail) {
      setEmail(storedEmail);
    } else {
      setError('Email not found. Please restart the login process.');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/set-new-password/', {
        email,
        new_password: newPassword,
      });
      setMessage(response.data.message || 'Password updated successfully.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '500px', borderRadius: '12px' }}>
        <h3 className="mb-3 text-center text-primary">Set New Password</h3>
        {email && <p className="text-center mb-3"><strong>Email:</strong> {email}</p>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-group mb-3">
            <label>Confirm Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Update Password
          </button>
        </form>

        {message && <p className="mt-3 text-primary text-center">{message}</p>}
        {error && <p className="mt-3 text-danger text-center">{error}</p>}
      </div>
    </div>
  );
};

export default SetNewPasswordPage;
