import jwt from "jsonwebtoken";
import 'dotenv/config';


export const userAuth = async (req, res, next) => {
    const {token} = req.header;

    if(!token) {
        return res.json({success: false, message: "Not Authorized. Login Again"});
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
        
        if(tokenDecode.id) {
            req.body.userId  = tokenDecode.id;
        }else{
            return res.json({success:false, message:"Not authorized. Login Again"});
        }
        
        next();
    } catch (error) {
        console.log(error);
        res.json({success:false, message: error.message});
    }

};

