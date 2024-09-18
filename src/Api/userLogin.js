import axios from "axios";

const Base_URL = process.env.VLADIMIR_BASE_URL;

export const userLogin = axios.create({
  baseURL: Base_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: " application/json",
  },
});

userLogin.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
