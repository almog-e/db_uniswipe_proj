import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";

import HomePage from "../pages/HomePage";
import UniversityProfile from "../pages/UniversityProfile";
import LikesPage from "../pages/LikesPage";
import UserSettings from "../pages/UserSettings";
import AnalyticsPage from "../pages/AnalyticsPage";
import MatchesPage from "../pages/MatchesPage";

import ProtectedRoute from "../auth/ProtectedRoute";
import { AuthProvider } from "../auth/AuthContext";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/u/:id" element={<UniversityProfile />} />
            <Route path="/likes" element={<LikesPage />} />
            <Route path="/matches" element={<MatchesPage />} />
            <Route path="/settings" element={<UserSettings />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
