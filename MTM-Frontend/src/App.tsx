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
import Form from "./pages/Form";
import EditProfile from "./pages/EditProfile";
import { ProfileLayout } from "./pages/ProfileLayout";
import SpecificItemPage from "./pages/SpecificItemPage";
import Home from "./pages/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
      </Route>
      <Route path="home" element={<PrivateRoute element={<HomeLayout />} />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Profile />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>
        <Route path="form" element={<PrivateRoute element={<Form />} />} />
        <Route
          path="specificitem"
          element={<PrivateRoute element={<SpecificItemPage />} />}
        />
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
