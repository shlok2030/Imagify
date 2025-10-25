import jwt from "jsonwebtoken";
import 'dotenv/config';


export const userAuth = async (req, res, next) => {
    // const {token} = req.header;
    

    try {

        const authHeader = req.headers.authorization || req.headers.token || req.headers['x-access-token'];
        const token = authHeader && authHeader.startsWith('Bearer ')
            ? authHeader.split(' ')[1]
            : authHeader;

        if(!token) {
            return res.status(401).json({success: false, message: "No token provided."});
        }
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);


        req.userId = tokenDecode.id || tokenDecode._id || tokenDecode.userId; 

        console.log('Authenticated user:', req.userId);
        next();
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(401).json({
            success: false, 
            message: "Authentication failed",
            error: error.message
        });
    }

};

