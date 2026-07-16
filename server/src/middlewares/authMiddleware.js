import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const protect = (req, res, next) => {
    let token;

    // Check if Bearer token exists in the Authorization Header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            // Decode token
            const decoded = jwt.verify(token, JWT_SECRET);

            // Attach user object to request
            req.user = decoded;
            next();
        } catch (error) {
            console.error('Token validation error:', error);
            return res.status(401).json({ error: 'Not authorized, token failed.' });
        }
    }

    if (!token) {
        return res.status(401).json({ error: 'Not authorized, no token provided.' });
    }
};