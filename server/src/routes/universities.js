import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

if (typeof fetch === 'undefined') {
    global.fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
}

const router = express.Router();

function safeParsePrograms(text) {
    try {
        return text ? JSON.parse(text) : [];
    } catch {
        return [];
    }
}

async function getLogoUrl(siteUrl, uniName, uniId) {
    // Try Wikipedia summary API first
    if (uniName && uniName.trim()) {
        try {
            // Use underscores for Wikipedia summary API
            const summaryUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${uniName.replace(/ /g, '_')}`;
            console.log('[WIKIPEDIA API CALL]', summaryUrl);
            const summaryRes = await fetch(summaryUrl);
            const summaryData = await summaryRes.json();
            if (summaryData.originalimage && summaryData.originalimage.source) {
                const imageUrl = summaryData.originalimage.source;
                console.log('Logo URL from Wikipedia summary:', imageUrl);
                return imageUrl;
            } else if (summaryData.thumbnail && summaryData.thumbnail.source) {
                // fallback to thumbnail if originalimage not present
                const imageUrl = summaryData.thumbnail.source;
                console.log('Thumbnail URL from Wikipedia summary:', imageUrl);
                return imageUrl;
            } else {
                console.log('No image found in summary for:', uniName);
            }
        } catch (err) {
            console.error('Wikipedia summary API error:', err);
        }
    }
    // Fallback: let frontend handle placeholder
    return null;
}

function mapRowToUniversity(r) {
    const admission = r.admission_rate == null ? null : Number(r.admission_rate);
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
        imageUrl: null, // Let frontend handle placeholder/fake
        website: r.site_url,
        sat_avg: r.sat_avg || null,
        act_avg: r.act_avg || null,
    };
}

router.get(
    '/',
    asyncWrap(async (req, res) => {
        const mode = req.query.mode || '1';
        const userId = req.query.userId; // Optional: pass user_id to use preferences
        const limit = parseInt(req.query.limit) || 10; // Default to 10 universities
        const offset = parseInt(req.query.offset) || 0; // Default to start from beginning

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
        // SAT/ACT averages are included for each university, but are NOT used for filtering here.
        // Matching based on SAT/ACT is handled in the frontend when the user swipes right.

        let query;
        switch (mode) {
            case '1':
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                        LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id
                        LIMIT ${limit} OFFSET ${offset}`;
                break;
            case '2':
                const state = (userPrefs && userPrefs.preferred_region) || 'NULL';
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                        LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id
                        WHERE inst.state = "${state}"
                        ORDER BY inst.admission_rate ASC LIMIT ${limit} OFFSET ${offset}`;
                break;
            case '3':
                const field_category = (userPrefs && userPrefs.preferred_field_category) || 'NULL';
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                            JOIN institutions_programs AS ip ON inst.uni_id = ip.uni_id
                            JOIN programs AS p ON ip.cip_code = p.cip_code
                            LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id
                        WHERE p.name = "${field_category}"
                        ORDER BY inst.admission_rate ASC LIMIT ${limit} OFFSET ${offset}`;
                break;
            case '4':
                const conditions = [];
                let baseQuery = `SELECT DISTINCT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                            JOIN institutions_programs AS ip ON inst.uni_id = ip.uni_id
                            JOIN programs AS p ON ip.cip_code = p.cip_code
                            LEFT JOIN program_outcomes AS po ON ip.uni_prog_id = po.uni_prog_id
                            LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id`;
                if (userPrefs && userPrefs.preferred_region) {
                    conditions.push(`inst.state = "${userPrefs.preferred_region}"`);
                }
                if (userPrefs && userPrefs.preferred_degree_type) {
                    conditions.push(`ip.degree_type = "${userPrefs.preferred_degree_type}"`);
                }
                if (userPrefs && userPrefs.preferred_field_category) {
                    conditions.push(`p.name = "${userPrefs.preferred_field_category}"`);
                }
                if (userPrefs && userPrefs.min_roi) {
                    conditions.push(`po.roi_score >= ${userPrefs.min_roi}`);
                }
                if (conditions.length > 0) {
                    query = `${baseQuery} WHERE ${conditions.join(' AND ')} ORDER BY inst.admission_rate ASC LIMIT ${limit} OFFSET ${offset}`;
                } else {
                    query = `${baseQuery} ORDER BY inst.admission_rate ASC LIMIT ${limit} OFFSET ${offset}`;
                }
                break;
            case '5':
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                        LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id
                        WHERE inst.admission_rate > 0.5
                        ORDER BY inst.admission_rate DESC LIMIT ${limit} OFFSET ${offset}`;
                break;
            default:
                query = `SELECT inst.uni_id, inst.name, inst.state, inst.city, inst.zip, inst.public_private, inst.admission_rate, inst.site_url, inst.logo_url, adm.sat_avg, adm.act_avg
                        FROM institutions AS inst
                        LEFT JOIN admissions AS adm ON inst.uni_id = adm.uni_id
                        LIMIT ${limit} OFFSET ${offset}`;
        }

        console.log('=== UNIVERSITY QUERY DEBUG ===');
        console.log('Mode:', mode);
        console.log('User ID:', userId);
        console.log('User Preferences:', userPrefs);
        console.log('Query:', query);
        console.log('==============================');

        let [rows] = await db.query(query);

        if (mode === '4' && rows.length === 0) {
            console.log('No results found with user preferences. Falling back to all universities...');
            const fallbackQuery = `SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions LIMIT ${limit} OFFSET ${offset}`;
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

        const [rows] = await db.query(
            'SELECT uni_id, name, state, city, zip, public_private, admission_rate, site_url, logo_url FROM institutions WHERE uni_id = ?',
            [id]
        );
        if (!rows.length) return res.status(404).json({ error: 'Not found' });

        const university = mapRowToUniversity(rows[0]);
        university.imageUrl = await getLogoUrl(university.site_url, university.name, university.uni_id);

        let programsQuery = `
            SELECT p.name, ip.degree_type, po.roi_score, po.earn_1year, po.earn_2years
            FROM institutions_programs AS ip
            JOIN programs AS p ON ip.cip_code = p.cip_code
            LEFT JOIN program_outcomes AS po ON ip.uni_prog_id = po.uni_prog_id
            WHERE ip.uni_id = ?
        `;

        let orderBy = 'ORDER BY p.name ASC'; // Default: alphabetical

        if (userId) {
            const [prefRows] = await db.query(
                'SELECT preferred_field_category, preferred_degree_type FROM user_preferences WHERE user_id = ?',
                [userId]
            );
            const userPrefs = prefRows[0];

            // Order by relevance: preferred field/degree first, then by ROI, then alphabetically
            if ((userPrefs && userPrefs.preferred_field_category) || (userPrefs && userPrefs.preferred_degree_type)) {
                orderBy = `ORDER BY
                    CASE WHEN p.name = "${(userPrefs && userPrefs.preferred_field_category) || ''}" THEN 0 ELSE 1 END,
                    CASE WHEN ip.degree_type = "${(userPrefs && userPrefs.preferred_degree_type) || ''}" THEN 0 ELSE 1 END,
                    po.roi_score DESC,
                    p.name ASC`;
            } else {
                orderBy = 'ORDER BY po.roi_score DESC, p.name ASC';
            }
        }

        const [programRows] = await db.query(programsQuery + ' ' + orderBy, [id]);

        let userPrefs = null;
        if (userId) {
            const [prefRows] = await db.query(
                'SELECT preferred_field_category, preferred_degree_type FROM user_preferences WHERE user_id = ?',
                [userId]
            );
            userPrefs = prefRows[0];
        }

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
