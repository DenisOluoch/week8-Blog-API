const usermodel = require('../models/user.model.js');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        // 1. Validate user input
        const userSchema = joi.object({
            username: joi.string().min(2).max(100).required(),
            email: joi.string().email().pattern(/@/).required().messages({
                'string.email': 'Please provide a valid email address.',
                'string.pattern.base': 'Email address must include an "@" symbol.',
                'any.required': 'Email is required.'
            }),
            password: joi.string().min(6).required()
        });
        
        const { error } = userSchema.validate({ username, email, password });
        if (error) {
            return res.status(400).json({ 
                message: 'Invalid user data', 
                error: error.details[0].message 
            });
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create and save the new user
        const newUser = new usermodel({ 
            username, 
            email, 
            password: hashedPassword 
        });
        
        await newUser.save();

        // 4. Send success response (don't return the password hash back!)
        return res.status(201).json({ 
            message: 'User registered successfully', 
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            } 
        });

    } catch (error) {
        // This only runs if something breaks unexpectedly (e.g., database connection failure)
        console.error('Registration error:', error);
        if (error.code === 11000) { // Duplicate key error
            
            const duplicatedField = Object.keys(error.keyValue)[0];
            const duplicatedValue = error.keyValue[duplicatedField];
            return res.status(400).json({ 
              message: `The ${duplicatedField} '${duplicatedValue}' is already registered. Please use another one.`
            });
        }
        return res.status(500).json({ 
            message: 'Error registering user', 
            error: error.message 
        });
    }
    next(error);

};


    const loginUser = async (req, res, next) => {
     try {

        const loginSchema = joi.object({
            email: joi.string().email().required(),
            password: joi.string().min(6).required()
        });

        const { error } = loginSchema.validate({ email: req.body.email, password: req.body.password });
        if (error) {
            return res.status(400).json({ message: 'Invalid login data', error: error.details[0].message });

        }
        const { email, password } = req.body;
        const user = await usermodel.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'user does not exist' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET, { expiresIn: '7d' }
        );
const resUser = { _id: user._id, username: user.username, email: user.email };
        return res.status(200).json({ message: 'Login successful', user: resUser, token });

} catch (error) {
    next(error);
}
};

module.exports = { registerUser, loginUser };


