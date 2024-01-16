import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { AuthProvider } from "./lib/contexts";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import LoginLink from "./pages/Auth/LoginLink";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import HomeLayout from "./pages/HomeLayout";
import Profile from "./pages/Profile";
import UserManagement from "./pages/UserManagement";

export const App = () => {
  const email = localStorage.getItem("emailForSignIn");
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/loginLink" element={<LoginLink email={email} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          {/* Home Page Routes */}
          <Route path="/" element={<PrivateRoute element={<HomeLayout />} />}>
            <Route path="userManagement" element={<UserManagement />} />
            <Route
              path="profile"
              element={<PrivateRoute element={<Profile />} />}
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
