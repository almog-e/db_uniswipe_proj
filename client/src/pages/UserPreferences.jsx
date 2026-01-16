import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities } from "../services/universitiesService";
import SwipeCard from "../components/SwipeCard";
import { addMatch } from "../services/matchesStorage";

import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";
import "./UserPreferences.css";

export default function UserPreferences() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [index, setIndex] = useState(0);
    const [stack, setStack] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let mounted = true;
        getUniversities()
            .then((data) => {
                if (!mounted) return;
                setStack(Array.isArray(data) ? data : []);
            })
            .catch((e) => {
                console.error(e);
                if (mounted) setError(e.message || 'Failed to load universities');
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, []);

    const current = stack[index];

    const onSwipeLeft = () => {
        setIndex(index + 1);
    };

    const onSwipeRight = (uni) => {
        addMatch(uni);
        setIndex(index + 1);
    };

    const onOpenProfile = (uni) => navigate(`/u/${uni.id}`);

    return (
        <div>
            <AppNavbar />



            {/* SAT/ACT box */}
            <div className="userprefs-satact-box">
                <strong>Your Scores:</strong>
                <div style={{ marginTop: 4 }}>
                    SAT: {user?.sat_score ?? "-"} | ACT: {user?.act_score ?? "-"}
                </div>
            </div>


            <div className="userprefs-main">
                <div>
                    <div style={{ fontSize: 18, fontWeight: 800 }}>Discover</div>
                    <div style={{ opacity: 0.75, marginTop: 4, fontSize: 13 }}>
                        Swipe right to LIKE, left to REJECT
                    </div>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/likes")}
                    className="userprefs-btn"
                >
                    My Likes
                </button>
            </div>

            <div style={{ height: "calc(100vh - 160px)", padding: "0 18px 18px" }}>
                <div style={{ maxWidth: 420, height: "100%", margin: "0 auto", position: "relative" }}>
                    {loading ? (
                        <div style={{ height: "100%", borderRadius: 18, display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
                            <div>
                                {error ? (
                                    <div style={{ color: 'red' }}>{error}</div>
                                ) : (
                                    'Loading universities…'
                                )}
                            </div>
                        </div>
                    ) : !current ? (
                        <div style={{ height: "100%", borderRadius: 18, border: "1px dashed rgba(0,0,0,0.25)", display: "grid", placeItems: "center", padding: 24, textAlign: "center" }}>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 800 }}>
                                    You’re done.
                                </div>
                                <div style={{ opacity: 0.75, marginTop: 6 }}>
                                    No more universities to swipe right now.
                                </div>
                                <button className="userprefs-btn" onClick={() => setIndex(0)}>
                                    Restart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {stack[index + 1] && (
                                <div style={{ position: "absolute", inset: 0, borderRadius: 18, background: "#ddd", transform: "scale(0.98) translateY(8px)", filter: "blur(0.2px)" }} />
                            )}
                            <SwipeCard
                                item={current}
                                onSwipeLeft={onSwipeLeft}
                                onSwipeRight={onSwipeRight}
                                onOpen={onOpenProfile}
                            />
                            {/* buttons for people who hate swiping */}
                            <div style={{ position: "absolute", left: 0, right: 0, bottom: 12, display: "flex", justifyContent: "center", gap: 14, pointerEvents: "none" }}>
                                <button type="button" onClick={onSwipeLeft} className="userprefs-btn dislike" style={{ pointerEvents: "auto" }}>
                                    Reject
                                </button>
                                <button type="button" onClick={() => onSwipeRight(current)} className="userprefs-btn like" style={{ pointerEvents: "auto" }}>
                                    Like
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

