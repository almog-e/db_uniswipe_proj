import express from 'express';
import db from '../db.js';
import asyncWrap from '../middleware/asyncWrap.js';

const router = express.Router();

// q1:  This query retrieves the 10 fields of study with the highest admission rate
router.get(
    '/programs/highestAdmissionRate/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT p.name AS program_name,
                    AVG(i.admission_rate) AS avg_admission
             FROM institutions_programs ip
             JOIN programs p ON ip.cip_code = p.cip_code
             JOIN institutions i ON ip.uni_id = i.uni_id
             WHERE i.admission_rate IS NOT NULL
             GROUP BY p.cip_code, p.name
             ORDER BY avg_admission DESC
             LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q2: This query retrieves the top 10 institutions with the highest return on investment (ROI) per cost
router.get(
    '/insititutions/HighestRoi/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
                const [rows] = await db.query(
            `SELECT
                i.name,
                i.state,
                po.roi_score,
                im.COSTT4_A,
                (po.roi_score / NULLIF(im.COSTT4_A, 0)) AS roi_per_cost
            FROM institutions i
            JOIN institutions_main im ON im.UNITID = i.uni_id
            JOIN institutions_programs ip ON ip.uni_id = i.uni_id
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.roi_score IS NOT NULL
            AND im.COSTT4_A IS NOT NULL
            ORDER BY roi_per_cost DESC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q3: This query calculates the average ROI for each program by state, considering only programs with at least 5 samples
router.get(
    '/states/programs/avgRoi/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT
                i.state,
                p.name AS program_name,
                AVG(po.roi_score) AS avg_roi,
                COUNT(*) AS samples
            FROM institutions i
            JOIN institutions_programs ip ON ip.uni_id = i.uni_id
            JOIN programs p ON p.cip_code = ip.cip_code
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.roi_score IS NOT NULL
            GROUP BY i.state, p.cip_code
            HAVING samples >= 5
            ORDER BY i.state, avg_roi DESC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);


// q4: This query identifies the top programs with the highest average earnings growth from year 1 to year 2
router.get(
    '/programs/highestAvgEarn/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT
                p.name AS program_name,
                AVG(po.earn_1year) AS avg_earn_1year,
                AVG(po.earn_2years) AS avg_earn_2years,
                AVG(po.earn_2years - po.earn_1year) AS avg_growth
            FROM programs p
            JOIN institutions_programs ip ON ip.cip_code = p.cip_code
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.earn_1year IS NOT NULL
            AND po.earn_2years IS NOT NULL
            GROUP BY p.cip_code, p.name
            ORDER BY avg_growth DESC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);


// q5: This query retrieves the top programs with the highest average salary one year after graduation across all institutions
router.get(
    '/programs/highestSalary/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT
                p.name AS program_name,
                AVG(po.earn_1year) AS avg_salary_1year
            FROM programs p
            JOIN institutions_programs ip ON ip.cip_code = p.cip_code
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.earn_1year IS NOT NULL
            GROUP BY p.cip_code, p.name
            ORDER BY avg_salary_1year DESC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q6: This query retrieves the programs with the lowest ROI scores across all institutions.
router.get(
    '/programs/lowestRoi/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT
                i.name,
                i.state,
                p.name AS program_name,
                po.roi_score
            FROM institutions_programs ip
            JOIN institutions i ON i.uni_id = ip.uni_id
            JOIN programs p ON p.cip_code = ip.cip_code
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.roi_score != 0
            ORDER BY po.roi_score ASC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q7: This query retrieves the programs with at least 30 samples that have the lowest average salary two years after graduation across all institutions, excluding salaries less than or equal to $1000.
router.get(
    '/programs/lowestSalary/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT
                p.name AS program_name,
                COUNT(*) AS samples,
                AVG(po.earn_2years) AS avg_salary_2years
            FROM programs p
            JOIN institutions_programs ip ON ip.cip_code = p.cip_code
            JOIN program_outcomes po ON po.uni_prog_id = ip.uni_prog_id
            WHERE po.earn_2years IS NOT NULL
            AND po.earn_2years > 1000
            GROUP BY p.cip_code, p.name
            HAVING COUNT(*) >= 30
            ORDER BY avg_salary_2years ASC
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q8: This query retrieves most profitable (highest ROI) university in every state
router.get(
    '/states/intitutions/highestRoi/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT state, name, avg_roi
            FROM (
                SELECT i.state,
                    i.name,
                    AVG(po.roi_score) AS avg_roi,
                    ROW_NUMBER() OVER (PARTITION BY i.state ORDER BY AVG(po.roi_score) DESC) AS rn
                FROM institutions i
                JOIN institutions_programs ip ON i.uni_id = ip.uni_id
                JOIN program_outcomes po ON ip.uni_prog_id = po.uni_prog_id
                GROUP BY i.state, i.name
            ) t
            WHERE rn = 1
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

// q9: This query retrieves most profitable (highest ROI) university in every field of study
router.get(
    '/programs/intitutions/highestRoi/:limit',
    asyncWrap(async (req, res) => {
        // Get the limit from query params
        const limit = Number(req.params.limit);
        if (!Number.isInteger(limit)) return res.status(400).json({ error: 'Invalid limit' });
        const [rows] = await db.query(
            `SELECT program_name, university_name, avg_roi
            FROM (
                SELECT i.name AS university_name,
                    p.name AS program_name,
                    AVG(po.roi_score) AS avg_roi,
                    ROW_NUMBER() OVER (PARTITION BY p.cip_code ORDER BY AVG(po.roi_score) DESC) AS rn
                FROM institutions i
                JOIN institutions_programs ip ON i.uni_id = ip.uni_id
                JOIN program_outcomes po ON ip.uni_prog_id = po.uni_prog_id
                JOIN programs p ON ip.cip_code = p.cip_code
                GROUP BY p.cip_code, p.name, i.name
            ) t
            WHERE rn = 1
            LIMIT ?;`,
            [limit]
        );
        res.json(rows);
    })
);

export default router;
