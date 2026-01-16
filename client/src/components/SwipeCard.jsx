import { useEffect, useMemo, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { fetchWikipediaLogo } from "../services/wikipediaLogo";
import "./SwipeCard.css";

const SwipeCard = forwardRef(function SwipeCard({ item, onSwipeLeft, onSwipeRight, onOpen, renderActions }, ref) {
    const startRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [rot, setRot] = useState(0);
    const [logoUrl, setLogoUrl] = useState(item.imageUrl);

    const threshold = 120;

    const likeOpacity = useMemo(() => clamp((pos.x - 40) / 120, 0, 1), [pos.x]);
    const nopeOpacity = useMemo(() => clamp((-pos.x - 40) / 120, 0, 1), [pos.x]);

    useEffect(() => {
        let ignore = false;
        fetchWikipediaLogo(item.name).then(url => {
            if (url && !ignore) setLogoUrl(url);
        });
        return () => { ignore = true; };
    }, [item.name]);

    function onPointerDown(e) {
        draggingRef.current = true;
        startRef.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture?.(e.pointerId);
    }

    function onPointerMove(e) {
        if (!draggingRef.current) return;

        const dx = e.clientX - startRef.current.x;
        const dy = e.clientY - startRef.current.y;

        setPos({ x: dx, y: dy });
        setRot(dx * 0.06);
    }

    function onPointerUp() {
        if (!draggingRef.current) return;
        draggingRef.current = false;

        if (pos.x > threshold) {
            console.debug('[SwipeCard] Swipe right via drag:', item);
            animateOut(800, pos.y, () => onSwipeRight(item));
            return;
        }
        if (pos.x < -threshold) {
            console.debug('[SwipeCard] Swipe left via drag:', item);
            animateOut(-800, pos.y, () => onSwipeLeft(item));
            return;
        }

        setPos({ x: 0, y: 0 });
        setRot(0);
    }

    function animateOut(x, y, cb) {
        setIsAnimating(true);
        setPos({ x, y });
        setRot(x * 0.04);
        window.setTimeout(() => {
            setIsAnimating(false);
            setPos({ x: 0, y: 0 });
            setRot(0);
            cb();
        }, 180);
    }

    // Expose animateOut globally for button triggers
    useEffect(() => {
        window.swipeCardAnimateOut = animateOut;
        return () => {
            if (window.swipeCardAnimateOut === animateOut) {
                window.swipeCardAnimateOut = undefined;
            }
        };
    }, [item]);

    const [isAnimating, setIsAnimating] = useState(false);

    useImperativeHandle(ref, () => ({ animateOut }), [animateOut]);

    return (
        <div
            role="button"
            tabIndex={0}
            className={`swipe-card${isAnimating ? " animating" : ""}`}
            onDoubleClick={() => onOpen(item)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`,
            }}
            aria-label={`University card: ${item.name}`}
        >
            <img
                src={logoUrl}
                alt={item.name}
                className="swipe-card-img"
                draggable={false}
            />
            <div className="swipe-card-gradient" />
            <div
                className="swipe-card-reject"
                style={{ opacity: nopeOpacity }}
                id={`swipe-dislike-${item.id}`}
                onClick={() => {
                    console.debug('[SwipeCard] Dislike button clicked:', item);
                    animateOut(-800, 0, () => onSwipeLeft(item));
                }}
            >
                REJECT
            </div>
            <div
                className="swipe-card-match"
                style={{ opacity: likeOpacity }}
                id={`swipe-like-${item.id}`}
                onClick={() => {
                    console.debug('[SwipeCard] Like button (MATCH overlay) clicked:', item);
                    animateOut(800, 0, () => onSwipeRight(item));
                }}
            >
                MATCH
            </div>
            <div className="swipe-card-info">
                <div className="swipe-card-title">{item.name}</div>
                <div className="swipe-card-details">
                    {item.city}, {item.country} • {item.tagline}
                </div>
                {/* SAT/ACT averages box */}
                <div style={{
                    margin: "10px 0 0 0",
                    background: "#f3f3f3",
                    color: "#222",
                    borderRadius: 8,
                    padding: "6px 10px",
                    fontSize: "0.98em",
                    textAlign: "center",
                    border: "1px solid #ccc"
                }}>
                    {(item.sat_avg && item.sat_avg > 0) || (item.act_avg && item.act_avg > 0) ? (
                        <span>
                            <strong>University SAT/ACT Avg:</strong><br />
                            SAT: {item.sat_avg ?? "-"} | ACT: {item.act_avg ?? "-"}
                        </span>
                    ) : (
                        <span>Contact the university for more info</span>
                    )}
                </div>
                {/* Render actions (like/dislike buttons) if provided, after info */}
                {renderActions && renderActions(item)}
                {/* Debug: log when renderActions is rendered */}
                {console.debug('[SwipeCard] renderActions rendered for:', item) || null}
            </div>
        </div>
    );
});

export default SwipeCard;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}
