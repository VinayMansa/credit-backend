const admin = require("firebase-admin");
const serviceAccount = require("../task-buddy-74129-firebase-adminsdk-fbsvc-24f724c8d6.json");
const User = require("../models/User");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

exports.authenticateUser = async (req, res) => {
  const { token } = req.body;

  // Log the token for debugging purposes
  console.log("Received token:", token);

  // Check if the token is a valid JWT
  if (!token || token.split(".").length !== 3) {
    console.warn("Invalid token format received");
    return res
      .status(400)
      .json({ success: false, message: "Invalid token format" });
  }

  try {
    // Log the token length for debugging
    console.log("Token length:", token.length);

    // Verify the token with Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const { uid, email, name } = decodedToken;

    // Check if user exists in the database
    let user = await User.findOne({ firebaseUID: uid });

    if (!user) {
      // Create a new user if not found
      user = new User({
        name: name || "Anonymous",
        email,
        firebaseUID: uid,
        dob: new Date(), // Placeholder, adjust as needed
        phno: "", // Placeholder, adjust as needed
        countryCode: "", // Placeholder, adjust as needed
      });
      await user.save();
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error during authentication:", error);
    res
      .status(401)
      .json({ success: false, message: "Authentication failed", error });
  }
};
