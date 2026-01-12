import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

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
          Don&apos;t have an account?{" "}
          <button
            type="button"
            className="link-button"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </p>

        {/* Optional: show fake credentials */}
        <div style={{ marginTop: 16, fontSize: 13, opacity: 0.8 }}>
          <div>Fake User: user@test.com / 123456</div>
          <div>Fake Admin: admin@test.com / admin123</div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
