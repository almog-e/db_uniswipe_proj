import fs from 'fs';
import path from 'path';
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

// Run init.sql file by replacing lines like "file_name.sql;" with the actual file content
function expandSql(filePath) {
    const dir = path.dirname(filePath);
    let sql = fs.readFileSync(filePath, 'utf8');

    return sql.replace(/^([a-zA-Z0-9_]+\.sql);$/gm, (_, fname) => {
        const fullPath = path.join(dir, fname);
        if (!fs.existsSync(fullPath)) {
            throw new Error(`SQL file not found: ${fullPath}`);
        }
        return fs.readFileSync(fullPath, 'utf8');
    });
}

function main() {
    const sqlPath = path.resolve(process.cwd(), 'DataBase', 'scripts', 'init.sql');
    const baseDir = path.dirname(sqlPath);

    let sql;
    try {
        sql = expandSql(sqlPath);
    } catch (err) {
        console.error('Error reading SQL files:', err.message || err);
        process.exit(1);
    }

    // Open connection with mySQL
    const conn = mysql.createConnection({
        host: process.env.DB_HOST || '127.0.0.1',
        port: Number(process.env.DB_PORT) || 3306,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        multipleStatements: true,
        infileStreamFactory: (filePath) => {
            // Relative path to the init.sql directory
            const fullPath = path.resolve(baseDir, filePath);
            if (!fs.existsSync(fullPath)) {
                throw new Error(`CSV file not found: ${fullPath}`);
            }
            return fs.createReadStream(fullPath);
        },
    });

    conn.query(sql, (err) => {
        if (err) {
            console.error('Error applying SQL:', err.message || err);
            process.exitCode = 1;
        } else {
            console.log('SQL applied successfully!');
        }
        conn.end();
    });
}

main();