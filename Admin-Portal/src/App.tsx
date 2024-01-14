import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/contexts";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import HomeLayout from "./pages/HomeLayout";
import Profile from "./pages/Profile";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Home Page Routes */}
          <Route path="/" element={<PrivateRoute element={<HomeLayout />} />}>
            <Route index element={<PrivateRoute element={<Profile />} />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
