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
    try {
      const response = await request('/api/account_check/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      const userData = {
        user_id: response.user_id,
        email: response.email,
        fullName: response.name,
        sat_score: response.sat_score,
        act_score: response.act_score,
        token: "jwt-token",
      };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return userData;
    } catch {
      const found = FAKE_USERS.find(
        (u) => u.email === email && u.password === password
      );
      if (!found) throw new Error("Invalid email or password");
      const userData = {
        email: found.email,
        fullName: found.fullName,
        sat_score: found.sat_score,
        act_score: found.act_score,
        token: "fake-jwt-token",
      };
      setUser(userData);
      localStorage.setItem("auth_user", JSON.stringify(userData));
      return userData;
    }
  };

  const register = async ({ fullName, email, password, gpa, satScore, actScore }) => {
    return await request('/api/account_check', {
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
