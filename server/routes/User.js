const express = require("express");
const router = express.Router();

const {login,signup,changePassword,google,signOut} = require("../controllers/Auth");

const { resetPasswordToken,resetPassword,} = require("../controllers/ResetPassword");

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", login)

// Route for user signup
router.post("/signup", signup)

// Route for user google
router.post("/google",google)

// Route for user password change
// router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword)

// Export the router for use in the main application
module.exports = router
