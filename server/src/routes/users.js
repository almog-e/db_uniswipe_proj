import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

function mapRowToUser(r) {
    return {
        user_id: r.user_id,
        name: r.name,
        email: r.email,
        gpa: r.gpa,
        sat_score: r.sat_score,
        act_score: r.act_score
    };
}

router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query(
            'SELECT user_id, name, email, gpa, sat_score, act_score FROM users'
        );
        res.json(rows.map(mapRowToUser));
    })
);



export default router;
