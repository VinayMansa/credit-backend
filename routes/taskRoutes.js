const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");
const authenticateUser = require("../middleware/auth");

router.post("/create", authenticateUser, taskController.createTask);
router.get("/get", taskController.getTasks);
router.put("/update/:id", taskController.updateTask);
router.delete("/delete/:id", taskController.deleteTask);

module.exports = router;
