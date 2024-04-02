import React from "react";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./lib/contexts";
// Routes
import Login from "./pages/Auth/Login";
import LoginLink from "./pages/Auth/LoginLink";
import PrivateRoute from "./pages/Auth/PrivateRoute";
import HomeLayout from "./pages/HomeLayout";
import DonationsPage from "./pages/DonationsPage";
import InventoryPage from "./pages/InventoryPage";
import ReportsPage from "./pages/ReportsPage";
import CashDonationsPage from "./pages/CashDonationsPage";
import UsersPage from "./pages/UsersPage";
import AdminsPage from "./pages/AdminsPage";

export const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/loginLink" element={<LoginLink />} />
          {/* Home Page Routes */}
          <Route path="/" element={<HomeLayout />}>
            {/* <Route path="/" element={<PrivateRoute element={<HomeLayout />} />}> */}
            <Route path="donations" element={<DonationsPage />} />
            <Route path="inventory" element={<InventoryPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="cashDonations" element={<CashDonationsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="admins" element={<AdminsPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};
