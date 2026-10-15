const jwt = require('jsonwebtoken');
const usermodel = require('../models/user.model.js'); // 1. Import your user model!

const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const token = authHeader.replace('Bearer ', '');

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const user = await usermodel.findById(payload.userId).select('-password');
        
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }

        req.user = user; // Attach user info to request object
        next(); // 2. CRITICAL: Call next() to move on to the controller!

    } catch (error) {
        console.error('Auth error:', error.message); // Helpful for debugging
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

module.exports = requireAuth;