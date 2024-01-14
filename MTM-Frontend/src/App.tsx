import React from "react";

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  Routes,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FormProvider } from "./contexts/FormContext";
// Routes
import ForgotPassword from "./pages/Auth/ForgotPassword/ForgotPassword";
import Login from "./pages/Auth/Login/Login";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import Register from "./pages/Auth/Register";
import { HomeLayout } from "./pages/HomeLayout";
import { AuthLayout } from "./pages/Auth/AuthLayout";
import Profile from "./pages/Profile/Profile";
import Form from "./pages/Form";
import EditProfile from "./pages/EditProfile/EditProfile";
import { ProfileLayout } from "./pages/Profile/ProfileLayout";
import SpecificItemPage from "./pages/SpecificItemPage";
import Home from "./pages/Home/Home";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<AuthLayout />}>
        <Route index element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="home" element={<PrivateRoute element={<HomeLayout />} />}>
        <Route index element={<Home />} />
        <Route path="profile" element={<ProfileLayout />}>
          <Route index element={<Profile />} />
          <Route path="edit" element={<EditProfile />} />
        </Route>

        <Route
          path="form/*"
          element={
            <FormProvider>
              <Routes>
                <Route index element={<Form />} />
                <Route
                  path="specific-item"
                  element={<PrivateRoute element={<SpecificItemPage />} />}
                />
              </Routes>
            </FormProvider>
          }
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
