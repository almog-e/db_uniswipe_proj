import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import { clearMatches, getMatches, removeMatch } from "../services/matchesStorage";
import { fetchWikipediaLogo, getLocalPlaceholder } from "../services/wikipediaLogo";

export default function LikesPage() {
    const [likes, setLikes] = useState(() => getMatches());
    const [displayCount, setDisplayCount] = useState(20);
    const [logos, setLogos] = useState({});

    useEffect(() => {
        let ignore = false;
        async function loadLogos() {
            const updates = {};
            await Promise.all(likes.map(async (u) => {
                const url = await fetchWikipediaLogo(u.name);
                if (url) updates[u.id] = url;
            }));
            if (!ignore) setLogos(updates);
        }
        loadLogos();
        return () => { ignore = true; };
    }, [likes]);

    const onRemove = (id) => {
        setLikes(removeMatch(id));
    };

    const onClear = () => {
        clearMatches();
        setLikes([]);
    };

    const loadMore = () => {
        setDisplayCount(prev => prev + 20);
    };

    const displayedLikes = likes.slice(0, displayCount);
    const hasMore = displayCount < likes.length;

    return (
        <div>
            <AppNavbar />

            <div style={{ color: "white", padding: 18, maxWidth: 860, margin: "0 auto" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div>
                        <h1 style={{ margin: 0 }}>My Likes</h1>
                        <div style={{ opacity: 0.75, marginTop: 6 }}>
                            {likes.length} liked universities
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClear}
                        style={{
                            height: 44,
                            color: "white",
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
                    {displayedLikes.map((u) => (
                        <div
                            key={u.id}
                            style={{
                                border: "1px solid rgba(0,0,0,0.12)",
                                borderRadius: 16,
                                overflow: "hidden",
                                background: "rgba(120, 67, 242, 0.42)",
                            }}
                        >
                            <div style={{ background: "#e0e0e0", width: "100%", height: 160 }}>
                                <img
                                    src={logos[u.id] || getLocalPlaceholder(u.name)}
                                    alt={u.name}
                                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                                />
                            </div>
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

                    {likes.length === 0 && (
                        <div style={{ opacity: 0.75 }}>
                            No likes yet. Go swipe like a responsible adult.
                        </div>
                    )}
                </div>

                {hasMore && (
                    <div style={{ marginTop: 20, textAlign: 'center' }}>
                        <button
                            onClick={loadMore}
                            style={{
                                padding: "12px 24px",
                                borderRadius: 12,
                                border: "1px solid rgba(0,0,0,0.2)",
                                background: "black",
                                color: "white",
                                cursor: "pointer",
                                fontWeight: 700,
                            }}
                        >
                            Load More ({likes.length - displayCount} remaining)
                        </button>
                    </div>
                )}
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
