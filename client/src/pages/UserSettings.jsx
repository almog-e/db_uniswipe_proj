import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";
import { request } from "../services/api";

export default function UserSettings() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [preferences, setPreferences] = useState({
        preferred_region: "",
        preferred_degree_type: "",
        preferred_field_category: "",
        min_roi: ""
    });

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Load user preferences on mount
    useEffect(() => {
        if (!user) return;

        // For now, use a mock user_id. In production, get this from auth context
        const userId = 1; // TODO: Get from authenticated user

        request(`/api/user_pref/${userId}`)
            .then((data) => {
                if (data) {
                    setPreferences({
                        preferred_region: data.preferred_region || "",
                        preferred_degree_type: data.preferred_degree_type || "",
                        preferred_field_category: data.preferred_field_category || "",
                        min_roi: data.min_roi || ""
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to load preferences:", err);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            // For now, use a mock user_id. In production, get this from auth context
            const userId = 1; // TODO: Get from authenticated user

            await request(`/api/user_pref/${userId}`, {
                method: 'PUT',
                body: JSON.stringify(preferences)
            });

            setSuccess("Preferences saved successfully!");
            setTimeout(() => navigate("/"), 1500);
        } catch (err) {
            setError(err.message || "Failed to save preferences");
        }
    };

    if (loading) {
        return (
            <div>
                <AppNavbar />
                <div style={{ padding: 24, textAlign: "center" }}>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <AppNavbar />

            <div style={{ padding: 24, maxWidth: 800, margin: "0 auto" }}>
                <h1 style={{ marginBottom: 8 }}>My Preferences</h1>
                <p style={{ opacity: 0.75, marginBottom: 24 }}>
                    Set your preferences to get better university recommendations.
                </p>

                {error && (
                    <div style={{
                        padding: 12,
                        marginBottom: 16,
                        borderRadius: 8,
                        backgroundColor: "#fee",
                        color: "#c00",
                        border: "1px solid #fcc"
                    }}>
                        {error}
                    </div>
                )}

                {success && (
                    <div style={{
                        padding: 12,
                        marginBottom: 16,
                        borderRadius: 8,
                        backgroundColor: "#efe",
                        color: "#080",
                        border: "1px solid #cfc"
                    }}>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Preferred Region
                        </label>
                        <input
                            type="text"
                            value={preferences.preferred_region}
                            onChange={(e) => setPreferences({ ...preferences, preferred_region: e.target.value })}
                            placeholder="e.g., Northeast, Southwest, Midwest"
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Preferred Degree Type
                        </label>
                        <input
                            type="text"
                            value={preferences.preferred_degree_type}
                            onChange={(e) => setPreferences({ ...preferences, preferred_degree_type: e.target.value })}
                            placeholder="e.g., Bachelor's, Master's, PhD"
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Preferred Field Category
                        </label>
                        <input
                            type="text"
                            value={preferences.preferred_field_category}
                            onChange={(e) => setPreferences({ ...preferences, preferred_field_category: e.target.value })}
                            placeholder="e.g., STEM, Business, Arts, Healthcare"
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Minimum ROI (Return on Investment)
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={preferences.min_roi}
                            onChange={(e) => setPreferences({ ...preferences, min_roi: e.target.value })}
                            placeholder="e.g., 1.5"
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", gap: 12 }}>
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            style={{
                                padding: "12px 24px",
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                background: "white",
                                cursor: "pointer",
                                fontWeight: 600
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: "12px 24px",
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                background: "black",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 600
                            }}
                        >
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
