import jwt from 'jsonwebtoken';
import BlacklistToken from '../models/schemas/blacklistToken';

const authVerify = async (req: any, res: any, next: any) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const isTokenBlacklisted = await BlacklistToken.findOne({ token });

    if(isTokenBlacklisted) {
        return res.status(401).json({ message: 'Token Blacklisted' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        req.user = decoded;
        next();
    } catch (err) {
        console.log('Error verifying token:', err);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export default authVerify;