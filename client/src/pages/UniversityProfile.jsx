import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUniversity } from "../services/universitiesService";
import { addMatch } from "../services/matchesStorage";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";

export default function UniversityProfile() {
    const { id } = useParams();
    const { user } = useAuth();
    const [uni, setUni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        getUniversity(id, user?.user_id)
            .then((data) => {
                if (!mounted) return;
                setUni(data);
            })
            .catch((e) => {
                console.error(e);
                if (mounted) setError(e.message || 'Failed to load');
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [id]);

    if (loading) {
        return (
            <div>
                <AppNavbar />
                <div style={{ padding: 24 }}>{error ? <div style={{ color: 'red' }}>{error}</div> : 'Loading…'}</div>
            </div>
        );
    }

    if (!uni) {
        return (
            <div>
                <AppNavbar />
                <div style={{ padding: 24 }}>
                    <h2>Not found</h2>
                    <Link to="/">Back</Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AppNavbar />

            <div style={{ padding: 18, maxWidth: 860, margin: "0 auto" }}>
                <Link to="/" style={{ textDecoration: "none" }}>← Back</Link>

                <div style={{ marginTop: 14, display: "grid", gap: 16 }}>
                    <div
                        style={{
                            borderRadius: 18,
                            overflow: "hidden",
                            boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
                        }}
                    >
                        <img
                            src={uni.imageUrl}
                            alt={uni.name}
                            style={{ width: "100%", height: 420, objectFit: "cover" }}
                        />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <div>
                            <h1 style={{ margin: 0 }}>{uni.name}</h1>
                            <div style={{ opacity: 0.75, marginTop: 6 }}>
                                {uni.city}, {uni.state} • {uni.public_private}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => addMatch(uni)}
                            style={{
                                height: 44,
                                padding: "0 14px",
                                borderRadius: 12,
                                border: "1px solid rgba(0,0,0,0.2)",
                                background: "black",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 800,
                                whiteSpace: "nowrap",
                            }}
                        >
                            Add to Matches
                        </button>
                    </div>

                    <div style={{ lineHeight: 1.6 }}>
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

                        <h3 style={{ marginTop: 32 }}>Programs Offered</h3>
                        {uni.programs && uni.programs.length > 0 ? (
                            <div style={{ marginTop: 12, display: 'grid', gap: 12 }}>
                                {uni.programs.map((program, idx) => {
                                    const isMatch = program.isMatch;
                                    return (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: 16,
                                                borderRadius: 12,
                                                border: isMatch ? '3px solid #4CAF50' : '1px solid rgba(0,0,0,0.1)',
                                                backgroundColor: isMatch ? '#222222' : '#706c6c',
                                                boxShadow: isMatch ? '0 4px 12px rgba(76, 175, 80, 0.3)' : 'none',
                                                transform: isMatch ? 'scale(1.02)' : 'scale(1)',
                                                transition: 'all 0.2s ease',
                                                position: 'relative'
                                            }}
                                        >
                                            {isMatch && (
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 12,
                                                    right: 12,
                                                    padding: '4px 12px',
                                                    borderRadius: 8,
                                                    backgroundColor: '#4CAF50',
                                                    color: 'white',
                                                    fontWeight: 700,
                                                    fontSize: 12
                                                }}>
                                                    ✓ BEST MATCH
                                                </div>
                                            )}
                                            <div style={{ fontWeight: 700, fontSize: 16, color: isMatch ? '#2e7d32' : 'inherit' }}>
                                                {program.name}
                                            </div>
                                            <div style={{ opacity: 0.7, marginTop: 4 }}>
                                                {program.degree_type}
                                            </div>
                                            {(program.roi_score || program.earn_1year || program.earn_2years) && (
                                                <div style={{ marginTop: 5, fontSize: 10 }}>
                                                    {program.roi_score && (
                                                        <div><strong>ROI Score:</strong> {program.roi_score.toFixed(1)}</div>
                                                    )}
                                                    {program.earn_1year && (
                                                        <div><strong>1-Year Earnings:</strong> ${program.earn_1year.toLocaleString()}</div>
                                                    )}
                                                    {program.earn_2years && (
                                                        <div><strong>2-Year Earnings:</strong> ${program.earn_2years.toLocaleString()}</div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <p style={{ opacity: 0.6 }}>No program data available</p>
                        )}

                        <h3 style={{ marginTop: 32 }}>Website</h3>
                        <a href={uni.website?.startsWith('http') ? uni.website : `https://${uni.website}`} target="_blank" rel="noreferrer">
                            {uni.website}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
