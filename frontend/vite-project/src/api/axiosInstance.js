import axios from "axios";

// Create a centralized axios instance
const axiosInstance = axios.create({
  // Use VITE_API_BASE_URL from env, or default to Render in production and localhost in dev
  baseURL: import.meta.env.VITE_API_BASE_URL || 
          (import.meta.env.MODE === "production" ? "https://mern-backend-rfm6.onrender.com" : "http://localhost:4000"),
  withCredentials: true
});

export default axiosInstance;
