// import axios from "axios";

// const API = axios.create({
//   baseURL: import.meta.env.VITE_API_URL, // 🔥 Auto switch for production & local
// });

// // Attach JWT token automatically
// API.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// export default API;


import axios from "axios";

// Create a single axios instance
const API = axios.create({
  // "baseURL: '/api'" tells the browser to use the current domain + /api
  // This is PERFECT for Nginx hosting.
  baseURL: "/api", 
});

// Automatically add the Token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 (Unauthorized) errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // If token expires, logout user
      localStorage.removeItem("token");
      localStorage.removeItem("userInfo");
      window.location.href = "/"; // Redirect to login
    }
    return Promise.reject(error);
  }
);

export default API;