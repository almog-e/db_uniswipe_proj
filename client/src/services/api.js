const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

async function request(path, opts = {}) {
    const res = await fetch(`${API_BASE}${path}`, {
        headers: { 'Content-Type': 'application/json' },
        ...opts,
    });
    if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        const err = new Error(body.error || res.statusText);
        err.status = res.status;
        throw err;
    }
    return res.json().catch(() => null);
}

export { API_BASE, request };
