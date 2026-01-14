/* global process */
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import universitiesRouter from './routes/universities.js';
import usersRouter from './routes/users.js';
import stateRouter from './routes/states.js';
import accountCheckRouter from './routes/account_check.js';
import userPrefRouter from './routes/user_pref.js';
import adminRouter from './routes/admin.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/api/institutions', universitiesRouter);
app.use('/api/users', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/states', stateRouter);
app.use('/api/account_check', accountCheckRouter);
app.use('/api/user_pref', userPrefRouter);

app.get('/api/health', (req, res) => res.json({ ok: true }));

import errorHandler from './middleware/errorHandler.js';
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
});
