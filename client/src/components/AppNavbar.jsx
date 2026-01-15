import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const onLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div
            style={{
                padding: "12px 16px",
                borderBottom: "1px solid rgba(0,0,0,0.12)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}
        >
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <strong>UniMatch</strong>
                <span style={{ opacity: 0.8 }}>
                    {user.email}
                    {user.role ? ` (${user.role})` : ""}
                </span>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Discover
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/matches")}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    My Matches
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/analytics")}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Analytics
                </button>
                
                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "white",
                        color: "black",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Preferences
                </button>

                {user.role === "admin" && (
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(0,0,0,0.2)",
                            background: "black",
                            color: "white",
                            cursor: "pointer",
                            fontWeight: 600,
                        }}
                    >
                        Admin
                    </button>
                )}

                <button
                    type="button"
                    onClick={onLogout}
                    style={{
                        padding: "8px 12px",
                        borderRadius: 8,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "black",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 600,
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
