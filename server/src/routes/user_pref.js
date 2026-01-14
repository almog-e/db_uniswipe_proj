import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// GET /api/user_pref/:userId -> get user preferences
router.get(
    '/:userId',
    asyncWrap(async (req, res) => {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const [rows] = await db.query(
            'SELECT * FROM user_preferences WHERE user_id = ?',
            [userId]
        );

        if (!rows.length) {
            return res.json({
                user_id: userId,
                preferred_region: null,
                preferred_degree_type: null,
                preferred_field_category: null,
                min_roi: null
            });
        }

        res.json(rows[0]);
    })
);

// PUT /api/user_pref/:userId -> update user preferences
router.put(
    '/:userId',
    asyncWrap(async (req, res) => {
        const userId = Number(req.params.userId);
        if (!Number.isInteger(userId)) {
            return res.status(400).json({ error: 'Invalid user ID' });
        }

        const {
            preferred_region,
            preferred_degree_type,
            preferred_field_category,
            min_roi
        } = req.body;

        // Check if preferences exist
        const [existing] = await db.query(
            'SELECT pref_id FROM user_preferences WHERE user_id = ?',
            [userId]
        );

        console.log('=== USER PREFERENCE UPDATE ===');
        console.log('User ID:', userId);
        console.log('Data:', { preferred_region, preferred_degree_type, preferred_field_category, min_roi });
        console.log('Existing preferences:', existing.length > 0 ? 'YES' : 'NO');

        if (existing.length > 0) {
            // Update existing preferences
            console.log('Updating existing preference...');
            await db.query(
                `UPDATE user_preferences
                SET preferred_region = ?,
                    preferred_degree_type = ?,
                    preferred_field_category = ?,
                    min_roi = ?
                WHERE user_id = ?`,
                [preferred_region, preferred_degree_type, preferred_field_category, min_roi, userId]
            );
            console.log('Preference updated successfully');
        } else {
            // Insert new preferences
            console.log('=== INSERTING NEW PREFERENCE ===');
            console.log('User ID:', userId);
            console.log('Data:', { preferred_region, preferred_degree_type, preferred_field_category, min_roi });

            await db.query(
                `INSERT INTO user_preferences
                (user_id, preferred_region, preferred_degree_type, preferred_field_category, min_roi)
                VALUES (?, ?, ?, ?, ?)`,
                [userId, preferred_region, preferred_degree_type, preferred_field_category, min_roi]
            );

            console.log('Preference inserted successfully');
        }

        res.json({
            user_id: userId,
            preferred_region,
            preferred_degree_type,
            preferred_field_category,
            min_roi
        });
    })
);

export default router;
