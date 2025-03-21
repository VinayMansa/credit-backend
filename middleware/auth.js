// middleware/auth.js
const jwt = require("jsonwebtoken");
const axios = require("axios");

// Cache for Google's public keys
let googlePublicKeys = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const fetchGooglePublicKeys = async () => {
  if (!googlePublicKeys || Date.now() - lastFetchTime > CACHE_DURATION) {
    const response = await axios.get(
      "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
    );
    googlePublicKeys = response.data;
    lastFetchTime = Date.now();
  }
  return googlePublicKeys;
};

const authenticate = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  console.log(`Incoming request: ${req.method} ${req.url}`);

  if (!token) {
    console.log("No token provided");
    return res.status(401).json({ message: "Please authenticate" });
  }

  try {
    const keys = await fetchGooglePublicKeys();
    const decodedHeader = jwt.decode(token, { complete: true }).header;
    const kid = decodedHeader.kid;
    const publicKey = keys[kid];

    if (!publicKey) {
      console.error("Public key not found for the given key ID");
      return res.status(401).json({ message: "Please authenticate" });
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
      issuer: "https://securetoken.google.com/task-buddy-74129",
      audience: "task-buddy-74129",
    });

    req.user = decoded;
    console.log("Token verified successfully:", decoded);
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    res.status(401).json({ message: "Please authenticate" });
  }
};

module.exports = authenticate;
