/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import { request } from "../services/api";
import FAKE_USERS from "../data/fakeUsers";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, password }) => {
    // Try to login via API first
    try {
      const response = await request('/api/account_check/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const userData = {
        user_id: response.user_id,
        email: response.email,
        role: response.role || 'user',
        fullName: response.name,
        token: "jwt-token",
      };

      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return userData;
    } catch (err) {
      // Fallback to fake users for admin/test accounts
      const found = FAKE_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!found) throw new Error("Invalid email or password");

      const userData = {
        email: found.email,
        role: found.role,
        fullName: found.fullName,
        token: "fake-jwt-token",
      };

      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return userData;
    }
  };

  const register = async ({ fullName, email, password, gpa, satScore, actScore }) => {
    // Call the backend API to save user to database
    const response = await request('/api/account_check', {
      method: 'POST',
      body: JSON.stringify({
        name: fullName,
        email,
        password,
        gpa,
        sat_score: satScore,
        act_score: actScore
      })
    });

    return response;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
