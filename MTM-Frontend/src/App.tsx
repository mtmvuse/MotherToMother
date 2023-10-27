import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./AuthContext";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Login from "./pages/Auth/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import { HomeLayout } from "./pages/HomeLayout";
import { AuthLayout } from "./pages/Auth/AuthLayout";
import Profile from "./pages/Profile";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="home" element={<PrivateRoute element={<HomeLayout />} />}>
        <Route
          path="profile"
          element={<PrivateRoute element={<Profile />} />}
        />
      </Route>
      <Route path="/" element={<PrivateRoute element={<AuthLayout />} />}>
        <Route index element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
    </>,
  ),
);

const App: React.FC = () => (
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
);

export default App;
