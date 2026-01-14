import express from 'express';
import crypto from 'crypto';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// POST /api/account_check/login -> authenticate user
router.post(
    '/login',
    asyncWrap(async (req, res) => {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Missing email or password' });
        }

        // Hash the provided password
        const password_hash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        console.log('=== LOGIN ATTEMPT ===');
        console.log('Email:', email);
        console.log('Plain password:', password);
        console.log('SHA-256 hash:', password_hash);
        console.log('====================');

        // Find user by email and password hash
        const [rows] = await db.query(
            'SELECT user_id, name, email, gpa, sat_score, act_score FROM users WHERE email = ? AND password_hash = ?',
            [email, password_hash]
        );

        console.log('Database query result:', rows.length > 0 ? 'User found' : 'User not found');

        if (!rows.length) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const user = rows[0];
        res.json({
            user_id: user.user_id,
            name: user.name,
            email: user.email,
            gpa: user.gpa,
            sat_score: user.sat_score,
            act_score: user.act_score,
            role: 'user' // Default role for now
        });
    })
);

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

        if (!name || !email || !password || gpa === null || gpa === undefined || sat_score === null || sat_score === undefined || act_score === null || act_score === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Validate GPA (0 to 5.0 for weighted GPAs)
        if (gpa < 0 || gpa > 5.0) {
            return res.status(400).json({ error: 'GPA must be between 0 and 5.0' });
        }

        // Validate SAT score (400 to 1600)
        if (sat_score < 400 || sat_score > 1600) {
            return res.status(400).json({ error: 'SAT score must be between 400 and 1600' });
        }

        // Validate ACT score (1 to 36)
        if (act_score < 1 || act_score > 36) {
            return res.status(400).json({ error: 'ACT score must be between 1 and 36' });
        }

        // Hash password (SHA-256)
        const password_hash = crypto
            .createHash('sha256')
            .update(password)
            .digest('hex');

        console.log('=== PASSWORD HASH DEBUG ===');
        console.log('Plain password:', password);
        console.log('SHA-256 hash:', password_hash);
        console.log('===========================');

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
