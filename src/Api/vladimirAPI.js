import axios from "axios";

const Base_URL = process.env.VLADIMIR_BASE_URL

export const vladimirAPI = axios.create({
  baseURL: Base_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': ' application/json'
  }
})

vladimirAPI.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);
