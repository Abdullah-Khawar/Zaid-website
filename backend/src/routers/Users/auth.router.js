import express from 'express';
import { googleAuthSuccess, logout, signUp, login, resetPasswordRequest, resetPassword, verifyResetCode } from '../../controllers/Users/auth.controller.js';
import passport from '../../config/passport.js';

const router = express.Router();

const API_URL = process.env.API_URL;
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', {
    successRedirect: `${API_URL}/auth/google/success`,
    failureRedirect: `${API_URL}/auth/google/failure`
}));

router.get('/google/failure', (req, res) => {
    res.status(401).json({ message: "Google authentication failed" });
});


router.get('/google/success', googleAuthSuccess);
router.post('/logout', logout);
router.post('/signup', signUp);
router.post('/login', login);


router.post('/confirm-reset-code', verifyResetCode);
router.post('/reset-password-request', resetPasswordRequest);
router.post('/reset-password', resetPassword);

export default router;
