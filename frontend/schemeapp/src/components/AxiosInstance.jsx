import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/',
  withCredentials: true, // very important for sending cookies
});

axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    // If 401 Unauthorized and it's the first retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try refreshing the token using cookies (no need for refresh token in body)
        await axios.post('http://localhost:8000/api/token/refresh/', null, {
          withCredentials: true,
        });

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error('Refresh failed. Redirecting to login.', err);

        // Redirect to login
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
