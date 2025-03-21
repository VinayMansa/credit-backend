const express = require("express");
const authController = require("../controllers/authController"); // Import the authController

const router = express.Router();

// Define a route for user authentication
router.post("/authenticate", authController.authenticateUser);

// ... existing code ...

module.exports = router;
