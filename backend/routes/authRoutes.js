const express = require("express");
const { 
  register, 
  login, 
  getProfile, 
  changePassword, 
  logout,
  testDB 
} = require("../controllers/authController.js");
const auth = require("../middleware/auth.js");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

// Test route (optional)
router.get("/test-db", testDB);

// Protected routes (require authentication)
router.get("/profile", auth, getProfile);
router.put("/change-password", auth, changePassword);

module.exports = router;