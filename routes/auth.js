const express = require('express');
const passport = require('passport');
const router = express.Router();

// login / auth with google -> actually route is GET /auth/google 
router.get('/google', passport.authenticate('google', { scope: ['profile']} ))

// google callback -> actually route is GET /auth/google/callback
router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    res.redirect('/dashboard');
})

//logout user - route /auth/logout
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})


module.exports = router;