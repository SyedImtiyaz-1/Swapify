const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const axios = require('axios');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { sendPasswordResetEmail } = require('../utils/emailService');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const router = express.Router();

router.post('/register', async (req, res) => {
    const { 
        username, 
        user_password,
        user_role,
        email,
        user_avatar,
        phone_number,
        country,
        state,
        city,
        pincode,
        address 
    } = req.body;
    
    if (!username || !user_password || !email) {
        return res.status(400).json({ message: 'Username, password and email are required.' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already exists.' });
        }

        const hashedPassword = await bcrypt.hash(user_password, 10);
        
        const user = new User({
            username,
            user_password: hashedPassword,
            email,
            user_role,
            user_avatar,
            phone_number,
            country,
            state,
            city,
            pincode,
            address
        });

        const userData= await user.save();
        const token = jwt.sign(
            { 
                id: userData._id,
                email: userData.email 
            }, 
            process.env.JWT_SECRET
        );
        
        res.status(201).json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.user_role
            }})
    }
         catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed.' });
    }
});

router.post('/login', async (req, res) => {
    const { email, user_password } = req.body;

    if (!email || !user_password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'No user found with this email.' });
        }

        const isValidPassword = await bcrypt.compare(user_password, user.user_password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email,
                iat: Math.floor(Date.now() / 1000)
            }, 
            process.env.JWT_SECRET
        );

        await User.findByIdAndUpdate(user._id, { last_token: token });
        
        res.json({ 
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.user_role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Login failed.' });
    }
});

router.get('/users', async (req, res) => {
    try {
        const users = await User.find({}, '-user_password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users' });
    }
});

router.get('/protected', authMiddleware, (req, res) => {
    res.json({ message: 'You have access.', userId: req.userId });
});

router.get('/user/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id, '-user_password');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ message: 'Invalid user ID format' });
        }
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

router.post('/verify-token', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'No token provided.' });
        }

        const userId = req.userId;
        const user = await User.findById(userId);

        if (user.last_token !== token) {
            return res.status(403).json({ 
                message: 'Token has been invalidated.',
                isLoggedIn: false
            });
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ 
                    message: 'Invalid token.',
                    isLoggedIn: false
                });
            }
            
            res.status(200).json({ 
                isLoggedIn: true,
                message: 'Token is valid.',
                token,
                user
            });
        });
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(500).json({
            message: 'Token verification failed.',
            isLoggedIn: false
        });
    }
});

router.post('/logout', authMiddleware, async (req, res) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        await User.findByIdAndUpdate(req.userId, { last_token: null });

        res.status(200).json({ 
            message: 'Logged out successfully',
            isLoggedIn: false 
        });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ 
            message: 'Logout failed',
            error: error.message 
        });
    }
});

router.put('/profile-setup', authMiddleware, async (req, res) => {
    try {
        const {
            username,
            phone_number,
            country,
            state,
            city,
            pincode,
            address,
            user_avatar
        } = req.body;

        const userId = req.userId;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                $set: {
                    username: username,
                    phone_number: phone_number,
                    country: country,
                    state: state,
                    city: city,
                    pincode: pincode,
                    address: address,
                    user_avatar: user_avatar
                }
            },
            { new: true, select: '-user_password' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({
            message: 'Profile updated successfully',
            user: updatedUser
        });
    } catch (error) {
        console.error('Profile setup error:', error);
        res.status(500).json({ message: 'Profile setup failed.' });
    }
});

// Redirect to Google OAuth
router.get("/auth/google", (req, res) => {
    const googleAuthURL = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_CALLBACK_URL}&response_type=code&scope=profile email`;
    res.redirect(googleAuthURL);
});

// Handle Google OAuth Callback
router.get("/auth/google/callback", async (req, res) => {
    try {
        const { code } = req.query;
        
        if (!code) {
            return res.status(400).json({ message: 'Authorization code is missing' });
        }

        // Exchange code for access token
        const tokenResponse = await axios.post(
            "https://oauth2.googleapis.com/token",
            {
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: process.env.GOOGLE_CALLBACK_URL,
                grant_type: "authorization_code",
                code,
            },
            { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
        );

        const { access_token } = tokenResponse.data;

        // Fetch user profile from Google API
        const profileResponse = await axios.get(
            "https://www.googleapis.com/oauth2/v2/userinfo",
            { headers: { Authorization: `Bearer ${access_token}` } }
        );
        const profile = await profileResponse.data;
        
        let user = await User.findOne({ email: profile.email });

        if (!user) {
            // Create new user from Google profile
            user  = await User.create({
                username: profile.name,
                email: profile.email,
                
                full_name: profile.name,
                nickname: profile.given_name,
                family_name: profile.family_name,
                google_user_id: profile.id,
                google_user_avatar: profile.picture,
                is_verified: profile.verified_email,
                
                user_password: await bcrypt.hash(Math.random().toString(36), 10), // Random secure password
                user_role: 'user'
            });
        }
        
        const token = jwt.sign(
            { 
                id: user._id,
                email: user.email
            }, 
            process.env.JWT_SECRET
        );

        await User.findByIdAndUpdate(user._id, { last_token: token });
        res.redirect(`${process.env.FRONTEND_URL}/auth/callback/google?authToken=${token}`);
        
        return ;
        
    } catch (error) {
        console.error("OAuth Error:", error.response?.data || error.message);
        res.status(500).json({
            message: "Authentication Failed",
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});

// Forgot Password Route
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'No user found with this email.' });
        }

        // Generate a random token
        const resetToken = crypto.randomBytes(20).toString('hex');
        
        // Set token and expiration (1 hour from now)
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
        
        await user.save();

        // Send password reset email
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        const emailResult = await sendPasswordResetEmail(email, resetToken, frontendUrl);
        
        if (emailResult.success) {
            res.status(200).json({ 
                message: 'Password reset link has been sent to your email.',
                success: true 
            });
        } else {
            res.status(500).json({ 
                message: 'Failed to send password reset email. Please try again.',
                success: false 
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ 
            message: 'Password reset request failed.',
            success: false 
        });
    }
});

// Reset Password Route
router.post('/reset-password', async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        if (!email || !token || !newPassword) {
            return res.status(400).json({ 
                message: 'Email, token, and new password are required.',
                success: false 
            });
        }

        // Find user with the given email and valid reset token
        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() } // token hasn't expired
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Password reset token is invalid or has expired.',
                success: false 
            });
        }

        // Hash the new password and save
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.user_password = hashedPassword;
        
        // Clear the reset token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;
        
        await user.save();

        res.status(200).json({ 
            message: 'Password has been reset successfully. You can now login with your new password.',
            success: true 
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ 
            message: 'Password reset failed. Please try again.',
            success: false 
        });
    }
});

// Verify reset token
router.post('/verify-reset-token', async (req, res) => {
    try {
        const { email, token } = req.body;

        if (!email || !token) {
            return res.status(400).json({ 
                message: 'Email and token are required.',
                success: false 
            });
        }

        const user = await User.findOne({
            email,
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ 
                message: 'Password reset token is invalid or has expired.',
                success: false 
            });
        }

        res.status(200).json({ 
            message: 'Token is valid.',
            success: true 
        });
    } catch (error) {
        console.error('Verify reset token error:', error);
        res.status(500).json({ 
            message: 'Token verification failed.',
            success: false 
        });
    }
});

module.exports = router;
