import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SetNewPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
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
      navigate('/login')
      // Optional: redirect to login or dashboard
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update password.');
    }
  };

  return (
    <div className="set-password-container">
      <h2>Set New Password</h2>
      {email && <p><strong>Email:</strong> {email}</p>}
      <form onSubmit={handleSubmit}>
        <label>New Password:</label><br />
        <input
          type="password"
          placeholder="Enter new password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        /><br />
        <label>Confirm Password:</label><br />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br />
        <button type="submit">Update Password</button>
      </form>
      {message && <p style={{ color: 'green' }}>{message}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default SetNewPasswordPage;
