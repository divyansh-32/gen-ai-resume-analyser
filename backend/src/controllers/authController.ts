import { Request, Response } from 'express';
import userModel from '../models/schemas/userSchema';
import {registerValidator, loginValidator} from '../utils/validators/authValidators';
import BlacklistToken from '../models/schemas/blacklistToken';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../types/customRequest';

const authController = {
    register: async (req: CustomRequest, res: Response) => {
        // Handle user registration logic here
        const { error } = registerValidator.validate(req.body);
        if (error) {
            return res.status(400).json({ 
                message: error?.details?.[0]?.message || 'Validation error' 
            });
        }
        const { name, email, password } = req.body;

        // Check if user already exists
        const ifUserExist = await userModel.findOne({
            $or: [{ email }, { name }]
        })

        if (ifUserExist) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign({ id: newUser._id, 
            name: newUser.name, 
            email: newUser.email 
        }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
          });

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                username: newUser.name,
                email: newUser.email,
                id: newUser._id,
            }
        });
    },
    login: async (req: CustomRequest, res: Response) => {
        // Handle user login logic here
        const {error} = loginValidator.validate(req.body);

        if(error) {
            return res.status(400).json({ 
                message: error?.details?.[0]?.message || 'Validation error' 
            });
        }

        const { email, password } = req.body;

        const user = await userModel.findOne({email: email});

        if(!user) {
            return res.status(401).json({ 
                message: "Invalid email or password"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect) {
            return res.status(401).json({ 
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({ id: user._id, 
            name: user.name, 
            email: user.email 
        }, process.env.JWT_SECRET!, { expiresIn: '1h' });

        res.cookie("token", token, {
            httpOnly: true,         
            sameSite: "lax",         
            secure: false,         
          });

        res.status(200).json({
            message: 'User logged in successfully',
            id: user._id,
            user: {
                username: user.name,
                email: user.email,
                id: user._id,
            }
        });
    },
    logout: async (req: CustomRequest, res: Response) => {
        // Handle user logout logic here
        const token = req.cookies.token;

        if (!token) {
            return res.status(400).json({ message: 'No token provided' });
        }

        // Add the token to the blacklist
        const blacklistedToken = new BlacklistToken({ token });
        await blacklistedToken.save();

        res.clearCookie('token');

        res.status(200).json({
            message: 'User logged out successfully',
        });
    },
    getCurrentUser: async (req: CustomRequest, res: Response) => {
        // Handle logic to get current user info here
        const user = req.user;
        
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        res.status(200).json({
            user: {
                username: user.name,
                email: user.email,
                id: user.id,
            }
        });
        
    }
};

export default authController;