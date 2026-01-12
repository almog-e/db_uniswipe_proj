import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    const sqlPath = path.resolve(process.cwd(), 'server', 'sql', 'init.sql');
    const sql = fs.readFileSync(sqlPath, { encoding: 'utf8' });

    const conn = await mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
    });

    try {
        console.log('Applying SQL from', sqlPath);
        await conn.query(sql);
        console.log('SQL applied successfully.');
    } catch (err) {
        console.error('Error applying SQL:', err.message || err);
        process.exitCode = 1;
    } finally {
        await conn.end();
    }
}

main();
