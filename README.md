# My React App

Full-stack app with React frontend and Node/Express backend.

## Setup

You'll need Node.js and MySQL installed.

### Getting started

**Client:**
```bash
npm install
npm run dev
```
Runs on http://localhost:5173

**Server:**
```bash
cd server
npm install
```

Create a `.env` file in the server directory:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=myreactapp
```

Then run:
```bash
npm run init-db  # first time only
npm run dev
```

### Running everything

Just open two terminals and run `npm run dev` in each (remember to `cd server` for the backend).

## Commands

**Client:**
- `npm run dev` - dev server
- `npm run build` - production build
- `npm run lint` - run linter

**Server:**
- `npm run dev` - dev mode with auto-restart
- `npm start` - production
- `npm run init-db` - set up database

## Stack

React + Vite / Node + Express / MySQL
