// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  firebaseUID: { type: String, required: true, unique: true }, // Ensure uniqueness
  dob: { type: Date, default: Date.now },
  phno: { type: String, default: "" }, // Make optional
  countryCode: { type: String, default: "" }, // Make optional
});

module.exports = mongoose.model("User", userSchema);
