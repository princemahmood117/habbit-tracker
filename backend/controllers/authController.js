import jwt from "jsonwebtoken"
import User from "../models/User.js";

const signToken = (id) => {

    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn : process.env.JWT_EXPIRES_IN || '30d',
    })
}


// REGISTER
export const register = async (req, res) => {
    try {
        // take credentials from input field
        const {name, email, password} = req.body;

        if(!name || !email || !password) {
            return res.status(400).json({
                message : "error in name/email/password"
            })
        }

        if(password.length < 6) {
             return res.status(400).json({
                message : "password length must be atleast 6"
            })
        }

        // email already exist check
        const exists = await User.findOne({
            email : email.toLowerCase()
        })
        if(exists) {
            return res.status(400).json({
                message : "email already exists!"
            })
        }

        // create user
        const user = await User.create({
            name,
            email : email.toLowerCase(),
            password,
            avatar : name.charAt(0).toUpperCase(),
        });

        const token = signToken(user?._id);
        res.status(201).json({user, token})
        
    } catch (err) {
        res.status(500).json({message : `register error catch: ${err.message}`})
    }
}

// LOGIN
export const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if(!email || !password) {
            return res.status(400).json({
                message : "email and password are required!"
            })
        }

        // check user
        const user = await User.findOne({
            email : email.toLowerCase()
        })
        if(!user || !(await user.matchPassword(password))) {
            return res.status(400).json({
                message : "Invalid email or password"
            })
        }

        const token = signToken(user?._id);
        res.json({user, token})  // retun the user data along with the token
        
    } catch (err) {
        res.status(500).json({message : `error in login catch: ${err.message}`})
    }
}


export const me = (req,res) => {
    console.log("request from me function : ", req);
    res.json({user : req.user})
}


// UPDATE profile
export const updateProfile = async (req, res) => {

    try {
        const {name, morningMotivation} = req.body;
        const user = await User.findById(req.user?._id);
        if(name !== undefined) {
            user.name = name;
            user.avatar = name.charAt(0).toUpperCase();
        }

        if(morningMotivation !== undefined) {
            user.morningMotivation = morningMotivation
        }
        await user.save();
        res.json({user})
        
    } catch (error) {
        res.status(500).json({message : `error in updateProfile catch: ${error.message}`})
    }
}