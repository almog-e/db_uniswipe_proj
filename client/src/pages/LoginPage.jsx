import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";
import logo from "../../../public/logo.png";


function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setError("");
      await login({ email, password });
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
         <div className="logo">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img src={logo} alt="logo" style={{ width: 100, height: "auto", marginBottom: 12 }} />
            </div>
          </div>
        <h1 className="login-title">Login</h1>
        <p className="login-subtitle">Welcome back! Please sign in.</p>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <label className="login-label">
            Email
            <input
              type="email"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />
          </label>

          <label className="login-label">
            Password
            <input
              type="password"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </label>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>

        <p className="login-footer">
          Don't have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

        <div className="login-credentials">
          <div>Fake User: user@test.com / 123456</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
