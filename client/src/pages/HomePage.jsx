
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getUniversities } from "../services/universitiesService";
import SwipeCard from "../components/SwipeCard";
import { addMatch, getMatches } from "../services/matchesStorage";
import AppNavbar from "../components/AppNavbar";
import { useAuth } from "../auth/AuthContext";
import { fetchWikipediaLogo } from "../services/wikipediaLogo";
import "./HomePage.css";

function MatchPopup({ open, onClose, isMatch, onGoProfile }) {
    if (!open) return null;
    return (
        <div className="match-popup-overlay">
            <div className="match-popup">
                <div className="match-popup-title">
                    {isMatch ? "It's a match!" : "Not a match"}
                </div>
                <div className="match-popup-desc">
                    {isMatch
                        ? "You meet or exceed this university's SAT/ACT average."
                        : "Your SAT/ACT is below the university's average or missing. You may still apply!"}
                </div>
                {isMatch && (
                    <button onClick={onGoProfile} className="match-popup-btn">Go to Profile</button>
                )}
                <button onClick={onClose} className="match-popup-btn">Close</button>
            </div>
        </div>
    );
}

export default function HomePage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [index, setIndex] = useState(0);
    const [stack, setStack] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterMode, setFilterMode] = useState('1');
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [logoMap, setLogoMap] = useState({});

    const BATCH_SIZE = 10;

    const fetchNextUnmatchedBatch = async (startOffset) => {
        let nextOffset = startOffset;
        let found = false;
        let allUnmatched = [];
        while (!found) {
            const data = await getUniversities(filterMode, user?.user_id, nextOffset, BATCH_SIZE);
            if (!Array.isArray(data) || data.length === 0) {
                setHasMore(false);
                break;
            }
            const matches = getMatches();
            const matchedIds = new Set(matches.map(m => m.id));
            const unmatched = data.filter(uni => !matchedIds.has(uni.id));
            if (unmatched.length > 0) {
                allUnmatched = unmatched;
                setStack(prev => [...prev, ...unmatched]);
                setOffset(nextOffset);
                setHasMore(data.length === BATCH_SIZE);
                found = true;
            } else {
                nextOffset += BATCH_SIZE;
            }
        }
    };

    useEffect(() => {
        if (loadingMore || !hasMore || loading) return;
        
        if (index >= stack.length - 2 && stack.length > 0) {
            setLoadingMore(true);
            const nextOffset = offset + BATCH_SIZE;
            fetchNextUnmatchedBatch(nextOffset)
                .catch((e) => {
                    console.error('Error loading more universities:', e);
                })
                .finally(() => setLoadingMore(false));
        }
    }, [index, stack.length, hasMore, loadingMore, loading, offset, filterMode, user?.user_id]);

    useEffect(() => {
        let mounted = true;
        setLoading(true);
        setIndex(0);
        setOffset(0);
        setHasMore(true);

        const loadInitial = async () => {
            let nextOffset = 0;
            let found = false;
            while (!found) {
                const data = await getUniversities(filterMode, user?.user_id, nextOffset, BATCH_SIZE);
                if (!mounted) return;
                if (!Array.isArray(data) || data.length === 0) {
                    setStack([]);
                    setHasMore(false);
                    break;
                }
                const matches = getMatches();
                const matchedIds = new Set(matches.map(m => m.id));
                const unmatched = data.filter(uni => !matchedIds.has(uni.id));
                if (unmatched.length > 0) {
                    setStack(unmatched);
                    setHasMore(data.length === BATCH_SIZE);
                    setOffset(nextOffset);
                    found = true;
                } else {
                    nextOffset += BATCH_SIZE;
                }
            }
        };

        loadInitial()
            .catch((e) => {
                console.error(e);
                if (mounted) setError(e.message || 'Failed to load universities');
            })
            .finally(() => mounted && setLoading(false));
        return () => { mounted = false; };
    }, [filterMode]);

    // Fetch Wikipedia logos for all universities in the stack
    useEffect(() => {
        let ignore = false;
        async function fetchAllLogos(unis) {
            const updates = {};
            await Promise.all(unis.map(async (uni) => {
                const url = await fetchWikipediaLogo(uni.name);
                if (url) updates[uni.id] = url;
            }));
            if (!ignore) setLogoMap((prev) => ({ ...prev, ...updates }));
        }
        if (stack.length > 0) fetchAllLogos(stack);
        return () => { ignore = true; };
    }, [stack]);

    const current = stack[index];
    const swipeCardRef = useRef();


    const [popup, setPopup] = useState({ open: false, isMatch: false, uni: null });

    const onSwipeLeft = () => {
        setIndex((i) => Math.min(i + 1, stack.length));
    };

    // Unified swipe right/like logic
    const onSwipeRight = (uni) => {
        const userSAT = user?.sat_score || 0;
        const userACT = user?.act_score || 0;
        const uniSAT = uni.sat_avg || 0;
        const uniACT = uni.act_avg || 0;
        const hasData = (uniSAT > 0 || uniACT > 0);
        const isMatch = hasData && (userSAT >= uniSAT || userACT >= uniACT);
        if (isMatch) {
            addMatch(uni);
            setPopup({ open: true, isMatch: true, uni });
        } else {
            setIndex((i) => Math.min(i + 1, stack.length));
        }
    };

    const onOpenProfile = (uni) => navigate(`/u/${uni.id}`);

    return (
        <div>
            <AppNavbar />
            <div className="homepage-header">
                <div className="homepage-header-left">
                    <div className="homepage-title">Discover</div>
                    <div className="homepage-subtitle">
                        Swipe right to MATCH, left to REJECT
                    </div>
                </div>
                <select
                    value={filterMode}
                    onChange={(e) => setFilterMode(e.target.value)}
                    className="homepage-select"
                >
                    <option value="1">All Universities</option>
                    <option value="2">In Your region</option>
                    <option value="3">By Degree field</option>
                    <option value="4">By Preference Algorithm</option>
                    <option value="5">High Admission Rate (&gt;50%)</option>
                </select>
                <button
                    type="button"
                    onClick={() => navigate("/likes")}
                    className="homepage-likes-btn"
                >
                    My Likes
                </button>
            </div>
            <div className="homepage-main">
                {loadingMore && (
                    <div className="homepage-loading-more">
                        Loading more universities...
                    </div>
                )}
                <div className="homepage-card-stack">
                    {loading ? (
                        <div className="homepage-loading">
                            <div>
                                {error ? (
                                    <div style={{ color: 'red' }}>{error}</div>
                                ) : (
                                    'Loading universities…'
                                )}
                            </div>
                        </div>
                    ) : !current ? (
                        <div className="homepage-empty">
                            <div>
                                <div className="homepage-empty-title">
                                    You’re done.
                                </div>
                                <div className="homepage-empty-subtitle">
                                    No more universities to swipe right now.
                                </div>
                                <button
                                    className="homepage-restart-btn"
                                    onClick={() => setIndex(0)}
                                >
                                    Restart
                                </button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div style={{ width: "100%", marginTop: 0, display: "flex", flexDirection: "column", alignItems: "center", flexGrow: 1 }}>
                                {stack[index + 1] && (
                                    <div className="homepage-card-bg" />
                                )}
                                <div className="homepage-card-outer">
                                    <SwipeCard
                                        ref={swipeCardRef}
                                        item={{ ...current, imageUrl: logoMap[current.id] || current.imageUrl }}
                                        onSwipeLeft={onSwipeLeft}
                                        onSwipeRight={onSwipeRight}
                                        onOpen={onOpenProfile}
                                    />
                                    <div className="homepage-action-btns">
                                        <button
                                            type="button"
                                            className="action-btn dislike"
                                            onClick={() => {
                                                if (swipeCardRef.current && swipeCardRef.current.animateOut) {
                                                    swipeCardRef.current.animateOut(-800, 0, () => onSwipeLeft(current));
                                                } else {
                                                    onSwipeLeft(current);
                                                }
                                            }}
                                        >
                                            Dislike
                                        </button>
                                        <button
                                            type="button"
                                            className="action-btn like"
                                            onClick={() => {
                                                if (swipeCardRef.current && swipeCardRef.current.animateOut) {
                                                    swipeCardRef.current.animateOut(800, 0, () => onSwipeRight(current));
                                                } else {
                                                    onSwipeRight(current);
                                                }
                                            }}
                                        >
                                            Like
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
                <MatchPopup
                    open={popup.open}
                    isMatch={popup.isMatch}
                    onGoProfile={() => { setPopup({ ...popup, open: false }); navigate(`/u/${popup.uni.id}`); }}
                    onClose={() => { setPopup({ ...popup, open: false }); setIndex((i) => Math.min(i + 1, stack.length)); }}
                />
            </div>
        </div>
    );
}

