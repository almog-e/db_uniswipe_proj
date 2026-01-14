import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// GET /api/degreeType -> get all program names
router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query(
            'SELECT DISTINCT degree_type FROM institutions_programs'
        );
        res.json(rows.map(r => r.degree_type));
    })
);

export default router;
