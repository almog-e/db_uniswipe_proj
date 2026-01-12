import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function AppNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Show nothing if not logged in
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
                {user.role === "admin" && (
                    <button
                        type="button"
                        onClick={() => navigate("/admin")}
                        style={{
                            padding: "8px 12px",
                            borderRadius: 8,
                            border: "1px solid rgba(0,0,0,0.2)",
                            background: "black",
                            cursor: "pointer",
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
                        cursor: "pointer",
                    }}
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
