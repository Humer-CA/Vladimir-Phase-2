import React, { useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import LoginPage from "../Layout/LoginPage";

export const PrivateRoutes = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  let auth = { token };
  return auth.token ? <Outlet /> : <Navigate to="/login" />;
};

export const LoginRoutes = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();
  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  let auth = { token };
  return auth.token ? <Navigate to="/" /> : <LoginPage />;
};
