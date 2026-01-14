import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities } from "../services/universitiesService";
import SwipeCard from "../components/SwipeCard";
import { addMatch, getMatches } from "../services/matchesStorage";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [index, setIndex] = useState(0);
    const [stack, setStack] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterMode, setFilterMode] = useState('1');

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setIndex(0);

        getUniversities(filterMode, user?.user_id)
            .then((data) => {
                if (!mounted) return;

                // Filter out universities that are already matched
                const matches = getMatches();
                const matchedIds = new Set(matches.map(m => m.id));
                const unmatched = Array.isArray(data)
                    ? data.filter(uni => !matchedIds.has(uni.id))
                    : [];

                setStack(unmatched);
            })
            .catch((e) => {
                console.error(e);
                if (mounted) setError(e.message || 'Failed to load universities');
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [filterMode]);

    const current = stack[index];

    const onSwipeLeft = () => {
        setIndex((i) => Math.min(i + 1, stack.length));
    };

    const onSwipeRight = (uni) => {
        addMatch(uni);
        setIndex((i) => Math.min(i + 1, stack.length));
    };

    const onOpenProfile = (uni) => navigate(`/u/${uni.id}`);

    return (
        <div>
            <AppNavbar />

            <div
                style={{
                    padding: 18,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 12,
                }}
            >
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Discover</div>
                    <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
                        Swipe right to MATCH, left to REJECT
                    </div>
                </div>

                <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "gray",
                        cursor: "pointer",
                        fontWeight: 600,
                        fontSize: 14
                    }}
                >
                    <option value="1">All Universities</option>
                    <option value="2">In Your region</option>
                    <option value="3">By Degree field</option>
                    <option value="4">By Preference Algorithm</option>
                    <option value="5">Filter Mode 5</option>
                </select>

                <button
                    type="button"
                    onClick={() => navigate("/matches")}
                    style={{
                        padding: "10px 12px",
                        borderRadius: 10,
                        border: "1px solid rgba(0,0,0,0.2)",
                        background: "black",
                        color: "white",
                        cursor: "pointer",
                        fontWeight: 700,
                    }}
                >
                    My Matches
                </button>
            </div>

            <div
                style={{
                    height: "calc(100vh - 160px)",
                    padding: "0 18px 18px",
                }}
            >
                <div
                    style={{
                        maxWidth: 420,
                        height: "100%",
                        margin: "0 auto",
                        position: "relative",
                    }}
                >
                    {loading ? (
                        <div
                            style={{
                                height: "100%",
                                borderRadius: 18,
                                display: "grid",
                                placeItems: "center",
                                padding: 24,
                                textAlign: "center",
                            }}
                        >
                            <div>
                                {error ? (
                                    <div style={{ color: 'red' }}>{error}</div>
                                ) : (
                                    'Loading universities…'
                                )}
                            </div>
                        </div>
                    ) : !current ? (
                        <div
                            style={{
                                height: "100%",
                                borderRadius: 18,
                                border: "1px dashed rgba(0,0,0,0.25)",
                                display: "grid",
                                placeItems: "center",
                                padding: 24,
                                textAlign: "center",
                            }}
                        >
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>
                                    You’re done.
                                </div>
                                <div style={{ opacity: 0.75, marginTop: 6 }}>
                                    No more universities to swipe right now.
                                </div>
                                <button
                                    style={{
                                        marginTop: 14,
                                        padding: "10px 12px",
                                        borderRadius: 10,
                                        border: "1px solid rgba(0,0,0,0.2)",
                                        background: "black",
                                        cursor: "pointer",
                                        fontWeight: 700,
                                    }}
                                    onClick={() => setIndex(0)}
                                >
                                    Restart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {stack[index + 1] && (
                                <div
                                    style={{
                                        position: "absolute",
                                        inset: 0,
                                        borderRadius: 18,
                                        background: "#ddd",
                                        transform: "scale(0.98) translateY(8px)",
                                        filter: "blur(0.2px)",
                                    }}
                                />
                            )}

                            <SwipeCard
                                item={current}
                                onSwipeLeft={onSwipeLeft}
                                onSwipeRight={onSwipeRight}
                                onOpen={onOpenProfile}
                            />

                            {/* buttons for people who hate swiping */}
                            <div
                                style={{
                                    position: "absolute",
                                    left: 0,
                                    right: 0,
                                    bottom: 12,
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 14,
                                    pointerEvents: "none",
                                }}
                            >
                                <button
                                    type="button"
                                    onClick={onSwipeLeft}
                                    style={actionBtnStyle}
                                >
                                    Reject
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onSwipeRight(current)}
                                    style={actionBtnStyle}
                                >
                                    Match
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

const actionBtnStyle = {
    pointerEvents: "auto",
    padding: "12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(0,0,0,0.2)",
    background: "rgba(36, 139, 50, 0.95)",
    cursor: "pointer",
    fontWeight: 800,
};
