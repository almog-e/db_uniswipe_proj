import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./LoginPage.css";

function RegisterPage() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [gpa, setGpa] = useState("");
    const [satScore, setSatScore] = useState("");
    const [actScore, setActScore] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();
    const { register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (!fullName || !email || !password || !confirmPassword || !gpa || !satScore || !actScore) {
            setError("Please fill in all fields.");
            return;
        }

        if (password.length < 6) {
            setError("Password should be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const gpaNum = parseFloat(gpa);
        if (gpaNum < 0 || gpaNum > 5.0) {
            setError("GPA must be between 0 and 5.0.");
            return;
        }

        const satNum = parseInt(satScore);
        if (satNum < 400 || satNum > 1600) {
            setError("SAT score must be between 400 and 1600.");
            return;
        }

        const actNum = parseInt(actScore);
        if (actNum < 1 || actNum > 36) {
            setError("ACT score must be between 1 and 36.");
            return;
        }

        try {
            await register({
                fullName,
                email,
                password,
                gpa: parseFloat(gpa),
                satScore: parseInt(satScore),
                actScore: parseInt(actScore)
            });
            setSuccess("Account created successfully!");
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.message || "Registration failed. Please try again.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <h1 className="login-title">Create Account</h1>
                <p className="login-subtitle">Sign up to get started.</p>

                {error && <div className="login-error">{error}</div>}
                {success && (
                    <div
                        className="login-error login-success"
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

                    <label className="login-label">
                        GPA
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            max="5.0"
                            className="login-input"
                            value={gpa}
                            onChange={(e) => setGpa(e.target.value)}
                            placeholder="3.5"
                            required
                        />
                    </label>

                    <label className="login-label">
                        SAT Score
                        <input
                            type="number"
                            min="400"
                            max="1600"
                            className="login-input"
                            value={satScore}
                            onChange={(e) => setSatScore(e.target.value)}
                            placeholder="1200"
                            required
                        />
                    </label>

                    <label className="login-label">
                        ACT Score
                        <input
                            type="number"
                            min="1"
                            max="36"
                            className="login-input"
                            value={actScore}
                            onChange={(e) => setActScore(e.target.value)}
                            placeholder="24"
                            required
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
