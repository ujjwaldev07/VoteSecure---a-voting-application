const jwt = require('jsonwebtoken');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

const jwtAuthMiddleware = (req, res, next) => {
    const authorization = req.headers.authorization;
    if(!authorization) return res.status(401).json({error: 'Token not found'});

    const parts = authorization.split(' ');
    if(parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
       return res.status(401).json({error: 'Authorization header must be: Bearer <token>'});
    }

    const token = parts[1];
    if(!token) return res.status(401).json({error: 'Unauthorized'});

    try{
           const decoded = jwt.verify(token, process.env.JWT_SECRET);
           req.user = decoded;
           next();
    }catch(err){
        res.status(401).json({ success: false, message: 'Invalid or expired token', error: 'Invalid token' });
    }
}

const adminAuthMiddleware = (req, res, next) => {
    if (!req.user) return res.status(401).json({error: 'Unauthorized'});

    const role = String(req.user.role || '').trim().toLowerCase();

    if (role !== 'admin') {
        return res.status(403).json({message: 'User does not have admin role'});
    }

    next();
}

const generateToken = (userData) => {
     const payload = {
         id: userData.id,
         role: String(userData.role || '').trim().toLowerCase(),
         accountType: userData.accountType || (String(userData.role).toLowerCase() === 'admin' ? 'admin' : 'user'),
     };
     return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

module.exports = {jwtAuthMiddleware, adminAuthMiddleware, generateToken};
