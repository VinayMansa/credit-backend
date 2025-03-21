const express = require("express");
const connectDB = require("./config/database.js");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/api/auth", require("./routes/userRoutes.js"));
app.use("/api/tasks", require("./routes/taskRoutes.js"));

// Connect to database
connectDB().then(async () => {
  console.log("Connected to database");

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
