import express from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendVerificationEmail, sendResetPasswordEmail } from '../services/email.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route   POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log("[REGISTER] Request Body:", req.body);
        const { email, password, name, profilePicture } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Verification Token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        const user = await User.create({
            email,
            password,
            name,
            profilePicture,
            verificationToken,
            verificationTokenExpires
        });

        if (user) {
            console.log(`Generated Token: ${verificationToken} for ${email}`);
            await sendVerificationEmail(user.email, verificationToken);

            // No auto-login. Require verification.
            res.status(201).json({
                _id: user._id,
                email: user.email,
                isVerified: user.isVerified,
                message: "Registered! Please check your email to verify."
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
});

// @route   POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        if (!user.isVerified) {
            return res.status(401).json({ message: 'Please verify your email first.' });
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        res.json({
            _id: user._id,
            email: user.email,
            name: user.name,
            profilePicture: user.profilePicture,
            isVerified: user.isVerified,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
});

// @route   POST /api/auth/logout
router.post('/logout', (req, res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out' });
});

// @route   GET /api/auth/verify/:token
router.get('/verify/:token', async (req, res) => {
    const { token } = req.params;
    console.log(`[VERIFY] Attempting to verify token: ${token}`);

    // 1. Find user by token ONLY
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
        console.log(`[VERIFY] Token not found in database: ${token}`);
        return res.status(400).json({ message: 'Invalid token' });
    }

    // 2. Explicitly check expiry
    const now = new Date();
    // Ensure both are Date objects for comparison
    const expiresAt = new Date(user.verificationTokenExpires);

    console.log(`[VERIFY] Token found for user: ${user.email}`);
    console.log(`[VERIFY] Expires At (DB): ${expiresAt.toISOString()}`);
    console.log(`[VERIFY] Current Time (Server): ${now.toISOString()}`);

    if (expiresAt < now) {
        console.log(`[VERIFY] FAIL: Token has expired.`);
        return res.status(400).json({ message: `Token expired. Server Time: ${now.toISOString()}` });
    }

    console.log(`[VERIFY] SUCCESS: Token is valid.`);

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
});

// @route   POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpires = Date.now() + 3600000; // 1 hour
    await user.save();

    await sendResetPasswordEmail(user.email, resetToken);

    res.json({ message: 'Password reset email sent' });
});

// @route   POST /api/auth/reset-password/:token
router.post('/reset-password/:token', async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordTokenExpires: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.password = password; // Will be hashed by pre-save hook
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });
});

// @route   GET /api/auth/me
router.get('/me', protect, async (req, res) => {
    res.json(req.user);
});

// @route   PUT /api/auth/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.profilePicture = req.body.profilePicture || user.profilePicture;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                profilePicture: updatedUser.profilePicture,
                isVerified: updatedUser.isVerified,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error("Profile Update Error:", error);
        res.status(500).json({ message: error.message || 'Server error during profile update' });
    }
});

export default router;
