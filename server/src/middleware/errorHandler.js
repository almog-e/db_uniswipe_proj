/* global process */
export default function errorHandler(err, req, res, _next) {
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';
    if (process.env.NODE_ENV !== 'test') {
        console.error(err);
    }
    res.status(status).json({ error: message });
}
