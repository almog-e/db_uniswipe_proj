import { useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { clearMatches, getMatches, removeMatch } from "../services/matchesStorage";

export default function MatchesPage() {
    const [matches, setMatches] = useState(() => getMatches());

    const onRemove = (id) => {
        setMatches(removeMatch(id));
    };

    const onClear = () => {
        clearMatches();
        setMatches([]);
    };

    return (
        <div>
            <AppNavbar />

            <div style={{ padding: 18, maxWidth: 860, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                        <h1 style={{ margin: 0 }}>My Matches</h1>
                        <div style={{ opacity: 0.75, marginTop: 6 }}>
                            {matches.length} matched universities
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClear}
                        style={{
                            height: 44,
                            padding: "0 14px",
                            borderRadius: 12,
                            border: "1px solid rgba(0,0,0,0.2)",
                            background: "black",
                            cursor: "pointer",
                            fontWeight: 800,
                        }}
                    >
                        Clear
                    </button>
                </div>

                <div style={{ marginTop: 14 }}>
                    <Link to="/" style={{ textDecoration: "none" }}>← Back to swipe</Link>
                </div>

                <div
                    style={{
                        marginTop: 16,
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                        gap: 14,
                    }}
                >
                    {matches.map((u) => (
                        <div
                            key={u.id}
                            style={{
                                border: "1px solid rgba(0,0,0,0.12)",
                                borderRadius: 16,
                                overflow: "hidden",
                                background: "rgba(120, 67, 242, 0.42)",
                            }}
                        >
                            <img
                                src={u.imageUrl}
                                alt={u.name}
                                style={{ width: "100%", height: 160, objectFit: "cover" }}
                            />
                            <div style={{ padding: 12 }}>
                                <div style={{ fontWeight: 800 }}>{u.name}</div>
                                <div style={{ opacity: 0.75, fontSize: 13, marginTop: 4 }}>
                                    {u.city}, {u.country}
                                </div>

                                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                                    <Link to={`/u/${u.id}`} style={linkBtn}>
                                        View
                                    </Link>
                                    <button type="button" onClick={() => onRemove(u.id)} style={linkBtn}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    {matches.length === 0 && (
                        <div style={{ opacity: 0.75 }}>
                            No matches yet. Go swipe like a responsible adult.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const linkBtn = {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(0,0,0,0.18)",
    background: "white",
    cursor: "pointer",
    fontWeight: 700,
    textDecoration: "none",
    color: "black",
    display: "inline-block",
};
