/* global process */
export default function errorHandler(err, req, res, _next) {
    // Minimal error object normalization
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV !== 'test') {
        // prevent leaking stack in production - still useful in dev
        console.error(err);
    }
    res.status(status).json({ error: message });
}
