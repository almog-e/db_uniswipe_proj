import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

function safeParsePrograms(text) {
    try {
        return text ? JSON.parse(text) : [];
    } catch {
        return [];
    }
}

function mapRowToUniversity(r) {
    const admission = r.admission_rate == null ? null : Number(r.admission_rate);
    const id = Number(r.uni_id) || 0;
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
        id: String(r.uni_id),
        imageUrl: r.logo_url || `https://picsum.photos/id/${seed}/600/400`,
        website: r.site_url,
    };
}

router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query(
            'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions'
        );
        res.json(rows.map(mapRowToUniversity));
    })
);

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
