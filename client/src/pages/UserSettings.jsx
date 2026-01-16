import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";

import { useAuth } from "../auth/AuthContext";
import { request } from "../services/api";
import "./UserSettings.css";

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

    // Load data and user preferences
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

        // Check ROI range
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
                <div className="usersettings-loading">Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <AppNavbar />
            <div className="usersettings-container">
                <h1 className="usersettings-title">My Preferences</h1>
                <p className="usersettings-subtitle">
                    Set your preferences to get better university recommendations.
                </p>
                {error && (
                    <div className="usersettings-error">{error}</div>
                )}
                {success && (
                    <div className="usersettings-success">{success}</div>
                )}
                <form onSubmit={handleSubmit}>
                    <div className="usersettings-form-section">
                        <label className="usersettings-label">
                            Preferred State
                        </label>
                        <select
                            value={preferences.preferred_region}
                            onChange={(e) => setPreferences({ ...preferences, preferred_region: e.target.value })}
                            className="usersettings-select"
                        >
                            <option value="">Select a state...</option>
                            {states.map(state => (
                                <option key={state.state_code} value={state.state_code}>{state.state_code} - {state.state_name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="usersettings-form-section">
                        <label className="usersettings-label">
                            Preferred Degree Type
                        </label>
                        <select
                            value={preferences.preferred_degree_type}
                            onChange={(e) => setPreferences({ ...preferences, preferred_degree_type: e.target.value })}
                            className="usersettings-select"
                        >
                            <option value="">Select a degree type...</option>
                            {degreeTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                    <div className="usersettings-form-section">
                        <label className="usersettings-label">
                            Preferred Field/Program
                        </label>
                        <select
                            value={preferences.preferred_field_category}
                            onChange={(e) => setPreferences({ ...preferences, preferred_field_category: e.target.value })}
                            className="usersettings-select"
                        >
                            <option value="">Select a program...</option>
                            {programs.map(program => (
                                <option key={program} value={program}>{program}</option>
                            ))}
                        </select>
                    </div>
                    <div className="usersettings-form-section">
                        <label className="usersettings-range-label">
                            Minimum ROI: {preferences.min_roi || 0}
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            step="1"
                            value={preferences.min_roi || 0}
                            onChange={(e) => setPreferences({ ...preferences, min_roi: e.target.value })}
                            className="usersettings-range"
                        />
                        <div className="usersettings-range-marks">
                            <span>0</span>
                            <span>50</span>
                            <span>100</span>
                        </div>
                    </div>
                    <div className="usersettings-actions">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="usersettings-btn-cancel"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="usersettings-btn-save"
                        >
                            Save Preferences
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
