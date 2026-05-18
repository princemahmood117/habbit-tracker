import jwt from "jsonwebtoken"
import User from "../models/User.js";

export const protect = async (req, res, next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1]            
            console.log("token: ", token);
        }

        if(!token) {
            return res.status(401).json({message : "Not authorized, no token found!"})
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log({decoded});

        const user = await User.findById(decoded.id)
        console.log({user});

        if(!user) {
            return res.status(401).json({message : "User not found in token!"})
        }

        req.user = user;  // user is set inside 'req.user'
        next()
        
    } catch (error) {
        return res.status(401).json({message : "Not authorized catched!"})
    }
} 