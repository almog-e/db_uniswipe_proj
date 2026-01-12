import express from 'express';
import crypto from 'crypto';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// GET /api/users -> list
router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query('SELECT user_id FROM users');
        res.json(rows);
    })
);

// POST /api/users -> add user
router.post(
    '/',
    asyncWrap(async (req, res) => {
        const {
            name,
            email,
            password,
            gpa,
            sat_score,
            act_score
        } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Hash password (SHA-256)
        const password_hash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        const [result] = await db.query(
            `
      INSERT INTO users
        (name, email, password_hash, gpa, sat_score, act_score)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
            [name, email, password_hash, gpa, sat_score, act_score]
        );

        res.status(201).json({
            user_id: result.insertId,
            name,
            email,
            gpa,
            sat_score,
            act_score
        });
    })
);

export default router;
