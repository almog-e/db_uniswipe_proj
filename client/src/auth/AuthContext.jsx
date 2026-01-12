/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";
import FAKE_USERS from "../data/fakeUsers";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("auth_user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = async ({ email, password }) => {
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
  };

  const register = async ({ fullName, email, password }) => {
    FAKE_USERS.push({ email, password, role: "user", fullName });
    return { ok: true };
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
