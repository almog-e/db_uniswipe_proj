Server setup

1. Copy `.env.example` to `.env` and fill DB credentials.

2. Create the database and tables, for example:
   - Navigate to `server/DataBase/scripts`
   - Using the included script: `npm run init-db` (reads and applies `init.sql`)
   - Or manually: `mysql -u root -p < init.sql`

3. Install dependencies and run server:
   - cd server
   - npm install
   - npm run dev

The server exposes:
 - GET /api/health
 - GET /api/universities
 - GET /api/universities/:id
 - GET /api/users

