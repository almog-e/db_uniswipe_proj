import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// GET /api/programs -> get all program names
router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query(
            'SELECT DISTINCT name FROM programs ORDER BY name'
        );
        res.json(rows.map(r => r.name));
    })
);

export default router;
