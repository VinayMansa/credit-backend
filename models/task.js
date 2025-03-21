const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, enum: ["personal", "work"], required: true },
  dueOn: { type: Date, required: true },
  status: {
    type: String,
    enum: ["inprogress", "todo", "completed"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Task", taskSchema, "Tasks");
