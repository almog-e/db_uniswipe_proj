import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "./AppNavbar.css";
import logo from "../../../public/logo.png";

export default function AppNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const onLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="app-navbar">
            <div className="logo">
                <img src={logo} alt="logo" style={{ width: "100px", height: "auto" }} />
            </div>

            <div className="app-navbar-left">
                {/* <strong>UniSwipe</strong> */}
                <span className="app-navbar-email">
                    {user.email}
                </span>
                <span className="app-navbar-scores" style={{
                    marginLeft: 12,
                    background: "#f3f3f3",
                    color: "#222",
                    borderRadius: 6,
                    padding: "2px 8px",
                    fontSize: "0.95em",
                    border: "1px solid #ccc"
                }}>
                    SAT: {user.sat_score ?? "-"} | ACT: {user.act_score ?? "-"}
                </span>
            </div>

            <div className="app-navbar-buttons">
                <button
                    type="button"
                    onClick={() => navigate("/")}
                    className="app-navbar-btn"
                >
                    Discover
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/likes")}
                    className="app-navbar-btn"
                >
                    My Likes
                </button>

                <button
                    type="button"
                    onClick={() => navigate("/analytics")}
                    className="app-navbar-btn"
                >
                    Analytics
                </button>
                
                <button
                    type="button"
                    onClick={() => navigate("/settings")}
                    className="app-navbar-btn"
                >
                    Preferences
                </button>

                <button
                    type="button"
                    onClick={onLogout}
                    className="app-navbar-btn app-navbar-btn-black"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
