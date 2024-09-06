import React, { useEffect } from "react";
import { Navigate, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import LoginPage from "../Layout/LoginPage";
import PageNotFound from "../Pages/PageNotFound";

export const PrivateRoutes = () => {
  const token = localStorage.getItem("token");
  const userData = JSON.parse(localStorage.getItem("user"));
  const userRolePermissions = userData?.role?.access_permission?.split(", ") || [];

  const navigate = useNavigate();
  const location = useLocation();
  const matches = useMatches(); // Access route metadata

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [navigate, token]);

  if (!token) {
    return <Navigate to="/login" />;
  }

  // Get the matched route for the current path
  const matchedRoute = matches.find((route) => route.pathname === location.pathname);
  const requiredPermission = matchedRoute?.handle?.permission;

  // If the route doesn't require a specific permission, allow access
  if (!requiredPermission) {
    return <Outlet />;
  }

  // Check if the user has the required permission
  const hasPermission = userRolePermissions.includes(requiredPermission);

  return hasPermission ? <Outlet /> : <PageNotFound />;
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
