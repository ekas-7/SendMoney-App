import jwt from 'jsonwebtoken';

const transferFundsMiddleware = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden Access' });
        }

        const { fromAccountId} = req.body;
        
        if (decoded.userId !== fromAccountId) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }

        req.user = decoded;
        next(); 
    });
};

export default transferFundsMiddleware;
