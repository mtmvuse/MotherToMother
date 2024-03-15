import React, { useEffect } from "react";
import { CACHE_KEY } from "./lib/constants";
import { Route, Routes, BrowserRouter } from "react-router-dom";
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
import Success from "./pages/Success";
import { useState } from "react";

export interface SharedStates {
  setSavedUserType: (newUserType: string) => void;
}

const App: React.FC = () => {
  const [savedUserType, setSavedUserType] = useState<string>("");
  useEffect(() => {
    const savedUserType = localStorage.getItem(CACHE_KEY.USER_TYPE);
    if (savedUserType) {
      setSavedUserType(savedUserType);
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route
              index
              element={<Login setSavedUserType={setSavedUserType} />}
            />
            <Route
              path="register"
              element={<Register setSavedUserType={setSavedUserType} />}
            />
            <Route path="forgotPassword" element={<ForgotPassword />} />
          </Route>
          <Route
            path="home"
            element={
              <PrivateRoute
                element={<HomeLayout savedUserType={savedUserType} />}
              />
            }
          >
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
                      path="specificItem"
                      element={<PrivateRoute element={<SpecificItemPage />} />}
                    />
                    <Route
                      path="success"
                      element={<PrivateRoute element={<Success />} />}
                    />
                  </Routes>
                </FormProvider>
              }
            />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
