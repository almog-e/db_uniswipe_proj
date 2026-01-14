import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { getUniversity } from "../services/universitiesService";
import { addMatch } from "../services/matchesStorage";
import AppNavbar from "../components/AppNavbar";

export default function UniversityProfile() {
    const { id } = useParams();
    const [uni, setUni] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        getUniversity(id)
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

                        <h3>Website</h3>
                        <a href={uni.website?.startsWith('http') ? uni.website : `https://${uni.website}`} target="_blank" rel="noreferrer">
                            {uni.website}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
