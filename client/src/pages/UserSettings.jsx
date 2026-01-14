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

    const [states, setStates] = useState([]);
    const [degreeTypes, setDegreeTypes] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    // Load states, degree types, programs, and user preferences on mount
    useEffect(() => {
        if (!user || !user.user_id) return;

        const userId = user.user_id;

        Promise.all([
            request('/api/states'),
            request('/api/degreeType'),
            request('/api/programs'),
            request(`/api/user_pref/${userId}`)
        ])
            .then(([statesData, degreeTypesData, programsData, prefsData]) => {
                setStates(statesData || []);
                setDegreeTypes(degreeTypesData || []);
                setPrograms(programsData || []);
                if (prefsData) {
                    setPreferences({
                        preferred_region: prefsData.preferred_region || "",
                        preferred_degree_type: prefsData.preferred_degree_type || "",
                        preferred_field_category: prefsData.preferred_field_category || "",
                        min_roi: prefsData.min_roi || ""
                    });
                }
            })
            .catch((err) => {
                console.error("Failed to load data:", err);
            })
            .finally(() => setLoading(false));
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        // Validate min_roi range
        const roi = Number(preferences.min_roi);
        if (preferences.min_roi !== "" && (roi < 0 || roi > 100)) {
            setError("Minimum ROI must be between 0 and 100");
            return;
        }

        try {
            if (!user || !user.user_id) {
                throw new Error('User not authenticated');
            }

            const userId = user.user_id;

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
                            Preferred State
                        </label>
                        <select
                            value={preferences.preferred_region}
                            onChange={(e) => setPreferences({ ...preferences, preferred_region: e.target.value })}
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14,
                                backgroundColor: "gray"
                            }}
                        >
                            <option value="">Select a state...</option>
                            {states.map(state => (
                                <option key={state.state_code} value={state.state_code}>{state.state_code} - {state.state_name}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Preferred Degree Type
                        </label>
                        <select
                            value={preferences.preferred_degree_type}
                            onChange={(e) => setPreferences({ ...preferences, preferred_degree_type: e.target.value })}
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14,
                                backgroundColor: "gray"
                            }}
                        >
                            <option value="">Select a degree type...</option>
                            {degreeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Preferred Field/Program
                        </label>
                        <select
                            value={preferences.preferred_field_category}
                            onChange={(e) => setPreferences({ ...preferences, preferred_field_category: e.target.value })}
                            style={{
                                width: "100%",
                                padding: 10,
                                borderRadius: 8,
                                border: "1px solid rgba(0,0,0,0.2)",
                                fontSize: 14,
                                backgroundColor: "gray"
                            }}
                        >
                            <option value="">Select a program...</option>
                            {programs.map(program => (
                                <option key={program} value={program}>{program}</option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: "block", fontWeight: 600, marginBottom: 8 }}>
                            Minimum ROI (0-100)
                        </label>
                        <input
                            type="number"
                            min="0"
                            max="100"
                            value={preferences.min_roi}
                            onChange={(e) => setPreferences({ ...preferences, min_roi: e.target.value })}
                            placeholder="Enter value between 1-100"
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
                                background: "gray",
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
