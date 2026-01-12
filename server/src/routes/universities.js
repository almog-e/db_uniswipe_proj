import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

// Simple, beginner-friendly routes for /api/institutions
// - GET /api/institutions       -> returns array of institutions
// - GET /api/institutions/:id   -> returns single institution by id

const router = express.Router();

// Safely parse JSON stored in the DB (returns [] on error)
function safeParsePrograms(text) {
    try {
        return text ? JSON.parse(text) : [];
    } catch {
        return [];
    }
}

// Turn a DB row into the API response object (matching new schema)
function mapRowToUniversity(r) {
    const admission = r.admission_rate == null ? null : Number(r.admission_rate);
    const id = Number(r.uni_id) || 0;
    // ensure a non-negative 0..999 seed even for negative ids
    const seed = ((id % 1000) + 1000) % 1000;

    return {
        uni_id: r.uni_id,
        name: r.name,
        state: r.state,
        city: r.city,
        zip: r.zip,
        public_private: r.public_private,
        admission_rate: Number.isFinite(admission) ? admission : null,
        site_url: r.site_url,
        logo_url: r.logo_url,
        // backward-compatible aliases used by the client
        id: String(r.uni_id),
        imageUrl: r.logo_url || `https://picsum.photos/id/${seed}/600/400`,
        website: r.site_url,
    };
}

// GET /api/universities
router.get(
    '/',
    asyncWrap(async (req, res) => {
        // Select columns that match your schema
        const [rows] = await db.query(
            'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions'
        );
        res.json(rows.map(mapRowToUniversity));
    })
);

// GET /api/universities/:id
router.get(
    '/:id',
    asyncWrap(async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });
        const [rows] = await db.query(
            'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions WHERE uni_id = ?',
            [id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.json(mapRowToUniversity(rows[0]));
    })
);

export default router;
