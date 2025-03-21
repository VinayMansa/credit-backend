const Task = require("../models/task");
const authenticate = require("../middleware/auth");
const User = require("../models/User");

// Create a new task
exports.createTask = [
  authenticate, // Ensure this middleware sets req.user
  async (req, res) => {
    try {
      console.log("Authenticated user:", req.user); // Log the authenticated user
      if (!req.user || !req.user.user_id) {
        throw new Error("User not authenticated or user ID missing");
      }

      // Find the user by firebaseUID
      const user = await User.findOne({ firebaseUID: req.user.user_id });
      if (!user) {
        throw new Error("User not found");
      }

      // Add the authenticated user's ID to the task data
      const taskData = {
        ...req.body,
        user: user._id, // Use the MongoDB _id of the user
      };
      const task = new Task(taskData);
      await task.save();
      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error); // Log the error
      res.status(400).json({ message: error.message });
    }
  },
];

// Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.status(200).json({ message: "Task deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
