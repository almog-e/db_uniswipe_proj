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
        const mode = req.query.mode || '1';
        const userId = req.query.userId; // Optional: pass user_id to use preferences

        // Fetch user preferences if userId is provided
        let userPrefs = null;
        if (userId) {
            const [prefRows] = await db.query(
                'SELECT preferred_region, preferred_degree_type, preferred_field_category, min_roi FROM user_preferences WHERE user_id = ?',
                [userId]
            );
            userPrefs = prefRows[0] || null;
        }

        // Now you have access to:
        // userPrefs.preferred_region (e.g., "CA", "NY")
        // userPrefs.preferred_degree_type (e.g., "Bachelor's", "Master's")
        // userPrefs.preferred_field_category (e.g., "Computer Science")
        // userPrefs.min_roi (e.g., 50)

        let query;

        // Define different queries based on mode
        switch (mode) {
            case '1':
                // Default: All universities
                query = 'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions';
                break;

            case '2':
                // Use user's preferred state
                const state = userPrefs?.preferred_region || 'NULL';
                query = `SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url
                        FROM institutions
                        WHERE state = "${state}"
                        ORDER BY admission_rate ASC`;
                break;


            case '3':
                const field_category = userPrefs?.preferred_field_category || 'NULL';
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url
                        FROM institutions AS inst
                            JOIN institutions_programs AS ip ON inst.uni_id = ip.uni_id
                            JOIN programs AS p ON ip.cip_code = p.cip_code
                        WHERE p.name = "${field_category}"
                        ORDER BY inst.admission_rate ASC`;
                break;

            case '4':
                // ===== MODE 4: Filter by ALL user preferences =====
                // This mode combines all user preferences into one smart filter

                const conditions = [];
                let baseQuery = `SELECT DISTINCT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url
                        FROM institutions AS inst
                            JOIN institutions_programs AS ip ON inst.uni_id = ip.uni_id
                            JOIN programs AS p ON ip.cip_code = p.cip_code
                            LEFT JOIN program_outcomes AS po ON ip.uni_prog_id = po.uni_prog_id`;
                if (userPrefs?.preferred_region) {
                    conditions.push(`inst.state = "${userPrefs.preferred_region}"`);
                }
                if (userPrefs?.preferred_degree_type) {
                    conditions.push(`ip.degree_type = "${userPrefs.preferred_degree_type}"`);
                }
                if (userPrefs?.preferred_field_category) {
                    conditions.push(`p.name = "${userPrefs.preferred_field_category}"`);
                }
                if (userPrefs?.min_roi) {
                    conditions.push(`po.roi_score >= ${userPrefs.min_roi}`);
                }

                if (conditions.length > 0) {
                    query = `${baseQuery} WHERE ${conditions.join(' AND ')} ORDER BY inst.admission_rate ASC`;
                } else {
                    query = `${baseQuery} ORDER BY inst.admission_rate ASC`;
                }
                break;

            case '5':
                // Mode 5: Custom query (example: high admission rate universities)
                query = 'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions WHERE admission_rate > 0.5 ORDER BY admission_rate DESC';
                break;

            default:
                query = 'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions';
        }

        // Debug: Print the query being executed
        console.log('=== UNIVERSITY QUERY DEBUG ===');
        console.log('Mode:', mode);
        console.log('User ID:', userId);
        console.log('User Preferences:', userPrefs);
        console.log('Query:', query);
        console.log('==============================');

        let [rows] = await db.query(query);

        // Fallback: If mode 4 returns no results, fallback to all universities
        if (mode === '4' && rows.length === 0) {
            console.log('No results found with user preferences. Falling back to all universities...');
            const fallbackQuery = 'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions';
            [rows] = await db.query(fallbackQuery);
        }

        res.json(rows.map(mapRowToUniversity));
    })
);

router.get(
    '/:id',
    asyncWrap(async (req, res) => {
        const id = Number(req.params.id);
        const userId = req.query.userId; // Optional: for ordering by user preferences

        if (!Number.isInteger(id)) return res.status(400).json({ error: 'Invalid id' });

        // Get basic university info
        const [rows] = await db.query(
            'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions WHERE uni_id = ?',
            [id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Not found' });

        const university = mapRowToUniversity(rows[0]);

        // Get programs offered by this university
        let programsQuery = `
            SELECT p.name, ip.degree_type, po.roi_score, po.earn_1year, po.earn_2years
            FROM institutions_programs AS ip
            JOIN programs AS p ON ip.cip_code = p.cip_code
            LEFT JOIN program_outcomes AS po ON ip.uni_prog_id = po.uni_prog_id
            WHERE ip.uni_id = ?
        `;

        // If userId provided, check preferences and order accordingly
        let orderBy = 'ORDER BY p.name ASC'; // Default: alphabetical

        if (userId) {
            const [prefRows] = await db.query(
                'SELECT preferred_field_category, preferred_degree_type FROM user_preferences WHERE user_id = ?',
                [userId]
            );
            const userPrefs = prefRows[0];

            // Order by relevance: preferred field/degree first, then by ROI, then alphabetically
            if (userPrefs?.preferred_field_category || userPrefs?.preferred_degree_type) {
                orderBy = `ORDER BY
                    CASE WHEN p.name = "${userPrefs?.preferred_field_category || ''}" THEN 0 ELSE 1 END,
                    CASE WHEN ip.degree_type = "${userPrefs?.preferred_degree_type || ''}" THEN 0 ELSE 1 END,
                    po.roi_score DESC,
                    p.name ASC`;
            } else {
                orderBy = 'ORDER BY po.roi_score DESC, p.name ASC';
            }
        }

        const [programRows] = await db.query(programsQuery + ' ' + orderBy, [id]);

        // Fetch user preferences to mark matching programs
        let userPrefs = null;
        if (userId) {
            const [prefRows] = await db.query(
                'SELECT preferred_field_category, preferred_degree_type FROM user_preferences WHERE user_id = ?',
                [userId]
            );
            userPrefs = prefRows[0];
        }

        // Add programs to university object with match indicator
        // A program is a match if it matches the preferred field (program name)
        university.programs = programRows.map(p => ({
            name: p.name,
            degree_type: p.degree_type,
            roi_score: p.roi_score,
            earn_1year: p.earn_1year,
            earn_2years: p.earn_2years,
            isMatch: userPrefs && p.name === userPrefs.preferred_field_category
        }));

        res.json(university);
    })
);

export default router;
