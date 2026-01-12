import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// GET /api/widgets  -> list
router.get(
    '/',
    asyncWrap(async (req, res) => {
        const [rows] = await db.query('SELECT id, name, description FROM widgets');
        res.json(rows);
    })
);

// GET /api/widgets/:id  -> single item
router.get(
    '/:id',
    asyncWrap(async (req, res) => {
        const id = Number(req.params.id);
        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

        const [rows] = await db.query('SELECT id, name, description FROM widgets WHERE id = ?', [id]);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });

        res.json(rows[0]);
    })
);

// POST /api/widgets  -> create
router.post(
    '/',
    asyncWrap(async (req, res) => {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ error: 'name is required' });

        const [result] = await db.query('INSERT INTO widgets (name, description) VALUES (?, ?)', [name, description || null]);
        const [rows] = await db.query('SELECT id, name, description FROM widgets WHERE id = ?', [result.insertId]);
        res.status(201).json(rows[0]);
    })
);

export default router;
