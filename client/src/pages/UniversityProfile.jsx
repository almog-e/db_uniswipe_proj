
import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUniversity } from "../services/universitiesService";
import { addMatch } from "../services/matchesStorage";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";
import { request } from "../services/api";
import { fetchWikipediaLogo, getLocalPlaceholder } from "../services/wikipediaLogo";
import "./UniversityProfile.css";

export default function UniversityProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const [uni, setUni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userPrefs, setUserPrefs] = useState(null);
    const [logoUrl, setLogoUrl] = useState(null);

    useEffect(() => {
        let mounted = true;
        
        // Load university data
        getUniversity(id, user && user.user_id)
            .then((data) => {
                if (!mounted) return;
                setUni(data);
                fetchWikipediaLogo(data.name).then((url) => {
                    if (mounted) setLogoUrl(url);
                });
            })
            .catch((e) => {
                console.error(e);
                if (mounted) setError(e.message || 'Failed to load');
            })
            .finally(() => mounted && setLoading(false));
        
        // Load user preferences if user is logged in
        if (user && user.user_id) {
            request(`/api/user_pref/${user.user_id}`)
                .then((prefs) => {
                    if (mounted) setUserPrefs(prefs);
                })
                .catch((err) => {
                    console.error("Failed to load user preferences:", err);
                });
        }
        
        return () => { mounted = false; };
    }, [id, user]);

    if (loading) {
        return (
            <div>
                <AppNavbar />
                <div className="uni-profile-loading">{error ? <div className="uni-profile-error">{error}</div> : 'Loading…'}</div>
            </div>
        );
    }

    if (!uni) {
        return (
            <div>
                <AppNavbar />
                <div className="uni-profile-loading">
                    <h2>Not found</h2>
                    <Link to="/">Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AppNavbar />
            <div className="uni-profile-container">
                <Link to="/" className="uni-profile-back">← Back</Link>
                <div className="uni-profile-main">
                    <div className="uni-profile-card">
                        <div className="uni-profile-img-bg">
                            <img
                                src={logoUrl || getLocalPlaceholder(uni.name)}
                                alt={uni.name}
                                className="uni-profile-img"
                                onError={e => {
                                    e.currentTarget.src = getLocalPlaceholder(uni.name);
                                }}
                            />
                        </div>
                    </div>
                    <div className="uni-profile-header">
                        <div>
                            <h1 className="uni-profile-title">{uni.name}</h1>
                            <div className="uni-profile-subtitle">
                                {uni.city}, {uni.state} • {uni.public_private}
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => addMatch(uni)}
                            className="uni-profile-add-btn"
                        >
                            Add to Matches
                        </button>
                    </div>
                    <div className="uni-profile-details">
                        <h3>Details</h3>
                        <p style={{ marginTop: 6 }}>
                            <strong>Location:</strong> {uni.city}, {uni.state} {uni.zip}
                        </p>
                        <p>
                            <strong>Type:</strong> {uni.public_private}
                        </p>
                        {uni.admission_rate !== null && (
                            <p>
                                <strong>Admission Rate:</strong> {(uni.admission_rate * 100).toFixed(1)}%
                            </p>
                        )}
                        <h3 className="uni-profile-section">Programs Offered</h3>
                        {userPrefs && uni.programs && uni.programs.some(p => p.isMatch) && (
                            <div className="uni-profile-userprefs">
                                <h4 className="uni-profile-userprefs-title">Your Preferences</h4>
                                <div className="uni-profile-userprefs-list">
                                    {userPrefs.preferred_field_category && (
                                        <div><strong>Preferred Field:</strong> {userPrefs.preferred_field_category}</div>
                                    )}
                                    {userPrefs.preferred_degree_type && (
                                        <div><strong>Preferred Degree:</strong> {userPrefs.preferred_degree_type}</div>
                                    )}
                                    {userPrefs.preferred_region && (
                                        <div><strong>Preferred State:</strong> {userPrefs.preferred_region}</div>
                                    )}
                                    {userPrefs.min_roi && (
                                        <div><strong>Minimum ROI:</strong> {userPrefs.min_roi}</div>
                                    )}
                                </div>
                            </div>
                        )}
                        {uni.programs && uni.programs.length > 0 ? (
                            <div className="uni-profile-programs">
                                {uni.programs.map((program, idx) => {
                                    const isMatch = program.isMatch;
                                    return (
                                        <div
                                            key={idx}
                                            className={`uni-profile-program-card${isMatch ? ' match' : ''}`}
                                        >
                                            {isMatch && (
                                                <div className="uni-profile-program-badge">
                                                    ✓ BEST MATCH
                                                </div>
                                            )}
                                            <div className={`uni-profile-program-title${isMatch ? ' match' : ''}`}>
                                                {program.name}
                                            </div>
                                            <div className="uni-profile-program-degree">
                                                {program.degree_type}
                                            </div>
                                            {(program.roi_score > 0 || program.earn_1year > 0 || program.earn_2years > 0) ? (
                                                <div className="uni-profile-program-extra">
                                                    {program.roi_score > 0 && (
                                                        <div><strong>ROI Score:</strong> {program.roi_score.toFixed(1)}</div>
                                                    )}
                                                    {program.earn_1year > 0 && (
                                                        <div><strong>1-Year Earnings:</strong> ${program.earn_1year.toLocaleString()}</div>
                                                    )}
                                                    {program.earn_2years > 0 && (
                                                        <div><strong>2-Year Earnings:</strong> ${program.earn_2years.toLocaleString()}</div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="uni-profile-program-extra-empty">
                                                    Please contact university to get more details.
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p className="uni-profile-empty">Please contact university to get more details.</p>
                        )}
                        <h3 className="uni-profile-section">Website</h3>
                        <a href={uni.website?.startsWith('http') ? uni.website : `https://${uni.website}`} target="_blank" rel="noreferrer">
                            {uni.website}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
