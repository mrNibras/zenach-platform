import express from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  registerUser,
  loginUser,
  getUserProfile,
  createAdmin,
  getAdmins,
  updateAdmin,
  deleteAdmin,
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Passport Google Strategy Configuration
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || 'your_id',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'your_secret',
    callbackURL: "http://localhost:10000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({
        $or: [{ googleId: profile.id }, { email: profile.emails[0].value }] 
      });

      if (user) {
        if (!user.googleId) user.googleId = profile.id;
        await user.save();
        return done(null, user);
      }

      user = await User.create({
        name: profile.displayName || profile.emails[0].value.split('@')[0],
        email: profile.emails[0].value,
        googleId: profile.id,
      });

      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
));

router.post('/register', registerUser);
router.post('/login', loginUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/admins').get(protect, admin, getAdmins).post(protect, admin, createAdmin);
router.route('/admins/:id').put(protect, admin, updateAdmin).delete(protect, admin, deleteAdmin);

// Google Auth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

const frontendUrl = process.env.NODE_ENV === 'production' ? '/' : 'http://localhost:5173';

router.get('/google/callback',
  passport.authenticate('google', { 
    failureRedirect: `${frontendUrl}/login?error=google_auth_failed`, 
    session: false 
  }),
  (req, res) => {
    // Generate token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    // Redirect to frontend with encoded data
    const queryParams = `token=${token}&id=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&role=${req.user.role || 'user'}`;
    res.redirect(`${frontendUrl}/login?${queryParams}`);
  }
);

export default router;
