import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query(
            'SELECT user_id, name, email, gpa, sat_score, act_score FROM users'
        );
        res.json(rows);
    })
);

export default router;
