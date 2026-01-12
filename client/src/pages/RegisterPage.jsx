import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!fullName || !email || !password || !confirmPassword) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters long.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        await register({ fullName, email, password });
        setSuccess("Account created successfully! (Simulation only for now)");

        setTimeout(() => navigate("/login"), 600);
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Sign up to get started.</p>

                {error && <div className="login-error">{error}</div>}
                {success && (
                    <div
                        className="login-error"
                        style={{
                            backgroundColor: "#e5ffe9",
                            color: "#146c2e",
                            borderColor: "rgba(20,108,46,0.35)",
                        }}
                    >
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label className="login-label">
                        Full name
                        <input
                            type="text"
                            className="login-input"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                        />
                    </label>

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

                    <label className="login-label">
                        Confirm password
                        <input
                            type="password"
                            className="login-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </label>

                    <button type="submit" className="login-button">
                        Sign up
                    </button>
                </form>

                <p className="login-footer">
                    Already have an account?{" "}
                    <button
                        type="button"
                        className="link-button"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
}

export default RegisterPage;
