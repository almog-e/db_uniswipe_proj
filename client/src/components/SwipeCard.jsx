import { useMemo, useRef, useState } from "react";

export default function SwipeCard({ item, onSwipeLeft, onSwipeRight, onOpen }) {
    const startRef = useRef({ x: 0, y: 0 });
    const draggingRef = useRef(false);

    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [rot, setRot] = useState(0);

    const threshold = 120;

    const likeOpacity = useMemo(() => clamp((pos.x - 40) / 120, 0, 1), [pos.x]);
    const nopeOpacity = useMemo(() => clamp((-pos.x - 40) / 120, 0, 1), [pos.x]);

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
            animateOut(800, pos.y, () => onSwipeRight(item));
            return;
        }
        if (pos.x < -threshold) {
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

    const [isAnimating, setIsAnimating] = useState(false);

    return (
        <div
            role="button"
            tabIndex={0}
            onDoubleClick={() => onOpen(item)}
            onKeyDown={(e) => e.key === "Enter" && onOpen(item)}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            style={{
                position: "absolute",
                inset: 0,
                borderRadius: 18,
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
                background: "#111",
                cursor: "grab",
                touchAction: "none",
                userSelect: "none",
                transform: `translate(${pos.x}px, ${pos.y}px) rotate(${rot}deg)`,
                transition: isAnimating ? "transform 180ms ease-out" : "none",
            }}
            aria-label={`University card: ${item.name}`}
        >
            <img
                src={item.imageUrl}
                alt={item.name}
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                    filter: "contrast(1.05)",
                }}
                draggable={false}
            />

            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    background:
                        "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 55%, rgba(0,0,0,0.0) 75%)",
                }}
            />

            <div
                style={{
                    position: "absolute",
                    top: 18,
                    left: 18,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "2px solid rgba(255,255,255,0.9)",
                    color: "RED",
                    fontWeight: 800,
                    letterSpacing: 1,
                    opacity: nopeOpacity,
                    transform: "rotate(-14deg)",
                    background: "rgba(0,0,0,0.2)",
                }}
            >
                REJECT
            </div>

            <div
                style={{
                    position: "absolute",
                    top: 18,
                    right: 18,
                    padding: "8px 12px",
                    borderRadius: 10,
                    border: "2px solid rgba(255,255,255,0.9)",
                    color: "GREEN",
                    fontWeight: 800,
                    letterSpacing: 1,
                    opacity: likeOpacity,
                    transform: "rotate(14deg)",
                    background: "rgba(0,0,0,0.2)",
                }}
            >
                MATCH
            </div>

            <div style={{ position: "absolute", left: 16, right: 16, bottom: 16 }}>
                <div style={{ color: "white", fontSize: 22, fontWeight: 800 }}>
                    {item.name}
                </div>
                <div style={{ color: "rgba(255,255,255,0.85)", marginTop: 4 }}>
                    {item.city}, {item.country} • {item.tagline}
                </div>
                <div
                    style={{
                        color: "rgba(255,255,255,0.7)",
                        marginTop: 10,
                        fontSize: 13,
                    }}
                >
                    Double-click (or Enter) for full profile
                </div>
            </div>
        </div>
    );
}

function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
}
